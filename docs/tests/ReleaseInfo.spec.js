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

  it('resolves every platform when only aliases remain', async () => {
    const feed = makeFeed()
    for (const key of ['darwin', 'darwin-arm64', 'darwin-amd64', 'windows']) {
      delete feed.platforms[key]
    }
    const wrapper = await mountWithFeed(feed)

    const rows = wrapper.findAll('.ri-row')
    expect(rows).toHaveLength(6)
    expect(wrapper.text()).toContain('PinableAgents-mac.dmg')
    expect(wrapper.text()).toContain('PinableAgents-win-portable.zip')
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

  it('copies the whole checksum list in SHA256SUMS format', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const wrapper = await mountWithFeed(makeFeed())

    const allButton = wrapper.find('.ri-checksums-head .ri-copy')
    expect(allButton.text()).toBe('复制全部')
    await allButton.trigger('click')
    await flushPromises()

    const text = writeText.mock.calls[0][0]
    const lines = text.split('\n')
    expect(lines).toHaveLength(7)
    expect(text.includes('\n\n')).toBe(false)
    expect(lines[0]).toBe(`${latest.platforms.darwin.sha256}  PinableAgents-mac.dmg`)
    expect(lines[5]).toBe(
      `${latest.platforms['linux-core'].sha256}  pinable-linux-core.tar.gz`,
    )
    expect(lines[6]).toBe('')
    expect(allButton.text()).toBe('已复制')

    wrapper.unmount()
  })

  it('reports a rejected clipboard for the bulk copy', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const wrapper = await mountWithFeed(makeFeed())

    const allButton = wrapper.find('.ri-checksums-head .ri-copy')
    await allButton.trigger('click')
    await flushPromises()

    expect(allButton.text()).toBe('复制失败')

    wrapper.unmount()
  })

  it('reports a bulk copy failure when the clipboard is unavailable', async () => {
    delete navigator.clipboard
    const wrapper = await mountWithFeed(makeFeed())

    const allButton = wrapper.find('.ri-checksums-head .ri-copy')
    await allButton.trigger('click')
    await flushPromises()

    expect(allButton.text()).toBe('复制失败')

    wrapper.unmount()
  })

  it('copies only the assets that still carry a checksum', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const feed = makeFeed()
    feed.platforms.windows.sha256 = ''
    const wrapper = await mountWithFeed(feed)

    expect(wrapper.findAll('.ri-row')).toHaveLength(5)
    await wrapper.find('.ri-checksums-head .ri-copy').trigger('click')
    await flushPromises()

    const lines = writeText.mock.calls[0][0].split('\n')
    expect(lines).toHaveLength(6)
    expect(lines[3]).toBe(
      `${latest.asset_sha256.windows_exe}  PinableAgents-win.exe`,
    )
    expect(lines.at(-2)).toBe(
      `${latest.platforms['linux-core'].sha256}  pinable-linux-core.tar.gz`,
    )

    wrapper.unmount()
  })

  it('does not render the bulk copy button without checksums', async () => {
    const feed = makeFeed()
    for (const key of ['darwin', 'darwin-arm64', 'darwin-amd64', 'windows', 'linux-core']) {
      feed.platforms[key].sha256 = ''
    }
    feed.asset_sha256.windows_exe = ''
    const wrapper = await mountWithFeed(feed)

    expect(wrapper.find('.ri-version').exists()).toBe(true)
    expect(wrapper.find('.ri-checksums').exists()).toBe(false)
    expect(wrapper.find('.ri-checksums-head .ri-copy').exists()).toBe(false)

    wrapper.unmount()
  })
})
