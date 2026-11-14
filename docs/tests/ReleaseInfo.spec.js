import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import latest from '../public/releases/latest.json'
import ReleaseInfo from '../.vitepress/theme/components/ReleaseInfo.vue'

const makeFeed = () => structuredClone(latest)

function stubFetch(response) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))
}

async function mountWithFeed(feed) {
  stubFetch({ ok: true, json: async () => feed })
  const wrapper = mount(ReleaseInfo)
  await flushPromises()
  return wrapper
}

afterEach(() => {
  vi.unstubAllGlobals()
  delete navigator.clipboard
})

describe('ReleaseInfo', () => {
  it('renders version, date and the manifest notes', async () => {
    const wrapper = await mountWithFeed(makeFeed())

    expect(wrapper.find('.ri-version').text()).toBe(latest.version)
    expect(wrapper.text()).toContain('2026-10-11')
    expect(wrapper.findAll('.ri-notes li')).toHaveLength(4)
    expect(wrapper.find('.ri-notes p').text()).toContain('备份数据')

    wrapper.unmount()
  })

  it('lists every available asset with its full SHA-256', async () => {
    const wrapper = await mountWithFeed(makeFeed())

    const rows = wrapper.findAll('.ri-row')
    expect(rows).toHaveLength(6)
    expect(wrapper.text()).toContain('PinableAgents-mac.dmg')
    for (const row of rows) {
      expect(row.find('.ri-sha').text()).toMatch(/^[0-9a-f]{64}$/)
    }

    wrapper.unmount()
  })

  it('renders nothing when the response is not ok', async () => {
    stubFetch({ ok: false, json: async () => ({}) })
    const wrapper = mount(ReleaseInfo)
    await flushPromises()

    expect(wrapper.find('.release-info').exists()).toBe(false)
    wrapper.unmount()
  })

  it('renders nothing when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    const wrapper = mount(ReleaseInfo)
    await flushPromises()

    expect(wrapper.find('.release-info').exists()).toBe(false)
    wrapper.unmount()
  })

  it('keeps version and checksums when notes are missing', async () => {
    const feed = makeFeed()
    delete feed.notes
    const wrapper = await mountWithFeed(feed)

    expect(wrapper.find('.ri-version').exists()).toBe(true)
    expect(wrapper.find('.ri-notes').exists()).toBe(false)
    expect(wrapper.findAll('.ri-row')).toHaveLength(6)

    wrapper.unmount()
  })

  it('copies the full SHA-256 to the clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const wrapper = await mountWithFeed(makeFeed())

    const firstRow = wrapper.findAll('.ri-row')[0]
    await firstRow.find('.ri-copy').trigger('click')
    await flushPromises()

    expect(writeText).toHaveBeenCalledWith(latest.platforms.darwin.sha256)
    expect(firstRow.find('.ri-copy').text()).toBe('已复制')

    wrapper.unmount()
  })
})
