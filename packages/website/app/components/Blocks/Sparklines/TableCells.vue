<script lang="ts" setup>
import Sparkline from '~/components/lib/Sparkline/Sparkline.vue'

defineOptions({
  tags: ['blocks', 'sparklines', 'table-cells']
})

const products = [
  { name: 'Starter', mrr: '$8.2k', trend: [10, 12, 11, 14, 13, 16, 15, 18], up: true },
  { name: 'Pro', mrr: '$24.6k', trend: [20, 18, 22, 21, 25, 24, 28, 31], up: true },
  { name: 'Team', mrr: '$18.1k', trend: [30, 28, 26, 27, 24, 22, 23, 20], up: false },
  { name: 'Enterprise', mrr: '$52.9k', trend: [40, 44, 42, 48, 46, 52, 50, 58], up: true }
]
</script>

<template>
  <UCard class="w-full">
    <table class="w-full text-sm">
      <thead>
        <tr class="text-muted text-left">
          <th class="pb-3 font-medium">
            Plan
          </th>
          <th class="pb-3 font-medium">
            MRR
          </th>
          <th class="pb-3 text-right font-medium">
            Last 8 weeks
          </th>
        </tr>
      </thead>
      <tbody class="divide-default divide-y">
        <tr
          v-for="p in products"
          :key="p.name"
        >
          <td class="text-highlighted py-3 font-medium">
            {{ p.name }}
          </td>
          <td class="text-default py-3 tabular-nums">
            {{ p.mrr }}
          </td>
          <td class="py-3">
            <div class="flex justify-end">
              <Sparkline
                :data="p.trend"
                type="line"
                :color="p.up ? 'var(--ui-success)' : 'var(--ui-error)'"
                :width="110"
                :height="28"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </UCard>
</template>
