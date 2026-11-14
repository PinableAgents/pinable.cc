import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import latest from '../public/releases/latest.json'
import HeroDownloads from '../.vitepress/theme/components/HeroDownloads.vue'
import { RELEASES_PAGE } from '../.vitepress/theme/lib/releases.js'

const makeFeed = () => structuredClone(latest)

const originalPlatform = navigator.platform
const originalUserAgent = navigator.userAgent

function setPlatform(platform) {
  Object.defineProperty(navigator, 'platform', { value: platform, configurable: true })
}

afterEach(() => {
  Object.defineProperty(navigator, 'platform', { value: originalPlatform, configurable: true })
  Object.defineProperty(navigator, 'userAgent', { value: originalUserAgent, configurable: true })
  vi.unstubAllGlobals()
})

describe('HeroDownloads', () => {
  it('starts from the GitHub fallback link', async () => {
    let resolveFetch
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise((resolve) => {
            resolveFetch = resolve
          }),
      ),
    )

    const wrapper = mount(HeroDownloads)

    expect(wrapper.find('.hd-primary').attributes('href')).toBe(RELEASES_PAGE)
    expect(wrapper.text()).toContain('下载 PinableAgents')

    resolveFetch({ ok: true, json: async () => makeFeed() })
    await flushPromises()
    wrapper.unmount()
  })

  it('recommends the universal macOS build on a Mac', async () => {
    setPlatform('MacIntel')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => makeFeed() }))

    const wrapper = mount(HeroDownloads)
    await flushPromises()

    const primary = wrapper.find('.hd-primary')
    expect(primary.text()).toContain('macOS · Universal')
    expect(primary.attributes('href')).toBe(latest.platforms.darwin.url)
    expect(wrapper.text()).toContain('5574a89e')

    wrapper.unmount()
  })

  it('falls back to the universal alias on a Mac', async () => {
    setPlatform('MacIntel')
    const feed = makeFeed()
    delete feed.platforms.darwin
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => feed }))

    const wrapper = mount(HeroDownloads)
    await flushPromises()

    const primary = wrapper.find('.hd-primary')
    expect(primary.text()).toContain('macOS · Universal')
    expect(primary.attributes('href')).toBe(feed.platforms['darwin-universal'].url)
    expect(wrapper.text()).toContain('5574a89e')

    wrapper.unmount()
  })

  it('never links to an asset the manifest does not carry', async () => {
    setPlatform('MacIntel')
    const feed = makeFeed()
    delete feed.platforms['linux-core']
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => feed }))

    const wrapper = mount(HeroDownloads, { props: { startExpanded: true } })
    await flushPromises()

    const hrefs = wrapper.findAll('a').map((anchor) => anchor.attributes('href'))
    expect(hrefs.length).toBeGreaterThan(0)
    for (const href of hrefs) {
      expect(href).toMatch(/^https:\/\//)
    }
    expect(wrapper.text()).not.toContain('Linux')

    wrapper.unmount()
  })

  it('hides the alternatives toggle when there is only one entry', async () => {
    setPlatform('MacIntel')
    const feed = makeFeed()
    const minimal = { version: 'test', platforms: { darwin: feed.platforms.darwin } }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => minimal }))

    const wrapper = mount(HeroDownloads)
    await flushPromises()

    expect(wrapper.find('.hd-primary').exists()).toBe(true)
    expect(wrapper.find('.hd-toggle').exists()).toBe(false)

    wrapper.unmount()
  })
})
