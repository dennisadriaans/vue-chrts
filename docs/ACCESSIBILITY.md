# Accessibility in vue-chrts

All charts in vue-chrts are designed to meet WCAG 2.1 AA accessibility standards out of the box. This document explains the accessibility features and how to use them effectively.

## Overview

The library implements the following WCAG 2.1 AA requirements:

- **1.1.1 Non-text Content**: Charts have descriptive labels for screen readers
- **1.3.1 Info and Relationships**: ARIA roles and labels convey chart structure
- **1.4.1 Use of Color**: Information is not conveyed by color alone (legends are always used)
- **2.1.1 Keyboard Accessible**: Charts are focusable and keyboard-navigable
- **2.4.x Labels and Instructions**: Proper semantic structure and focus management
- **4.1.2 Name, Role, Value**: ARIA attributes provide programmatic access

## Accessibility Props

All chart components support these accessibility props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ariaLabel` | `string` | Auto-generated | Custom accessible label for the chart |
| `ariaLabelledby` | `string` | `undefined` | ID of an element that labels the chart |
| `ariaDescribedby` | `string` | `undefined` | ID of an element that describes the chart |
| `focusable` | `boolean` | `true` | Whether the chart should be keyboard-focusable |

## Usage Examples

### Basic Usage (Automatic Labels)

```vue
<BarChart
  :data="salesData"
  :categories="categories"
  :height="400"
/>
```

### Custom ARIA Label

```vue
<AreaChart
  :data="monthlyData"
  :categories="categories"
  :height="400"
  aria-label="Monthly revenue trends for 2024"
/>
```

### Using aria-labelledby

```vue
<h2 id="revenue-chart-title">Quarterly Revenue</h2>
<BarChart
  :data="quarterlyData"
  :categories="categories"
  aria-labelledby="revenue-chart-title"
/>
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Data Visualization Accessibility](https://www.w3.org/WAI/tutorials/charts/)
