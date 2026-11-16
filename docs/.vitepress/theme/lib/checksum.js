/**
 * Pure helpers for verifying a pasted SHA-256 against the release manifest.
 *
 * The input is usually a whole command output line (`shasum -a 256`, PowerShell
 * `Get-FileHash`, `sha256sum`), so digests are extracted from any surrounding
 * text instead of requiring the user to pick out the 64 characters themselves.
 * No DOM or Vue access lives here.
 */

const SHA256_LENGTH = 64

/**
 * Every distinct 64-character hex token in `text`, lowercased, in first-seen
 * order. Tokenizing on anything that is not hex prevents a 64-character prefix
 * of a longer hex run (65+ characters) from being accepted. Non-strings and
 * empty input yield an empty list; the input is never mutated.
 */
export function extractDigests(text) {
  if (typeof text !== 'string' || !text) return []

  const seen = new Set()
  const digests = []
  for (const token of text.toLowerCase().split(/[^0-9a-f]+/)) {
    if (token.length !== SHA256_LENGTH || seen.has(token)) continue
    seen.add(token)
    digests.push(token)
  }
  return digests
}

/**
 * Compare a pasted digest (or command output) with `entries` from
 * `resolveDownloads`. Returns one of four states:
 *
 * - `idle`: blank input, nothing to verify yet
 * - `invalid`: non-blank input containing no 64-character digest
 * - `match`: at least one extracted digest matches an entry, case-insensitively
 * - `mismatch`: digests were found but none match
 *
 * Missing or malformed entries are ignored rather than throwing, so a partial
 * manifest simply cannot produce a match.
 */
export function verifyChecksum(text, entries) {
  if (typeof text !== 'string' || !text.trim()) {
    return { state: 'idle', digest: '', entry: null }
  }

  const digests = extractDigests(text)
  if (!digests.length) {
    return { state: 'invalid', digest: '', entry: null }
  }

  const candidates = Array.isArray(entries) ? entries : []
  for (const digest of digests) {
    const entry = candidates.find((item) => {
      const sha = typeof item?.sha256 === 'string' ? item.sha256.trim().toLowerCase() : ''
      return sha === digest
    })
    if (entry) return { state: 'match', digest, entry }
  }

  return { state: 'mismatch', digest: digests[0], entry: null }
}
