import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SectionRail from '../.vitepress/theme/components/SectionRail.vue'

vi.mock('vitepress', () => ({
  useRoute: () => ({ path: '/' }),
}))

const wrappers = []

function addSections(html) {
  document.body.insertAdjacentHTML('beforeend', html)
}

async function mountRail() {
  const wrapper = mount(SectionRail)
  wrappers.push(wrapper)
  await wrapper.vm.$nextTick()
  return wrapper
}

const hrefsOf = (wrapper) => wrapper.findAll('.rail-item').map((item) => item.attributes('href'))
const labelsOf = (wrapper) => wrapper.findAll('.rail-label').map((label) => label.text())

afterEach(() => {
  for (const wrapper of wrappers) wrapper.unmount()
  wrappers.length = 0
  document.body.innerHTML = ''
})

describe('SectionRail', () => {
  it('prefers the explicit Chinese rail label over the design eyebrow', async () => {
    addSections(`
      <section class="landing-section" data-rail-label="运行时">
        <span class="landing-eyebrow">01 · Runtime</span>
      </section>
      <section class="landing-section" data-rail-label="编排">
        <span class="landing-eyebrow">02 · Orchestration</span>
      </section>
      <section class="landing-section" data-rail-label="交付">
        <span class="landing-eyebrow">03 · Delivery</span>
      </section>
    `)

    const wrapper = await mountRail()

    expect(labelsOf(wrapper)).toEqual(['运行时', '编排', '交付'])
    expect(wrapper.text()).not.toMatch(/Runtime|Orchestration|Delivery/)
  })

  it('keeps anchor ids derived from the eyebrow for link compatibility', async () => {
    addSections(`
      <section class="landing-section" data-rail-label="运行时">
        <span class="landing-eyebrow">01 · Runtime</span>
      </section>
      <section class="landing-section" data-rail-label="编排">
        <span class="landing-eyebrow">02 · Orchestration</span>
      </section>
      <section class="landing-section" data-rail-label="交付">
        <span class="landing-eyebrow">03 · Delivery</span>
      </section>
    `)

    const wrapper = await mountRail()

    expect(hrefsOf(wrapper)).toEqual(['#runtime', '#orchestration', '#delivery'])
  })

  it('falls back to the eyebrow when no rail label is declared', async () => {
    addSections(`
      <section class="landing-section"><span class="landing-eyebrow">01 · Runtime</span></section>
      <section class="landing-section"><span class="landing-eyebrow">02 · Orchestration</span></section>
      <section class="landing-section"><span class="landing-eyebrow">03 · Delivery</span></section>
    `)

    const wrapper = await mountRail()

    expect(labelsOf(wrapper)).toEqual(['01 · Runtime', '02 · Orchestration', '03 · Delivery'])
  })

  it('keeps hand-written ids and duplicate suffixes unchanged', async () => {
    addSections(`
      <section class="landing-section" id="interface">
        <span class="landing-eyebrow">Interface</span>
      </section>
      <section class="landing-section"><span class="landing-eyebrow">01 · Runtime</span></section>
      <section class="landing-section"><span class="landing-eyebrow">01 · Runtime</span></section>
    `)

    const wrapper = await mountRail()

    expect(hrefsOf(wrapper)).toEqual(['#interface', '#runtime', '#runtime-2'])
  })

  it('marks exactly one section as current', async () => {
    addSections(`
      <section class="landing-section" data-rail-label="运行时"></section>
      <section class="landing-section" data-rail-label="编排"></section>
      <section class="landing-section" data-rail-label="交付"></section>
    `)

    const wrapper = await mountRail()

    expect(wrapper.findAll('[aria-current="true"]')).toHaveLength(1)
  })
})
