# DualChart Component

The `DualChart` component combines bar and line charts to display multiple data series with different visualizations. This powerful component allows you to overlay line charts on top of bar charts, making it ideal for comparing metrics like actuals vs. targets, revenue with profit trends, or any scenario where you need to visualize data using different chart types simultaneously.

## Features

- **Multiple Bar Series**: Support for grouped or stacked bars
- **Multiple Line Series**: Overlay one or more line charts on the same visualization
- **Flexible Configuration**: Separate categories for bars and lines
- **Responsive**: Adapts to container size
- **Interactive Tooltips**: Shows data for both bars and lines on hover
- **Customizable Legend**: Control position and styling
- **Curve Types**: Support for various line curve types (MonotoneX, Step, Basis, etc.)

## Basic Usage

```vue
<script setup lang="ts">
import { DualChart, LegendPosition } from 'vue-chrts';

type DataItem = {
  month: string;
  revenue: number;
  costs: number;
  profit: number;
};

const data: DataItem[] = [
  { month: "January", revenue: 45000, costs: 30000, profit: 15000 },
  { month: "February", revenue: 52000, costs: 35000, profit: 17000 },
  // ... more data
];

const barCategories = {
  revenue: { name: "Revenue", color: "#3b82f6" },
  costs: { name: "Costs", color: "#ef4444" },
};

const lineCategories = {
  profit: { name: "Profit", color: "#22c55e" },
};
</script>

<template>
  <DualChart
    :data="data"
    :bar-categories="barCategories"
    :line-categories="lineCategories"
    :bar-y-axis="['revenue', 'costs']"
    :line-y-axis="['profit']"
    :height="300"
    :x-formatter="(tick: number): string => data[tick]?.month || ''"
    :tooltip-title-formatter="(d: DataItem) => d.month"
    y-label="Amount ($)"
  />
</template>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Array of data points to display |
| `barCategories` | `Record<string, BulletLegendItemInterface>` | Configuration for bar series (name and color) |
| `lineCategories` | `Record<string, BulletLegendItemInterface>` | Configuration for line series (name and color) |
| `barYAxis` | `(keyof T)[]` | Array of property keys for bar chart values |
| `lineYAxis` | `(keyof T)[]` | Array of property keys for line chart values |
| `height` | `number` | Chart height in pixels |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `xLabel` | `string` | - | Label for x-axis |
| `yLabel` | `string` | - | Label for y-axis |
| `yLabelSecondary` | `string` | - | Label for secondary y-axis (if needed) |
| `padding` | `{ top, right, bottom, left }` | `{ top: 5, right: 5, bottom: 5, left: 5 }` | Chart padding |
| `xFormatter` | `axisFormatter` | - | Function to format x-axis tick labels |
| `yFormatter` | `axisFormatter` | - | Function to format y-axis tick labels |
| `tooltipTitleFormatter` | `(data: T) => string \| number` | - | Custom tooltip title formatter |
| `curveType` | `CurveType` | `MonotoneX` | Line curve type |
| `lineWidth` | `number` | `2` | Width of line in pixels |
| `stacked` | `boolean` | `false` | Whether to stack bars |
| `groupPadding` | `number` | `0` | Padding between bar groups |
| `barPadding` | `number` | `0.2` | Padding between bars (0-1) |
| `radius` | `number` | `0` | Rounded corner radius for bars |
| `orientation` | `Orientation` | `Vertical` | Bar orientation |
| `legendPosition` | `LegendPosition` | `BottomCenter` | Legend position |
| `hideLegend` | `boolean` | `false` | Hide legend |
| `hideTooltip` | `boolean` | `false` | Hide tooltip |
| `yGridLine` | `boolean` | `true` | Show y-axis grid lines |
| `xGridLine` | `boolean` | `false` | Show x-axis grid lines |
| `yDomainLine` | `boolean` | `false` | Show y-axis domain line |
| `xDomainLine` | `boolean` | `false` | Show x-axis domain line |
| `yTickLine` | `boolean` | `false` | Show y-axis tick lines |
| `xTickLine` | `boolean` | `false` | Show x-axis tick lines |
| `hideXAxis` | `boolean` | `false` | Hide x-axis |
| `hideYAxis` | `boolean` | `false` | Hide y-axis |
| `xNumTicks` | `number` | - | Number of x-axis ticks |
| `yNumTicks` | `number` | - | Number of y-axis ticks |
| `minMaxTicksOnly` | `boolean` | `false` | Show only min and max ticks |
| `xExplicitTicks` | `(number \| string \| Date)[]` | - | Explicit x-axis tick values |

## Examples

### 1. Revenue & Costs with Profit Line

Shows monthly revenue and costs as grouped bars with profit as a trend line.

```vue
<DualChart
  :data="data"
  :bar-categories="{ revenue: { name: 'Revenue', color: '#3b82f6' }, costs: { name: 'Costs', color: '#ef4444' } }"
  :line-categories="{ profit: { name: 'Profit', color: '#22c55e' } }"
  :bar-y-axis="['revenue', 'costs']"
  :line-y-axis="['profit']"
  :height="300"
  :legend-position="LegendPosition.TopRight"
