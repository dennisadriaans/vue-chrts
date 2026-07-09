<template>
  <div
    ref="containerRef"
    class="relative w-screen h-screen bg-[#111111] overflow-hidden cursor-crosshair"
    @mousedown="handleContainerMouseDown"
    @mousemove="handleGlobalMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- Background / Particles -->
    <CanvasBackground
      :nodes="nodes"
      :mouse-x="mouseX"
      :mouse-y="mouseY"
      @update:fps="fps = $event"
      @update:particle-count="particleCount = $event"
    />

    <!-- Alignment Guides -->
    <CanvasAlignmentGuides :lines="activeAlignmentLines" />

    <!-- Shared Dividers -->
    <CanvasSharedDividers
      :dividers="sharedDividers"
      @start-resize="startSharedResize"
    />

    <!-- Draggable nodes/panels -->
    <CanvasNode
      v-for="node in nodes"
      :key="node.id"
      :node="node"
      :is-dragging="dragNode?.id === node.id"
      :used-chart-keys="usedChartKeys"
      @start-drag="startDrag"
      @start-resize="startResize"
      @remove="removeNode"
    />

    <!-- Stats & Actions -->
    <CanvasControls
      :particle-count="particleCount"
      :fps="fps"
      @auto-align="autoAlignNodes"
    />
  </div>
</template>

<script lang="ts" setup>
import { CONFIG } from './types'
import type { Node, ResizeDirection, SharedDivider, AlignmentLine } from './types'

// ============================================================
// STATE
// ============================================================

const containerRef = ref<HTMLElement>()

const nodes = ref<Node[]>([])
const particleCount = ref(0)
const fps = ref(0)
const nodeIdCounter = ref(1)

const mouseX = ref(-1000)
const mouseY = ref(-1000)

// Drag/Resize states
const isDragging = ref(false)
const dragNode = ref<Node | null>(null)
const dragOffset = ref({ x: 0, y: 0 })

const isResizing = ref(false)
const resizeNode = ref<Node | null>(null)
const resizeDirection = ref<ResizeDirection | null>(null)
const resizeStart = ref({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  nodeX: 0,
  nodeY: 0
})
const isCreating = ref(false)

const isSharedResizing = ref(false)
const activeDivider = ref<SharedDivider | null>(null)
const sharedResizeStart = ref({ x: 0, y: 0, n1Size: 0, n2Size: 0, n2Pos: 0 })

const activeAlignmentLines = ref<AlignmentLine[]>([])
const SNAP_THRESHOLD = 5

// ============================================================
// COMPUTED
// ============================================================

const usedChartKeys = computed(() => nodes.value
  .map(n => n.chartKey)
  .filter((k): k is string => !!k)
)

const sharedDividers = computed(() => {
  if (isDragging.value || isResizing.value || isSharedResizing.value) return []

  const dividers: SharedDivider[] = []
  const currentNodes = nodes.value
  const len = currentNodes.length

  for (let i = 0; i < len; i++) {
    const n1 = currentNodes[i]
    if (!n1) continue
    for (let j = i + 1; j < len; j++) {
      const n2 = currentNodes[j]
      if (!n2) continue

      // Vertical divider
      if (Math.abs(n1.x + n1.width - n2.x) < 5) {
        const yStart = Math.max(n1.y, n2.y)
        const yEnd = Math.min(n1.y + n1.height, n2.y + n2.height)
        if (yEnd > yStart + 20) {
          dividers.push({
            id: `v-${n1.id}-${n2.id}`,
            type: 'vertical',
            pos: (n1.x + n1.width + n2.x) * 0.5,
            start: yStart,
            end: yEnd,
            node1Id: n1.id,
            node2Id: n2.id
          })
        }
      } else if (Math.abs(n2.x + n2.width - n1.x) < 5) {
        const yStart = Math.max(n1.y, n2.y)
        const yEnd = Math.min(n1.y + n1.height, n2.y + n2.height)
        if (yEnd > yStart + 20) {
          dividers.push({
            id: `v-${n2.id}-${n1.id}`,
            type: 'vertical',
            pos: (n2.x + n2.width + n1.x) * 0.5,
            start: yStart,
            end: yEnd,
            node1Id: n2.id,
            node2Id: n1.id
          })
        }
      }

      // Horizontal divider
      if (Math.abs(n1.y + n1.height - n2.y) < 5) {
        const xStart = Math.max(n1.x, n2.x)
        const xEnd = Math.min(n1.x + n1.width, n2.x + n2.width)
        if (xEnd > xStart + 20) {
          dividers.push({
            id: `h-${n1.id}-${n2.id}`,
            type: 'horizontal',
            pos: (n1.y + n1.height + n2.y) * 0.5,
            start: xStart,
            end: xEnd,
            node1Id: n1.id,
            node2Id: n2.id
          })
        }
      } else if (Math.abs(n2.y + n2.height - n1.y) < 5) {
        const xStart = Math.max(n1.x, n2.x)
        const xEnd = Math.min(n1.x + n1.width, n2.x + n2.width)
        if (xEnd > xStart + 20) {
          dividers.push({
            id: `h-${n2.id}-${n1.id}`,
            type: 'horizontal',
            pos: (n2.y + n2.height + n1.y) * 0.5,
            start: xStart,
            end: xEnd,
            node1Id: n2.id,
            node2Id: n1.id
          })
        }
      }
    }
  }
  return dividers
})

