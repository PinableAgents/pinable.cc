import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { afterEach, describe, it } from 'node:test'
import {
  TARGETS,
  assetNameFor,
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

  it('drops the macOS entries when their platform keys are missing', () => {
    const feed = makeFeed()
    for (const key of ['darwin', 'darwin-arm64', 'darwin-amd64']) delete feed.platforms[key]
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
