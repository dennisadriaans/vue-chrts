---
name: common-patterns
description: Common patterns and best practices for vue-chrts. Use for general guidance on data formatting, styling, and chart configuration.
---

# Common Patterns & Best Practices

This guide covers patterns that apply across all vue-chrts chart types.

## The Categories Object Pattern

Every chart uses a `categories` object to define how data series are displayed.

```typescript
// Structure: Record<DataKey, BulletLegendItemInterface>
const categories = {
  dataKey1: { name: 'Display Name', color: '#hexcolor' },
  dataKey2: { name: 'Another Series', color: '#hexcolor2' }
}

// BulletLegendItemInterface full options:
interface BulletLegendItemInterface {
  name: string | number       // Legend label
  color?: string | string[]   // Fill color(s)
  className?: string          // CSS class
  inactive?: boolean          // Dim in legend
  hidden?: boolean            // Hide from legend
  pointer?: boolean           // Show pointer cursor
}
```

## Formatter Functions

Formatters control how axis labels and tooltips display values.

### X-Axis Formatter

```typescript
// IMPORTANT: xFormatter receives the INDEX, not the data item!
const data = [
  { month: 'Jan', value: 100 },
  { month: 'Feb', value: 150 },
]

// ❌ WRONG - this receives index (0, 1, 2...)
const xFormatter = (tick) => tick.month

// ✅ CORRECT - use index to access data
const xFormatter = (tick: number) => data[tick].month

// ✅ ALSO CORRECT - with additional params
const xFormatter = (tick: number, i?: number, ticks?: number[]) => {
  return data[tick].month
}
```

### Y-Axis Formatter

```typescript
// yFormatter receives the actual tick VALUE
const yFormatter = (tick: number) => {
  // Format as currency
  return `$${tick.toLocaleString()}`
}

// Format as percentage
const yFormatter = (tick: number) => `${tick}%`

// Format large numbers
const yFormatter = (tick: number) => {
  if (tick >= 1000000) return `${(tick / 1000000).toFixed(1)}M`
  if (tick >= 1000) return `${(tick / 1000).toFixed(0)}K`
  return tick.toString()
}
```

### Tooltip Title Formatter

```typescript
// Receives the actual data item, not an index
const tooltipTitleFormatter = (dataItem) => {
  return `${dataItem.month} 2024`
}
```

## Common Styling Props

These props are available on most chart types:

```vue
<ChartComponent
  <!-- Axes -->
  xLabel="X Axis Title"
  yLabel="Y Axis Title"
  :xDomainLine="true"
  :yDomainLine="true"
  :xTickLine="false"
  :yTickLine="false"
  :xGridLine="false"
  :yGridLine="true"
  
  <!-- Ticks -->
  :xNumTicks="5"
  :yNumTicks="4"
  :minMaxTicksOnly="false"
  :xExplicitTicks="[0, 50, 100]"
  
  <!-- Legend -->
  :hideLegend="false"
  :legendPosition="LegendPosition.TopRight"
  :legendStyle="{ padding: '8px' }"
  
  <!-- Tooltip -->
  :hideTooltip="false"
  :tooltip="{ followCursor: true, hideDelay: 100 }"
  
  <!-- Animation -->
  :duration="300"
  
  <!-- Padding -->
  :padding="{ top: 20, right: 20, bottom: 40, left: 50 }"
/>
```

## Legend Positions

```typescript
import { LegendPosition } from 'vue-chrts'

// Available positions
LegendPosition.TopLeft
LegendPosition.TopCenter
LegendPosition.TopRight
LegendPosition.BottomLeft
LegendPosition.BottomCenter
LegendPosition.BottomRight
```

## Curve Types (Line/Area Charts)

```typescript
import { CurveType } from 'vue-chrts'

// Common choices
CurveType.Linear       // Straight lines
CurveType.MonotoneX    // Smooth, preserves monotonicity
CurveType.Step         // Stepped/staircase
CurveType.Natural      // Natural cubic spline
CurveType.Basis        // B-spline, very smooth
CurveType.Cardinal     // Cardinal spline
```

## Orientation (Bar Charts)

```typescript
import { Orientation } from 'vue-chrts'

Orientation.Vertical    // Bars go up
Orientation.Horizontal  // Bars go sideways
```

## Responsive Charts

Charts are responsive by default. Container width is automatic, but height must be specified:

```vue
<template>
  <!-- Chart fills container width, fixed height -->
  <div class="chart-container">
    <LineChart :data="data" :categories="categories" :height="300" />
  </div>
</template>

<style>
.chart-container {
  width: 100%;
  max-width: 800px;
}
</style>
```

## TypeScript Generics

Charts are generic over your data type:

```typescript
interface MyDataItem {
  label: string
  value1: number
  value2: number
}

const data: MyDataItem[] = [...]

// Type-safe accessors
const xFormatter = (tick: number): string => data[tick].label
const tooltipFormatter = (d: MyDataItem): string => d.label
```

## Color Recommendations

```typescript
// Recommended color palettes

// Blue-based (professional)
const blueScale = ['#bfdbfe', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8']

// Multi-series (distinct)
const categorical = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

// Sequential (for ordered data)
const sequential = ['#dcfce7', '#86efac', '#22c55e', '#16a34a', '#166534']

// Diverging (for +/- values)
const diverging = ['#ef4444', '#fca5a5', '#e5e7eb', '#86efac', '#22c55e']
```

## Performance Tips

1. **Limit data points**: Charts work best with < 1000 data points
2. **Use `duration: 0`** to disable animations for large datasets
3. **Memoize formatters**: Wrap formatters in `computed()` if they depend on reactive data
4. **Lazy load maps**: TopoJSON files are large; import dynamically

```typescript
// Lazy load TopoJSON
const topoJson = ref(null)
onMounted(async () => {
  topoJson.value = await import('./data/map.topo.json')
})
```

## Debugging Checklist

When a chart isn't working:

1. **No data showing?**
   - Check that `categories` keys match your data object keys
   - For BarChart, verify `yAxis` array is correct

2. **X-axis shows numbers?**
   - Add `xFormatter` function
   - Remember it receives an INDEX

3. **Wrong colors?**
   - Categories object keys must exactly match data keys
   - Check for typos in key names

4. **Legend missing items?**
   - Ensure all data series have category entries
   - Check `hideLegend` isn't true

5. **Tooltip not showing?**
   - Check `hideTooltip` isn't true
   - Verify chart has `height` prop set
