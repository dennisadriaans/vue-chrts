<script setup lang="ts">
import { LegendPosition } from './types'
import type { Node, ResizeDirection } from './types'

const props = defineProps<{
  node: Node
  isDragging: boolean
  usedChartKeys?: string[]
}>()

defineEmits<{
  (e: 'startDrag', event: MouseEvent, node: Node): void
  (e: 'startResize', event: MouseEvent, node: Node, dir: ResizeDirection): void
  (e: 'remove', id: number): void
}>()

// ============================================================
// CHARTS
// ============================================================

const chartLoaders = import.meta.glob([
  '~/components/ChartGallery/**/*.vue',
  '~/components/Canvas/NodeTitle.vue'
])

type ChartKey = keyof typeof chartLoaders

const chartComponentCache: Partial<Record<ChartKey, Component>> = {}

function getChartComponent(key: string) {
  const typedKey = key as ChartKey
  const loader = chartLoaders[typedKey]
  if (!loader) return null

  if (!chartComponentCache[typedKey]) {
    chartComponentCache[typedKey] = defineAsyncComponent(loader as () => Promise<Component>)
  }

  return chartComponentCache[typedKey]
}

function formatChartLabel(key: string) {
  return key
    .replace('/components/ChartGallery/', '')
    .replace('~/components/ChartGallery/', '')
    .replace('/components/Canvas/', '')
    .replace('~/components/Canvas/', '')
    .replace(/\.vue$/, '')
    .replaceAll('/', ' / ')
}

function iconForChart(key: string) {
  const lowerKey = key.toLowerCase()
  if (lowerKey.includes('nodetitle')) return 'i-lucide-type'
  if (lowerKey.includes('/area/')) return 'i-lucide-chart-area'
  if (lowerKey.includes('/bar/')) return 'i-lucide-chart-column'
  if (lowerKey.includes('/line/')) return 'i-lucide-chart-line'
  if (lowerKey.includes('/donut/')) return 'i-lucide-chart-pie'
  return 'i-lucide-chart-area'
}

// Pre-calculate constants for charts
const chartKeys = Object.keys(
  chartLoaders
).sort() as ChartKey[]

const nodeTitleKey = chartKeys.find(k => k.includes('NodeTitle.vue'))
const libraryChartKeys = chartKeys.filter(k => k.includes('/ChartGallery/'))

const baseChartMenuItems = libraryChartKeys.map(key => ({
  key,
  label: formatChartLabel(key),
  icon: iconForChart(key)
}))

const menuItems = computed(() => {
  const chartItems = baseChartMenuItems
    .filter(item => !props.usedChartKeys?.includes(item.key))
    .map(item => ({
      label: item.label,
      icon: item.icon,
      onSelect: () => {
        props.node.chartKey = item.key
      }
    }))

  return [
    [
      {
        label: 'Clear Node',
        icon: 'i-lucide-trash-2',
        onSelect: () => {
          props.node.chartKey = undefined
          props.node.title = undefined
          props.node.description = undefined
        }
      }
    ],
    [
      {
        label: 'Title',
        icon: 'i-lucide-type',
        onSelect: () => {
          props.node.title = props.node.title || 'New Node'
          props.node.description = props.node.description || 'Description here...'
        }
      },
      {
        label: 'Chart',
        icon: 'i-lucide-chart-column',
        children: [chartItems]
      }
    ]
  ]
})
</script>

