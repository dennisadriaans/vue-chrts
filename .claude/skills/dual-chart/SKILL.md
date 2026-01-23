---
name: dual-chart
description: Build DualChart components combining bars and lines. Use for showing relationships between two different metrics on the same visualization.
---

# DualChart

DualChart combines BarChart and LineChart in a single visualization, perfect for comparing two related but different metrics (e.g., revenue bars with profit margin line).

## Mental Model

```
┌─────────────────────────────────────────────────────────────┐
│  DUAL CHART = BARS + LINES                                  │
│                                                             │
│  profit (line)                                              │
│     ─●─────●─────●─────●                                    │
│       ╲   ╱ ╲         ╱                                     │
│        ●     ●───────●                                      │
│     ┌──┐  ┌──┐  ┌──┐  ┌──┐  ← revenue, costs (bars)        │
│     │  │  │  │  │  │  │  │                                  │
│     └──┘  └──┘  └──┘  └──┘                                  │
│      Q1    Q2    Q3    Q4                                   │
│                                                             │
│  Two separate category configs:                             │
│  • barCategories → which data keys become bars              │
│  • lineCategories → which data keys become lines            │
└─────────────────────────────────────────────────────────────┘
```

## Complete Example

```vue
<script setup lang="ts">
import { DualChart, CurveType, LegendPosition } from 'vue-chrts'

interface MonthlyData {
  month: string
  revenue: number
  costs: number
  profit: number
}

const data: MonthlyData[] = [
  { month: 'January', revenue: 45000, costs: 30000, profit: 15000 },
  { month: 'February', revenue: 52000, costs: 35000, profit: 17000 },
  { month: 'March', revenue: 48000, costs: 32000, profit: 16000 },
  { month: 'April', revenue: 61000, costs: 38000, profit: 23000 },
  { month: 'May', revenue: 55000, costs: 33000, profit: 22000 },
  { month: 'June', revenue: 67000, costs: 40000, profit: 27000 },
]

// Bars configuration
const barCategories = {
  revenue: { name: 'Revenue', color: '#3b82f6' },
  costs: { name: 'Costs', color: '#ef4444' }
}
const barYAxis: (keyof MonthlyData)[] = ['revenue', 'costs']

// Lines configuration
const lineCategories = {
  profit: { name: 'Profit Trend', color: '#10b981' }
}
const lineYAxis: (keyof MonthlyData)[] = ['profit']

const xFormatter = (tick: number) => data[tick].month.substring(0, 3)
const yFormatter = (tick: number) => `$${(tick / 1000).toFixed(0)}k`
</script>

<template>
  <DualChart
    :data="data"
    :barCategories="barCategories"
    :barYAxis="barYAxis"
    :lineCategories="lineCategories"
    :lineYAxis="lineYAxis"
    :height="350"
    :xFormatter="xFormatter"
    :yFormatter="yFormatter"
    :curveType="CurveType.MonotoneX"
    :legendPosition="LegendPosition.TopRight"
    xLabel="Month"
    yLabel="Amount ($)"
    :yGridLine="true"
    :lineWidth="3"
  />
</template>
```

## Key Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | required | Array of data objects |
| `barCategories` | `Record<string, BulletLegendItem>` | required | Bar series config |
| `barYAxis` | `(keyof T)[]` | required | Data keys for bars |
| `lineCategories` | `Record<string, BulletLegendItem>` | required | Line series config |
| `lineYAxis` | `(keyof T)[]` | required | Data keys for lines |
| `height` | `number` | required | Chart height in pixels |
| `curveType` | `CurveType` | `Linear` | Line interpolation style |
| `lineWidth` | `number` | `2` | Stroke width of lines |
| `xFormatter` | `(tick, i?, ticks?) => string` | - | X-axis label formatter |
| `yFormatter` | `(tick, i?, ticks?) => string` | - | Y-axis label formatter |
| `yLabelSecondary` | `string` | - | Secondary y-axis label |
| `xNumTicks` | `number` | auto | Desired x-axis tick count |
| `yNumTicks` | `number` | auto | Desired y-axis tick count |
| `xGridLine` | `boolean` | `false` | Show vertical grid lines |
| `yGridLine` | `boolean` | `false` | Show horizontal grid lines |
| `hideLegend` | `boolean` | `false` | Hide the legend |
| `hideTooltip` | `boolean` | `false` | Hide tooltips |

## Common Patterns

### Sales vs Target

```vue
<script setup>
const data = [
  { period: 'Week 1', actual: 12500, target: 10000 },
  { period: 'Week 2', actual: 14200, target: 12000 },
  { period: 'Week 3', actual: 11800, target: 13000 },
  { period: 'Week 4', actual: 15600, target: 14000 },
]

const barCategories = {
  actual: { name: 'Actual Sales', color: '#3b82f6' }
}

const lineCategories = {
  target: { name: 'Target', color: '#f59e0b' }
}
</script>

<template>
  <DualChart
    :data="data"
    :barCategories="barCategories"
    :barYAxis="['actual']"
    :lineCategories="lineCategories"
    :lineYAxis="['target']"
    :height="300"
    :xFormatter="(i) => data[i].period"
  />
</template>
```

### Temperature with Precipitation

```vue
<script setup>
const weatherData = [
  { day: 'Mon', temp: 22, rain: 5 },
  { day: 'Tue', temp: 25, rain: 0 },
  { day: 'Wed', temp: 19, rain: 12 },
  { day: 'Thu', temp: 21, rain: 8 },
  { day: 'Fri', temp: 28, rain: 0 },
]

// Bars for rain
const barCategories = {
  rain: { name: 'Rainfall (mm)', color: '#3b82f6' }
}

// Line for temperature
const lineCategories = {
  temp: { name: 'Temperature (°C)', color: '#ef4444' }
}
</script>

<template>
  <DualChart
    :data="weatherData"
    :barCategories="barCategories"
    :barYAxis="['rain']"
    :lineCategories="lineCategories"
    :lineYAxis="['temp']"
    :height="300"
    :xFormatter="(i) => weatherData[i].day"
    :yFormatter="(tick) => `${tick}`"
  />
</template>
```

## Gotchas

1. **Need FOUR category configs**: barCategories + barYAxis + lineCategories + lineYAxis
2. **Keys must match across configs**: barYAxis keys must exist in barCategories
3. **Different scales?**: Both use the same y-axis scale by default. Consider if your data ranges differ significantly.
4. **Legend combines both**: Bar and line categories appear together in legend
