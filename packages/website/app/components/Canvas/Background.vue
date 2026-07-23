<template>
  <canvas
    ref="canvasRef"
    class="absolute inset-0 w-full h-full pointer-events-none"
  />
</template>

<script setup lang="ts">
import { CONFIG } from './types'
import type { Particle, Node } from './types'

const props = defineProps<{
  nodes: Node[]
  mouseX: number
  mouseY: number
}>()

const canvasRef = ref<HTMLCanvasElement>()
const ctx = ref<CanvasRenderingContext2D | null>(null)

let particles: Particle[] = []

// Grid dimensions for line drawing
let cols = 0
let rows = 0

// Animation state
let animationId: number
let frameCount = 0
let fpsTime = 0

const whiteBucketColors = Array.from(
  { length: 21 },
  (_, i) => `rgba(255, 255, 255, ${i / 20})`
)
const lineBuckets: [Particle, Particle][][] = Array.from(
  { length: 21 },
  () => []
)
const dotBuckets: Particle[][] = Array.from({ length: 21 }, () => [])

const whiteHighlightBuckets: [Particle, Particle][][] = Array.from(
  { length: 21 },
  () => []
)

// The parent was using fps for stats. I should probably expose it or emit it.
const emit = defineEmits<{
  (e: 'update:fps', value: number): void
  (e: 'update:particleCount', value: number): void
}>()

function initParticles() {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  particles = []
  cols = Math.ceil(canvas.width / CONFIG.gridSpacing) + 2
  rows = Math.ceil(canvas.height / CONFIG.gridSpacing) + 2

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = (i - 1) * CONFIG.gridSpacing
      const y = (j - 1) * CONFIG.gridSpacing
      particles.push({
        homeX: x,
        homeY: y,
        x,
        y,
        vx: 0,
        vy: 0,
        size: CONFIG.particleBaseSize,
        brightness: 1
      })
    }
  }
  emit('update:particleCount', particles.length)
}

function updateParticles() {
  const nodeBounds = props.nodes.map(n => ({
    left: n.x,
    right: n.x + n.width,
    top: n.y,
    bottom: n.y + n.height,
    centerX: n.x + n.width * 0.5,
    centerY: n.y + n.height * 0.5
  }))

  const {
    panelProximityRadiusSq: proxRadiusSq,
    panelAvoidanceMarginSq: avoidMarginSq,
    panelRepulsionStrength: repulsionStrength,
    springStrength,
    damping,
    baseBrightness,
    panelAvoidanceMargin: avoidMargin,
    panelProximityRadius: proxRadius
  } = CONFIG
  const proxRange = proxRadius - avoidMargin

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    if (!p) continue
    let fX = 0,
      fY = 0,
      minDistSq = Infinity

    for (let j = 0; j < nodeBounds.length; j++) {
      const b = nodeBounds[j]
      if (!b) continue
      const cX = Math.max(b.left, Math.min(p.x, b.right))
      const cY = Math.max(b.top, Math.min(p.y, b.bottom))
      const dx = p.x - cX,
        dy = p.y - cY
      const distSq = dx * dx + dy * dy
      if (distSq < minDistSq) minDistSq = distSq

      if (
        (p.x >= b.left && p.x <= b.right && p.y >= b.top && p.y <= b.bottom)
        || distSq < avoidMarginSq
      ) {
        const tX = p.x - b.centerX,
          tY = p.y - b.centerY
        const tD = Math.sqrt(tX * tX + tY * tY) || 0.001
        fX += (tX / tD) * 0.5
        fY += (tY / tD) * 0.5
      } else if (distSq < proxRadiusSq) {
        const d = Math.sqrt(distSq)
        const force = Math.pow(1 - d / proxRadius, 2) * repulsionStrength
        fX += (dx / (d || 0.001)) * force
        fY += (dy / (d || 0.001)) * force
      }
    }

    if (minDistSq < proxRadiusSq) {
      const d = Math.sqrt(minDistSq)
      const factor = 1 - Math.max(0, (d - avoidMargin) / proxRange)
      p.brightness = baseBrightness + factor * factor * (1 - baseBrightness)
    } else {
      p.brightness = baseBrightness
    }

    p.vx = (p.vx + (p.homeX - p.x) * springStrength + fX) * damping
    p.vy = (p.vy + (p.homeY - p.y) * springStrength + fY) * damping
    p.x += p.vx
    p.y += p.vy
  }
}

