---
name: donut-chart
description: Build DonutChart components. Use for part-to-whole relationships and percentage breakdowns.
---

# DonutChart

DonutCharts show proportional data as segments of a circle. Supports full donut and half-donut (gauge) styles.

## Mental Model

```
┌─────────────────────────────────────────────────────────────┐
│  DONUT DATA IS DIFFERENT!                                   │
│                                                             │
│  Other Charts:              DonutChart:                     │
│  data = [                   data = [30, 70, 100]  ← numbers │
│    { label, value },        categories = {                  │
│    { label, value }           a: { name, color },           │
│  ]                            b: { name, color },           │
│                               c: { name, color }            │
│                             }                               │
│                                                             │
│  Categories keys match data index order (a=30, b=70, c=100) │
└─────────────────────────────────────────────────────────────┘
```

## Complete Example

```vue
<script setup lang="ts">
import { DonutChart, DonutType, LegendPosition } from 'vue-chrts'

// Data is just an array of numbers!
const data = [35, 25, 20, 15, 5]

// Categories map to data indices in order
const categories = {
  organic: { name: 'Organic Search', color: '#3b82f6' },
  direct: { name: 'Direct', color: '#10b981' },
  referral: { name: 'Referral', color: '#f59e0b' },
  social: { name: 'Social', color: '#8b5cf6' },
  other: { name: 'Other', color: '#6b7280' }
}
</script>

<template>
  <DonutChart
    :data="data"
    :categories="categories"
    :radius="120"
    :arcWidth="40"
    :legendPosition="LegendPosition.BottomCenter"
    :padAngle="0.02"
  />
</template>
```

## Half Donut (Gauge Style)

```vue
<DonutChart
  :data="[75, 25]"
  :categories="{
    complete: { name: 'Complete', color: '#10b981' },
    remaining: { name: 'Remaining', color: '#e5e7eb' }
  }"
  :radius="100"
  :arcWidth="30"
  :type="DonutType.Half"
/>
```

## Key Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `number[]` | required | **Array of numeric values** |
| `categories` | `Record<string, BulletLegendItem>` | required | Labels/colors for each segment |
| `radius` | `number` | required | Outer radius in pixels |
| `arcWidth` | `number` | - | Width of the donut ring |
| `height` | `number` | - | Container height (optional) |
| `type` | `DonutType` | `Full` | `Full` or `Half` donut |
| `padAngle` | `number` | `0` | Gap between segments (radians) |
| `hideLegend` | `boolean` | `false` | Hide the legend |
| `hideTooltip` | `boolean` | `false` | Hide tooltips |
| `legendPosition` | `LegendPosition` | - | Legend placement |
| `legendStyle` | `string \| Record<string, string>` | - | Custom legend styles |
| `tooltipTitleFormatter` | `(data: T) => string` | - | Custom tooltip title |
| `duration` | `number` | - | Animation duration in ms |

## Sizing Guide

```
┌─────────────────────────────────────────────────────────────┐
│  DONUT SIZING                                               │
│                                                             │
│  radius = outer edge distance from center                   │
│  arcWidth = thickness of the donut ring                     │
│                                                             │
│        ┌───────────┐                                        │
│       ╱             ╲       radius = 100                    │
│      │   ┌─────┐     │      arcWidth = 30                   │
│      │   │     │     │                                      │
│      │   │ 70px│     │      inner radius = 100 - 30 = 70    │
│      │   │     │     │                                      │
│      │   └─────┘     │                                      │
│       ╲             ╱                                       │
│        └───────────┘                                        │
│            100px                                            │
└─────────────────────────────────────────────────────────────┘
```

## Common Patterns

### Progress Indicator

```vue
<script setup>
const progress = 73
const data = [progress, 100 - progress]

const categories = {
  complete: { name: `${progress}% Complete`, color: '#10b981' },
  remaining: { name: 'Remaining', color: '#e5e7eb' }
}
</script>

<template>
  <DonutChart
    :data="data"
    :categories="categories"
    :radius="80"
    :arcWidth="16"
    :type="DonutType.Half"
    :hideLegend="true"
  />
</template>
```

### Budget Breakdown

```vue
<script setup>
const budgetData = [
  { category: 'Housing', amount: 2000, color: '#3b82f6' },
  { category: 'Food', amount: 600, color: '#10b981' },
  { category: 'Transport', amount: 400, color: '#f59e0b' },
  { category: 'Utilities', amount: 300, color: '#8b5cf6' },
  { category: 'Other', amount: 700, color: '#6b7280' },
]

// Transform to DonutChart format
const data = budgetData.map(item => item.amount)
const categories = Object.fromEntries(
  budgetData.map((item, index) => [
    `cat${index}`,
    { name: item.category, color: item.color }
  ])
)
</script>

<template>
  <DonutChart
    :data="data"
    :categories="categories"
    :radius="120"
    :arcWidth="50"
    :legendPosition="LegendPosition.BottomCenter"
  />
</template>
```

## Gotchas

1. **Data must be numbers array**: Unlike other charts, DonutChart takes `number[]` not `object[]`
2. **Categories order matters**: First category = first number in data array
3. **Category count must match**: Number of categories must equal data array length
4. **No xFormatter/yFormatter**: Donut charts don't have axes
5. **Height is optional**: Chart sizes based on radius; height just sets container
