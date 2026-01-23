import { ref, reactive } from 'vue'

export interface PanZoomState {
  x: number
  y: number
}

export interface UseMapPanZoomOptions {
  minScale?: number
  maxScale?: number
  scaleStep?: number
}

export function useMapPanZoom(options: UseMapPanZoomOptions = {}) {
  const {
    minScale = 0.25,
    maxScale = 4,
    scaleStep = 0.25
  } = options

  const scale = ref(1)
  const offset = reactive<PanZoomState>({ x: 0, y: 0 })

  // Track mouse state for pan
  let isPanning = false
  let startX = 0
  let startY = 0
  let startOffsetX = 0
  let startOffsetY = 0
  let hasMoved = false
  const moveThreshold = 5 // pixels

  const zoomIn = () => {
    scale.value = Math.min(scale.value + scaleStep, maxScale)
  }

  const zoomOut = () => {
    scale.value = Math.max(scale.value - scaleStep, minScale)
  }

  const resetView = (defaultZoom = 1) => {
    scale.value = defaultZoom
    offset.x = 0
    offset.y = 0
  }

  const wasClick = () => {
    return !hasMoved
  }

  const onWheel = (event: WheelEvent) => {
    event.preventDefault()
    if (event.deltaY < 0) {
      zoomIn()
    } else {
      zoomOut()
    }
  }

  const onMouseDown = (event: MouseEvent) => {
    isPanning = true
    hasMoved = false
    startX = event.clientX
    startY = event.clientY
    startOffsetX = offset.x
    startOffsetY = offset.y

    const onMouseMove = (e: MouseEvent) => {
      if (!isPanning) return

      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      // Check if we've moved beyond threshold
      if (Math.abs(deltaX) > moveThreshold || Math.abs(deltaY) > moveThreshold) {
        hasMoved = true
      }

      offset.x = startOffsetX + deltaX
      offset.y = startOffsetY + deltaY
    }

    const onMouseUp = () => {
      isPanning = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  return {
    scale,
    offset,
    zoomIn,
    zoomOut,
    resetView,
    wasClick,
    onWheel,
    onMouseDown
  }
}
