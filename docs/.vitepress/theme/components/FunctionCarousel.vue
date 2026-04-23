<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type Slide = {
  src: string
  alt: string
}

const slides: Slide[] = [
  { src: '/assets/functions/1-provider.png', alt: 'Provider 管理界面' },
  { src: '/assets/functions/2-workflow.png', alt: '工作流列表界面' },
  { src: '/assets/functions/3-skills.png', alt: '技能列表界面' },
  { src: '/assets/functions/4-workflow-tasks.png', alt: '工作流任务执行界面' },
  { src: '/assets/functions/5-teminal.png', alt: '终端执行界面' },
  { src: '/assets/functions/6-history.png', alt: '历史记录界面' },
  { src: '/assets/functions/7-conversation.png', alt: '会话界面' },
  { src: '/assets/functions/8-gateway.png', alt: 'Gateway 配置界面' },
  { src: '/assets/functions/9-schedule.png', alt: '定时任务界面' },
]

const SWIPE_THRESHOLD_RATIO = 0.14
const AUTOPLAY_DELAY = 2800

const currentIndex = ref(0)
const frameRef = ref<HTMLDivElement | null>(null)
const dragOffset = ref(0)
const isDragging = ref(false)
const hasEnded = ref(false)

let dragStartX = 0
let activePointerId: number | null = null
let autoplayTimer: ReturnType<typeof window.setTimeout> | null = null

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

  autoplayTimer = window.setTimeout(() => {
    advance('auto')
  }, AUTOPLAY_DELAY)
}

function prev() {
  hasEnded.value = false

  if (currentIndex.value === 0) {
    currentIndex.value = slides.length - 1
  } else {
    currentIndex.value -= 1
  }

  scheduleAutoplay()
}

function advance(mode: 'auto' | 'manual' = 'manual') {
  if (currentIndex.value >= slides.length - 1) {
    hasEnded.value = true
    clearAutoplay()
    return
  }

  hasEnded.value = false
  currentIndex.value += 1

  if (mode === 'auto') {
    scheduleAutoplay()
  } else {
    scheduleAutoplay()
  }
}

function restart() {
  hasEnded.value = false
  currentIndex.value = 0
  dragOffset.value = 0
  scheduleAutoplay()
}

function onPointerDown(event: PointerEvent) {
  if (!frameRef.value) return

  clearAutoplay()
  activePointerId = event.pointerId
  dragStartX = event.clientX
  dragOffset.value = 0
  isDragging.value = true
  frameRef.value.setPointerCapture(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!isDragging.value || event.pointerId !== activePointerId) return

  dragOffset.value = event.clientX - dragStartX
}

function onPointerEnd(event: PointerEvent) {
  if (!isDragging.value || event.pointerId !== activePointerId) return

  const frameWidth = frameRef.value?.clientWidth ?? 1
  const threshold = frameWidth * SWIPE_THRESHOLD_RATIO
  const offset = dragOffset.value

  isDragging.value = false
  dragOffset.value = 0
  activePointerId = null

  if (Math.abs(offset) < threshold) {
    scheduleAutoplay()
    return
  }

  if (offset > 0) {
    prev()
    return
  }

  advance()
}

onMounted(() => {
  scheduleAutoplay()
})

onBeforeUnmount(() => {
  clearAutoplay()
})
</script>

<template>
  <div
    class="function-carousel"
    tabindex="0"
    aria-label="功能截图轮播"
    @keydown.left.prevent="prev"
    @keydown.right.prevent="advance()"
  >
    <button
      class="function-carousel-arrow function-carousel-arrow-prev"
      type="button"
      aria-label="上一张"
      @click="prev"
    >
      <span aria-hidden="true">‹</span>
    </button>

    <div
      ref="frameRef"
      class="function-carousel-frame"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerEnd"
      @pointercancel="onPointerEnd"
    >
      <div class="function-carousel-track" :style="trackStyle">
        <figure
          v-for="slide in slides"
          :key="slide.src"
          class="function-slide"
        >
          <img :src="slide.src" :alt="slide.alt" loading="lazy">
        </figure>
      </div>
    </div>

    <button
      class="function-carousel-arrow function-carousel-arrow-next"
      type="button"
      aria-label="下一张"
      @click="advance()"
    >
      <span aria-hidden="true">›</span>
    </button>

    <button
      v-if="hasEnded"
      class="function-carousel-replay"
      type="button"
      aria-label="重新播放"
      @click="restart"
    >
      <span aria-hidden="true">↻</span>
    </button>
  </div>
