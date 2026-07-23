<script setup lang="ts">
import { useWindowSize, useRafFn, useWindowScroll } from '@vueuse/core'

const canvasRef = ref<HTMLCanvasElement>()
const containerRef = ref<HTMLElement>()
const { width: windowWidth, height: windowHeight } = useWindowSize()
const { y: scrollY } = useWindowScroll()

// Configuration
const CONFIG = {
  gridSpacing: 12,
  hoverRadius: 450,
  lerpFactor: 0.12,
  speed: 0.0025,
  waveAmplitude: 40,
  waveFrequency: 0.002,
  pixelSize: 1.1
}

let ctx: CanvasRenderingContext2D | null = null
let primaryColor = '#000000'

function updateColors() {
  const isDark = document.documentElement.classList.contains('dark')
  primaryColor = isDark ? '#ffffff' : '#000000'
}

function init() {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1

  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx = canvas.getContext('2d')
  if (ctx) ctx.scale(dpr, dpr)
}

function render(timestamp: number) {
  if (!ctx || !canvasRef.value) return
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()

  // Start shifted to the right, and oscillate slowly based on scroll position
  const scrollEffect = Math.sin(scrollY.value * 0.001) * (rect.width * 0.2)
  const centerX = (rect.width * 0.55) + scrollEffect // Shifted slightly more left to balance the radius
  const centerY = rect.height / 1.8 // Moved further to the bottom

  ctx.clearRect(0, 0, rect.width, rect.height)
  ctx.fillStyle = primaryColor

  // Draw pixel grid
  for (let x = 0; x <= rect.width; x += CONFIG.gridSpacing) {
    for (let y = 0; y <= rect.height; y += CONFIG.gridSpacing) {
      // Create an elliptical glow that is wider horizontally (especially to the left)
      const dx = (x - centerX)
      const dy = (y - centerY)
      const dist = Math.sqrt((dx / 1.2) ** 2 + dy ** 2)
      let factor = 0

      if (dist < CONFIG.hoverRadius) {
        factor = Math.pow(1 - (dist / CONFIG.hoverRadius), 2)
      }

      // Add a subtle organic flicker
      const flicker = Math.sin(timestamp * 0.001 + (x * 0.02) + (y * 0.02)) * 0.02
      const dotAlpha = Math.max(0, 0.1 + (factor * 0.45) + flicker)
      const dotSize = CONFIG.pixelSize + (factor * 0.8)

      ctx.globalAlpha = dotAlpha
      ctx.fillRect(x - dotSize / 2, y - dotSize / 2, dotSize, dotSize)
    }
  }
}

useRafFn(({ timestamp }) => {
  render(timestamp)
})

onMounted(() => {
  updateColors()
  init()
})

const colorMode = useColorMode()
watch(() => colorMode.value, () => {
  nextTick(() => {
    updateColors()
  })
})

watch([windowWidth, windowHeight], () => {
  nextTick(() => init())
})
</script>

<template>
  <div
    ref="containerRef"
    class="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
  >
    <canvas
      ref="canvasRef"
      class="w-full h-full opacity-100 dark:opacity-40"
    />
  </div>
</template>
