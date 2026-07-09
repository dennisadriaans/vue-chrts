<script setup lang="ts">
defineOptions({
  tags: ['statusuptime', 'serverperformanceheatmap']
})

interface ServerData {
  region: string
  server: string
  responseTime: number
  status: 'healthy' | 'warning' | 'critical'
  uptime: number
}

const regions = [
  'US-East',
  'US-West',
  'EU-Central',
  'EU-West',
  'Asia-Pacific',
  'Asia-South'
]
const serversPerRegion = ['Server-01', 'Server-02', 'Server-03', 'Server-04']

// Generate realistic server performance data
const generateServerData = (): ServerData[] => {
  const data: ServerData[] = []

  regions.forEach((region) => {
    serversPerRegion.forEach((server) => {
      // Base response time varies by region
      let baseResponseTime = 100
      if (region.includes('Asia')) baseResponseTime = 150
      if (region.includes('EU')) baseResponseTime = 120

      // Add some randomness and occasional issues
      const variance = Math.random() * 100
      let responseTime = Math.round(baseResponseTime + variance)

      // Determine status based on response time
      let status: 'healthy' | 'warning' | 'critical' = 'healthy'
      if (responseTime > 200) status = 'warning'
      if (responseTime > 300) status = 'critical'

      // Random chance of server issues
      if (Math.random() < 0.05) {
        status = 'critical'
        responseTime = Math.round(400 + Math.random() * 200)
      }

      // Generate uptime (usually high)
      const uptime
        = status === 'critical' ? Math.random() * 30 + 70 : Math.random() * 5 + 95

      data.push({
        region,
        server,
        responseTime,
        status,
        uptime: Math.round(uptime * 100) / 100
      })
    })
  })

  return data
}

const serverData = ref<ServerData[]>(generateServerData())
const hoveredServer = ref<ServerData | null>(null)
const selectedServer = ref<ServerData | null>(null)
const autoRefresh = ref(true)

const maxResponseTime = computed(() =>
  Math.max(...serverData.value.map(d => d.responseTime))
)

const getResponseTimeClass = (responseTime: number) => {
  const ratio = responseTime / maxResponseTime.value
  if (ratio <= 0.3) return 'bg-green-500'
  if (ratio <= 0.5) return 'bg-yellow-500'
  if (ratio <= 0.7) return 'bg-orange-600'
  return 'bg-red-600'
}

const getCellClass = (server: ServerData) => {
  return getResponseTimeClass(server.responseTime)
}

const getServerStatus = (
  responseTime: number
): 'healthy' | 'warning' | 'critical' => {
  const ratio = responseTime / maxResponseTime.value
  if (ratio <= 0.3) return 'healthy'
  if (ratio <= 0.5) return 'healthy'
  if (ratio <= 0.7) return 'warning'
  return 'critical'
}

const getCellOpacity = (server: ServerData) => {
  if (!selectedServer.value) return 1

  // If a server is selected, dim all others
  if (
    selectedServer.value.region === server.region
    && selectedServer.value.server === server.server
  ) {
    return 1 // Keep selected server at full opacity
  }
  return 0.3 // Dim unselected servers
}

const selectServer = (server: ServerData) => {
  if (
    selectedServer.value
    && selectedServer.value.region === server.region
    && selectedServer.value.server === server.server
  ) {
    selectedServer.value = null // Deselect if clicking the same server
  } else {
    selectedServer.value = server
  }
}

const getStatusIcon = (status: ServerData['status']) => {
  switch (status) {
    case 'healthy':
      return 'i-lucide-check-circle'
    case 'warning':
      return 'i-lucide-alert-triangle'
    case 'critical':
      return 'i-lucide-x-circle'
    default:
      return 'i-lucide-help-circle'
  }
}

const avgResponseTime = computed(() => {
  const total = serverData.value.reduce((sum, s) => sum + s.responseTime, 0)
  return Math.round(total / serverData.value.length)
})

const refreshData = () => {
  serverData.value = generateServerData()
}

// Auto refresh every 30 seconds if enabled
let refreshInterval: NodeJS.Timeout | null = null

