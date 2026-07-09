<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineOptions({
  tags: ['statusuptime', 'realtimesparklines']
})

interface RealtimeMetric {
  id: string
  label: string
  value: number
  unit: string
  data: number[]
  maxDataPoints: number
  color: string
  threshold?: {
    warning: number
    critical: number
  }
}

const metrics = ref<RealtimeMetric[]>([
  {
    id: 'cpu',
    label: 'CPU Usage',
    value: 45,
    unit: '%',
    data: [42, 38, 45, 52, 48, 41, 39, 44, 47, 43, 45],
    maxDataPoints: 20,
    color: 'rgb(59, 130, 246)',
    threshold: { warning: 70, critical: 85 }
  },
  {
    id: 'memory',
    label: 'Memory Usage',
    value: 68,
    unit: '%',
    data: [65, 62, 68, 71, 69, 66, 64, 67, 70, 72, 68],
    maxDataPoints: 20,
    color: 'rgb(34, 197, 94)',
    threshold: { warning: 80, critical: 90 }
  },
  {
    id: 'network',
    label: 'Network I/O',
    value: 1.2,
    unit: 'MB/s',
    data: [0.8, 1.1, 0.9, 1.3, 1.5, 1.2, 1.0, 1.4, 1.1, 0.9, 1.2],
    maxDataPoints: 20,
    color: 'rgb(168, 85, 247)'
  },
  {
    id: 'requests',
    label: 'Requests/sec',
    value: 847,
    unit: 'req/s',
    data: [720, 850, 920, 780, 940, 860, 810, 890, 920, 870, 847],
    maxDataPoints: 20,
    color: 'rgb(245, 158, 11)'
  },
  {
    id: 'errors',
    label: 'Error Rate',
    value: 0.05,
    unit: '%',
    data: [0.02, 0.03, 0.01, 0.04, 0.06, 0.03, 0.02, 0.05, 0.07, 0.04, 0.05],
    maxDataPoints: 20,
    color: 'rgb(239, 68, 68)',
    threshold: { warning: 0.1, critical: 0.5 }
  },
  {
    id: 'latency',
    label: 'Avg Latency',
    value: 125,
    unit: 'ms',
    data: [110, 120, 105, 135, 140, 125, 115, 130, 145, 135, 125],
    maxDataPoints: 20,
    color: 'rgb(20, 184, 166)',
    threshold: { warning: 200, critical: 500 }
  }
])

const isRealtime = ref(true)
let updateInterval: NodeJS.Timeout | null = null

function generateSparklinePath(
  data: number[],
  width: number = 50,
  height: number = 20
): string {
  if (data.length < 2) return ''

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  })

  return `M ${points.join(' L ')}`
}

function getStatusColor(metric: RealtimeMetric): string {
  if (!metric.threshold) return metric.color

  if (metric.value >= metric.threshold.critical) return 'rgb(239, 68, 68)'
  if (metric.value >= metric.threshold.warning) return 'rgb(245, 158, 11)'
  return 'rgb(34, 197, 94)'
}

function getStatusLabel(metric: RealtimeMetric): string {
  if (!metric.threshold) return 'Normal'

  if (metric.value >= metric.threshold.critical) return 'Critical'
  if (metric.value >= metric.threshold.warning) return 'Warning'
  return 'Normal'
}

function simulateRealtimeUpdate() {
  metrics.value.forEach((metric) => {
    // Generate realistic fluctuations
    const lastValue = metric.data[metric.data.length - 1]
    const variation = (Math.random() - 0.5) * 0.2 * lastValue
    let newValue = Math.max(0, lastValue + variation)

    // Add occasional spikes for demonstration
    if (Math.random() < 0.05) {
      newValue *= 1.5
    }

    // Update data array
    metric.data.push(newValue)
    if (metric.data.length > metric.maxDataPoints) {
      metric.data.shift()
    }

    // Update current value
    metric.value = Number(newValue.toFixed(metric.unit === '%' ? 0 : 2))
  })
}