// ============================================================
// NODE SYSTEM
// ============================================================

function handleContainerMouseDown(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('.node-panel')) return
  const rect = containerRef.value?.getBoundingClientRect()
  if (!rect) return

  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const newNode = { id: nodeIdCounter.value++, x, y, width: 0, height: 0 }
  nodes.value.push(newNode)
  isCreating.value = true
  startResize(e, newNode, 'se')
}

function handleGlobalMouseMove(e: MouseEvent) {
  const rect = containerRef.value?.getBoundingClientRect()
  if (!rect) return
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
}

function handleMouseLeave() {
  mouseX.value = -1000
  mouseY.value = -1000
}

function removeNode(id: number) {
  nodes.value = nodes.value.filter(n => n.id !== id)
}

function autoAlignNodes() {
  if (nodes.value.length === 0) return
  const gap = 30
  const containerWidth = containerRef.value?.clientWidth ?? window.innerWidth
  const targetWidth = 440
  const numCols = Math.max(
    1,
    Math.floor((containerWidth - 100) / (targetWidth + gap))
  )
  const gridWidth = numCols * targetWidth + (numCols - 1) * gap
  const startX = Math.max(50, (containerWidth - gridWidth) / 2)
  const columnHeights = new Array(numCols).fill(80)

  const sorted = [...nodes.value].sort((a, b) =>
    Math.abs(a.y - b.y) > 100 ? a.y - b.y : a.x - b.x
  )
  sorted.forEach((node) => {
    let shortest = 0
    for (let i = 1; i < numCols; i++) {
      if (columnHeights[i] < columnHeights[shortest] - 10) shortest = i
    }
    node.x = startX + shortest * (targetWidth + gap)
    node.y = columnHeights[shortest]
    node.width = targetWidth
    columnHeights[shortest] += (node.height || 180) + gap
  })
}

function startDrag(e: MouseEvent, node: Node) {
  isDragging.value = true
  dragNode.value = node
  dragOffset.value = { x: e.clientX - node.x, y: e.clientY - node.y }
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
}

