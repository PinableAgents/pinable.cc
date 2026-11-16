import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { extractDigests, verifyChecksum } from '../.vitepress/theme/lib/checksum.js'
import { resolveDownloads } from '../.vitepress/theme/lib/releases.js'

/*
 * Node's built-in runner only — no vitest and no .vue import — so `node --test`
 * runs this file on its own and alongside the component specs under `npm test`.
 * The real manifest is read as data because a bare JSON import needs an import
 * attribute under Node's own ESM loader.
 */
const latest = JSON.parse(
  readFileSync(new URL('../public/releases/latest.json', import.meta.url), 'utf8'),
)
const DARWIN_SHA = latest.platforms.darwin.sha256
const entries = resolveDownloads(latest)

describe('extractDigests', () => {
  it('returns nothing for empty, whitespace and non-string input', () => {
    assert.deepEqual(extractDigests(''), [])
    assert.deepEqual(extractDigests('   \n\t'), [])
    assert.deepEqual(extractDigests(null), [])
    assert.deepEqual(extractDigests(undefined), [])
    assert.deepEqual(extractDigests(42), [])
  })

  it('extracts a digest from plain text and a whole shasum line', () => {
    assert.deepEqual(extractDigests(` ${DARWIN_SHA.toUpperCase()} `), [DARWIN_SHA])
    assert.deepEqual(
      extractDigests(`${DARWIN_SHA.toUpperCase()}  PinableAgents-mac.dmg`),
      [DARWIN_SHA],
    )
    assert.deepEqual(
      extractDigests(`SHA256 (PinableAgents-mac.dmg) = ${DARWIN_SHA}`),
      [DARWIN_SHA],
    )
  })

  it('lowercases and deduplicates while preserving first-seen order', () => {
    const other = 'a'.repeat(64)
    assert.deepEqual(
      extractDigests(`${DARWIN_SHA.toUpperCase()} ${other} ${DARWIN_SHA}`),
      [DARWIN_SHA, other],
    )
  })

  it('rejects 63- and 65-character hex tokens', () => {
    assert.deepEqual(extractDigests('a'.repeat(63)), [])
    assert.deepEqual(extractDigests('a'.repeat(65)), [])
    assert.deepEqual(extractDigests(`${'a'.repeat(65)} ${DARWIN_SHA}`), [DARWIN_SHA])
  })

  it('finds every digest in multi-line output', () => {
    const another = 'b'.repeat(64)
    const text = `${DARWIN_SHA}  PinableAgents-mac.dmg\n${another}  other.zip\n`
    assert.deepEqual(extractDigests(text), [DARWIN_SHA, another])
  })
})

describe('verifyChecksum', () => {
  it('is idle for blank or non-string input', () => {
    for (const value of ['', '  \n ', null, undefined]) {
      assert.deepEqual(verifyChecksum(value, entries), {
        state: 'idle',
        digest: '',
        entry: null,
      })
    }
  })

  it('is invalid when non-blank input has no 64-character digest', () => {
    assert.equal(verifyChecksum('hello', entries).state, 'invalid')
    assert.equal(verifyChecksum('a'.repeat(63), entries).state, 'invalid')
    assert.equal(verifyChecksum('a'.repeat(65), entries).state, 'invalid')
  })

  it('matches a raw digest regardless of case and surrounding whitespace', () => {
    const result = verifyChecksum(`  ${DARWIN_SHA.toUpperCase()}\n`, entries)

    assert.equal(result.state, 'match')
    assert.equal(result.entry.assetName, 'PinableAgents-mac.dmg')
    assert.equal(result.digest, DARWIN_SHA)
  })

  it('matches a whole command output line', () => {
    const result = verifyChecksum(`${DARWIN_SHA}  PinableAgents-mac.dmg`, entries)

    assert.equal(result.state, 'match')
    assert.equal(result.entry.key, 'darwin')
  })

  it('matches when any extracted digest is in the manifest', () => {
    const result = verifyChecksum(`${'0'.repeat(64)}\n${DARWIN_SHA}`, entries)

    assert.equal(result.state, 'match')
    assert.equal(result.entry.key, 'darwin')
  })

  it('is mismatch for a well-formed digest that is not published', () => {
    const result = verifyChecksum('0'.repeat(64), entries)

    assert.equal(result.state, 'mismatch')
    assert.equal(result.entry, null)
    assert.equal(result.digest, '0'.repeat(64))
  })

  it('ignores missing, malformed and empty entries without throwing', () => {
    assert.equal(verifyChecksum(DARWIN_SHA, null).state, 'mismatch')
    assert.equal(verifyChecksum(DARWIN_SHA, undefined).state, 'mismatch')
    assert.equal(
      verifyChecksum(DARWIN_SHA, [null, {}, { sha256: 42 }, { sha256: '  ' }]).state,
      'mismatch',
    )
  })

  it('normalizes whitespace and case in manifest entries', () => {
    const result = verifyChecksum(DARWIN_SHA, [
      { sha256: ` ${DARWIN_SHA.toUpperCase()} `, assetName: 'custom.dmg' },
    ])

    assert.equal(result.state, 'match')
    assert.equal(result.entry.assetName, 'custom.dmg')
  })

  it('matches the real manifest darwin digest', () => {
    const result = verifyChecksum(DARWIN_SHA, entries)

    assert.equal(result.state, 'match')
    assert.equal(result.entry.assetName, latest.platforms.darwin.asset_name)
    assert.equal(result.entry.sha256, latest.platforms.darwin.sha256)
  })

  it('does not mutate the entries it receives', () => {
    const input = structuredClone(entries)
    const snapshot = structuredClone(input)

    verifyChecksum(DARWIN_SHA, input)

    assert.deepEqual(input, snapshot)
  })
})
