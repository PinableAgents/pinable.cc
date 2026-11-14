import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import {
  A2A_ROLES,
  CORE_PLATFORMS,
  DELIVERY_STAGES,
  DESKTOP_PLATFORMS,
  EXPERIMENTAL_BACKENDS,
  GATEWAY_CHANNELS,
  MCP_HARNESSES,
  MODULES,
  STABLE_BACKENDS,
} from '../.vitepress/theme/lib/productFacts.js'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

const index = read('../index.md')
const about = read('../about.md')
const downloads = read('../downloads.md')
const heroMeta = read('../.vitepress/theme/components/HeroMeta.vue')
const homeExperience = read('../.vitepress/theme/components/HomeExperience.vue')
const features = read('../.vitepress/theme/components/FeaturesSection.vue')
const carousel = read('../.vitepress/theme/components/FunctionCarousel.vue')
const config = read('../.vitepress/config.ts')
const footer = read('../.vitepress/theme/components/SiteFooter.vue')

const allCopy = [index, about, heroMeta, homeExperience, features].join('\n')

function occurrences(source, value) {
  return source.split(value).length - 1
}

describe('product facts copy', () => {
  it('keeps the four stable backends distinct from the experimental engine', () => {
    assert.deepEqual(STABLE_BACKENDS, ['codex', 'claude', 'antigravity', 'pi'])
    for (const source of [index, about, homeExperience]) {
      assert.doesNotMatch(source, /四个\s+AI 后端/)
    }
    assert.match(index, /四个内置 AI 后端/)
  })

  it('names DeepSeek exactly once on each product surface', () => {
    assert.ok(EXPERIMENTAL_BACKENDS.includes('deepseek'))
    for (const source of [index, about]) {
      assert.equal(occurrences(source, 'DeepSeek 实验引擎'), 1)
    }
    assert.match(features, /EXPERIMENTAL_BACKENDS/)
    assert.match(features, /实验引擎/)
  })

  it('describes the delivery lifecycle as five project stages', () => {
    assert.deepEqual(DELIVERY_STAGES, ['规划', '实现', '验证', '评审', '合入'])

    let cursor = -1
    for (const stage of DELIVERY_STAGES) {
      const next = about.indexOf(stage, cursor + 1)
      assert.ok(next > cursor, `about.md 缺少或打乱了阶段：${stage}`)
      cursor = next
    }

    assert.doesNotMatch(allCopy, /六段\s*链路/)
    assert.doesNotMatch(allCopy, /提交、校验、执行、审批、证据、时间线/)
  })

  it('keeps module chips aligned with the shipped module versions', () => {
    const chips = [...about.matchAll(/<li>([a-z-]+ \d+\.\d+)<\/li>/g)]
      .map((match) => match[1])
      .sort()
    const shipped = MODULES.map((module) => `${module.name} ${module.version}`).sort()

    assert.deepEqual(chips, shipped)
    assert.doesNotMatch(about, /image-gen 3\.1/)
  })

  it('lists exactly the three gateway channels', () => {
    for (const channel of GATEWAY_CHANNELS) {
      assert.match(about, new RegExp(`\\b${channel}\\b`))
    }

    assert.match(features, /GATEWAY_CHANNELS/)
    assert.doesNotMatch(allCopy, /weixin_?miniapp/)
    assert.match(about, /三条网关通道/)
  })

  it('documents the MCP harnesses and external MCP management', () => {
    for (const harness of MCP_HARNESSES) {
      assert.match(about, new RegExp(harness))
    }

    assert.doesNotMatch(allCopy, /codex 与 claude 任务自动接入/)
    assert.match(about, /8 个只读/)
    assert.match(about, /外部 MCP/)
  })

  it('describes A2A roles and Agent/Skill authorization', () => {
    for (const role of A2A_ROLES) {
      assert.match(about, new RegExp(role))
    }

    assert.match(features, /A2A_ROLES/)
    assert.doesNotMatch(
      allCopy,
      new RegExp(['访问凭据', '可限定', '允许访问的', '项目'].join('\\s*')),
    )
    assert.match(about, /按 Agent 与 Skill 授权/)
  })

  it('distinguishes desktop platforms from the Linux Core package', () => {
    assert.deepEqual(DESKTOP_PLATFORMS, ['macOS', 'Windows'])
    assert.deepEqual(CORE_PLATFORMS, ['Linux Core'])
    assert.match(heroMeta, /DESKTOP_PLATFORMS/)
    assert.match(heroMeta, /CORE_PLATFORMS/)
    assert.match(heroMeta, /运行包/)
    assert.match(downloads, /Linux Core 运行包/)

    for (const source of [index, about, downloads]) {
      assert.doesNotMatch(source, /macOS 版\s*桌面端/)
      assert.doesNotMatch(source, /⌘1[–-]7/)
    }
    assert.match(about, /Ctrl\+1–9/)
  })

  it('keeps the capabilities anchor wired on both sides', () => {
    assert.match(features, /id="capabilities"/)
    assert.match(config, /\/#capabilities/)
    assert.match(footer, /\/#capabilities/)
  })

  it('keeps the carousel count and screenshot copy in sync', () => {
    const slides = carousel.match(/src: '\/assets\/functions\//g) ?? []
    assert.equal(slides.length, 8)
    assert.match(about, /八张真实截图/)
  })
})
