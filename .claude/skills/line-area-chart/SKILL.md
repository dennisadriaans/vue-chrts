---
name: line-area-chart
description: Build LineChart and AreaChart components. Use for time series, trends, and continuous data visualization.
---

# LineChart & AreaChart

LineChart and AreaChart share the same API. LineChart is essentially AreaChart with `hideArea: true`.

## Data Structure Pattern

```
┌──────────────────────────────────────────────────────────┐
│  DATA FLOW                                               │
│                                                          │
│  Raw Data Array          Categories Config               │
│  ┌─────────────┐        ┌──────────────────┐            │
│  │ { x, y1, y2 }│   +   │ y1: {name, color}│  →  Chart  │
│  │ { x, y1, y2 }│       │ y2: {name, color}│            │
│  │ ...         │        └──────────────────┘            │
│  └─────────────┘                                        │
└──────────────────────────────────────────────────────────┘
```

## Complete Example

```vue
<script setup lang="ts">
import { LineChart, CurveType, LegendPosition } from 'vue-chrts'

interface DataItem {
  date: string
  desktop: number
  mobile: number
}

const data: DataItem[] = [
  { date: '2024-01-01', desktop: 186, mobile: 120 },
  { date: '2024-01-02', desktop: 305, mobile: 250 },
  { date: '2024-01-03', desktop: 237, mobile: 180 },
  { date: '2024-01-04', desktop: 273, mobile: 220 },
  { date: '2024-01-05', desktop: 209, mobile: 170 },
]

const categories = {
  desktop: { name: 'Desktop', color: '#3b82f6' },
  mobile: { name: 'Mobile', color: '#10b981' }
}

const xFormatter = (tick: number) => {
  const item = data[tick]
  return new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const yFormatter = (tick: number) => `${tick.toLocaleString()}`
</script>

<template>
  <LineChart
    :data="data"
    :categories="categories"
    :height="300"
    :xFormatter="xFormatter"
    :yFormatter="yFormatter"
    :curveType="CurveType.MonotoneX"
    :legendPosition="LegendPosition.TopRight"
    xLabel="Date"
    yLabel="Visitors"
    :xNumTicks="5"
    :yNumTicks="4"
    :yGridLine="true"
  />
</template>
```

## AreaChart Specific Features

```vue
<!-- Stacked area chart -->
<AreaChart
  :data="data"
  :categories="categories"
  :height="300"
  :stacked="true"
  :xFormatter="xFormatter"
/>

<!-- Custom gradient stops -->
<AreaChart
  :data="data"
  :categories="categories"
  :height="300"
  :gradientStops="[
    { offset: '0%', stopOpacity: 0.4 },
    { offset: '100%', stopOpacity: 0.05 }
  ]"
/>

<!-- Hide area (becomes LineChart) -->
<AreaChart
  :data="data"
  :categories="categories"
  :height="300"
  :hideArea="true"
/>
```

## Key Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | required | Array of data objects |
| `categories` | `Record<string, BulletLegendItem>` | required | Map of data keys to display config |
| `height` | `number` | required | Chart height in pixels |
| `curveType` | `CurveType` | `Linear` | Line interpolation style |
| `lineWidth` | `number` | `2` | Stroke width of lines |
| `lineDashArray` | `number[][]` | `undefined` | Dashed line patterns per series |
| `stacked` | `boolean` | `false` | Stack areas on top of each other |
| `hideArea` | `boolean` | `false` | Show only lines (AreaChart only) |
| `gradientStops` | `Array<{offset, stopOpacity}>` | default gradient | Custom fill gradient |
| `xFormatter` | `(tick, i?, ticks?) => string` | - | X-axis label formatter |
| `yFormatter` | `(tick, i?, ticks?) => string` | - | Y-axis label formatter |
| `tooltipTitleFormatter` | `(data: T) => string` | - | Custom tooltip title |
| `xNumTicks` | `number` | auto | Desired x-axis tick count |
| `yNumTicks` | `number` | auto | Desired y-axis tick count |
| `minMaxTicksOnly` | `boolean` | `false` | Show only first/last x ticks |
| `xGridLine` | `boolean` | `false` | Show vertical grid lines |
| `yGridLine` | `boolean` | `false` | Show horizontal grid lines |
| `xDomainLine` | `boolean` | `true` | Show x-axis line |
| `yDomainLine` | `boolean` | `true` | Show y-axis line |
| `hideLegend` | `boolean` | `false` | Hide the legend |
| `hideTooltip` | `boolean` | `false` | Hide tooltips |
| `legendPosition` | `LegendPosition` | `TopRight` | Legend placement |

## Curve Types Cheat Sheet

```
Linear ────────    MonotoneX ∿∿∿∿∿    Step ┌─┐┌─┐
  Best for:         Best for:           Best for:
  Discrete data     Smooth trends       Discrete states
  
Natural ~~~~~      Basis ∼∼∼∼∼        Cardinal ≈≈≈≈
  Best for:         Best for:           Best for:
  Flowing curves    Extra smooth        Balanced curves
```

## Common Gotchas

1. **X-axis shows numbers instead of labels**: You forgot `xFormatter`
2. **Only one series shows**: Categories keys must match data object keys exactly
3. **Tooltip shows wrong info**: Use `tooltipTitleFormatter` for custom display
4. **Lines look jagged**: Try `CurveType.MonotoneX` instead of `Linear`
