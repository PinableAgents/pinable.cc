import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { afterEach, describe, it } from 'node:test'
import {
  TARGETS,
  assetNameFor,
  formatChecksums,
  formatReleaseDate,
  loadReleaseFeed,
  parseNotes,
  pickRecommended,
  resolveDownloads,
  shaFor,
  shortSha,
  urlFor,
} from '../.vitepress/theme/lib/releases.js'

/*
 * Node's built-in runner only — no vitest and no .vue import — so `node --test`
 * runs this file on its own, and `npm test` runs it alongside the component
 * specs. The manifest is read as data because a bare JSON import needs an
 * import attribute under Node's own ESM loader.
 */
const latest = JSON.parse(
  readFileSync(new URL('../public/releases/latest.json', import.meta.url), 'utf8'),
)
const makeFeed = () => structuredClone(latest)

const labelsOf = (entries) => entries.map((entry) => entry.label)
const originalFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = originalFetch
})

describe('resolveDownloads', () => {
  it('returns nothing without a feed', () => {
    assert.deepEqual(resolveDownloads(null), [])
    assert.deepEqual(resolveDownloads(undefined), [])
  })

  it('resolves every target the real manifest carries, in display order', () => {
    const entries = resolveDownloads(makeFeed())
    assert.deepEqual(labelsOf(entries), [
      'macOS · Universal',
      'macOS · Apple Silicon',
      'macOS · Intel',
      'Windows · 便携版',
      'Windows · 安装程序',
      'Linux · Core',
    ])
    for (const entry of entries) {
      assert.match(entry.url, /^https:\/\//)
      assert.match(entry.sha256, /^[0-9a-f]{64}$/)
      assert.notEqual(entry.assetName, '')
    }
  })

  it('drops an entry whose platform key is missing', () => {
    const feed = makeFeed()
    delete feed.platforms['linux-core']
    assert.ok(!labelsOf(resolveDownloads(feed)).includes('Linux · Core'))
  })

  it('drops the macOS entries when their platform keys and aliases are missing', () => {
    const feed = makeFeed()
    for (const key of [
      'darwin',
      'darwin-universal',
      'darwin-arm64',
      'darwin-aarch64',
      'darwin-amd64',
      'darwin-x86_64',
    ]) {
      delete feed.platforms[key]
    }
    const labels = labelsOf(resolveDownloads(feed))
    assert.equal(labels.some((label) => label.startsWith('macOS')), false)
    assert.ok(labels.includes('Windows · 便携版'))
  })

  it('drops an asset-style entry when its URL is null', () => {
    const feed = makeFeed()
    feed.assets.windows_exe = null
    assert.ok(!labelsOf(resolveDownloads(feed)).includes('Windows · 安装程序'))
  })

  it('reads asset-style entries from assets / asset_sha256', () => {
    const feed = makeFeed()
    const target = TARGETS.find((entry) => entry.asset === 'windows_exe')
    assert.equal(urlFor(feed, target), feed.assets.windows_exe)
    assert.equal(shaFor(feed, target), feed.asset_sha256.windows_exe)
  })

  it('treats every lookup as nullable', () => {
    const target = TARGETS[0]
    assert.equal(urlFor(null, target), null)
    assert.equal(shaFor(null, target), null)
    assert.equal(assetNameFor(null, target), '')
    assert.deepEqual(resolveDownloads({}), [])
  })
})

describe('platform aliases', () => {
  const aliasCases = [
    ['macOS · Universal', 'darwin', 'darwin-universal'],
    ['macOS · Apple Silicon', 'darwin-arm64', 'darwin-aarch64'],
    ['macOS · Intel', 'darwin-amd64', 'darwin-x86_64'],
    ['Windows · 便携版', 'windows', 'windows-amd64'],
  ]

  for (const [label, key, alias] of aliasCases) {
    it(`resolves ${label} from its alias`, () => {
      const feed = makeFeed()
      delete feed.platforms[key]

      const entry = resolveDownloads(feed).find((item) => item.label === label)
      const source = feed.platforms[alias]
      assert.ok(entry)
      assert.equal(entry.url, source.url)
      assert.equal(entry.sha256, source.sha256)
      assert.equal(entry.assetName, source.asset_name)
    })
  }

  it('resolves the Windows portable build from windows-x86_64 alone', () => {
    const feed = makeFeed()
    delete feed.platforms.windows
    delete feed.platforms['windows-amd64']

    const entry = resolveDownloads(feed).find((item) => item.label === 'Windows · 便携版')
    assert.equal(entry.url, feed.platforms['windows-x86_64'].url)
    assert.equal(entry.sha256, feed.platforms['windows-x86_64'].sha256)
  })

  it('prefers the canonical key and keeps URL/SHA from the same entry', () => {
    const feed = makeFeed()
    feed.platforms['darwin-universal'].url = 'https://example.com/alias.dmg'
    feed.platforms['darwin-universal'].sha256 = 'a'.repeat(64)
    feed.platforms['darwin-universal'].asset_name = 'alias.dmg'
    const target = TARGETS.find((entry) => entry.key === 'darwin')

    assert.equal(urlFor(feed, target), feed.platforms.darwin.url)
    assert.equal(shaFor(feed, target), feed.platforms.darwin.sha256)
    assert.equal(assetNameFor(feed, target), feed.platforms.darwin.asset_name)
  })

  it('falls back to an alias when the canonical url is unusable', () => {
    for (const url of [null, '', 42]) {
      const feed = makeFeed()
      feed.platforms.darwin.url = url
      feed.platforms.darwin.sha256 = 'b'.repeat(64)
      feed.platforms.darwin.asset_name = 'canonical.dmg'
      const target = TARGETS.find((entry) => entry.key === 'darwin')

      assert.equal(urlFor(feed, target), feed.platforms['darwin-universal'].url)
      assert.equal(shaFor(feed, target), feed.platforms['darwin-universal'].sha256)
      assert.equal(assetNameFor(feed, target), feed.platforms['darwin-universal'].asset_name)
    }
  })

  it('drops the Windows portable entry when every windows key is missing', () => {
    const feed = makeFeed()
    for (const key of ['windows', 'windows-amd64', 'windows-x86_64']) delete feed.platforms[key]

    const labels = labelsOf(resolveDownloads(feed))
    assert.ok(!labels.includes('Windows · 便携版'))
    assert.ok(labels.includes('Windows · 安装程序'))
  })

  it('keeps every published alias consistent with its canonical key', () => {
    for (const target of TARGETS.filter((entry) => entry.aliases)) {
      const canonical = latest.platforms[target.key]
      if (!canonical) continue

      for (const alias of target.aliases) {
        const entry = latest.platforms[alias]
        if (!entry) continue
        assert.equal(entry.url, canonical.url, `${alias} url differs from ${target.key}`)
        assert.equal(entry.sha256, canonical.sha256, `${alias} sha256 differs from ${target.key}`)
      }
    }
  })
})

describe('assetNameFor', () => {
  it('uses the manifest filename when present', () => {
    const target = TARGETS.find((entry) => entry.key === 'darwin')
    assert.equal(assetNameFor(makeFeed(), target), 'PinableAgents-mac.dmg')
  })

  it('falls back to the URL basename', () => {
    const feed = makeFeed()
    delete feed.platforms.darwin.asset_name
    const target = TARGETS.find((entry) => entry.key === 'darwin')
    assert.equal(assetNameFor(feed, target), 'PinableAgents-mac.dmg')
  })
})

describe('formatChecksums', () => {
  it('renders the real manifest as a six-line SHA256SUMS list', () => {
    const text = formatChecksums(resolveDownloads(makeFeed()))
    const line = (sha, name) => `${sha}  ${name}`
    const nameFromUrl = (url) => url.split('/').filter(Boolean).pop()

    assert.equal(
      text,
      [
        line(latest.platforms.darwin.sha256, latest.platforms.darwin.asset_name),
        line(latest.platforms['darwin-arm64'].sha256, latest.platforms['darwin-arm64'].asset_name),
        line(latest.platforms['darwin-amd64'].sha256, latest.platforms['darwin-amd64'].asset_name),
        line(latest.platforms.windows.sha256, latest.platforms.windows.asset_name),
        line(latest.asset_sha256.windows_exe, nameFromUrl(latest.assets.windows_exe)),
        line(latest.platforms['linux-core'].sha256, latest.platforms['linux-core'].asset_name),
        '',
      ].join('\n'),
    )
  })

  it('returns an empty string for non-arrays and empty input', () => {
    assert.equal(formatChecksums(null), '')
    assert.equal(formatChecksums(undefined), '')
    assert.equal(formatChecksums('not-an-array'), '')
    assert.equal(formatChecksums([]), '')
  })

  it('skips entries without a usable hash or filename', () => {
    const entries = [
      { sha256: 'a'.repeat(64), assetName: 'keep.dmg' },
      { sha256: '', assetName: 'missing-hash.zip' },
      { sha256: 'b'.repeat(64), assetName: '' },
      { sha256: 'c'.repeat(64), assetName: 'line\nbreak.zip' },
      { sha256: 'd'.repeat(64), assetName: 'carriage\rreturn.zip' },
      { sha256: null, assetName: 'null-hash.zip' },
      { sha256: 'e'.repeat(64) },
    ]

    assert.equal(formatChecksums(entries), `${'a'.repeat(64)}  keep.dmg\n`)
  })

  it('keeps resolveDownloads order and does not mutate the entries', () => {
    const entries = resolveDownloads(makeFeed())
    const snapshot = structuredClone(entries)
    const text = formatChecksums(entries)
    const lines = text.split('\n')

    assert.deepEqual(entries, snapshot)
    assert.equal(lines.length, 7)
    assert.equal(lines.at(-1), '')
    assert.ok(lines[0].endsWith('  PinableAgents-mac.dmg'))
    assert.ok(lines.at(-2).endsWith('  pinable-linux-core.tar.gz'))
    assert.equal(text.includes('\n\n'), false)
  })

  it('returns an empty string when no entry is usable', () => {
    assert.equal(
      formatChecksums([
        { sha256: '', assetName: 'a.zip' },
        { sha256: 'b'.repeat(64), assetName: '' },
      ]),
      '',
    )
  })
})

describe('pickRecommended', () => {
  const entries = resolveDownloads(makeFeed())

  it('prefers the platform primary', () => {
    assert.equal(pickRecommended(entries, 'mac').key, 'darwin')
  })

  it('falls back to the first entry of that platform', () => {
    const withoutPrimary = entries.filter((entry) => entry.key !== 'darwin')
    assert.equal(pickRecommended(withoutPrimary, 'mac').key, 'darwin-arm64')
  })

  it('returns null for a platform with no entries or no hint', () => {
    assert.equal(pickRecommended(entries, 'beos'), null)
    assert.equal(pickRecommended(entries, null), null)
    assert.equal(pickRecommended([], 'mac'), null)
  })
})

describe('parseNotes', () => {
  it('splits the real notes into one paragraph and four list items', () => {
    const notes = parseNotes(latest.notes)
    assert.equal(notes.filter((item) => item.type === 'p').length, 1)
    assert.equal(notes.filter((item) => item.type === 'li').length, 4)
    assert.ok(notes[0].text.includes('备份数据'))
    assert.doesNotMatch(notes[1].text, /^- /)
  })

  it('returns nothing for empty or non-string notes', () => {
    assert.deepEqual(parseNotes(''), [])
    assert.deepEqual(parseNotes('   '), [])
    assert.deepEqual(parseNotes(undefined), [])
  })
})

describe('formatReleaseDate', () => {
  it('reads published_at first', () => {
    assert.equal(formatReleaseDate(latest), '2026-10-11')
  })

  it('falls back through pub_date and released_at', () => {
    assert.equal(formatReleaseDate({ pub_date: '2026-10-11T09:25:56Z' }), '2026-10-11')
    assert.equal(formatReleaseDate({ released_at: '2026-10-11 17:25:56 +0800' }), '2026-10-11')
  })

  it('returns an empty string when nothing parses', () => {
    assert.equal(formatReleaseDate({ published_at: 'not-a-date' }), '')
    assert.equal(formatReleaseDate(null), '')
  })
})

describe('shortSha', () => {
  it('truncates to eight characters', () => {
    assert.equal(shortSha('5574a89ebedf46b43cc715c0796a1fc73b7d36a8895974531df4e3d1e191d3f3'), '5574a89e')
  })

  it('handles a missing value', () => {
    assert.equal(shortSha(null), '')
    assert.equal(shortSha(''), '')
  })
})

describe('loadReleaseFeed', () => {
  it('shares one request between concurrent callers', async () => {
    const payload = { version: 'v' }
    let calls = 0
    globalThis.fetch = async () => {
      calls += 1
      return { ok: true, json: async () => payload }
    }

    const [first, second] = await Promise.all([loadReleaseFeed(), loadReleaseFeed()])

    assert.equal(calls, 1)
    assert.deepEqual(first, payload)
    assert.deepEqual(second, first)
  })

  it('resolves null when the request fails or the response is not ok', async () => {
    globalThis.fetch = async () => {
      throw new Error('offline')
    }
    assert.equal(await loadReleaseFeed(), null)

    globalThis.fetch = async () => ({ ok: false, json: async () => ({}) })
    assert.equal(await loadReleaseFeed(), null)
  })
})
