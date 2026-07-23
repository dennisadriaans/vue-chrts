<script setup lang="ts">
const props = defineProps<{
  domain: string
  uptime: string
  operationalStatus: boolean
  statusData: {
    status: string
  }[]
  barWidth: number
  barGap: number
  startLabel?: string
  endLabel?: string
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const containerWidth = ref(0)
const resizeObserver = ref<ResizeObserver | null>(null)

// statusData is assumed to be ordered oldest -> newest (index 0 = oldest)
// Recent data appears on the right, older records are dropped when there's not enough space
const statusBars = computed(() => {
  if (!containerWidth.value) return []

  const totalBarWidth = props.barWidth + props.barGap * 2
  const numberOfBars = Math.floor(containerWidth.value / totalBarWidth)

  if (props.statusData.length === 0) return []

  const dataLength = props.statusData.length
  const startIndex = Math.max(0, dataLength - numberOfBars)
  const visibleBars = props.statusData.slice(startIndex)

  if (visibleBars.length < numberOfBars) {
    const emptyBars = Array(numberOfBars - visibleBars.length).fill({
      status: 'empty'
    })
    return [...emptyBars, ...visibleBars]
  }

  return visibleBars
})

const updateContainerWidth = () => {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.offsetWidth
  }
}

onMounted(() => {
  updateContainerWidth()
  resizeObserver.value = new ResizeObserver(updateContainerWidth)
  if (containerRef.value) {
    resizeObserver.value.observe(containerRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect()
  }
})
</script>

<template>
  <UCard
    data-testid="status-tracker"
    class="w-full"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon
            data-testid="status-tracker-icon"
            :name="operationalStatus ? 'i-lucide-check-circle-2' : 'i-lucide-alert-circle'"
            :class="operationalStatus ? 'text-success' : 'text-error'"
            class="size-5"
          />
          <span
            data-testid="status-tracker-domain"
            class="text-sm font-medium text-default"
          >{{ domain }}</span>
        </div>
        <span
          data-testid="status-tracker-uptime"
          class="text-sm font-medium text-default"
        >{{ uptime }} uptime</span>
      </div>
    </template>

    <div class="space-y-3">
      <div
        ref="containerRef"
        data-testid="status-tracker-bars"
        class="flex h-7 w-full justify-between"
      >
        <UTooltip
          v-for="(bar, index) in statusBars"
          :key="index"
          :text="bar.status === 'empty' ? 'No data' : bar.status"
          :disabled="bar.status === 'empty'"
        >
          <div
            data-testid="status-tracker-bar"
            class="h-7 transition-opacity first:rounded-l last:rounded-r"
            :class="[
              bar.status === 'online' && 'bg-success hover:opacity-80',
              bar.status === 'offline' && 'bg-error hover:opacity-80',
              bar.status === 'empty' && 'bg-elevated'
            ]"
            :style="{
              width: `${barWidth}px`,
              marginLeft: `${barGap / 2}px`,
              marginRight: `${barGap / 2}px`
            }"
          />
        </UTooltip>
      </div>

      <div class="flex items-center justify-between text-xs text-muted">
        <span>{{ startLabel }}</span>
        <span>{{ endLabel }}</span>
      </div>
    </div>
  </UCard>
</template>
