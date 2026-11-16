<script setup>
import { computed, onMounted, ref } from 'vue'
import { loadReleaseFeed, resolveDownloads } from '../lib/releases.js'
import { verifyChecksum } from '../lib/checksum.js'

/**
 * Offline SHA-256 verifier for /downloads. The user pastes a digest or a whole
 * checksum command line and gets an immediate match/mismatch against the same
 * manifest ReleaseInfo and InstallGuide already consume.
 *
 * The feed is read in onMounted only, so SSR renders nothing and a failed
 * request removes the block instead of leaving an unusable form behind.
 */

const feed = ref(null)
const input = ref('')

const entries = computed(() => resolveDownloads(feed.value).filter((entry) => entry.sha256))
const result = computed(() => verifyChecksum(input.value, entries.value))

const matchedName = computed(() => result.value.entry?.assetName || result.value.digest)

const statusText = computed(() => {
  switch (result.value.state) {
    case 'invalid':
      return '没有找到 64 位 SHA-256 摘要，请粘贴完整校验值或整行命令输出。'
    case 'match':
      return `校验通过，与 ${matchedName.value} 的发布校验值一致。`
    case 'mismatch':
      return '校验失败，与当前发布清单中的任何文件都不一致。'
    default:
      return '粘贴 SHA-256 或校验命令输出，自动与发布清单比对。'
  }
})

onMounted(async () => {
  feed.value = await loadReleaseFeed()
})
</script>

<template>
  <div v-if="entries.length" class="checksum-verifier">
    <h2 class="cv-heading">校验下载文件</h2>
    <p class="cv-lead">
      把校验值或整行命令输出粘贴到下面，即可在本地与当前发布清单比对，不会上传任何内容。
    </p>

    <label class="cv-label" for="checksum-input">SHA-256 校验值</label>
    <textarea
      id="checksum-input"
      v-model="input"
      class="cv-input"
      rows="3"
      spellcheck="false"
      autocomplete="off"
      aria-describedby="checksum-status"
      :aria-invalid="result.state === 'invalid' ? 'true' : undefined"
      placeholder="粘贴 SHA-256，或 shasum / Get-FileHash / sha256sum 的整行输出"
    ></textarea>

    <p
      id="checksum-status"
      class="cv-status"
      :class="`cv-status--${result.state}`"
      role="status"
      aria-live="polite"
    >
      {{ statusText }}
    </p>
  </div>
</template>

<style scoped>
.checksum-verifier {
  max-width: 760px;
}

/* The .checksum-verifier prefix is load-bearing: `.vp-doc .downloads-note p`
 * is (0,2,0) and would otherwise tie with these scoped rules. */
.checksum-verifier .cv-heading {
  margin: 0 0 12px;
  font-family: var(--pa-font-display);
  font-size: clamp(1.5rem, 3vw, 2rem);
  line-height: 1.2;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.checksum-verifier .cv-lead {
  margin: 0 0 18px;
  color: var(--vp-c-text-2);
  font-size: 0.9375rem;
  line-height: 1.75;
}

.checksum-verifier .cv-label {
  display: block;
  margin-bottom: 8px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-3);
}

.checksum-verifier .cv-input {
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-height: 88px;
  padding: 10px 12px;
  resize: vertical;
  border: 1px solid var(--vp-c-border);
  border-radius: var(--pa-radius);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  font-size: 0.8125rem;
  line-height: 1.6;
  transition: border-color var(--pa-transition);
}

.checksum-verifier .cv-input:focus-visible {
  outline: 2px solid var(--vp-c-neutral);
  outline-offset: 2px;
}

.checksum-verifier .cv-input[aria-invalid='true'] {
  border-color: var(--vp-c-warning-1);
}

.checksum-verifier .cv-status {
  display: flex;
  align-items: flex-start;
  min-height: 1.6em;
  margin: 10px 0 0;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--vp-c-text-3);
}

.checksum-verifier .cv-status--match {
  color: var(--vp-c-success-1);
}

.checksum-verifier .cv-status--mismatch {
  color: var(--vp-c-danger-1);
}

.checksum-verifier .cv-status--invalid {
  color: var(--vp-c-warning-1);
}
</style>
