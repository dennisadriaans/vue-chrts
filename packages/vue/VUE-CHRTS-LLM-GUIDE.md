# Vue-CHRTS Library: LLM Integration Guide

This guide provides comprehensive instructions for Language Learning Models (LLMs) to effectively implement the vue-chrts charting library in Vue.js applications.

## Library Overview

Vue-CHRTS is a chart visualization library for Vue.js that provides customizable chart components with TypeScript support. The library includes:

- **Area Charts**: Single and stacked variants with customizable curves
- **Line Charts**: Customizable curves and styling
- **Bar Charts**: Vertical/horizontal, grouped/stacked variants  
- **Donut Charts**: Full or half-circle variants

## Installation and Setup

```vue
<script setup>
import { AreaChart, LineChart, BarChart, DonutChart, CurveType, Orientation, LegendPosition } from 'vue-chrts';
</script>
```

## Common Configuration Options

All charts share these core configuration patterns:

### Required Properties

- `data`: Array of data points that will be visualized
- `height`: Chart height in pixels
- `categories`: Maps data keys to legend items with color and name properties

### Common Optional Properties

- `xLabel`/`yLabel`: Axis labels
- `xFormatter`/`yFormatter`: Functions for formatting axis labels
- `hideTooltip`/`hideLegend`: Toggle visibility of tooltips and legends
- `legendPosition`: Position of the legend (`top` or `bottom`)
- Grid and domain line controls:
  - `xGridLine`/`yGridLine`: Show grid lines
  - `xDomainLine`/`yDomainLine`: Show domain (axis) lines
  - `xTickLine`/`yTickLine`: Show tick lines

## Chart-Specific Components and Options

### Area Chart

```vue
<AreaChart
  :data="chartData"
  :height="300"
  :categories="categories"
  :xFormatter="(val) => formatDate(val)"
  :curveType="CurveType.Linear"
  :xGridLine="true"
  :yGridLine="true"
/>
```

**Unique options:**
- `curveType`: Line curve style (Linear, Cardinal, Natural, etc.)
- `xNumTicks`/`yNumTicks`: Number of axis ticks
- `xExplicitTicks`: Force specific ticks
- `minMaxTicksOnly`: Show only first and last ticks

### Area Stacked Chart

```vue
<AreaStackedChart
  :data="stackedData"
  :height="300"
  :categories="categories"
  :xFormatter="(val) => formatDate(val)"
  :xGridLine="true"
  :yGridLine="true" 
/>
```

### Line Chart

```vue
<LineChart
  :data="lineData"
  :height="300"
  :categories="categories"
  :xFormatter="(val) => formatDate(val)"
  :curveType="CurveType.Cardinal"
  :xGridLine="true"
  :yGridLine="true"
/>
```

**Unique options:**
- Same as Area Chart, optimized for line rendering

### Bar Chart

```vue
<BarChart
  :data="barData"
  :height="300"
  :categories="categories"
  :yAxis="['value1', 'value2']"
  :xFormatter="(val) => String(val)"
  :orientation="Orientation.Vertical"
  :stacked="false"
  :radius="4"
  :groupPadding="10"
  :barPadding="2"
/>
```

**Unique options:**
- `stacked`: Boolean to create stacked or grouped bars
- `orientation`: Horizontal or vertical bars
- `yAxis`: Array of data properties to use for Y-axis values
- `groupPadding`/`barPadding`: Spacing between bars and groups
- `radius`: Corner radius for bars

### Donut Chart

```vue
<DonutChart
  :data="[40, 30, 20, 10]"
  :height="300"
  :radius="120"
  :type="'full'"
  :labels="[
    { name: 'Category A', color: '#3B82F6' },
    { name: 'Category B', color: '#10B981' },
    { name: 'Category C', color: '#F59E0B' },
    { name: 'Category D', color: '#EF4444' }
  ]"
/>
```

**Unique options:**
- `type`: "half" or "full" donut
- `radius`: Donut radius in pixels
- `labels`: Array of objects with name and color for each segment

## Enum Values

