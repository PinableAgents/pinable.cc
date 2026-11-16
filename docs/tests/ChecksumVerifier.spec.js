import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { flushPromises, mount } from '@vue/test-utils'
import latest from '../public/releases/latest.json'
import ChecksumVerifier from '../.vitepress/theme/components/ChecksumVerifier.vue'

const makeFeed = () => structuredClone(latest)
const DARWIN_SHA = latest.platforms.darwin.sha256

function stubFeed(feed) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => feed }))
}

async function mountVerifier(feed = makeFeed()) {
  stubFeed(feed)
  const wrapper = mount(ChecksumVerifier)
  await flushPromises()
  return wrapper
}

const status = (wrapper) => wrapper.find('.cv-status')

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ChecksumVerifier SSR', () => {
  it('renders nothing and does not fetch', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const html = await renderToString(createSSRApp(ChecksumVerifier))

    expect(html).not.toContain('checksum-verifier')
    expect(html).not.toContain('校验下载文件')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('ChecksumVerifier', () => {
  it('starts idle after the release feed loads', async () => {
    const wrapper = await mountVerifier()

    expect(wrapper.find('.checksum-verifier').exists()).toBe(true)
    expect(status(wrapper).attributes('role')).toBe('status')
    expect(status(wrapper).attributes('aria-live')).toBe('polite')
    expect(status(wrapper).classes()).toContain('cv-status--idle')
    expect(status(wrapper).text()).toContain('粘贴 SHA-256')
    expect(wrapper.find('.cv-input').attributes('aria-invalid')).toBeUndefined()

    wrapper.unmount()
  })

  it('matches a known digest and names the file', async () => {
    const wrapper = await mountVerifier()

    await wrapper.find('.cv-input').setValue(DARWIN_SHA)

    expect(status(wrapper).classes()).toContain('cv-status--match')
    expect(status(wrapper).text()).toContain('校验通过')
    expect(status(wrapper).text()).toContain('PinableAgents-mac.dmg')
    expect(wrapper.find('.cv-input').attributes('aria-invalid')).toBeUndefined()

    wrapper.unmount()
  })

  it('matches a whole shasum output line, ignoring case and whitespace', async () => {
    const wrapper = await mountVerifier()

    await wrapper.find('.cv-input').setValue(`  ${DARWIN_SHA.toUpperCase()}  PinableAgents-mac.dmg\n`)

    expect(status(wrapper).classes()).toContain('cv-status--match')
    expect(status(wrapper).text()).toContain('PinableAgents-mac.dmg')

    wrapper.unmount()
  })

  it('reports a mismatch for an unpublished digest', async () => {
    const wrapper = await mountVerifier()

    await wrapper.find('.cv-input').setValue('0'.repeat(64))

    expect(status(wrapper).classes()).toContain('cv-status--mismatch')
    expect(status(wrapper).text()).toContain('校验失败')
    expect(wrapper.find('.cv-input').attributes('aria-invalid')).toBeUndefined()

    wrapper.unmount()
  })

  it('marks input without a 64-character digest as invalid', async () => {
    const wrapper = await mountVerifier()

    await wrapper.find('.cv-input').setValue('hello')

    expect(status(wrapper).classes()).toContain('cv-status--invalid')
    expect(status(wrapper).text()).toContain('没有找到 64 位 SHA-256')
    expect(wrapper.find('.cv-input').attributes('aria-invalid')).toBe('true')

    wrapper.unmount()
  })

  it('returns to idle when the input is cleared', async () => {
    const wrapper = await mountVerifier()
    const input = wrapper.find('.cv-input')

    await input.setValue('hello')
    expect(status(wrapper).classes()).toContain('cv-status--invalid')

    await input.setValue('')
    expect(status(wrapper).classes()).toContain('cv-status--idle')
    expect(status(wrapper).text()).toContain('粘贴 SHA-256')

    wrapper.unmount()
  })

  it('renders nothing when the response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }))
    const wrapper = mount(ChecksumVerifier)
    await flushPromises()

    expect(wrapper.find('.checksum-verifier').exists()).toBe(false)

    wrapper.unmount()
  })

  it('renders nothing when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    const wrapper = mount(ChecksumVerifier)
    await flushPromises()

    expect(wrapper.find('.checksum-verifier').exists()).toBe(false)

    wrapper.unmount()
  })
})
