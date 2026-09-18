<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

/**
 * Floating section rail for long pages — a click target per section, with the
 * one you are reading marked and labelled.
 *
 * The sections are discovered from the DOM rather than declared, so adding,
 * removing or reordering sections in markdown needs no change here. Two
 * consequences of that choice:
 *
 *   - Nothing renders during SSR. `ready` only flips on the client, so the
 *     server markup and the first client frame agree (both empty) and there is
 *     no hydration mismatch to guard against.
 *   - `SectionRail` is mounted in the Layout's `layout-bottom` slot, which
 *     survives client-side navigation between pages, so the discovery has to
 *     re-run on every route change. It does, after `nextTick`, once the new
 *     page's content is in the DOM.
 *
 * Hidden below three sections (so /contact, which has one, gets no rail) and
 * below 1280px, where a right-edge rail has nowhere to sit that isn't on top of
 * the content.
 */

const SECTION_SELECTOR = '.landing-section, .features-section'
const MIN_SECTIONS = 3

/** Where the "currently reading" line sits, measured from the viewport top. */
const READ_LINE = 140

const route = useRoute()

const ready = ref(false)
const items = ref([])
const activeIndex = ref(0)

let frame = null

/** The eyebrow is already a short section index — prefer it to the title. */
function eyebrowOf(section) {
  return section.querySelector('.landing-eyebrow')?.textContent?.trim() ?? ''
}

function labelFor(section, index) {
  const eyebrow = eyebrowOf(section)
  if (eyebrow) return eyebrow

  const title = section.querySelector('h2')?.textContent?.trim()
  if (title) return title.length > 20 ? `${title.slice(0, 20)}…` : title

  return `第 ${index + 1} 节`
}

/**
 * "01 · Runtime" → "runtime". Dropping the index prefix and any non-Latin
 * characters keeps the anchor readable in a copied URL, and stable as long as
 * the eyebrow is — an all-Chinese eyebrow slugs to nothing and falls through to
 * a positional id.
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/^\s*\d+\s*·\s*/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** A hand-written id in the markdown always wins; otherwise derive one. */
function idFor(section, index, used) {
  if (section.id) {
    used.add(section.id)
    return section.id
  }

  const base = slugify(eyebrowOf(section)) || `section-${index + 1}`
  let id = base
  let suffix = 2
  while (used.has(id)) id = `${base}-${suffix++}`
  used.add(id)
  section.id = id
  return id
}

function measure() {
  frame = null

  const sections = document.querySelectorAll(SECTION_SELECTOR)
  // The active section is the last one whose top has crossed the read line.
  // An "is it intersecting" test would flicker between two entries while a
  // tall section still fills the viewport; this cannot.
  let next = 0
  sections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= READ_LINE) next = index
  })
  activeIndex.value = next
}

function scheduleMeasure() {
  if (frame !== null) return
  frame = window.requestAnimationFrame(measure)
}

function discover() {
  const sections = Array.from(document.querySelectorAll(SECTION_SELECTOR))
  if (sections.length < MIN_SECTIONS) {
    ready.value = false
    items.value = []
    return
  }

  const used = new Set()
  items.value = sections.map((section, index) => ({
    id: idFor(section, index, used),
    label: labelFor(section, index),
  }))
  activeIndex.value = 0
  ready.value = true
  measure()
}

function go(event, item) {
  // The href stays real so the control is a link for assistive tech and for
  // middle-click. The scroll is driven here only so the reduced-motion
  // preference can be honoured — the offset itself lives in CSS via
  // `scroll-margin-top` on the sections.
  event.preventDefault()

  const target = document.getElementById(item.id)
  if (!target) return

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' })
  window.history.replaceState(null, '', `#${item.id}`)
}

onMounted(() => {
  discover()
  window.addEventListener('scroll', scheduleMeasure, { passive: true })
  window.addEventListener('resize', scheduleMeasure, { passive: true })
})

watch(
  () => route.path,
  async () => {
    ready.value = false
    await nextTick()
    discover()
  },
  { flush: 'post' },
)

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scheduleMeasure)
  window.removeEventListener('resize', scheduleMeasure)
  if (frame !== null) window.cancelAnimationFrame(frame)
})
</script>

<template>
  <nav v-if="ready" class="section-rail" aria-label="页面章节导航">
    <ul class="rail-list">
      <li v-for="(item, index) in items" :key="item.id">
        <a
          class="rail-item"
          :class="{ 'is-active': index === activeIndex }"
          :href="`#${item.id}`"
          :aria-current="index === activeIndex ? 'true' : undefined"
          @click="go($event, item)"
        >
          <span class="rail-label">{{ item.label }}</span>
          <span class="rail-bar" aria-hidden="true" />
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.section-rail {
  position: fixed;
  top: 50%;
  right: 20px;
  z-index: 20;
  transform: translateY(-50%);
}

.rail-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.rail-item {
  position: relative;
  display: block;
  padding: 7px 0 7px 32px;
  border-radius: var(--pa-radius-sm);
  /* The theme styles `a` brand-blue in its base sheet; nothing inside this
   * control should pick that up, so both states are set here. */
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.rail-item:hover {
  color: var(--vp-c-text-1);
}

.rail-bar {
  display: block;
  width: 16px;
  height: 2px;
  margin-left: auto;
  border-radius: 2px;
  background: var(--vp-c-text-3);
  transition: width var(--pa-transition), background-color var(--pa-transition);
}

.rail-item:hover .rail-bar,
.rail-item:focus-visible .rail-bar,
.rail-item.is-active .rail-bar {
  background: var(--vp-c-text-1);
}

.rail-item.is-active .rail-bar {
  width: 26px;
}

.rail-item:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 4px;
}

/* On screen the label is a chip rather than bare text: above ~1280px the gap
 * between the content measure and the viewport edge is narrower than a label,
 * so it overlaps — a solid surface keeps it legible when it does. */
.rail-label {
  position: absolute;
  top: 50%;
  right: 30px;
  padding: 3px 8px;
  border: 1px solid var(--vp-c-border);
  border-radius: var(--pa-radius-sm);
  background: var(--vp-c-bg-elv);
  box-shadow: var(--pa-shadow);
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  line-height: 1.5;
  letter-spacing: 0.06em;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-50%);
  transition: opacity var(--pa-transition);
}

.rail-item:hover .rail-label,
.rail-item:focus-visible .rail-label,
.rail-item.is-active .rail-label {
  opacity: 1;
}

@media (max-width: 1279px) {
  .section-rail {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rail-bar,
  .rail-label {
    transition: none;
  }
}
</style>
