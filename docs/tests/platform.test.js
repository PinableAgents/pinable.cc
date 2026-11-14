import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { detectPlatform } from '../.vitepress/theme/lib/platform.js'

/*
 * Node's built-in runner only — detectPlatform is a pure function over the
 * hints it receives, so this file runs without vitest, jsdom or a .vue import.
 */
describe('detectPlatform', () => {
  it('detects macOS from the legacy platform hint', () => {
    assert.equal(detectPlatform({ platform: 'MacIntel' }), 'mac')
  })

  it('detects macOS from the user agent', () => {
    assert.equal(
      detectPlatform({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5)' }),
      'mac',
    )
  })

  it('prefers userAgentData over the legacy hints', () => {
    assert.equal(
      detectPlatform({
        userAgentData: { platform: 'macOS' },
        platform: 'Win32',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      }),
      'mac',
    )
  })

  it('detects Windows', () => {
    assert.equal(detectPlatform({ platform: 'Win32' }), 'windows')
    assert.equal(
      detectPlatform({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }),
      'windows',
    )
  })

  it('detects Linux', () => {
    assert.equal(detectPlatform({ platform: 'Linux x86_64' }), 'linux')
    assert.equal(
      detectPlatform({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64)' }),
      'linux',
    )
  })

  it('returns null for Android, iOS and other mobile clients', () => {
    assert.equal(
      detectPlatform({ userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8)' }),
      null,
    )
    assert.equal(
      detectPlatform({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)' }),
      null,
    )
    assert.equal(
      detectPlatform({ userAgent: 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)' }),
      null,
    )
    assert.equal(detectPlatform({ userAgent: 'Mozilla/5.0 (Mobile; rv:130.0)' }), null)
  })

  it('returns null for unknown or empty hints', () => {
    assert.equal(detectPlatform({}), null)
    assert.equal(detectPlatform({ platform: 'FreeBSD' }), null)
    assert.equal(detectPlatform(null), null)
  })

  it('does not throw without an explicit hint object', () => {
    assert.doesNotThrow(() => detectPlatform())
  })
})