function toggleRealtime() {
  isRealtime.value = !isRealtime.value

  if (isRealtime.value) {
    updateInterval = setInterval(simulateRealtimeUpdate, 2000)
  } else {
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }
  }
}

onMounted(() => {
  if (isRealtime.value) {
    updateInterval = setInterval(simulateRealtimeUpdate, 2000)
  }
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<template>
  <UCard>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold">
            Real-time System Metrics
          </h3>
          <p class="text-muted mt-1 text-sm">
            Live server performance monitoring with trend indicators
          </p>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <div
              :class="isRealtime ? 'bg-green-500' : 'bg-gray-400'"
              class="h-2 w-2 animate-pulse rounded-full"
            />
            <span class="text-muted text-sm">
              {{ isRealtime ? 'Live' : 'Paused' }}
            </span>
          </div>

          <UButton
            :variant="isRealtime ? 'solid' : 'outline'"
            @click="toggleRealtime"
          >
            <UIcon :name="isRealtime ? 'i-lucide-pause' : 'i-lucide-play'" />
            {{ isRealtime ? 'Pause' : 'Resume' }}
          </UButton>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="metric in metrics"
          :key="metric.id"
          class="border-default relative overflow-hidden rounded-lg border bg-(--ui-bg-elevated) p-4"
        >
          <!-- Status indicator -->
          <div class="absolute top-2 right-2">
            <div
              class="rounded-full px-2 py-1 text-sm font-medium"
              :style="{
                backgroundColor: getStatusColor(metric) + '20',
                color: getStatusColor(metric)
              }"
            >
              {{ getStatusLabel(metric) }}
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <p class="text-muted text-sm font-medium">
                {{ metric.label }}
              </p>
              <div class="flex items-baseline gap-1">
                <span class="text-xl font-bold">
                  {{ metric.value }}
                </span>
                <span class="text-muted text-sm">
                  {{ metric.unit }}
                </span>
              </div>
            </div>

            <div class="flex items-end justify-end">
              <div>
                <svg
                  width="50"
                  height="20"
                  class="overflow-visible"
                >
                  <defs>
                    <linearGradient
                      :id="`gradient-${metric.id}`"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        :stop-color="metric.color"
                        stop-opacity="0.3"
                      />
                      <stop
                        offset="100%"
                        :stop-color="metric.color"
                        stop-opacity="0"
                      />
                    </linearGradient>
                  </defs>

                  <!-- Fill area -->
                  <path
                    :d="`${generateSparklinePath(metric.data)} L 50,20 L 0,20 Z`"
                    :fill="`url(#gradient-${metric.id})`"
                  />

                  <!-- Line -->
                  <path
                    :d="generateSparklinePath(metric.data)"
                    :stroke="metric.color"
                    stroke-width="1.5"
                    fill="none"
                    class="drop-shadow-sm"
                  />

                  <!-- Current value dot -->
                  <circle
                    :cx="50"
                    :cy="
                      20
                        - ((metric.data[metric.data.length - 1]
                          - Math.min(...metric.data))
                          / (Math.max(...metric.data) - Math.min(...metric.data)
                            || 1))
                        * 20
                    "
                    r="2"
                    :fill="metric.color"
                    class="drop-shadow-sm"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="border-default border-t pt-4">
        <div
          class="flex flex-col items-center justify-between text-sm lg:flex-row"
        >
          <div class="mb-4 flex flex-col items-center gap-4 lg:flex-row">
            <span class="text-muted">
              Updates every {{ isRealtime ? '2 seconds' : 'paused' }}
            </span>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <div class="h-2 w-2 rounded-full bg-green-500" />
                <span class="text-muted">Normal</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="h-2 w-2 rounded-full bg-yellow-500" />
                <span class="text-muted">Warning</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="h-2 w-2 rounded-full bg-red-500" />
                <span class="text-muted">Critical</span>
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <UButton
              variant="ghost"
              trailing-icon="i-lucide-settings"
              color="neutral"
            >
              Configure
            </UButton>

            <UButton
              variant="ghost"
              trailing-icon="i-lucide-external-link"
              color="neutral"
            >
              Full Dashboard
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
