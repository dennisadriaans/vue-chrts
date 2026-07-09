<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui'
import type { AppConfigInput } from 'nuxt/schema'

defineOptions({
  tags: ['donutcharts', 'withradiusandspacing']
})

const colorMode = useColorMode()

colorMode.preference = 'dark'

const newAppConfig: AppConfigInput = {
  theme: {
    radius: 0.25,
    blackAsPrimary: false
  },
  ui: {
    colors: {
      primary: 'emerald',
      neutral: 'zinc'
    },

    tabs: {
      compoundVariants: [
        {
          color: 'neutral',
          variant: 'pill',
          class: {
            indicator: 'bg-default dark:bg-muted',
            list: 'dark:bg-default',
            trigger: 'data-[state=active]:text-default'
          }
        }
      ]
    }
  }
}

updateAppConfig(newAppConfig)

const props = defineProps<{
  hideText?: boolean
}>()

const items = ref<TabsItem[]>([
  {
    label: 'Year'
  },
  {
    label: 'Month'
  },
  {
    label: 'Week'
  },
  {
    label: 'Day'
  }
])

const win = ref(32)
const loss = ref(18)

const winLossData = computed(() => [
  {
    color: '#10b981',
    name: 'Winning',
    value: win.value
  },
  {
    color: '#ef4444',
    name: 'Lost',
    value: loss.value
  }
])

const percentage = computed(() => {
  const total = win.value + loss.value
  if (total === 0) return '0%'
  return Math.round((win.value / total) * 100)
})

const categories = computed(() =>
  Object.fromEntries(
    winLossData.value.map(item => [
      item.name,
      {
        name: item.name,
        color: item.color,
        percentage: item.value
      }
    ])
  )
)
</script>

<template>
  <div class="mx-auto max-w-lg py-8">
    <UCard class="!bg-default">
      <div class="space-y-8">
        <div class="flex justify-between">
          <h2 class="text-highlighted text-xl font-semibold">
            Win ratio
          </h2>
          <div class="flex items-center gap-2">
            <UButton
              variant="link"
              color="neutral"
            >
              <template #leading>
                <UIcon
                  name="i-lucide-info"
                  size="18"
                />
              </template>
            </UButton>
            <UButton
              variant="link"
              color="neutral"
            >
              <template #trailing>
                <UIcon
                  name="i-lucide-settings"
                  size="18"
                />
              </template>
            </UButton>
            <UButton
              variant="link"
              color="neutral"
            >
              <template #trailing>
                <UIcon
                  name="i-lucide-trash-2"
                  size="18"
                />
              </template>
            </UButton>
          </div>
        </div>

        <div class="space-y-8">
          <div class="flex gap-8 space-y-4">
            <div class="relative w-46">
              <DonutChart
                :data="winLossData.map((i) => i.value)"
                :height="160"
                :arc-width="10"
                :categories="categories"
                :pad-angle="0.1"
                :hide-legend="true"
                :radius="4"
              >
                <div class="text-2xl font-bold">
                  {{ percentage }}<span class="text-toned">%</span>
                </div>
              </DonutChart>
            </div>
            <div class="ml-6 flex h-40 w-30 flex-col justify-between">
              <div class="flex h-1/2 flex-col space-y-2">
                <div class="text-toned dark:text-muted">
                  Winning trades
                </div>
                <div class="text-3xl font-bold">
                  {{ winLossData[0]?.value ?? 0 }}
                </div>
              </div>
              <div class="flex h-1/2 flex-col space-y-2">
                <div class="text-toned dark:text-muted">
                  Losing trades
                </div>
                <div class="text-3xl font-bold">
                  {{ winLossData[1]?.value ?? 0 }}
                </div>
              </div>
            </div>
          </div>

          <UTabs
            :content="false"
            :items="items"
            class="w-full"
            size="sm"
          />

          <p
            v-if="!props.hideText"
            class="text-muted px-16 text-center"
          >
            Your win % is higher on
            <span class="text-primary">8%</span> compared to
            <span class="text-primary">47 winning</span> /
            <span>33 losing</span> past month
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>
