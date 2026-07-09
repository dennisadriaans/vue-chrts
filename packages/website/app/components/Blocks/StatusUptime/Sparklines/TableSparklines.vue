<script setup lang="ts">
defineOptions({
  tags: ['statusuptime', 'tablesparklines']
})

interface UserData {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  lastActivity: string
  activityData: number[]
  totalSessions: number
  avgSessionTime: number
  conversionRate: number
}

const users: UserData[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'Product Manager',
    status: 'active',
    lastActivity: '2 hours ago',
    activityData: [12, 18, 15, 22, 28, 19, 35, 31, 42, 38, 45, 39, 52, 48, 55],
    totalSessions: 142,
    avgSessionTime: 24.5,
    conversionRate: 8.2
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    email: 'marcus.r@company.com',
    role: 'Engineering Lead',
    status: 'active',
    lastActivity: '15 minutes ago',
    activityData: [8, 12, 9, 16, 20, 14, 25, 22, 30, 28, 35, 31, 38, 34, 41],
    totalSessions: 89,
    avgSessionTime: 18.3,
    conversionRate: 6.7
  },
  {
    id: '3',
    name: 'Emily Watson',
    email: 'emily.watson@company.com',
    role: 'Designer',
    status: 'inactive',
    lastActivity: '3 days ago',
    activityData: [15, 12, 8, 5, 3, 2, 1, 0, 0, 0, 2, 4, 6, 8, 5],
    totalSessions: 67,
    avgSessionTime: 12.1,
    conversionRate: 3.4
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@company.com',
    role: 'Data Analyst',
    status: 'active',
    lastActivity: '1 hour ago',
    activityData: [5, 8, 12, 18, 25, 32, 28, 35, 42, 38, 48, 45, 52, 58, 62],
    totalSessions: 203,
    avgSessionTime: 31.2,
    conversionRate: 12.5
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa.t@company.com',
    role: 'Marketing Manager',
    status: 'pending',
    lastActivity: '30 minutes ago',
    activityData: [2, 4, 6, 8, 12, 10, 15, 18, 22, 20, 25, 28, 32, 30, 35],
    totalSessions: 45,
    avgSessionTime: 15.7,
    conversionRate: 4.8
  }
]

function generateSparklinePath(
  data: number[],
  width: number = 40,
  height: number = 16
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

function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'text-green-600'
    case 'inactive':
      return 'text-red-600'
    case 'pending':
      return 'text-yellow-600'
    default:
      return 'text-gray-600'
  }
}

function getSparklineColor(data: number[]): string {
  const recent = data.slice(-3)
  const earlier = data.slice(-6, -3)
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
  const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length

  if (recentAvg > earlierAvg * 1.1) return 'rgb(34, 197, 94)'
  if (recentAvg < earlierAvg * 0.9) return 'rgb(239, 68, 68)'
  return 'rgb(107, 114, 128)'
}
</script>

<template>
  <UCard class="!bg-[--ui-bg]">
    <div class="space-y-6">
      <div>
        <h3 class="text-lg font-semibold text-[--ui-text]">
          User Activity Table
        </h3>
        <p class="text-muted mt-1 text-sm">
          User engagement metrics with embedded trend charts
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-default border-b">
              <th class="text-muted px-4 py-3 text-left text-sm font-medium">
                User
              </th>
              <th class="text-muted px-4 py-3 text-left text-sm font-medium">
                Status
              </th>
              <th class="text-muted px-4 py-3 text-left text-sm font-medium">
                Activity Trend
              </th>
              <th class="text-muted px-4 py-3 text-left text-sm font-medium">
                Sessions
              </th>
              <th class="text-muted px-4 py-3 text-left text-sm font-medium">
                Avg Time
              </th>
              <th class="text-muted px-4 py-3 text-left text-sm font-medium">
                Conversion
              </th>
              <th class="text-muted px-4 py-3 text-left text-sm font-medium">
                Last Activity
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in users"
              :key="user.id"
              class="border-default border-b transition-colors hover:bg-[--ui-bg-elevated]/50"
            >
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-medium text-white"
                  >
                    {{
                      user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                    }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-[--ui-text]">
                      {{ user.name }}
                    </p>
                    <p class="text-muted text-xs">
                      {{ user.email }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-4 py-4">
                <div class="flex items-center gap-2">
                  <div
                    :class="getStatusColor(user.status)"
                    class="h-2 w-2 rounded-full"
                    :style="{
                      backgroundColor:
                        user.status === 'active'
                          ? 'rgb(34, 197, 94)'
                          : user.status === 'inactive'
                            ? 'rgb(239, 68, 68)'
                            : 'rgb(234, 179, 8)'
                    }"
                  />
                  <span class="text-sm text-[--ui-text] capitalize">{{
                    user.status
                  }}</span>
                </div>
              </td>

              <td class="px-4 py-4">
                <div class="flex items-center gap-2">
                  <svg
                    width="40"
                    height="16"
                    class="overflow-visible"
                  >
                    <path
                      :d="generateSparklinePath(user.activityData)"
                      :stroke="getSparklineColor(user.activityData)"
                      stroke-width="1.5"
                      fill="none"
                    />
                    <circle
                      :cx="40"
                      :cy="
                        16
                          - ((user.activityData[user.activityData.length - 1]
                            - Math.min(...user.activityData))
                            / (Math.max(...user.activityData)
                              - Math.min(...user.activityData) || 1))
                          * 16
                      "
                      r="1.5"
                      :fill="getSparklineColor(user.activityData)"
                    />
                  </svg>
                  <span class="text-muted text-xs">15 days</span>
                </div>
              </td>

              <td class="px-4 py-4">
                <span class="text-sm font-medium text-[--ui-text]">{{
                  user.totalSessions
                }}</span>
              </td>

              <td class="px-4 py-4">
                <span class="text-sm text-[--ui-text]">{{ user.avgSessionTime }}m</span>
              </td>

              <td class="px-4 py-4">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-[--ui-text]">{{ user.conversionRate }}%</span>
                  <div
                    class="h-1 w-12 overflow-hidden rounded-full bg-[--ui-border]"
                  >
                    <div
                      class="h-full rounded-full bg-blue-500 transition-all"
                      :style="{
                        width: `${Math.min(user.conversionRate * 8, 100)}%`
                      }"
                    />
                  </div>
                </div>
              </td>

              <td class="px-4 py-4">
                <span class="text-muted text-sm">{{ user.lastActivity }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="border-default flex flex-col items-center justify-between space-y-4 border-t pt-4 lg:flex-row"
      >
        <div class="flex flex-col items-center gap-4 lg:flex-row">
          <span class="text-muted text-sm"> Showing 5 of 1,247 users </span>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <div class="h-2 w-2 rounded-full bg-green-500" />
              <span class="text-muted text-sm">Trending up</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="h-2 w-2 rounded-full bg-red-500" />
              <span class="text-muted text-sm">Trending down</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="h-2 w-2 rounded-full bg-gray-500" />
              <span class="text-muted text-sm">Stable</span>
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <UButton
            variant="ghost"
            trailing-icon="i-lucide-download"
            color="neutral"
          >
            Export
          </UButton>

          <UButton
            variant="ghost"
            trailing-icon="i-lucide-filter"
            color="neutral"
          >
            Filter
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>
