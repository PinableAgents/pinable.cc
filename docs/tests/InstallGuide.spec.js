import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { flushPromises, mount } from '@vue/test-utils'
import latest from '../public/releases/latest.json'
import InstallGuide from '../.vitepress/theme/components/InstallGuide.vue'

const makeFeed = () => structuredClone(latest)

const originalPlatform = navigator.platform
const originalUserAgent = navigator.userAgent
const originalUserAgentData = Object.getOwnPropertyDescriptor(navigator, 'userAgentData')

function setHints({ platform, userAgent, userAgentData }) {
  if (platform !== undefined) {
    Object.defineProperty(navigator, 'platform', { value: platform, configurable: true })
  }
  if (userAgent !== undefined) {
    Object.defineProperty(navigator, 'userAgent', { value: userAgent, configurable: true })
  }
  if (userAgentData !== undefined) {
    Object.defineProperty(navigator, 'userAgentData', {
      value: userAgentData,
      configurable: true,
    })
  }
}

function stubFeed(feed) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => feed }))
}

function useMac() {
  setHints({
    platform: 'MacIntel',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5)',
  })
}

async function mountGuide(feed = makeFeed()) {
  stubFeed(feed)
  const wrapper = mount(InstallGuide)
  await flushPromises()
  return wrapper
}

const activeTab = (wrapper) =>
  wrapper.findAll('.ig-tab').find((button) => button.attributes('aria-pressed') === 'true')

afterEach(() => {
  Object.defineProperty(navigator, 'platform', { value: originalPlatform, configurable: true })
  Object.defineProperty(navigator, 'userAgent', { value: originalUserAgent, configurable: true })
  if (originalUserAgentData) {
    Object.defineProperty(navigator, 'userAgentData', originalUserAgentData)
  } else {
    delete navigator.userAgentData
  }
  delete navigator.clipboard
  vi.unstubAllGlobals()
})