watch(autoRefresh, (enabled) => {
  if (enabled) {
    refreshInterval = setInterval(refreshData, 30000)
  } else if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<template>
  <UCard class="!bg-default">
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold">
            Server Performance Heatmap
          </h3>
          <p class="text-muted text-sm">
            Global server response time monitoring
          </p>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-4">
            <div
              v-if="selectedServer"
              class="flex items-center gap-4"
            >
              <span class="text-muted text-sm">Selected:</span>
              <span class="text-sm font-medium">{{ selectedServer.region }} - {{ selectedServer.server }}</span>
              <UButton
                variant="soft"
                trailing-icon="i-lucide-x"
                @click="selectedServer = null"
              >
                Clear
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="space-y-4">
      <!-- Region Headers -->
      <div class="flex">
        <div class="w-24" />
        <div
          class="text-muted grid flex-1 grid-cols-6 gap-2 text-center text-sm font-medium"
        >
          <div
            v-for="region in regions"
            :key="region"
          >
            {{ region }}
          </div>
        </div>
      </div>

      <!-- Server Heatmap Grid -->
      <div class="space-y-2">
        <div
          v-for="server in serversPerRegion"
          :key="server"
          class="flex items-center gap-2"
        >
          <!-- Server Label -->
          <div class="text-muted w-20 text-sm font-medium">
            {{ server }}
          </div>

          <!-- Server Cells -->
          <div class="grid flex-1 grid-cols-6 gap-2">
            <div
              v-for="region in regions"
              :key="`${region}-${server}`"
              class="group relative"
            >
              <div
                :class="[
                  getCellClass(
                    serverData.find(
                      (s) => s.region === region && s.server === server
                    )!
                  ),
                  'h-12 w-full cursor-pointer rounded transition-all duration-200'
                ]"
                :style="{
                  opacity: getCellOpacity(
                    serverData.find(
                      (s) => s.region === region && s.server === server
                    )!
                  )
                }"
                @mouseenter="
                  hoveredServer = serverData.find(
                    (s) => s.region === region && s.server === server
                  )!
                "
                @mouseleave="hoveredServer = null"
                @click="
                  selectServer(
                    serverData.find(
                      (s) => s.region === region && s.server === server
                    )!
                  )
                "
              >
                <div class="flex h-full items-center justify-center">
                  <UIcon
                    :name="
                      getStatusIcon(
                        getServerStatus(
                          serverData.find(
                            (s) => s.region === region && s.server === server
                          )!.responseTime
                        )
                      )
                    "
                    class="h-4 w-4 text-white opacity-80"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Legend and Tooltip -->
      <div class="flex h-[40px] items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="text-muted flex items-center gap-2 text-xs">
            <span>Faster</span>
            <div class="flex gap-1">
              <div class="h-3 w-3 rounded-sm bg-green-500" />
              <div class="h-3 w-3 rounded-sm bg-yellow-500" />
              <div class="h-3 w-3 rounded-sm bg-orange-600" />
              <div class="h-3 w-3 rounded-sm bg-red-600" />
            </div>
            <span>Slower</span>
          </div>
        </div>

        <!-- Tooltip -->
        <div
          v-if="hoveredServer"
          class="text-sm"
        >
          <div class="flex items-center gap-2">
            <span class="font-medium">{{ hoveredServer.region }} - {{ hoveredServer.server }}</span>
            <UIcon
              :name="getStatusIcon(getServerStatus(hoveredServer.responseTime))"
              class="h-4 w-4"
              :class="{
                'text-green-600':
                  getServerStatus(hoveredServer.responseTime) === 'healthy',
                'text-yellow-600':
                  getServerStatus(hoveredServer.responseTime) === 'warning',
                'text-red-600':
                  getServerStatus(hoveredServer.responseTime) === 'critical'
              }"
            />
          </div>
          <div class="text-muted">
            {{ hoveredServer.responseTime }}ms response time
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div
        class="text-muted flex flex-col gap-4 text-sm lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span>Avg Response: {{ avgResponseTime }}ms</span>
          <div class="flex items-center gap-2">
            <span>Auto-refresh:</span>
            <USwitch v-model="autoRefresh" />
          </div>
          <span class="hidden sm:inline">• Last updated: {{ new Date().toLocaleTimeString() }}</span>
        </div>
        <div class="flex gap-2">
          <UButton
            variant="outline"
            trailing-icon="i-lucide-refresh-cw"
            color="neutral"
            @click="refreshData"
          >
            Refresh
          </UButton>
          <UButton
            variant="outline"
            trailing-icon="i-lucide-external-link"
            color="neutral"
          >
            Server Logs
          </UButton>
        </div>
      </div>
    </template>
  </UCard>
</template>
