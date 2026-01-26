---
name: nuxt-module
description: Using nuxt-charts module in Nuxt applications. Use when building charts in Nuxt projects.
---

# Nuxt-Charts Module

nuxt-charts is the Nuxt module wrapper for vue-chrts, providing auto-imports and seamless integration.

## Installation

```bash
# Install the module
pnpm add nuxt-charts

# Add to nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-charts']
})
```

## What Gets Auto-Imported

Once installed, these are available globally without imports:

### Components
- `AreaChart`
- `LineChart`
- `BarChart`
- `DonutChart`
- `BubbleChart`
- `GanttChart`
- `DagreGraph`
- `DualChart`
- `SankeyChart`
- `TopoJSONMap`
- `DottedMap`

### Enums & Types
- `LegendPosition`
- `CurveType`
- `Orientation`
- `DonutType`

## Usage in Nuxt

```vue
<!-- pages/dashboard.vue -->
<script setup lang="ts">
// No imports needed! Components and enums are auto-imported

interface SalesData {
  month: string
  revenue: number
  profit: number
}

const chartData = ref<SalesData[]>([
  { month: 'Jan', revenue: 45000, profit: 12000 },
  { month: 'Feb', revenue: 52000, profit: 15000 },
  { month: 'Mar', revenue: 48000, profit: 14000 },
])

const categories = {
  revenue: { name: 'Revenue', color: '#3b82f6' },
  profit: { name: 'Profit', color: '#10b981' }
}

const xFormatter = (tick: number) => chartData.value[tick].month
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Sales Dashboard</h1>
    
    <!-- Components work without imports -->
    <LineChart
      :data="chartData"
      :categories="categories"
      :height="300"
      :xFormatter="xFormatter"
      :curveType="CurveType.MonotoneX"
      :legendPosition="LegendPosition.TopRight"
      xLabel="Month"
      yLabel="Amount ($)"
    />
  </div>
</template>
```

## Server-Side Rendering Considerations

Charts render on the client side. For SSR compatibility:

```vue
<template>
  <ClientOnly>
    <LineChart
      :data="data"
      :categories="categories"
      :height="300"
    />
    <template #fallback>
      <div class="h-[300px] bg-gray-100 animate-pulse rounded" />
    </template>
  </ClientOnly>
</template>
```

## Fetching Data for Charts

```vue
<script setup lang="ts">
// Using useFetch for data
const { data: chartData } = await useFetch('/api/sales-data')

// Using useAsyncData with transform
const { data: transformedData } = await useAsyncData('sales', async () => {
  const response = await $fetch('/api/sales')
  return response.map(item => ({
    month: item.date,
    value: item.amount
  }))
})

const categories = {
  value: { name: 'Sales', color: '#3b82f6' }
}
</script>

<template>
  <LineChart
    v-if="transformedData"
    :data="transformedData"
    :categories="categories"
    :height="300"
    :xFormatter="(i) => transformedData[i].month"
  />
</template>
```

## Type Safety in Nuxt

For full type safety, you can still import types explicitly:

```vue
<script setup lang="ts">
import type { BulletLegendItemInterface } from 'vue-chrts'

interface ChartItem {
  label: string
  value: number
}

const data: ChartItem[] = [...]

const categories: Record<string, BulletLegendItemInterface> = {
  value: { name: 'Value', color: '#3b82f6' }
}
</script>
```

## Using with Nuxt UI

nuxt-charts works well alongside Nuxt UI:

```vue
<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold">Monthly Revenue</h2>
    </template>
    
    <LineChart
      :data="data"
      :categories="categories"
      :height="250"
      :xFormatter="xFormatter"
      :yGridLine="true"
    />
    
    <template #footer>
      <div class="flex justify-between text-sm text-gray-500">
        <span>Updated: {{ lastUpdated }}</span>
        <UButton size="xs" variant="ghost">View Details</UButton>
      </div>
    </template>
  </UCard>
</template>
```

## Composables Pattern

Create reusable chart configurations:

```typescript
// composables/useChartConfig.ts
export function useChartConfig() {
  const defaultCategories = {
    primary: { name: 'Primary', color: '#3b82f6' },
    secondary: { name: 'Secondary', color: '#10b981' },
    tertiary: { name: 'Tertiary', color: '#f59e0b' }
  }

  const formatCurrency = (tick: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(tick)
  }

  const formatPercentage = (tick: number) => `${tick}%`

  return {
    defaultCategories,
    formatCurrency,
    formatPercentage
  }
}
```

```vue
<script setup>
const { formatCurrency, defaultCategories } = useChartConfig()
</script>

<template>
  <BarChart
    :data="data"
    :categories="defaultCategories"
    :yFormatter="formatCurrency"
    :height="300"
  />
</template>
```

## Module Configuration

The module currently auto-imports all components. No additional configuration is needed in `nuxt.config.ts` beyond adding the module.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-charts'],
  
  // Charts work with any CSS framework
  css: ['~/assets/css/main.css'],
})
```
