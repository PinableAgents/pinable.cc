import { afterEach, describe, expect, it, vi } from 'vitest'
import latest from '../public/releases/latest.json'
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

const makeFeed = () => structuredClone(latest)

const labelsOf = (entries) => entries.map((entry) => entry.label)

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('resolveDownloads', () => {
  it('returns nothing without a feed', () => {
    expect(resolveDownloads(null)).toEqual([])
    expect(resolveDownloads(undefined)).toEqual([])
  })

  it('resolves every target the real manifest carries, in display order', () => {
    const entries = resolveDownloads(makeFeed())
    expect(labelsOf(entries)).toEqual([
      'macOS · Universal',
      'macOS · Apple Silicon',
      'macOS · Intel',
      'Windows · 便携版',
      'Windows · 安装程序',
      'Linux · Core',
    ])
    for (const entry of entries) {
      expect(entry.url).toMatch(/^https:\/\//)
      expect(entry.sha256).toMatch(/^[0-9a-f]{64}$/)
      expect(entry.assetName).not.toBe('')
    }
  })

  it('drops an entry whose platform key is missing', () => {
    const feed = makeFeed()
    delete feed.platforms['linux-core']
    expect(labelsOf(resolveDownloads(feed))).not.toContain('Linux · Core')
  })

  it('drops the macOS entries when their platform keys are missing', () => {
    const feed = makeFeed()
    for (const key of ['darwin', 'darwin-arm64', 'darwin-amd64']) delete feed.platforms[key]
    const labels = labelsOf(resolveDownloads(feed))
    expect(labels.some((label) => label.startsWith('macOS'))).toBe(false)
    expect(labels).toContain('Windows · 便携版')
  })

  it('drops an asset-style entry when its URL is null', () => {
    const feed = makeFeed()
    feed.assets.windows_exe = null
    expect(labelsOf(resolveDownloads(feed))).not.toContain('Windows · 安装程序')
  })

  it('reads asset-style entries from assets / asset_sha256', () => {
    const feed = makeFeed()
    const target = TARGETS.find((entry) => entry.asset === 'windows_exe')
    expect(urlFor(feed, target)).toBe(feed.assets.windows_exe)
    expect(shaFor(feed, target)).toBe(feed.asset_sha256.windows_exe)
  })

  it('treats every lookup as nullable', () => {
    const target = TARGETS[0]
    expect(urlFor(null, target)).toBeNull()
    expect(shaFor(null, target)).toBeNull()
    expect(assetNameFor(null, target)).toBe('')
    expect(resolveDownloads({})).toEqual([])
  })
})

describe('assetNameFor', () => {
  it('uses the manifest filename when present', () => {
    const feed = makeFeed()
    const target = TARGETS.find((entry) => entry.key === 'darwin')
    expect(assetNameFor(feed, target)).toBe('PinableAgents-mac.dmg')
  })

  it('falls back to the URL basename', () => {
    const feed = makeFeed()
    delete feed.platforms.darwin.asset_name
    const target = TARGETS.find((entry) => entry.key === 'darwin')
    expect(assetNameFor(feed, target)).toBe('PinableAgents-mac.dmg')
  })
})

describe('pickRecommended', () => {
  const entries = resolveDownloads(makeFeed())

  it('prefers the platform primary', () => {
    expect(pickRecommended(entries, 'mac').key).toBe('darwin')
  })

  it('falls back to the first entry of that platform', () => {
    const withoutPrimary = entries.filter((entry) => entry.key !== 'darwin')
    expect(pickRecommended(withoutPrimary, 'mac').key).toBe('darwin-arm64')
  })

  it('returns null for a platform with no entries or no hint', () => {
    expect(pickRecommended(entries, 'beos')).toBeNull()
    expect(pickRecommended(entries, null)).toBeNull()
    expect(pickRecommended([], 'mac')).toBeNull()
  })
})

describe('parseNotes', () => {
  it('splits the real notes into one paragraph and four list items', () => {
    const notes = parseNotes(latest.notes)
    expect(notes.filter((item) => item.type === 'p')).toHaveLength(1)
    expect(notes.filter((item) => item.type === 'li')).toHaveLength(4)
    expect(notes[0].text).toContain('备份数据')
    expect(notes[1].text).not.toMatch(/^- /)
  })

  it('returns nothing for empty or non-string notes', () => {
    expect(parseNotes('')).toEqual([])
    expect(parseNotes('   ')).toEqual([])
    expect(parseNotes(undefined)).toEqual([])
  })
})

describe('formatReleaseDate', () => {
  it('reads published_at first', () => {
    expect(formatReleaseDate(latest)).toBe('2026-10-11')
  })

  it('falls back through pub_date and released_at', () => {
    expect(formatReleaseDate({ pub_date: '2026-10-11T09:25:56Z' })).toBe('2026-10-11')
    expect(formatReleaseDate({ released_at: '2026-10-11 17:25:56 +0800' })).toBe('2026-10-11')
  })

  it('returns an empty string when nothing parses', () => {
    expect(formatReleaseDate({ published_at: 'not-a-date' })).toBe('')
    expect(formatReleaseDate(null)).toBe('')
  })
})

describe('shortSha', () => {
  it('truncates to eight characters', () => {
    expect(shortSha('5574a89ebedf46b43cc715c0796a1fc73b7d36a8895974531df4e3d1e191d3f3')).toBe(
      '5574a89e',
    )
  })

  it('handles a missing value', () => {
    expect(shortSha(null)).toBe('')
    expect(shortSha('')).toBe('')
  })
})

describe('loadReleaseFeed', () => {
  it('shares one request between concurrent callers', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ version: 'v' }) })
    vi.stubGlobal('fetch', fetchMock)

    const [first, second] = await Promise.all([loadReleaseFeed(), loadReleaseFeed()])

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(first).toEqual({ version: 'v' })
    expect(second).toEqual(first)
  })

  it('resolves null when the request fails or the response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    expect(await loadReleaseFeed()).toBeNull()

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }))
    expect(await loadReleaseFeed()).toBeNull()
  })
})
