<script lang="ts" setup>
defineOptions({
  tags: ['barlists', 'apiperformance']
})

interface ApiEndpoint {
  endpoint: string
  method: string
  responseTime: number
  requestCount: number
  errorRate: number
  status: 'healthy' | 'warning' | 'critical'
}

const apiData = ref<ApiEndpoint[]>([
  {
    endpoint: '/api/v1/notifications',
    method: 'GET',
    responseTime: 156,
    requestCount: 12840,
    errorRate: 0.5,
    status: 'healthy'
  }
])

const maxRequests = computed(() =>
  Math.max(...apiData.value.map(api => api.requestCount))
)

const getRequestBarWidth = (requests: number) => {
  const percentage = (requests / maxRequests.value) * 100
  return { width: `${Math.max(percentage, 5)}%` }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy':
      return 'bg-(--ui-primary)'
    case 'warning':
      return 'bg-yellow-500' // Keeping direct color for clarity with existing theme
    case 'critical':
      return 'bg-red-500' // Keeping direct color for clarity with existing theme
    default:
      return 'bg-(--ui-primary)'
  }
}

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}
</script>

<template>
  <UCard class="!bg-default mx-auto my-8 max-w-2xl">
    <template #header>
      <div
        class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <h2 class="text-default font-bold">
            API Performance Monitor
          </h2>
          <p class="text-muted text-sm">
            Real-time endpoint metrics and health status
          </p>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 text-sm">
            <div class="h-3 w-3 rounded-full bg-(--ui-primary) opacity-75" />
            <span>Healthy</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <div class="h-3 w-3 rounded-full bg-yellow-500 opacity-75" />
            <span>Warning</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <div class="h-3 w-3 rounded-full bg-red-500 opacity-75" />
            <span>Critical</span>
          </div>
        </div>
      </div>
    </template>

    <div class="space-y-6">
      <div
        v-for="(api, key) in apiData"
        :key="key"
        class="border-default transform rounded-xl border p-5 shadow-md transition-all duration-300 hover:shadow-lg"
      >
        <div class="mb-4 flex flex-col justify-between sm:flex-row">
          <div class="flex items-center gap-4">
            <span
              :class="
                api.method === 'GET'
                  ? 'bg-emerald-600/80 text-white dark:bg-emerald-600/20 dark:text-emerald-300'
                  : 'bg-blue-600/20 text-blue-300'
              "
              class="flex items-center gap-2 rounded-md px-3 py-1 text-sm font-semibold"
            >
              {{ api.method }}
            </span>
            <span class="text-default font-mono text-base font-medium">{{
              api.endpoint
            }}</span>
            <div
              :class="getStatusColor(api.status)"
              class="h-2 w-2 rounded-full"
            />
          </div>
          <div class="text-muted text-base font-medium">
            {{ formatNumber(api.requestCount) }} requests
          </div>
        </div>

        <div class="mb-4">
          <div
            class="text-muted mb-2 flex items-center justify-between text-sm font-medium"
          >
            <span>Request Volume</span>
            <span>{{ api.requestCount.toLocaleString() }}</span>
          </div>
          <div class="h-2 w-full rounded-full bg-(--ui-bg-elevated)">
            <div
              :style="getRequestBarWidth(api.requestCount)"
              :class="getStatusColor(api.status)"
              class="h-full rounded-full transition-all duration-300"
            />
          </div>
        </div>

        <div
          class="flex items-center justify-between gap-x-8 gap-y-4 text-base sm:grid-cols-2"
        >
          <div class="flex items-center gap-2 text-xs">
            <div class="text-muted flex items-center gap-2">
              <UIcon
                name="i-lucide-gauge"
                class="text-muted"
                size="14"
              />
              Avg Response Time
            </div>
            <div
              class="font-bold"
              :class="
                api.responseTime > 1000
                  ? 'text-red-500'
                  : api.responseTime > 500
                    ? 'text-yellow-500'
                    : 'text-default'
              "
            >
              {{ api.responseTime }}ms
            </div>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <div class="text-muted flex items-center gap-2">
              <UIcon
                name="i-lucide-alert-triangle"
                class="text-muted"
                size="14"
              />
              Error Rate
            </div>
            <div
              class="font-bold"
              :class="
                api.errorRate > 3
                  ? 'text-red-500'
                  : api.errorRate > 1
                    ? 'text-yellow-500'
                    : 'text-default'
              "
            >
              {{ api.errorRate }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div
        class="text-muted flex flex-col items-center justify-between text-sm lg:flex-row"
      >
        <span>Last updated: 2 minutes ago</span>
        <div class="mt-4 flex gap-4 sm:mt-0">
          <UButton
            variant="outline"
            trailing-icon="i-lucide-refresh-cw"
            color="neutral"
          >
            Refresh
          </UButton>
          <UButton
            variant="outline"
            trailing-icon="i-lucide-external-link"
            color="neutral"
          >
            View Logs
          </UButton>
        </div>
      </div>
    </template>
  </UCard>
</template>
