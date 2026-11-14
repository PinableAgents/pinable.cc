/**
 * Coarse platform detection shared by the landing downloads block and the
 * downloads-page install guide. userAgentData is the modern hint; platform
 * and userAgent are the legacy ones. Android and iPadOS both claim to be
 * Linux/macOS, so anything ambiguous falls through to no match rather than
 * guessing wrong.
 *
 * Pure by design: callers pass the hints (or rely on the global default), so
 * this can run under plain `node --test` without a DOM.
 */
export function detectPlatform(hints = globalThis.navigator) {
  const hint = `${hints?.userAgentData?.platform ?? ''} ${hints?.platform ?? ''} ${hints?.userAgent ?? ''}`

  if (/android|iphone|ipad|ipod|mobile/i.test(hint)) return null
  if (/mac/i.test(hint)) return 'mac'
  if (/win/i.test(hint)) return 'windows'
  if (/linux|x11/i.test(hint)) return 'linux'
  return null
}
