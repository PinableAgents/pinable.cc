<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  RELEASES_PAGE,
  loadReleaseFeed,
  pickRecommended,
  resolveDownloads,
  shortSha,
} from '../lib/releases.js'

/**
 * Reads the release manifest the pipeline publishes to /releases/latest.json
 * and turns it into per-platform download entries.
 *
 * It is written to survive VitePress's static render + hydrate: at build time
 * there is no navigator and no fetch, so the server-rendered markup is
 * deliberately the *degraded* state — a plain link to the GitHub release.
 * Everything platform-aware happens in onMounted, which means the first client
 * frame matches the server exactly and a failed request simply leaves the
 * fallback in place.
 */

const props = defineProps({ startExpanded: { type: Boolean, default: false } })
const feed = ref(null)
const expanded = ref(props.startExpanded)

/** Only offer entries the manifest actually resolves to a URL. */
const available = computed(() => resolveDownloads(feed.value))

const version = computed(() => feed.value?.version ?? '')

/**
 * Coarse platform detection. userAgentData is the modern hint; platform is the
 * legacy one. Android and iPadOS both claim to be Linux/macOS, so anything
 * ambiguous falls through to no match rather than guessing wrong.
 */
function detectPlatform() {
  const hint = `${navigator.userAgentData?.platform ?? ''} ${navigator.platform ?? ''} ${navigator.userAgent ?? ''}`

  if (/android|iphone|ipad|ipod|mobile/i.test(hint)) return null
  if (/mac/i.test(hint)) return 'mac'
  if (/win/i.test(hint)) return 'windows'
  if (/linux|x11/i.test(hint)) return 'linux'
  return null
}

const visitorPlatform = ref(null)

const recommended = computed(() => pickRecommended(available.value, visitorPlatform.value))

const primaryTarget = computed(() => recommended.value ?? null)

const primaryUrl = computed(() => primaryTarget.value?.url || RELEASES_PAGE)

const primaryLabel = computed(() =>
  primaryTarget.value ? `下载 ${primaryTarget.value.label}` : '下载 PinableAgents',
)

const primaryHint = computed(() => primaryTarget.value?.hint ?? '')

const primarySha = computed(() => shortSha(primaryTarget.value?.sha256))

const alternatives = computed(() =>
  primaryTarget.value
    ? available.value.filter((target) => target !== primaryTarget.value)
    : available.value,
)

const alternativeGroups = computed(() => {
  const groups = [
    ['macOS', 'mac'],
    ['Windows', 'windows'],
    ['Linux', 'linux'],
  ]
  return groups
    .map(([label, platform]) => ({
      label,
      items: alternatives.value.filter((target) => target.platform === platform),
    }))
    .filter((group) => group.items.length)
})

/** Template helper: entries already carry their resolved URL. */
const urlFor = (target) => target?.url ?? null

onMounted(async () => {
  visitorPlatform.value = detectPlatform()
  // Offline or a missing manifest resolves to null — the fallback stands.
  feed.value = await loadReleaseFeed()
})
</script>

<template>
  <div id="download" class="hero-downloads">
    <div class="hd-row">
      <a class="hd-primary" :href="primaryUrl" rel="noreferrer">
        <span class="hd-primary-label">{{ primaryLabel }}</span>
        <span v-if="primaryHint" class="hd-primary-hint">{{ primaryHint }}</span>
      </a>

      <button
        v-if="alternatives.length"
        type="button"
        class="hd-toggle"
        :aria-expanded="expanded"
        @click="expanded = !expanded"
      >
        其他平台
        <span aria-hidden="true" class="hd-caret">{{ expanded ? '−' : '+' }}</span>
      </button>
    </div>

    <div v-if="expanded" class="hd-list">
      <section v-for="group in alternativeGroups" :key="group.label" class="hd-group">
        <h3>{{ group.label }}</h3>
        <a v-for="target in group.items" :key="target.label" :href="urlFor(target)" rel="noreferrer">
          <span>{{ target.label.replace(`${group.label} · `, '') }}</span>
          <span class="hd-list-hint">{{ target.hint }}</span>
        </a>
      </section>
    </div>

    <p v-if="version" class="hd-note">
      <span class="hd-version">{{ version }}</span>
      <template v-if="primarySha">
        <span class="hd-sep" aria-hidden="true">·</span>
        <span>sha256 {{ primarySha }}…</span>
      </template>
    </p>
  </div>
</template>

<style scoped>
.hero-downloads {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  width: 100%;
}

.hd-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 8px;
}

.hd-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 18px;
  border: 1px solid var(--vp-c-neutral);
  border-radius: var(--pa-radius);
  background: var(--vp-c-neutral);
  color: var(--vp-c-neutral-inverse);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: background-color var(--pa-transition), border-color var(--pa-transition);
}

.hd-primary:hover {
  background: var(--vp-c-text-1);
  border-color: var(--vp-c-text-1);
}

.hd-primary-label {
  white-space: nowrap;
}

.hd-primary-hint {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  opacity: 0.6;
}

.hd-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--vp-c-border);
  border-radius: var(--pa-radius);
  background: transparent;
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--pa-transition), border-color var(--pa-transition);
}

.hd-toggle:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-text-3);
}

.hd-caret {
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
}

.hd-list {
  width: min(420px, 100%);
  margin: 4px 0 0;
  padding: 0;
  border: 1px solid var(--vp-c-border);
  border-radius: var(--pa-radius);
  overflow: hidden;
}

.hd-group + .hd-group {
  border-top: 1px solid var(--vp-c-border);
}

.hd-group h3 {
  margin: 0;
  padding: 9px 12px 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hd-group a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 0;
  padding: 9px 12px;
  background: var(--vp-c-bg-elv);
  text-align: left;
}

.hd-group a {
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  text-decoration: none;
}

/* Neutral, matching the rest of the site — the accent is reserved for focus
 * rings and in-prose links, not for hover states. */
.hd-group a:hover {
  color: var(--vp-c-text-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.hd-list-hint {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.hd-note {
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.hd-version {
  color: var(--vp-c-text-2);
}

.hd-sep {
  margin: 0 6px;
}

@media (max-width: 480px) {
  .hd-primary,
  .hd-toggle {
    width: 100%;
    justify-content: center;
  }

  .hd-list {
    width: 100%;
  }
}
</style>
