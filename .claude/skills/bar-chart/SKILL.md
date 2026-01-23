---
name: bar-chart
description: Build BarChart components. Use for categorical comparisons, grouped bars, and stacked bars.
---

# BarChart

BarCharts are ideal for comparing discrete categories. Supports grouped, stacked, horizontal, and vertical orientations.

## Mental Model

```
┌─────────────────────────────────────────────────────────────┐
│  GROUPED vs STACKED                                         │
│                                                             │
│  Grouped (default)           Stacked                        │
│  ┌──┐ ┌──┐                  ┌──┐                           │
│  │A │ │B │                  │B │                           │
│  │  │ │  │  ┌──┐ ┌──┐       ├──┤  ┌──┐                     │
│  │  │ │  │  │A │ │B │       │A │  │B │                     │
│  └──┴─┴──┘  └──┴─┴──┘       └──┘  ├──┤                     │
│   Jan        Feb             Jan  │A │                     │
│                                   └──┘                     │
│                                   Feb                       │
└─────────────────────────────────────────────────────────────┘
```

## Complete Example

```vue
<script setup lang="ts">
import { BarChart, Orientation, LegendPosition } from 'vue-chrts'

interface SalesData {
  quarter: string
  revenue: number
  costs: number
}

const data: SalesData[] = [
  { quarter: 'Q1', revenue: 45000, costs: 30000 },
  { quarter: 'Q2', revenue: 52000, costs: 35000 },
  { quarter: 'Q3', revenue: 48000, costs: 32000 },
  { quarter: 'Q4', revenue: 61000, costs: 38000 },
]

const categories = {
  revenue: { name: 'Revenue', color: '#3b82f6' },
  costs: { name: 'Costs', color: '#ef4444' }
}

// IMPORTANT: yAxis specifies which data keys to display as bars
const yAxis: (keyof SalesData)[] = ['revenue', 'costs']

const xFormatter = (tick: number) => data[tick].quarter
const yFormatter = (tick: number) => `$${(tick / 1000).toFixed(0)}k`
</script>

<template>
  <BarChart
    :data="data"
    :categories="categories"
    :yAxis="yAxis"
    :height="300"
    :xFormatter="xFormatter"
    :yFormatter="yFormatter"
    :legendPosition="LegendPosition.TopRight"
    xLabel="Quarter"
    yLabel="Amount ($)"
    :yGridLine="true"
    :radius="4"
    :barPadding="0.1"
    :groupPadding="16"
  />
</template>
```

## Stacked Bar Chart

```vue
<BarChart
  :data="data"
  :categories="categories"
  :yAxis="yAxis"
  :height="300"
  :stacked="true"
  :xFormatter="xFormatter"
/>
```

## Horizontal Bar Chart

```vue
<BarChart
  :data="data"
  :categories="categories"
  :yAxis="yAxis"
  :height="400"
  :orientation="Orientation.Horizontal"
  :xFormatter="xFormatter"
/>
```

## Key Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | required | Array of data objects |
| `categories` | `Record<string, BulletLegendItem>` | required | Map of data keys to display config |
| `yAxis` | `(keyof T)[]` | required | **Keys from data to plot as bars** |
| `height` | `number` | required | Chart height in pixels |
| `stacked` | `boolean` | `false` | Stack bars instead of grouping |
| `orientation` | `Orientation` | `Vertical` | Bar direction |
| `radius` | `number` | `2` | Corner radius of bars |
| `barPadding` | `number` | `0` | Fractional padding between bars [0,1) |
| `groupPadding` | `number` | - | Padding between bar groups in pixels |
| `xFormatter` | `(tick, i?, ticks?) => string` | - | X-axis label formatter |
| `yFormatter` | `(tick, i?, ticks?) => string` | - | Y-axis label formatter |
| `tooltipTitleFormatter` | `(data: T) => string` | - | Custom tooltip title |
| `xNumTicks` | `number` | auto | Desired x-axis tick count |
| `yNumTicks` | `number` | auto | Desired y-axis tick count |
| `xGridLine` | `boolean` | `false` | Show vertical grid lines |
| `yGridLine` | `boolean` | `false` | Show horizontal grid lines |
| `hideLegend` | `boolean` | `false` | Hide the legend |
| `hideTooltip` | `boolean` | `false` | Hide tooltips |

## Critical Difference from Line/Area Charts

```typescript
// Line/Area: categories keys define what to plot
const categories = { value1: {...}, value2: {...} }

// Bar: yAxis ALSO needed to specify which keys to plot
const yAxis = ['value1', 'value2']  // <-- Required for BarChart!
```

## Common Patterns

### Single Series Bar Chart

```vue
<script setup>
const data = [
  { name: 'Product A', sales: 120 },
  { name: 'Product B', sales: 98 },
  { name: 'Product C', sales: 156 },
]

const categories = {
  sales: { name: 'Sales', color: '#3b82f6' }
}
</script>

<template>
  <BarChart
    :data="data"
    :categories="categories"
    :yAxis="['sales']"
    :height="200"
    :xFormatter="(i) => data[i].name"
    :hideLegend="true"
  />
</template>
```

### Comparison Chart (Side by Side)

```vue
<template>
  <BarChart
    :data="yearlyData"
    :categories="{
      thisYear: { name: '2024', color: '#3b82f6' },
      lastYear: { name: '2023', color: '#94a3b8' }
    }"
    :yAxis="['thisYear', 'lastYear']"
    :height="300"
    :xFormatter="(i) => yearlyData[i].month"
    :groupPadding="20"
  />
</template>
```

## Gotchas

1. **No bars showing**: You forgot the `yAxis` prop or its values don't match category keys
2. **Bars too thin/thick**: Adjust `barPadding` (0-1) and `groupPadding` (pixels)
3. **Horizontal labels cut off**: Increase chart height or use `padding` prop
4. **Stacked bars wrong order**: Categories are rendered in the order they appear in the object
