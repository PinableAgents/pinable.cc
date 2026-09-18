<script setup>
/**
 * Monospace capability strip under the hero.
 *
 * Static by design — every claim here is a fact about the shipped product
 * (the four backends in pinable/backend/registry.go, the three artifact
 * families in the release manifest, and the PINABLE_HOME run root), so it
 * needs no fetch and renders identically on server and client.
 */
const backends = ['codex', 'claude', 'antigravity', 'pi']
const platforms = ['macOS', 'Windows', 'Linux']
</script>

<template>
  <div class="hero-meta">
    <div class="hm-row">
      <span class="hm-label">统一调度</span>
      <ul class="hm-backends">
        <li v-for="backend in backends" :key="backend">{{ backend }}</li>
      </ul>
    </div>
    <div class="hm-row hm-row-muted">
      <span v-for="(platform, index) in platforms" :key="platform">
        {{ platform }}
        <span v-if="index < platforms.length - 1" class="hm-sep" aria-hidden="true">·</span>
      </span>
      <span class="hm-sep" aria-hidden="true">·</span>
      <span>本地运行，数据归集于 <code>$PINABLE_HOME</code></span>
    </div>
  </div>
</template>

<style scoped>
/* This strip renders in `home-hero-after`, which the theme places *outside*
 * `.VPHero .container` — so it cannot inherit the hero's measure and has to
 * carry the same one itself, or it aligns to the full hero width instead. */
.hero-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: min(var(--pa-page-width), 100% - var(--pa-gutter));
  margin: 32px auto 0;
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  line-height: 1.6;
}

.hm-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.hm-row-muted {
  color: var(--vp-c-text-3);
}

.hm-label {
  color: var(--vp-c-text-3);
}

.hm-backends {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.hm-backends li {
  margin: 0;
  padding: 3px 8px;
  border: 1px solid var(--vp-c-border);
  border-radius: var(--pa-radius-sm);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.hm-sep {
  color: var(--vp-c-border);
}

code {
  font-family: inherit;
  color: var(--vp-c-text-2);
  background: none;
  border: none;
  padding: 0;
}

@media (max-width: 480px) {
  .hero-meta {
    font-size: 0.6875rem;
  }
}
</style>
