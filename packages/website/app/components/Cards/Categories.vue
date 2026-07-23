<script setup lang="ts">
import type { ExpenseCategory } from '../Blocks/Cards.vue'

const props = defineProps({
  categories: Array as PropType<ExpenseCategory[]>,
  legendPosition: {
    type: String,
    default: 'bottomLeft',
    validator: value =>
      ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].includes(value)
  }
})

const channelPercentages = ref({
  organic: 78,
  referral: 15,
  direct: 7
})

const getLegendClass = computed(() => {
  switch (props.legendPosition) {
    case 'topLeft':
      return 'justify-start'
    case 'topRight':
      return 'justify-end'
    case 'bottomRight':
      return 'justify-end'
    default:
      return 'justify-start'
  }
})
</script>

<template>
  <UCard
    v-for="i in 3"
    class="!bg-default"
  >
    <div class="space-y-4">
      <div class="flex items-baseline gap-2">
        <span class="text-default text-2xl font-bold">78%</span>
        <span class="text-error text-sm">-0.4%</span>
      </div>

      <div class="mb-4 flex h-2 w-full overflow-hidden rounded-full">
        <div
          :style="{ width: `${channelPercentages.organic}%` }"
          class="bg-primary"
        />
        <div
          :style="{ width: `${channelPercentages.referral}%` }"
          class="bg-info"
        />
        <div
          :style="{ width: `${channelPercentages.direct}%` }"
          class="bg-warning"
        />
      </div>

      <div
        :class="getLegendClass"
        class="text-muted flex gap-4 text-sm"
      >
        <div
          v-for="(category, categoryIndex) in props.categories"
          :key="categoryIndex"
          class="flex items-center gap-1.5"
        >
          <span
            class="h-2 w-2 rounded-full"
            :style="{ backgroundColor: category.color }"
          />
          <span class="whitespace-nowrap">
            {{ category.name.split(' ')[0] }}
          </span>
        </div>
      </div>
    </div>
  </UCard>
</template>
