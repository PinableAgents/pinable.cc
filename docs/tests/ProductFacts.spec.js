import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import HeroMeta from '../.vitepress/theme/components/HeroMeta.vue'
import HomeExperience from '../.vitepress/theme/components/HomeExperience.vue'
import FeaturesSection from '../.vitepress/theme/components/FeaturesSection.vue'
import {
  A2A_ROLES,
  DELIVERY_STAGES,
  GATEWAY_CHANNELS,
  MCP_HARNESSES,
  MODULES,
  STABLE_BACKENDS,
} from '../.vitepress/theme/lib/productFacts.js'

describe('HeroMeta product facts', () => {
  it('renders stable backends, desktop platforms and the experimental note', () => {
    const wrapper = mount(HeroMeta)
    const backendChips = wrapper.findAll('.hm-backends li:not(.hm-note)')

    expect(backendChips.map((chip) => chip.text())).toEqual(STABLE_BACKENDS)
    expect(wrapper.text()).toContain('macOS')
    expect(wrapper.text()).toContain('Windows')
    expect(wrapper.text()).toContain('Linux Core 运行包')
    expect(wrapper.text()).toContain('DeepSeek 实验引擎')

    wrapper.unmount()
  })
})

describe('FeaturesSection product facts', () => {
  it('renders the current capability matrix from shared facts', () => {
    const wrapper = mount(FeaturesSection)
    const text = wrapper.text()

    expect(wrapper.findAll('.feature-card')).toHaveLength(12)
    for (const module of MODULES) {
      expect(text).toContain(`${module.name} ${module.version}`)
    }
    for (const channel of GATEWAY_CHANNELS) {
      expect(text).toContain(channel)
    }
    for (const harness of MCP_HARNESSES) {
      expect(text).toContain(harness)
    }
    for (const role of A2A_ROLES) {
      expect(text).toContain(role)
    }

    expect(text).toContain(DELIVERY_STAGES.join(' → '))
    expect(text).toContain('项目事项')
    expect(text).toContain('Windows')
    expect(text).not.toContain(['weixin', 'miniapp'].join('_'))
    expect(text).not.toContain(['六段', '链路'].join(''))

    wrapper.unmount()
  })

  it('exposes the capabilities anchor', () => {
    const wrapper = mount(FeaturesSection)
    expect(wrapper.attributes('id')).toBe('capabilities')
    wrapper.unmount()
  })
})

describe('HomeExperience product facts', () => {
  it('shows the five delivery stages and the four stable backends', async () => {
    const wrapper = mount(HomeExperience)

    await wrapper.findAll('.stage-button')[2].trigger('click')
    await nextTick()
    expect(wrapper.find('.panel-topbar code').text()).toBe(DELIVERY_STAGES.join(' → '))

    const impact = wrapper.find('.impact-item')
    expect(impact.find('strong').text()).toContain(`${STABLE_BACKENDS.length} 个内置 AI 后端`)
    expect(impact.text()).toContain('deepseek（实验）')

    wrapper.unmount()
  })
})
