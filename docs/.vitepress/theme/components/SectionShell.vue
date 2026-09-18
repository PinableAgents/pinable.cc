<script setup>
/**
 * Numbered section shell, the repeated unit of the marketing pages:
 * mono eyebrow → headline → one-sentence lead → body → optional wide panel.
 *
 * Deliberately thin. It reuses the .landing-* vocabulary from landing.css so
 * section styling lives in one place, and page copy stays in markdown where it
 * can be edited without touching a component.
 *
 * Usage from markdown:
 *   <SectionShell eyebrow="01 · Runtime" title="…" lead="…" panel-label="…">
 *     …body…
 *     <template #panel>…</template>
 *   </SectionShell>
 */
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  lead: { type: String, default: '' },
  panelLabel: { type: String, default: '' },
})
</script>

<template>
  <section class="landing-section">
    <span v-if="eyebrow" class="landing-eyebrow">{{ eyebrow }}</span>
    <h2 v-if="title" class="landing-title">{{ title }}</h2>
    <p v-if="lead" class="landing-lead">{{ lead }}</p>

    <slot />

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
