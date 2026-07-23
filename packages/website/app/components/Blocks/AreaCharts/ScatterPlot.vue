<script lang="ts" setup>
import { data as bubbleChartData } from '~/data/BubbleChartData'

defineOptions({
  tags: ['areacharts', 'scatterplot']
})

// export const exampleData = [
//   {
//     id: "ENG-101",
//     title: "Fix login bug",
//     createdAt: 10,
//     timeToTriage: 2,
//     priority: 3,
//     comments: 5,
//   },
// ]

const categories1 = {
  title: { name: 'title', color: '#f00' }
}

const categories2 = {
  Inbox: { name: 'Inbox', color: '#2196f3' },
  Work: { name: 'Work', color: '#f44336' },
  Personal: { name: 'Personal', color: '#ff9800' },
  Shopping: { name: 'Shopping', color: '#e91e63' },
  Completed: { name: 'Completed', color: '#4caf50' }
}

function formatNumber(tick: number | Date): string {
  return typeof tick === 'number' ? tick.toLocaleString() : String(tick)
}

const xAccessor1 = (d: any) => d.createdAt
const yAccessor1 = (d: any) => d.timeToTriage
const sizeAccessor1 = (d: any) => d.comments
</script>

<template>
  <div class="space-y-4 pt-8 pb-24">
    <div class="mx-auto max-w-7xl space-y-8">
      <Card>
        <div>
          <h2 class="heading-2 mb-0 text-xl">
            Linear Tasks: Time to Triage
          </h2>
          <p class="text-sm text-neutral-400">
            Bubble charts visualize three dimensions of data: X, Y, and bubble
            size.
          </p>
        </div>
        <div class="mt-4">
          <BubbleChart
            :data="bubbleChartData"
            :height="400"
            :categories="categories1"
            category-key="title"
            :x-accessor="xAccessor1"
            :y-accessor="yAccessor1"
            :y-grid-line="false"
            :hide-y-axis="true"
            :size-accessor="sizeAccessor1"
            :legend-position="LegendPosition.BottomRight"
            :x-formatter="(v: number | Date) => `Week: ${v}`"
            :y-formatter="formatNumber"
          />
        </div>
      </Card>
      <Card>
        <div>
          <h2 class="heading-2 mb-0 text-xl">
            Priority vs Value (Platform Categories)
          </h2>
          <p class="text-sm text-neutral-400">
            Explicit color mapping for each platform category.
          </p>
        </div>
        <div class="mt-4">
          <BubbleChart
            :data="bubbleChartData2"
            :height="400"
            :categories="categories2"
            category-key="platform"
            :x-accessor="xAccessor2"
            :y-accessor="yAccessor2"
            :size-accessor="sizeAccessor2"
            :legend-position="LegendPosition.TopRight"
            :y-formatter="formatNumber"
            x-label="Value"
            y-label="Priority"
          />
        </div>
      </Card>
    </div>
  </div>
</template>