function renderParticles() {
  if (!ctx.value || !canvasRef.value) return
  const context = ctx.value
  const dpr = window.devicePixelRatio || 1
  context.clearRect(0, 0, canvasRef.value.width / dpr, canvasRef.value.height / dpr)

  for (let i = 0; i < 21; i++) {
    const lb = lineBuckets[i]
    const dotb = dotBuckets[i]
    const whb = whiteHighlightBuckets[i]
    if (lb) lb.length = 0
    if (dotb) dotb.length = 0
    if (whb) whb.length = 0
  }

  const mRadius = 140
  const mRadiusSq = mRadius * mRadius

  for (let i = 0; i < cols; i++) {
    const offset = i * rows
    for (let j = 0; j < rows; j++) {
      const p = particles[offset + j]
      if (!p) continue
      const dOpacity = CONFIG.dotOpacity * p.brightness
      if (dOpacity > 0.01) {
        const bucket = dotBuckets[Math.min(20, Math.floor(dOpacity * 20))]
        if (bucket) bucket.push(p)
      }

      if (i < cols - 1) {
        const rP = particles[offset + rows + j]
        if (rP) {
          const lOpacity
            = CONFIG.lineOpacity * (p.brightness + rP.brightness) * 0.5
          if (lOpacity > 0.005) {
            // Check if line is near mouse
            const avgX = (p.x + rP.x) * 0.5
            const avgY = (p.y + rP.y) * 0.5
            const dx = avgX - props.mouseX
            const dy = avgY - props.mouseY
            const distSq = dx * dx + dy * dy

            if (distSq < mRadiusSq) {
              const mFactor = 1 - Math.sqrt(distSq) / mRadius
              const highlightOpacity = Math.min(1.0, lOpacity * 4 + mFactor * mFactor * 0.8)
              const bucket = whiteHighlightBuckets[Math.min(20, Math.floor(highlightOpacity * 20))]
              if (bucket) bucket.push([p, rP])
            } else {
              const bucket = lineBuckets[Math.min(20, Math.floor(lOpacity * 200))]
              if (bucket) bucket.push([p, rP])
            }
          }
        }
      }
      if (j < rows - 1) {
        const bP = particles[offset + j + 1]
        if (bP) {
          const lOpacity
            = CONFIG.lineOpacity * (p.brightness + bP.brightness) * 0.5
          if (lOpacity > 0.005) {
            // Check if line is near mouse
            const avgX = (p.x + bP.x) * 0.5
            const avgY = (p.y + bP.y) * 0.5
            const dx = avgX - props.mouseX
            const dy = avgY - props.mouseY
            const distSq = dx * dx + dy * dy

            if (distSq < mRadiusSq) {
              const mFactor = 1 - Math.sqrt(distSq) / mRadius
              const highlightOpacity = Math.min(1.0, lOpacity * 4 + mFactor * mFactor * 0.8)
              const bucket = whiteHighlightBuckets[Math.min(20, Math.floor(highlightOpacity * 20))]
              if (bucket) bucket.push([p, bP])
            } else {
              const bucket = lineBuckets[Math.min(20, Math.floor(lOpacity * 200))]
              if (bucket) bucket.push([p, bP])
            }
          }
        }
      }
    }
  }

  context.lineWidth = 0.5
  // Regular white lines
  for (let i = 1; i < 21; i++) {
    const bucket = lineBuckets[i]
    const color = whiteBucketColors[i]
    if (bucket && bucket.length > 0 && color) {
      context.beginPath()
      context.strokeStyle = color
      for (const [p1, p2] of bucket) {
        context.moveTo(p1.x, p1.y)
        context.lineTo(p2.x, p2.y)
      }
      context.stroke()
    }
  }

  // White highlight lines near mouse
  for (let i = 1; i < 21; i++) {
    const bucket = whiteHighlightBuckets[i]
    const color = whiteBucketColors[i]
    if (bucket && bucket.length > 0 && color) {
      context.beginPath()
      context.strokeStyle = color
      for (const [p1, p2] of bucket) {
        context.moveTo(p1.x, p1.y)
        context.lineTo(p2.x, p2.y)
      }
      context.stroke()
    }
  }

  for (let i = 1; i < 21; i++) {
    const bucket = dotBuckets[i]
    const color = whiteBucketColors[i]
    if (bucket && bucket.length > 0 && color) {
      context.beginPath()
      context.fillStyle = color
      for (const p of bucket) {
        context.moveTo(p.x + p.size, p.y)
        context.arc(p.x, p.y, p.size, 0, 6.283185)
      }
      context.fill()
    }
  }
}

function animate(t: number) {
  frameCount++
  if (t - fpsTime >= 1000) {
    emit('update:fps', frameCount)
    frameCount = 0
    fpsTime = t
  }
  updateParticles()
  renderParticles()
  animationId = requestAnimationFrame(animate)
}

function resizeCanvas() {
  if (!canvasRef.value) return
  // We need to get the parent container size.
  // Since the canvas is absolute full width/height of relative parent, we can just use offsetWidth/Height if available?
  // Or rely on window for now as per original code (mostly).
  // The original code used containerRef.value.getBoundingClientRect().
  // Here, we can look at the parent element of the canvas.
  const parent = canvasRef.value.parentElement
  if (!parent) return
  const rect = parent.getBoundingClientRect()

  const dpr = window.devicePixelRatio || 1
  canvasRef.value.width = rect.width * dpr
  canvasRef.value.height = rect.height * dpr
  canvasRef.value.style.width = `${rect.width}px`
  canvasRef.value.style.height = `${rect.height}px`
  ctx.value?.scale(dpr, dpr)
  initParticles()
}

onMounted(() => {
  if (!canvasRef.value) return
  ctx.value = canvasRef.value.getContext('2d')
  resizeCanvas()
  animationId = requestAnimationFrame(animate)
  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resizeCanvas)
})
</script>
