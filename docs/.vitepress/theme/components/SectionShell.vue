<script setup>
/**
 * Numbered section shell — Finch-style split layout.
 * When a #panel slot is provided the section becomes a two-column grid:
 * content left, panel right (alternated by CSS nth-child).
 */
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  lead: { type: String, default: '' },
  panelLabel: { type: String, default: '' },
})
</script>

<template>
  <section class="landing-section" :class="{ 'landing-section--split': $slots.panel }">
    <div class="landing-section-content">
      <span v-if="eyebrow" class="landing-eyebrow">{{ eyebrow }}</span>
      <h2 v-if="title" class="landing-title">{{ title }}</h2>
      <p v-if="lead" class="landing-lead">{{ lead }}</p>
      <slot />
    </div>

    <div v-if="$slots.panel" class="landing-panel">
      <div v-if="panelLabel" class="landing-panel-bar">
        <span>{{ panelLabel }}</span>
      </div>
      <div class="landing-panel-body">
        <slot name="panel" />
      </div>
    </div>
  </section>
</template>
