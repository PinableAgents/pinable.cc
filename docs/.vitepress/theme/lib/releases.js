/**
 * Pure helpers for the release manifest the pipeline publishes to
 * /releases/latest.json. No Vue and no DOM access lives here, so both the
 * landing-page download buttons and the downloads-page release details share
 * one platform mapping instead of drifting apart.
 */

export const RELEASES_PAGE = 'https://github.com/PinableAgents/pinable.cc/releases'
export const FEED_URL = '/releases/latest.json'

/** Every entry the site can offer, in a stable display order. */
export const TARGETS = [
  { platform: 'mac', label: 'macOS · Universal', hint: '.dmg', key: 'darwin', primary: true },
  { platform: 'mac', label: 'macOS · Apple Silicon', hint: '.zip', key: 'darwin-arm64' },
  { platform: 'mac', label: 'macOS · Intel', hint: '.zip', key: 'darwin-amd64' },
  { platform: 'windows', label: 'Windows · 便携版', hint: '.zip', key: 'windows', primary: true },
  { platform: 'windows', label: 'Windows · 安装程序', hint: '.exe', asset: 'windows_exe' },
  { platform: 'linux', label: 'Linux · Core', hint: '.tar.gz', key: 'linux-core', primary: true },
]

/**
 * The manifest keeps URLs in two places: `platforms` holds objects (url +
 * sha256 + asset_name), `assets` holds bare URL strings. Some `assets` keys are
 * declared but null in practice (linux_tar_gz_amd64, linux_appimage_amd64), so
 * every lookup is treated as possibly empty.
 */
export function urlFor(feed, target) {
  if (!feed) return null

  if (target.asset) {
    const value = feed.assets?.[target.asset]
    return typeof value === 'string' && value ? value : null
  }

  const entry = feed.platforms?.[target.key]
  return entry && typeof entry.url === 'string' && entry.url ? entry.url : null
}

export function shaFor(feed, target) {
  if (!feed) return null
  const sha = target.asset
    ? feed.asset_sha256?.[target.asset]
    : feed.platforms?.[target.key]?.sha256
  return typeof sha === 'string' && sha ? sha : null
}

/** Prefer the manifest's own filename; fall back to the URL's last segment. */
export function assetNameFor(feed, target) {
  const declared = !target.asset ? feed?.platforms?.[target.key]?.asset_name : null
  if (typeof declared === 'string' && declared) return declared

  const url = urlFor(feed, target)
  if (!url) return ''
  try {
    const name = new URL(url).pathname.split('/').filter(Boolean).pop()
    return name ? decodeURIComponent(name) : ''
  } catch {
    return url.split('/').filter(Boolean).pop() ?? ''
  }
}

/** Only entries the manifest actually resolves to a URL. */
export function resolveDownloads(feed) {
  return TARGETS.flatMap((target) => {
    const url = urlFor(feed, target)
    if (!url) return []
    return [
      {
        ...target,
        url,
        sha256: shaFor(feed, target),
        assetName: assetNameFor(feed, target),
      },
    ]
  })
}

/** The primary entry for a platform, else its first entry, else null. */
export function pickRecommended(entries, platform) {
  if (!platform) return null
  const match = entries.find((entry) => entry.platform === platform && entry.primary)
  return match ?? entries.find((entry) => entry.platform === platform) ?? null
}

/**
 * The feed's `notes` is plain text: paragraphs separated by blank lines, list
 * items introduced by "- ". Returns a flat list so the caller decides markup.
 */
export function parseNotes(text) {
  if (typeof text !== 'string' || !text.trim()) return []

  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .flatMap((block) => {
      const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
      if (lines.every((line) => /^[-*]\s+/.test(line))) {
        return lines.map((line) => ({ type: 'li', text: line.replace(/^[-*]\s+/, '') }))
      }
      return [{ type: 'p', text: lines.join(' ') }]
    })
}

/** YYYY-MM-DD from whichever date field the manifest carries, else ''. */
export function formatReleaseDate(feed) {
  for (const key of ['published_at', 'pub_date', 'released_at']) {
    const value = feed?.[key]
    if (typeof value !== 'string' || !value) continue
    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10)
  }
  return ''
}

export function shortSha(sha) {
  return typeof sha === 'string' && sha ? sha.slice(0, 8) : ''
}

let inFlight = null

/**
 * Two components on the downloads page read the same manifest. Share one
 * request while it is in flight; a later call starts a fresh one so a failed
 * request is never cached for the rest of the session.
 */
export function loadReleaseFeed() {
  if (!inFlight) {
    inFlight = fetch(FEED_URL, { cache: 'no-cache' })
      .then((response) => (response.ok ? response.json() : null))
      .catch(() => null)
      .finally(() => {
        inFlight = null
      })
  }
  return inFlight
}