</template>

<style>
.function-carousel {
  position: relative;
  margin: 1rem auto 0;
  padding: 0 4.5rem;
}

.function-carousel:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 6px;
}

.function-carousel-frame {
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid var(--vp-c-divider);
  background:
    radial-gradient(circle at top left, rgba(125, 211, 252, 0.12), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(240, 249, 255, 0.92) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 20px 48px rgba(59, 130, 246, 0.1);
  cursor: grab;
  touch-action: pan-y;
}

.dark .function-carousel-frame {
  background:
    radial-gradient(circle at top left, rgba(56, 189, 248, 0.12), transparent 24%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, #08111f 100%);
  border-color: #334155;
  box-shadow: 0 20px 48px rgba(2, 6, 23, 0.32);
}

.function-carousel-frame:active {
  cursor: grabbing;
}

.function-carousel-track {
  display: flex;
  will-change: transform;
}

.function-slide {
  flex: 0 0 100%;
  margin: 0;
}

.function-slide img {
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

.function-carousel-arrow {
  position: absolute;
  top: 50%;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  padding: 0;
  border: 1px solid rgba(var(--brand-rgb), 0.22);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(241, 245, 249, 0.94));
  color: var(--vp-c-text-1);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
  transform: translateY(-50%);
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.dark .function-carousel-arrow {
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.92));
  color: #f8fafc;
  border-color: rgba(var(--brand-rgb), 0.4);
  box-shadow: 0 18px 40px rgba(2, 6, 23, 0.42);
}

.function-carousel-arrow:hover {
  background: rgba(var(--brand-rgb), 0.12);
  border-color: rgba(var(--brand-rgb), 0.42);
}

.dark .function-carousel-arrow:hover {
  background: rgba(var(--brand-rgb), 0.22);
  border-color: rgba(var(--brand-rgb), 0.55);
}

.function-carousel-arrow:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.function-carousel-arrow span {
  font-size: 2rem;
  line-height: 1;
  transform: translateY(-1px);
}

.function-carousel-arrow-prev {
  left: 0.5rem;
}

.function-carousel-arrow-next {
  right: 0.5rem;
}

.function-carousel-replay {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  min-width: 132px;
  height: 56px;
  padding: 0 1rem;
  border: 1px solid rgba(var(--brand-rgb), 0.28);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(241, 245, 249, 0.92));
  backdrop-filter: blur(16px);
  color: var(--vp-c-text-1);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.16);
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.dark .function-carousel-replay {
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.84));
  color: #f8fafc;
  border-color: rgba(var(--brand-rgb), 0.46);
  box-shadow: 0 18px 40px rgba(2, 6, 23, 0.42);
}

.function-carousel-replay:hover {
  transform: translate(-50%, -50%);
  background: rgba(var(--brand-rgb), 0.12);
  border-color: rgba(var(--brand-rgb), 0.44);
}

.dark .function-carousel-replay:hover {
  background: rgba(var(--brand-rgb), 0.22);
  border-color: rgba(var(--brand-rgb), 0.58);
}

.function-carousel-replay:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.function-carousel-replay span {
  font-size: 1.5rem;
  line-height: 1;
}

.function-carousel-replay::after {
  content: '重新播放';
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1;
}

@media (max-width: 640px) {
  .function-carousel {
    padding: 0 3.25rem;
  }

  .function-carousel-frame {
    border-radius: 14px;
  }

  .function-carousel-arrow {
    width: 42px;
    height: 42px;
  }

  .function-carousel-arrow span {
    font-size: 1.6rem;
  }

  .function-carousel-replay {
    min-width: 112px;
    height: 48px;
    padding: 0 0.9rem;
  }
}
</style>