/>
```

### 2. Sales vs Target

Quarterly sales as bars compared to target line.

```vue
<DualChart
  :data="salesData"
  :bar-categories="{ sales: { name: 'Actual Sales', color: '#8b5cf6' } }"
  :line-categories="{ target: { name: 'Target', color: '#f59e0b' } }"
  :bar-y-axis="['sales']"
  :line-y-axis="['target']"
  :height="300"
/>
```

### 3. Stacked Bars with Line

Stacked bars showing total composition with a trend line.

```vue
<DualChart
  :data="data"
  :bar-categories="barCategories"
  :line-categories="lineCategories"
  :bar-y-axis="['revenue', 'costs']"
  :line-y-axis="['profit']"
  :height="300"
  :stacked="true"
/>
```

### 4. Single Bar with Multiple Lines

Single bar series with multiple trend lines for comparison.

```vue
<DualChart
  :data="data"
  :bar-categories="{ revenue: { name: 'Revenue', color: '#3b82f6' } }"
  :line-categories="{ 
    costs: { name: 'Costs', color: '#ef4444' }, 
    profit: { name: 'Profit', color: '#22c55e' } 
  }"
  :bar-y-axis="['revenue']"
  :line-y-axis="['costs', 'profit']"
  :height="300"
  :curve-type="CurveType.MonotoneX"
  :line-width="2"
/>
```

## Events

### `@click`

Emitted when the chart is clicked.

```vue
<DualChart
  :data="data"
  :bar-categories="barCategories"
  :line-categories="lineCategories"
  :bar-y-axis="['revenue']"
  :line-y-axis="['profit']"
  :height="300"
  @click="(event, values) => console.log('Clicked:', values)"
/>
```

## Custom Tooltips

You can provide a custom tooltip template using the `tooltip` slot:

```vue
<DualChart
  :data="data"
  :bar-categories="barCategories"
  :line-categories="lineCategories"
  :bar-y-axis="['revenue']"
  :line-y-axis="['profit']"
  :height="300"
>
  <template #tooltip="{ values }">
    <div class="custom-tooltip">
      <h3>{{ values.month }}</h3>
      <p>Revenue: ${{ values.revenue?.toLocaleString() }}</p>
      <p>Profit: ${{ values.profit?.toLocaleString() }}</p>
    </div>
  </template>
</DualChart>
```

## TypeScript Support

The component is fully typed with generics for type-safe data access:

```typescript
import { DualChart } from 'vue-chrts';
import type { DualChartProps } from 'vue-chrts';

type MyDataType = {
  month: string;
  value1: number;
  value2: number;
};

// Props will be type-checked
const props: DualChartProps<MyDataType> = {
  data: myData,
  barCategories: { value1: { name: 'Value 1', color: '#000' } },
  lineCategories: { value2: { name: 'Value 2', color: '#fff' } },
  barYAxis: ['value1'],
  lineYAxis: ['value2'],
  height: 300,
};
```

## Use Cases

- **Financial Dashboards**: Revenue vs costs with profit margin
- **Sales Analytics**: Actual sales vs targets
- **Performance Metrics**: Multiple KPIs with different visualizations
- **Trend Analysis**: Historical data (bars) with moving averages (lines)
- **Comparative Analysis**: Comparing actual vs forecast/budget

## Browser Support

Works in all modern browsers that support ES6+ and SVG.
