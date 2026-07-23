<script setup lang="ts">
defineOptions({
  tags: ['barlists', 'conversionfunnel']
})

interface FunnelStage {
  id: string
  name: string
  users: number
  conversionRate?: number
  dropOffRate?: number
  color: string
}

const stages = ref<FunnelStage[]>([
  {
    id: 'visitors',
    name: 'Website Visitors',
    users: 10000,
    color: 'bg-primary'
  },
  {
    id: 'signup',
    name: 'Sign Up',
    users: 4250,
    color: 'bg-primary'
  },
  {
    id: 'verify',
    name: 'Email Verification',
    users: 3615,
    color: 'bg-primary'
  },
  {
    id: 'profile',
    name: 'Complete Profile',
    users: 2710,
    color: 'bg-primary'
  },
  {
    id: 'action',
    name: 'First Action',
    users: 2167,
    color: 'bg-primary'
  },
  {
    id: 'converted',
    name: 'Converted Users',
    users: 1840,
    color: 'bg-primary'
  },
  // Additional funnel stages
  {
    id: 'trial_started',
    name: 'Trial Started',
    users: 1200,
    color: 'bg-primary'
  },
  {
    id: 'trial_completed',
    name: 'Trial Completed',
    users: 900,
    color: 'bg-primary'
  },
  {
    id: 'paid_subscription',
    name: 'Paid Subscription',
    users: 650,
    color: 'bg-primary'
  }
])

const selectedTimeframe = ref('Last 30 days')
const timeframes = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last year']

// Calculate conversion and drop-off rates
const enrichedStages = computed(() => {
  return stages.value.map((stage, index) => {
    const prevStage = stages.value[index - 1]
    const conversionRate = prevStage
      ? Math.round((stage.users / prevStage.users) * 100)
      : 100
    const dropOffRate = prevStage
      ? Math.round(((prevStage.users - stage.users) / prevStage.users) * 100)
      : 0

    return {
      ...stage,
      conversionRate,
      dropOffRate
    }
  })
})

const biggestDropOff = computed(() => {
  return enrichedStages.value.reduce((max, stage) =>
    (stage.dropOffRate || 0) > (max.dropOffRate || 0) ? stage : max
  )
})

const getFunnelWidth = (users: number) => {
  const maxUsers = stages.value[0]?.users || 1
  return Math.max((users / maxUsers) * 100, 10) // Minimum 10% width
}
</script>

<template>
  <UCard class="!bg-default mx-auto my-8 max-w-2xl">
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold">
            Conversion Funnel
          </h3>
          <p class="text-muted text-sm">
            User journey from initial visit to conversion
          </p>
        </div>
        <div class="flex items-center gap-4">
          <USelect
            v-model="selectedTimeframe"
            :items="timeframes"
            color="neutral"
            variant="outline"
          />
        </div>
      </div>
    </template>

    <div class="space-y-6">
      <div class="relative space-y-2">
        <div
          v-for="(stage, index) in enrichedStages"
          :key="stage.id"
          class="group relative"
        >
          <div class="relative flex items-center gap-6">
            <div
              :class="stage.color"
              :style="{ width: `${getFunnelWidth(stage.users)}%` }"
              class="relative h-8 truncate transition-all duration-200 group-hover:border-(--ui-primary)"
            >
              <div
                class="absolute inset-0 flex items-center justify-between px-4 text-(--ui-text-inverted)"
              >
                <span class="text-sm font-medium">{{ stage.name }}</span>
                <span class="text-sm font-semibold">{{
                  stage.users.toLocaleString()
                }}</span>
              </div>
            </div>

            <div
              v-if="index > 0"
              class="flex min-w-[60px] items-center gap-1 text-right"
            >
              <div class="text-sm font-medium">
                {{ stage.conversionRate }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="text-muted flex items-center justify-between text-sm">
        <div class="flex items-center gap-4">
          <span>{{ selectedTimeframe }}</span>
        </div>
        <div class="flex gap-2">
          <UButton
            variant="outline"
            trailing-icon="i-lucide-external-link"
            color="neutral"
          >
            View Details
          </UButton>
        </div>
      </div>
    </template>
  </UCard>
</template>