<template>
  <div
    :style="{
      transform: `translate(${node.x}px, ${node.y}px)`,
      width: `${node.width}px`,
      height: `${node.height}px`
    }"
    class="absolute top-0 left-0 z-20 node-panel"
    @mousedown="(e) => $emit('startDrag', e, node)"
  >
    <div
      class="w-full h-full rounded-xl bg-[#1c1c1c] p-4 flex flex-col group transition-colors duration-200"
      :class="
        isDragging
          ? 'ring-1 ring-white/10'
          : 'border border-white/5'
      "
    >
      <div class="flex items-center justify-between mb-2 shrink-0">
        <div class="flex gap-1.5">
          <div
            class="w-2.5 h-2.5 rounded-full bg-white/5 group-hover:bg-red-500/50 transition-colors"
          />
          <div
            class="w-2.5 h-2.5 rounded-full bg-white/5 group-hover:bg-amber-500/50 transition-colors"
          />
          <div
            class="w-2.5 h-2.5 rounded-full bg-white/5 group-hover:bg-emerald-500/50 transition-colors"
          />
        </div>
        <div
          class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <UDropdownMenu :items="menuItems">
            <button
              class="text-white/20 hover:text-white/60 transition-colors"
            >
              <UIcon
                name="i-lucide-plus"
                class="w-3.5 h-3.5"
              />
            </button>
          </UDropdownMenu>
          <button
            class="text-white/20 hover:text-white/60 transition-colors"
            @click.stop="$emit('remove', node.id)"
          >
            <UIcon
              name="i-lucide-x"
              class="w-3.5 h-3.5"
            />
          </button>
        </div>
      </div>

      <div class="flex-1 w-full min-h-0 flex flex-col">
        <div
          v-if="node.title || node.title === ''"
          class="shrink-0"
        >
          <input
            v-model="node.title"
            class="bg-transparent text-white font-semibold text-lg border-none focus:ring-0 w-full p-0 focus:outline-none"
            placeholder="Title"
          >
          <textarea
            v-model="node.description"
            rows="1"
            class="bg-transparent text-white/40 text-sm border-none focus:ring-0 w-full p-0 resize-none h-auto focus:outline-none"
            placeholder="Description"
          />
        </div>

        <div
          v-if="node.chartKey && node.chartKey !== nodeTitleKey"
          class="flex-1 w-full min-h-0 mt-5"
        >
          <component
            :is="getChartComponent(node.chartKey)"
            :height="Math.max(50, node.height - (node.title ? 180 : 120))"
            :legend-position="LegendPosition.BottomCenter"
            :act-on-responsive-height="false"
          />
        </div>
      </div>

      <!-- Resize handles -->
      <!-- Corners -->
      <div
        class="absolute -top-1 -left-1 w-3 h-3 cursor-ne-resize z-30"
        @mousedown.stop="(e) => $emit('startResize', e, node, 'nw')"
      />
      <div
        class="absolute -top-1 -right-1 w-3 h-3 cursor-ne-resize z-30"
        @mousedown.stop="(e) => $emit('startResize', e, node, 'ne')"
      />
      <div
        class="absolute -bottom-1 -left-1 w-3 h-3 cursor-sw-resize z-30"
        @mousedown.stop="(e) => $emit('startResize', e, node, 'sw')"
      />
      <div
        class="absolute -bottom-1 -right-1 w-6 h-6 cursor-se-resize z-30 flex items-end justify-end p-1 group-hover:opacity-100 opacity-0 transition-opacity"
        @mousedown.stop="(e) => $emit('startResize', e, node, 'se')"
      >
        <div
          class="w-3 h-3 border-r-2 border-b-2 border-white/20 hover:border-white/40 rounded-br-sm transition-colors"
        />
      </div>

      <!-- Edges -->
      <div
        class="absolute top-0 left-2 right-2 h-1 cursor-n-resize z-30"
        @mousedown.stop="(e) => $emit('startResize', e, node, 'n')"
      />
      <div
        class="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize z-30"
        @mousedown.stop="(e) => $emit('startResize', e, node, 's')"
      />
      <div
        class="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize z-30"
        @mousedown.stop="(e) => $emit('startResize', e, node, 'w')"
      />
      <div
        class="absolute right-0 top-2 bottom-2 w-1 cursor-e-resize z-30"
        @mousedown.stop="(e) => $emit('startResize', e, node, 'e')"
      />
    </div>
  </div>
</template>

<style scoped>
.node-panel {
  cursor: grab;
}

.node-panel:active {
  cursor: grabbing;
}
</style>