describe('InstallGuide SSR', () => {
  it('renders only the macOS panel, without fetching or links', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const html = await renderToString(createSSRApp(InstallGuide))

    expect(html).toContain('安装与校验')
    expect(html).toContain('shasum -a 256')
    expect(html).toContain('PinableAgents-mac.dmg')
    expect(html).not.toContain('Get-FileHash')
    expect(html).not.toContain('sha256sum')
    expect(html).not.toContain('<a ')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('InstallGuide platform selection', () => {
  it('selects the Windows guide on Windows', async () => {
    setHints({
      platform: 'Win32',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    })
    const wrapper = await mountGuide()

    expect(activeTab(wrapper).text()).toBe('Windows')
    expect(wrapper.find('.ig-command-text').text()).toBe(
      'Get-FileHash ".\\PinableAgents-win-portable.zip" -Algorithm SHA256',
    )

    wrapper.unmount()
  })

  it('selects the Linux guide on Linux', async () => {
    setHints({
      platform: 'Linux x86_64',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
    })
    const wrapper = await mountGuide()

    expect(activeTab(wrapper).text()).toBe('Linux Core')
    expect(wrapper.find('.ig-command-text').text()).toBe(
      'sha256sum "pinable-linux-core.tar.gz"',
    )

    wrapper.unmount()
  })

  it('keeps macOS selected when the platform is unknown', async () => {
    setHints({ platform: 'FreeBSD', userAgent: 'Mozilla/5.0 (FreeBSD)' })
    const wrapper = await mountGuide()

    expect(activeTab(wrapper).text()).toBe('macOS')
    expect(wrapper.find('.ig-command-text').text()).toBe(
      'shasum -a 256 "PinableAgents-mac.dmg"',
    )

    wrapper.unmount()
  })

  it('switches tabs manually and resets the copy feedback', async () => {
    useMac()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const wrapper = await mountGuide()

    const buttons = wrapper.findAll('.ig-tab')
    await buttons.find((button) => button.text() === 'Windows').trigger('click')
    expect(activeTab(wrapper).text()).toBe('Windows')

    const copy = wrapper.find('.ig-copy')
    await copy.trigger('click')
    await flushPromises()
    expect(copy.text()).toBe('已复制')

    await buttons.find((button) => button.text() === 'Linux Core').trigger('click')
    expect(activeTab(wrapper).text()).toBe('Linux Core')
    expect(wrapper.find('.ig-copy').text()).toBe('复制命令')
    expect(wrapper.find('.ig-command-text').text()).toBe('sha256sum "pinable-linux-core.tar.gz"')

    wrapper.unmount()
  })

  it('never renders a link in any tab state', async () => {
    useMac()
    const wrapper = await mountGuide()

    for (const button of wrapper.findAll('.ig-tab')) {
      await button.trigger('click')
      expect(wrapper.findAll('a')).toHaveLength(0)
    }

    wrapper.unmount()
  })
})

describe('InstallGuide checksum command', () => {
  it('copies the current command to the clipboard', async () => {
    useMac()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const wrapper = await mountGuide()

    await wrapper.find('.ig-copy').trigger('click')
    await flushPromises()

    expect(writeText).toHaveBeenCalledWith('shasum -a 256 "PinableAgents-mac.dmg"')
    expect(wrapper.find('.ig-copy').text()).toBe('已复制')

    wrapper.unmount()
  })

  it('reports a rejected clipboard write', async () => {
    useMac()
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const wrapper = await mountGuide()

    await wrapper.find('.ig-copy').trigger('click')
    await flushPromises()

    expect(wrapper.find('.ig-copy').text()).toBe('复制失败')

    wrapper.unmount()
  })

  it('reports a failure when the clipboard is unavailable', async () => {
    useMac()
    delete navigator.clipboard
    const wrapper = await mountGuide()

    await wrapper.find('.ig-copy').trigger('click')
    await flushPromises()

    expect(wrapper.find('.ig-copy').text()).toBe('复制失败')

    wrapper.unmount()
  })

  it('follows a renamed manifest asset', async () => {
    useMac()
    const feed = makeFeed()
    feed.platforms.darwin.asset_name = 'PinableAgents-mac-custom.dmg'
    const wrapper = await mountGuide(feed)

    expect(wrapper.find('.ig-command-text').text()).toBe(
      'shasum -a 256 "PinableAgents-mac-custom.dmg"',
    )

    wrapper.unmount()
  })

  it('falls back to the static filename when the feed cannot load', async () => {
    useMac()
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    const wrapper = mount(InstallGuide)
    await flushPromises()

    expect(wrapper.find('.ig-command-text').text()).toBe(
      'shasum -a 256 "PinableAgents-mac.dmg"',
    )
    await wrapper.findAll('.ig-tab').find((button) => button.text() === 'Windows').trigger('click')
    expect(wrapper.find('.ig-command-text').text()).toBe(
      'Get-FileHash ".\\PinableAgents-win-portable.zip" -Algorithm SHA256',
    )

    wrapper.unmount()
  })

  it('falls back instead of using the Windows .exe when the portable entry is missing', async () => {
    setHints({
      platform: 'Win32',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    })
    const feed = makeFeed()
    for (const key of ['windows', 'windows-amd64', 'windows-x86_64']) delete feed.platforms[key]
    const wrapper = await mountGuide(feed)

    const command = wrapper.find('.ig-command-text').text()
    expect(command).toBe('Get-FileHash ".\\PinableAgents-win-portable.zip" -Algorithm SHA256')
    expect(command).not.toContain('.exe')

    wrapper.unmount()
  })

  it('falls back when the manifest filename contains a line break', async () => {
    useMac()
    const feed = makeFeed()
    feed.platforms.darwin.asset_name = 'PinableAgents-mac\nevil.dmg'
    const wrapper = await mountGuide(feed)

    expect(wrapper.find('.ig-command-text').text()).toBe(
      'shasum -a 256 "PinableAgents-mac.dmg"',
    )

    wrapper.unmount()
  })
})
