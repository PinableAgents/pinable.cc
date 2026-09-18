<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Screenshot carousel. Plays through once, then offers a replay button rather
 * than looping forever — a looping carousel fights the reader who is trying to
 * study a screenshot.
 *
 * Drag, keyboard and autoplay behave as before; styling is now on tokens and
 * scoped (it used to be a global stylesheet rule).
 */

const slides = [
  { src: '/assets/functions/1-provider.png', alt: 'Provider 与执行引擎配置界面' },
  { src: '/assets/functions/2-workflow.png', alt: '工作流列表界面' },
  { src: '/assets/functions/4-workflow-tasks.png', alt: '工作流任务执行界面' },
  { src: '/assets/functions/5-teminal.png', alt: '终端执行界面' },
  { src: '/assets/functions/6-history.png', alt: '历史记录界面' },
]

const SWIPE_THRESHOLD_RATIO = 0.14
const AUTOPLAY_DELAY = 2800

const currentIndex = ref(0)
const frameRef = ref(null)
const dragOffset = ref(0)
const isDragging = ref(false)
const hasEnded = ref(false)

let dragStartX = 0
let activePointerId = null
let autoplayTimer = null

const trackStyle = computed(() => ({
  transform: `translate3d(calc(-${currentIndex.value * 100}% + ${dragOffset.value}px), 0, 0)`,
  transition: isDragging.value ? 'none' : 'transform 460ms cubic-bezier(0.22, 1, 0.36, 1)',
}))

function clearAutoplay() {
  if (autoplayTimer === null) return
  window.clearTimeout(autoplayTimer)
  autoplayTimer = null
}

function scheduleAutoplay() {
  clearAutoplay()
  if (hasEnded.value || isDragging.value) return
  autoplayTimer = window.setTimeout(() => advance(), AUTOPLAY_DELAY)
}

function prev() {
  hasEnded.value = false
  currentIndex.value = currentIndex.value === 0 ? slides.length - 1 : currentIndex.value - 1
  scheduleAutoplay()
}

function advance() {
  if (currentIndex.value >= slides.length - 1) {
    hasEnded.value = true
    clearAutoplay()
    return
  }

  hasEnded.value = false
  currentIndex.value += 1
  scheduleAutoplay()
}

function restart() {
  hasEnded.value = false
  currentIndex.value = 0
  dragOffset.value = 0
  scheduleAutoplay()
}

function onPointerDown(event) {
  if (!frameRef.value) return

  clearAutoplay()
  activePointerId = event.pointerId
  dragStartX = event.clientX
  dragOffset.value = 0
  isDragging.value = true
  frameRef.value.setPointerCapture(event.pointerId)
}

function onPointerMove(event) {
  if (!isDragging.value || event.pointerId !== activePointerId) return
  dragOffset.value = event.clientX - dragStartX
}

function onPointerEnd(event) {
  if (!isDragging.value || event.pointerId !== activePointerId) return

  const frameWidth = frameRef.value?.clientWidth ?? 1
  const offset = dragOffset.value

  isDragging.value = false
  dragOffset.value = 0
  activePointerId = null

  if (Math.abs(offset) < frameWidth * SWIPE_THRESHOLD_RATIO) {
    scheduleAutoplay()
    return
  }

  if (offset > 0) {
    prev()
    return
  }

  advance()
}

onMounted(scheduleAutoplay)
onBeforeUnmount(clearAutoplay)
</script>

<template>
  <div
    class="function-carousel"
    tabindex="0"
    aria-label="功能截图轮播"
    @keydown.left.prevent="prev"
    @keydown.right.prevent="advance"
  >
    <button
      class="carousel-arrow carousel-arrow-prev"
      type="button"
      aria-label="上一张"
      @click="prev"
    >
      <span aria-hidden="true">‹</span>
    </button>

    <div
      ref="frameRef"
      class="carousel-frame"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerEnd"
      @pointercancel="onPointerEnd"
    >
      <div class="carousel-track" :style="trackStyle">
        <figure v-for="slide in slides" :key="slide.src" class="carousel-slide">
          <img :src="slide.src" :alt="slide.alt" loading="lazy">
        </figure>
      </div>
    </div>

    <button
      class="carousel-arrow carousel-arrow-next"
      type="button"
      aria-label="下一张"
      @click="advance"
    >
      <span aria-hidden="true">›</span>
    </button>

    <button
      v-if="hasEnded"
      class="carousel-replay"
      type="button"
      aria-label="重新播放"
      @click="restart"
    >
      <span aria-hidden="true">↻</span>
      <span class="carousel-replay-text">重新播放</span>
    </button>

    <p class="carousel-count">
      <span>{{ String(currentIndex + 1).padStart(2, '0') }}</span>
      <span class="carousel-count-sep" aria-hidden="true">/</span>
      <span>{{ String(slides.length).padStart(2, '0') }}</span>
    </p>
  </div>
</template>

<style scoped>
.function-carousel {
  position: relative;
  margin: 0 auto;
  padding: 0 4.5rem 3rem;
}

.function-carousel:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 6px;
}

.carousel-frame {
  overflow: hidden;
  border: 1px solid var(--vp-c-border);
  border-radius: var(--pa-radius-lg);
  background: var(--vp-c-bg-elv);
  cursor: grab;
  touch-action: pan-y;
}

.carousel-frame:active {
  cursor: grabbing;
}

.carousel-track {
  display: flex;
  will-change: transform;
}

.carousel-slide {
  flex: 0 0 100%;
  margin: 0;
}

.carousel-slide img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 2048 / 1600;
  object-fit: cover;
  background: var(--vp-c-bg-soft);
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}

/* ---- Controls ---- */
.carousel-arrow {
  position: absolute;
  top: calc(50% - 1.5rem);
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid var(--vp-c-border);
  border-radius: var(--pa-radius);
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  transform: translateY(-50%);
  cursor: pointer;
  transition: background-color var(--pa-transition), border-color var(--pa-transition);
}

.carousel-arrow:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-text-3);
}

.carousel-arrow:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.carousel-arrow span {
  font-size: 1.5rem;
  line-height: 1;
  transform: translateY(-1px);
}

.carousel-arrow-prev {
  left: 0.75rem;
}

.carousel-arrow-next {
  right: 0.75rem;
}

.carousel-replay {
  position: absolute;
  top: calc(50% - 1.5rem);
  left: 50%;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border: 1px solid var(--vp-c-border);
  border-radius: var(--pa-radius);
  background: var(--vp-c-bg-elv);
  backdrop-filter: blur(16px);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: background-color var(--pa-transition), border-color var(--pa-transition);
}

.carousel-replay:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-text-3);
}

.carousel-replay:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.carousel-replay span[aria-hidden] {
  font-size: 1.125rem;
  line-height: 1;
}

.carousel-replay-text {
  font-size: 0.875rem;
  font-weight: 500;
}

/* ---- Counter ---- */
.carousel-count {
  position: absolute;
  bottom: 0;
  left: 50%;
  margin: 0;
  transform: translateX(-50%);
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.carousel-count-sep {
  margin: 0 4px;
  color: var(--vp-c-border);
}

@media (max-width: 640px) {
  .function-carousel {
    padding: 0 0 2.5rem;
  }

  .carousel-arrow {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .carousel-track {
    transition: none !important;
  }
}
</style>
