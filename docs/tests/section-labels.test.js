import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'

const HAN = /[\u4e00-\u9fff]/
const LATIN = /[A-Za-z]/

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

function openingTags(html, tag) {
  return html.match(new RegExp(`<${tag}\\b[^>]*>`, 'g')) ?? []
}

function classOf(tag) {
  return tag.match(/\bclass="([^"]*)"/)?.[1] ?? ''
}

function attributeOf(tag, name) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] ?? ''
}

function assertChineseLabel(tags, attribute, page) {
  assert.ok(tags.length > 0, `${page}：没有找到可检查的章节`)

  for (const tag of tags) {
    const label = attributeOf(tag, attribute)
    const excerpt = tag.replace(/\s+/g, ' ').slice(0, 100)
    assert.ok(label, `${page}：章节缺少 ${attribute} —— ${excerpt}`)
    assert.match(label, HAN, `${page}：${attribute} 必须是中文 —— ${label}`)
    assert.doesNotMatch(label, LATIN, `${page}：${attribute} 不能中英混排 —— ${label}`)
  }
}

describe('section rail labels', () => {
  it('declares a Chinese rail label for every landing section on the home page', () => {
    const page = read('../index.md')
    const shells = openingTags(page, 'SectionShell')
    const native = openingTags(page, 'section').filter((tag) =>
      classOf(tag).split(/\s+/).includes('landing-section'),
    )

    assertChineseLabel(shells, 'rail-label', 'index.md')
    assertChineseLabel(native, 'data-rail-label', 'index.md')
    assert.ok(shells.length + native.length >= 6, 'index.md：章节数量少于预期')
  })

  it('declares a Chinese rail label for every landing section on the about page', () => {
    const page = read('../about.md')
    const shells = openingTags(page, 'SectionShell')
    const native = openingTags(page, 'section').filter((tag) =>
      classOf(tag).split(/\s+/).includes('landing-section'),
    )

    assertChineseLabel(shells, 'rail-label', 'about.md')
    assertChineseLabel(native, 'data-rail-label', 'about.md')
    assert.ok(shells.length + native.length >= 8, 'about.md：章节数量少于预期')
  })

  it('declares a Chinese rail label for the capabilities section', () => {
    const component = read('../.vitepress/theme/components/FeaturesSection.vue')
    const features = openingTags(component, 'section').filter((tag) =>
      classOf(tag).split(/\s+/).includes('features-section'),
    )

    assertChineseLabel(features, 'data-rail-label', 'FeaturesSection.vue')
  })
})
