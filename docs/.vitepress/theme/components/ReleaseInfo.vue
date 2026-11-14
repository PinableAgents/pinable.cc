<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  formatReleaseDate,
  loadReleaseFeed,
  parseNotes,
  resolveDownloads,
} from '../lib/releases.js'

/**
 * Release details for /downloads: version, publish date, the manifest's own
 * upgrade notes, and the full SHA-256 of every available asset.
 *
 * Like HeroDownloads it reads the feed in onMounted only, so SSR renders
 * nothing and a failed request simply leaves the surrounding static copy in
 * place. Untrusted feed text is interpolated, never passed to v-html.
 */

const feed = ref(null)

const version = computed(() => feed.value?.version ?? '')
const releaseDate = computed(() => formatReleaseDate(feed.value))
const checksums = computed(() => resolveDownloads(feed.value).filter((entry) => entry.sha256))

/** Group the flat note list into paragraph/list blocks, preserving order. */
const noteBlocks = computed(() => {
  const blocks = []
  for (const item of parseNotes(feed.value?.notes ?? '')) {
    const last = blocks[blocks.length - 1]
    if (item.type === 'li' && last?.type === 'ul') last.items.push(item.text)
    else if (item.type === 'li') blocks.push({ type: 'ul', items: [item.text] })
    else blocks.push({ type: 'p', text: item.text })
  }
  return blocks
})

const hasInfo = computed(() =>
  Boolean(version.value || releaseDate.value || noteBlocks.value.length || checksums.value.length),
)

const copied = ref({ key: null, ok: false })
let copiedTimer = null

const keyFor = (entry) => entry.key || entry.asset || entry.label

function copyLabel(entry) {
  if (copied.value.key !== keyFor(entry)) return '复制'
  return copied.value.ok ? '已复制' : '复制失败'
}

async function copySha(entry) {
  try {
    await navigator.clipboard.writeText(entry.sha256)
    copied.value = { key: keyFor(entry), ok: true }
  } catch {
    // Insecure context or a denied clipboard — report it, never throw.
    copied.value = { key: keyFor(entry), ok: false }
  }

  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => {
    copied.value = { key: null, ok: false }
  }, 1500)
}

onMounted(async () => {
  feed.value = await loadReleaseFeed()
})

onUnmounted(() => clearTimeout(copiedTimer))
</script>

<template>
  <div v-if="hasInfo" class="release-info">
    <p class="ri-title">版本与校验值</p>
    <p class="ri-meta">
      <span class="ri-version">{{ version }}</span>
      <template v-if="releaseDate">
        <span class="ri-sep" aria-hidden="true">·</span>
        <span>{{ releaseDate }}</span>
      </template>
    </p>

    <div v-if="noteBlocks.length" class="ri-notes">
      <template v-for="(block, index) in noteBlocks" :key="index">
        <ul v-if="block.type === 'ul'">
          <li v-for="(item, itemIndex) in block.items" :key="itemIndex">{{ item }}</li>
        </ul>
        <p v-else>{{ block.text }}</p>
      </template>
    </div>

    <div v-if="checksums.length" class="ri-checksums">
      <p class="ri-subtitle">文件 SHA-256</p>
      <div v-for="entry in checksums" :key="keyFor(entry)" class="ri-row">
        <span class="ri-file">{{ entry.assetName }}</span>
        <code class="ri-sha">{{ entry.sha256 }}</code>
        <button
          type="button"
          class="ri-copy"
          :aria-label="`复制 ${entry.assetName} 的 SHA-256`"
          @click="copySha(entry)"
        >
          {{ copyLabel(entry) }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.release-info {
  margin-top: 18px;
}

/* The .release-info prefix is load-bearing: `.vp-doc .downloads-note p` is
 * (0,2,0) and would otherwise tie with these scoped rules. */
.release-info .ri-title {
  margin: 0 0 8px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-3);
}

.release-info .ri-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
}

.ri-version {
  color: var(--vp-c-text-1);
}

.ri-sep {
  color: var(--vp-c-text-3);
}

.ri-notes {
  margin-top: 16px;
  padding: 12px 14px;
  border: 1px solid var(--vp-c-border);
  border-left: 2px solid var(--vp-c-text-3);
  border-radius: var(--pa-radius);
  background: var(--vp-c-bg-soft);
}

.ri-notes p {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  line-height: 1.7;
}

.ri-notes ul {
  margin: 8px 0 0;
  padding-left: 1.15rem;
  list-style: disc;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  line-height: 1.7;
}

.ri-notes li + li {
  margin-top: 4px;
}

.ri-checksums {
  margin-top: 20px;
}

.ri-subtitle {
  margin: 0 0 6px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-3);
}

.ri-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 2px 12px;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid var(--vp-c-border);
}

.ri-file {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8125rem;
  color: var(--vp-c-text-1);
  word-break: break-all;
}

/* `.vp-doc :not(pre) > code` is (0,2,1) and would add a chip background. */
.release-info .ri-sha {
  grid-column: 1;
  padding: 0;
  border-radius: 0;
  background: transparent;
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  line-height: 1.5;
  color: var(--vp-c-text-3);
  word-break: break-all;
}

.ri-copy {
  grid-column: 2;
  grid-row: 1 / span 2;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid var(--vp-c-border);
  border-radius: var(--pa-radius);
  background: transparent;
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 0.75rem;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color var(--pa-transition), border-color var(--pa-transition);
}

.ri-copy:hover {
  background: var(--vp-c-bg-elv);
  border-color: var(--vp-c-text-3);
}

.ri-copy:focus-visible {
  outline: 2px solid var(--vp-c-neutral);
  outline-offset: 2px;
}
</style>