function handleDrag(e: MouseEvent) {
  if (!dragNode.value || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const node = dragNode.value
  const tX = e.clientX - dragOffset.value.x,
    tY = e.clientY - dragOffset.value.y
  activeAlignmentLines.value = []

  const targetsX = [0, rect.width, rect.width * 0.5],
    targetsY = [0, rect.height, rect.height * 0.5]
  nodes.value.forEach((other) => {
    if (other.id === node.id) return
    targetsX.push(other.x, other.x + other.width * 0.5, other.x + other.width)
    targetsY.push(
      other.y,
      other.y + other.height * 0.5,
      other.y + other.height
    )
  })

  let finalX = tX,
    finalY = tY
  const edgesX = [tX, tX + node.width * 0.5, tX + node.width],
    edgesY = [tY, tY + node.height * 0.5, tY + node.height]

  edgesX.forEach((ex) => {
    let best = Infinity,
      minD = SNAP_THRESHOLD
    targetsX.forEach((tx) => {
      const d = Math.abs(ex - tx)
      if (d < minD) {
        minD = d
        best = tx
      }
    })
    if (best !== Infinity) {
      finalX = best - (ex - tX)
      activeAlignmentLines.value.push({ type: 'x', pos: best })
    }
  })
  edgesY.forEach((ey) => {
    let best = Infinity,
      minD = SNAP_THRESHOLD
    targetsY.forEach((ty) => {
      const d = Math.abs(ey - ty)
      if (d < minD) {
        minD = d
        best = ty
      }
    })
    if (best !== Infinity) {
      finalY = best - (ey - tY)
      activeAlignmentLines.value.push({ type: 'y', pos: best })
    }
  })

  node.x = Math.max(
    -node.width * 0.5,
    Math.min(finalX, rect.width - node.width * 0.5)
  )
  node.y = Math.max(
    -node.height * 0.5,
    Math.min(finalY, rect.height - node.height * 0.5)
  )
}

function stopDrag() {
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  activeAlignmentLines.value = []
  setTimeout(() => {
    isDragging.value = false
    dragNode.value = null
  }, 50)
}

function startResize(e: MouseEvent, node: Node, dir: ResizeDirection) {
  isResizing.value = true
  resizeNode.value = node
  resizeDirection.value = dir
  resizeStart.value = {
    x: e.clientX,
    y: e.clientY,
    width: node.width,
    height: node.height,
    nodeX: node.x,
    nodeY: node.y
  }
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

function handleResize(e: MouseEvent) {
  if (!resizeNode.value || !containerRef.value || !resizeDirection.value)
    return
  const node = resizeNode.value,
    dir = resizeDirection.value
  const dX = e.clientX - resizeStart.value.x,
    dY = e.clientY - resizeStart.value.y
  const rect = containerRef.value.getBoundingClientRect()
  let nX = resizeStart.value.nodeX,
    nY = resizeStart.value.nodeY,
    nW = resizeStart.value.width,
    nH = resizeStart.value.height

  activeAlignmentLines.value = []

  // Potential alignment positions
  const targetsX = [0, rect.width, rect.width * 0.5]
  const targetsY = [0, rect.height, rect.height * 0.5]

  nodes.value.forEach((other) => {
    if (other.id === node.id) return
    targetsX.push(other.x, other.x + other.width * 0.5, other.x + other.width)
    targetsY.push(other.y, other.y + other.height * 0.5, other.y + other.height)
  })

  if (isCreating.value) {
    nW = Math.abs(dX)
    nH = Math.abs(dY)
    nX = dX < 0 ? resizeStart.value.nodeX + dX : nX
    nY = dY < 0 ? resizeStart.value.nodeY + dY : nY

    // Snapping for creation
    const curR = nX + nW
    const curB = nY + nH
    targetsX.forEach((tx) => {
      if (Math.abs(nX - tx) < SNAP_THRESHOLD) {
        nW += nX - tx
        nX = tx
        activeAlignmentLines.value.push({ type: 'x', pos: tx })
      } else if (Math.abs(curR - tx) < SNAP_THRESHOLD) {
        nW = tx - nX
        activeAlignmentLines.value.push({ type: 'x', pos: tx })
      }
    })
    targetsY.forEach((ty) => {
      if (Math.abs(nY - ty) < SNAP_THRESHOLD) {
        nH += nY - ty
        nY = ty
        activeAlignmentLines.value.push({ type: 'y', pos: ty })
      } else if (Math.abs(curB - ty) < SNAP_THRESHOLD) {
        nH = ty - nY
        activeAlignmentLines.value.push({ type: 'y', pos: ty })
      }
    })
  } else {
    if (dir.includes('e')) {
      nW = Math.max(CONFIG.minNodeWidth, resizeStart.value.width + dX)
      const curR = nX + nW
      targetsX.forEach((tx) => {
        if (Math.abs(curR - tx) < SNAP_THRESHOLD) {
          nW = tx - nX
          activeAlignmentLines.value.push({ type: 'x', pos: tx })
        }
      })
    } else if (dir.includes('w')) {
      nX = Math.min(
        resizeStart.value.nodeX + resizeStart.value.width - CONFIG.minNodeWidth,
        resizeStart.value.nodeX + dX
      )
      targetsX.forEach((tx) => {
        if (Math.abs(nX - tx) < SNAP_THRESHOLD) {
          nX = tx
          activeAlignmentLines.value.push({ type: 'x', pos: tx })
        }
      })
      nW = resizeStart.value.nodeX + resizeStart.value.width - nX
    }
    if (dir.includes('s')) {
      nH = Math.max(CONFIG.minNodeHeight, resizeStart.value.height + dY)
      const curB = nY + nH
      targetsY.forEach((ty) => {
        if (Math.abs(curB - ty) < SNAP_THRESHOLD) {
          nH = ty - nY
          activeAlignmentLines.value.push({ type: 'y', pos: ty })
        }
      })
    } else if (dir.includes('n')) {
      nY = Math.min(
        resizeStart.value.nodeY
        + resizeStart.value.height
        - CONFIG.minNodeHeight,
        resizeStart.value.nodeY + dY
      )
      targetsY.forEach((ty) => {
        if (Math.abs(nY - ty) < SNAP_THRESHOLD) {
          nY = ty
          activeAlignmentLines.value.push({ type: 'y', pos: ty })
        }
      })
      nH = resizeStart.value.nodeY + resizeStart.value.height - nY
    }
  }

  node.x = Math.max(0, nX)
  node.y = Math.max(0, nY)
  node.width = Math.min(nW, rect.width - node.x)
  node.height = Math.min(nH, rect.height - node.y)
}

function stopResize() {
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  activeAlignmentLines.value = []
  if (isCreating.value && resizeNode.value) {
    if (resizeNode.value.width < 20 || resizeNode.value.height < 20)
      removeNode(resizeNode.value.id)
    else {
      resizeNode.value.width = Math.max(
        resizeNode.value.width,
        CONFIG.minNodeWidth
      )
      resizeNode.value.height = Math.max(
        resizeNode.value.height,
        CONFIG.minNodeHeight
      )
    }
  }
  setTimeout(() => {
    isResizing.value = false
    resizeNode.value = null
    resizeDirection.value = null
    isCreating.value = false
  }, 50)
}

function startSharedResize(e: MouseEvent, divider: SharedDivider) {
  isSharedResizing.value = true
  activeDivider.value = divider
  const n1 = nodes.value.find(n => n.id === divider.node1Id),
    n2 = nodes.value.find(n => n.id === divider.node2Id)
  if (!n1 || !n2) return
  sharedResizeStart.value = {
    x: e.clientX,
    y: e.clientY,
    n1Size: divider.type === 'vertical' ? n1.width : n1.height,
    n2Size: divider.type === 'vertical' ? n2.width : n2.height,
    n2Pos: divider.type === 'vertical' ? n2.x : n2.y
  }
  document.addEventListener('mousemove', handleSharedResize)
  document.addEventListener('mouseup', stopSharedResize)
}

function handleSharedResize(e: MouseEvent) {
  if (!isSharedResizing.value || !activeDivider.value) return
  const div = activeDivider.value,
    d
      = div.type === 'vertical'
        ? e.clientX - sharedResizeStart.value.x
        : e.clientY - sharedResizeStart.value.y
  const n1 = nodes.value.find(n => n.id === div.node1Id),
    n2 = nodes.value.find(n => n.id === div.node2Id)
  if (!n1 || !n2) return

  if (div.type === 'vertical') {
    const n1W = Math.max(
      CONFIG.minNodeWidth,
      sharedResizeStart.value.n1Size + d
    )
    const delta = n1W - sharedResizeStart.value.n1Size,
      n2W = sharedResizeStart.value.n2Size - delta
    if (n2W >= CONFIG.minNodeWidth) {
      n1.width = n1W
      n2.x = sharedResizeStart.value.n2Pos + delta
      n2.width = n2W
    }
  } else {
    const n1H = Math.max(
      CONFIG.minNodeHeight,
      sharedResizeStart.value.n1Size + d
    )
    const delta = n1H - sharedResizeStart.value.n1Size,
      n2H = sharedResizeStart.value.n2Size - delta
    if (n2H >= CONFIG.minNodeHeight) {
      n1.height = n1H
      n2.y = sharedResizeStart.value.n2Pos + delta
      n2.height = n2H
    }
  }
}

function stopSharedResize() {
  document.removeEventListener('mousemove', handleSharedResize)
  document.removeEventListener('mouseup', stopSharedResize)
  isSharedResizing.value = false
  activeDivider.value = null
}

onMounted(() => {
  nodes.value = [
    { id: nodeIdCounter.value++, x: 80, y: 80, width: 440, height: 240 }
  ]
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('mousemove', handleSharedResize)
  document.removeEventListener('mouseup', stopSharedResize)
})
</script>