### CurveType Options
- `Linear` - Straight lines between points
- `Basis` - B-spline interpolation
- `Bundle` - Bundle curves
- `Cardinal` - Cardinal splines (smooth curves through points)
- `CatmullRom` - Cubic splines with tension
- `MonotoneX`/`MonotoneY` - Preserves monotonicity in data
- `Natural` - Natural cubic splines
- `Step`/`StepAfter`/`StepBefore` - Step interpolation

### Orientation Options
- `Horizontal` - Horizontal bar chart
- `Vertical` - Vertical bar chart (default)

### LegendPosition Options
- `Top` - Legend at top of chart
- `Bottom` - Legend at bottom of chart

## Data Formatting Guidelines

### Area and Line Charts
Data should be an array of objects, where each object has:
- A value for the X-axis (typically a timestamp or category)
- One or more numeric values for each line/area series

```typescript
const data = [
  { date: 1641024000000, value1: 1200, value2: 900 },
  { date: 1641110400000, value1: 1400, value2: 1100 },
  // Additional data points...
];
```

### Bar Charts
For bar charts, data should include all values to be displayed:

```typescript
const data = [
  { category: 'A', value1: 120, value2: 80 },
  { category: 'B', value1: 160, value2: 100 },
  // Additional data points...
];
```

### Donut Charts
Donut charts take a simple array of numbers for values:

```typescript
const data = [40, 25, 20, 15]; // Percentages or values
```

### Categories Definition
For all charts except Donut, define categories to control legend appearance:

```typescript
const categories = {
  value1: { name: 'Series A', color: '#3B82F6' },
  value2: { name: 'Series B', color: '#10B981' },
};
```

## Formatters

Formatters control the display of axis labels:

```typescript
// Date formatter example
const xFormatter = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Value formatter example
const yFormatter = (value) => {
  return `$${value.toLocaleString()}`;
};
```

## Best Practices for LLMs

1. **Chart Selection**:
   - Use Line/Area charts for time series or continuous data
   - Use Bar charts for categorical comparisons
   - Use Donut charts for part-to-whole relationships
   - Use Stacked Area charts for showing how parts contribute to a whole over time

2. **Responsive Design**:
   - Set the chart height explicitly but allow the width to be determined by container
   - Consider different device sizes when setting heights and tick counts

3. **Data Preprocessing**:
   - Sort time-series data chronologically before passing to charts
   - Use appropriate data transformation for grouped or stacked charts

4. **Visual Clarity**:
   - Limit the number of series to 5-7 for readability
   - Use contrasting colors for categories
   - Use grid lines sparingly to avoid visual noise
   - Format axis labels for human readability (e.g., "10K" instead of "10000")

5. **Interactivity**:
   - Leverage built-in tooltips for detailed information on hover
   - Use legends to allow toggling series visibility

## Example Implementation

```vue
<template>
  <div>
    <h2>Monthly Revenue</h2>
    <LineChart
      :data="revenueData"
      :height="300"
      :categories="revenueCategories"
      :xFormatter="formatDate"
      :yFormatter="formatCurrency"
      :curveType="CurveType.MonotoneX"
      :xGridLine="true"
      :yGridLine="true"
      :legendPosition="LegendPosition.Bottom"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { LineChart, CurveType, LegendPosition } from 'vue-chrts';

// Sample data
const revenueData = ref([
  { date: 1641024000000, product: 500, services: 300 },
  { date: 1643702400000, product: 650, services: 320 },
  { date: 1646121600000, product: 700, services: 400 },
  { date: 1648800000000, product: 550, services: 450 },
  { date: 1651392000000, product: 800, services: 480 },
  { date: 1654070400000, product: 900, services: 600 },
]);

// Categories definition
const revenueCategories = {
  product: { name: 'Product Revenue', color: '#3B82F6' },
  services: { name: 'Services Revenue', color: '#10B981' },
};

// Formatter functions
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short' });
};

const formatCurrency = (value) => {
  return `$${value}K`;
};
</script>
```

This guide should provide LLMs with the necessary knowledge to implement vue-chrts charts effectively in Vue.js applications.