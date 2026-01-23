---
name: bubble-chart
description: Build BubbleChart components. Use for scatter plots with size encoding, showing relationships between three variables.
---

# BubbleChart

BubbleChart displays data points as circles where position (x, y) and size encode three different variables. Great for showing relationships and clusters.

## Mental Model

```
┌─────────────────────────────────────────────────────────────┐
│  THREE DIMENSIONS OF DATA                                   │
│                                                             │
│  Y-Axis                                                     │
│    ▲       ◯ large                                         │
│    │    ●       (size = third variable)                    │
│    │         ◉                                             │
│    │  ●              ◯                                     │
│    │       ◉                                               │
│    │  small ●                                              │
│    └──────────────────────► X-Axis                         │
│                                                             │
│  • xAccessor: horizontal position                          │
│  • yAccessor: vertical position                            │
│  • sizeAccessor: bubble size                               │
│  • categoryKey: bubble color                               │
└─────────────────────────────────────────────────────────────┘
```

## Complete Example

```vue
<script setup lang="ts">
import { BubbleChart, LegendPosition } from 'vue-chrts'

interface CompanyData {
  name: string
  revenue: number      // x-axis
  growth: number       // y-axis
  employees: number    // bubble size
  sector: string       // color category
}

const data: CompanyData[] = [
  { name: 'TechCorp', revenue: 500, growth: 25, employees: 1200, sector: 'tech' },
  { name: 'FinanceInc', revenue: 800, growth: 12, employees: 3500, sector: 'finance' },
  { name: 'HealthPlus', revenue: 300, growth: 35, employees: 800, sector: 'health' },
  { name: 'RetailMax', revenue: 1200, growth: 8, employees: 5000, sector: 'retail' },
  { name: 'GreenEnergy', revenue: 200, growth: 45, employees: 400, sector: 'tech' },
  { name: 'BankFirst', revenue: 950, growth: 6, employees: 4200, sector: 'finance' },
]

// Categories define colors for each unique sector value
const categories = {
  tech: { name: 'Technology', color: '#3b82f6' },
  finance: { name: 'Finance', color: '#10b981' },
  health: { name: 'Healthcare', color: '#f59e0b' },
  retail: { name: 'Retail', color: '#8b5cf6' }
}

const xFormatter = (tick: number) => `$${tick}M`
const yFormatter = (tick: number) => `${tick}%`
</script>

<template>
  <BubbleChart
    :data="data"
    :categories="categories"
    categoryKey="sector"
    :xAccessor="(d) => d.revenue"
    :yAccessor="(d) => d.growth"
    :sizeAccessor="(d) => d.employees"
    :sizeRange="[10, 50]"
    :height="400"
    :xFormatter="xFormatter"
    :yFormatter="yFormatter"
    xLabel="Revenue (Millions)"
    yLabel="Growth Rate (%)"
    :legendPosition="LegendPosition.TopRight"
    :opacity="0.7"
  />
</template>
```

## Key Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | required | Array of data objects |
| `categories` | `Record<string, BulletLegendItem>` | required | Color mapping for categoryKey values |
| `categoryKey` | `keyof T` | required | Data key for bubble coloring |
| `xAccessor` | `(d: T) => number` | - | Function to get x-position |
| `yAccessor` | `(d: T) => number` | - | Function to get y-position |
| `sizeAccessor` | `(d: T) => number` | - | Function to get bubble size |
| `sizeRange` | `[number, number]` | `[1, 20]` | Min/max bubble radius in pixels |
| `opacity` | `number` | - | Bubble opacity (0-1) |
| `height` | `number` | required | Chart height in pixels |
| `xFormatter` | `(tick, i?, ticks?) => string` | - | X-axis label formatter |
| `yFormatter` | `(tick, i?, ticks?) => string` | - | Y-axis label formatter |
| `labelPosition` | `Position` | `Bottom` | Position of bubble labels |
| `xLabel` | `string` | - | X-axis title |
| `yLabel` | `string` | - | Y-axis title |
| `hideLegend` | `boolean` | `false` | Hide the legend |
| `hideTooltip` | `boolean` | `false` | Hide tooltips |
| `xGridLine` | `boolean` | `false` | Show vertical grid lines |
| `yGridLine` | `boolean` | `false` | Show horizontal grid lines |

## Common Patterns

### Simple Scatter Plot (No Size Variation)

```vue
<BubbleChart
  :data="data"
  :categories="categories"
  categoryKey="type"
  :xAccessor="(d) => d.x"
  :yAccessor="(d) => d.y"
  :sizeRange="[8, 8]"
  :height="300"
/>
```

### Performance Matrix

```vue
<script setup>
const teamData = [
  { team: 'Alpha', velocity: 45, quality: 92, size: 8, status: 'active' },
  { team: 'Beta', velocity: 38, quality: 88, size: 12, status: 'active' },
  { team: 'Gamma', velocity: 52, quality: 78, size: 6, status: 'new' },
]

const categories = {
  active: { name: 'Active Teams', color: '#10b981' },
  new: { name: 'New Teams', color: '#f59e0b' }
}
</script>

<template>
  <BubbleChart
    :data="teamData"
    :categories="categories"
    categoryKey="status"
    :xAccessor="(d) => d.velocity"
    :yAccessor="(d) => d.quality"
    :sizeAccessor="(d) => d.size"
    :sizeRange="[15, 45]"
    :height="350"
    xLabel="Velocity (story points/sprint)"
    yLabel="Quality Score (%)"
    :xGridLine="true"
    :yGridLine="true"
  />
</template>
```

## Accessors Explained

```typescript
// Accessors are functions that extract values from each data item

const data = [
  { name: 'A', sales: 100, profit: 20, marketShare: 15 }
]

// Each accessor takes a data item and returns a number
const xAccessor = (d) => d.sales       // position on x-axis
const yAccessor = (d) => d.profit      // position on y-axis  
const sizeAccessor = (d) => d.marketShare  // bubble size
```

## Gotchas

1. **categoryKey is required**: Unlike other charts, you must specify which data key determines bubble color
2. **Categories must cover all values**: Every unique value in categoryKey must have a category entry
3. **sizeRange affects perception**: Use reasonable ranges; too large bubbles overlap, too small are invisible
4. **Accessors return numbers**: Make sure accessor functions return numeric values, not strings
5. **Opacity helps overlapping**: Use `opacity` prop when bubbles might overlap
