# Accessibility Guide

`vue-chrts` is designed with accessibility (a11y) in mind, helping you build data visualizations that are inclusive for all users. The library follows [WCAG 2.1](https://www.w3.org/TR/WCAG21/) guidelines to ensure charts are perceivable, operable, and understandable.

## Core Features

All charts in `vue-chrts` automatically include:

- **`role="img"`**: Identifies the component as an image to assistive technologies.
- **`aria-roledescription="chart"`**: Provides a clear description of the element's role (configurable).
- **Keyboard Navigation**: Charts are focusable (`tabindex="0"`) by default.
- **Auto-generated Labels**: If no custom label is provided, a descriptive label is generated based on the chart type and data.

## Best Practices

### 1. Provide Descriptive Labels

Always provide a clear, concise description of what the chart shows. You can do this via props:

```vue
<AreaChart
  :data="data"
  aria-label="Revenue over time, showing an upward trend in Q3 and Q4"
/>
```

If you have a visible heading that describes the chart, link it using `aria-labelledby`:

```vue
<h3 id="revenue-chart-heading">Monthly Revenue</h3>
<AreaChart
  :data="data"
  aria-labelledby="revenue-chart-heading"
/>
```

### 2. Provide Detailed Descriptions

For complex charts where a short label isn't enough, use `aria-describedby` to point to a detailed description elsewhere on the page (visible or hidden):

```vue
<div id="revenue-details">
  Revenue started at $10k in January, peaked at $50k in June, and settled at $45k by December.
</div>
<AreaChart
  :data="data"
  aria-label="Monthly Revenue 2023"
  aria-describedby="revenue-details"
/>
```

### 3. Customize Role Description

The default role description is "chart". You can customize this if needed, for example to "map" or "diagram":

```vue
<DottedMap
  :data="mapData"
  aria-roledescription="interactive map"
/>
```

### 4. Keyboard Navigation

Charts are focusable by default to allow keyboard users to navigate to them. If you have a chart that is purely decorative or redundant (e.g., a sparkline next to a text value), you should remove it from the tab order:

```vue
<LineChart
  :data="sparklineData"
  :focusable="false"
  aria-hidden="true" 
/>
```

### 5. Color Contrast

Ensure that the colors you choose for your charts have sufficient contrast against the background and each other.

- **WCAG AA** requires a contrast ratio of at least 3:1 for graphical objects and user interface components.
- Use tools like the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify your color palette.

```vue
<BarChart
  :categories="{
    revenue: { color: '#2563eb', label: 'Revenue' }, // Good contrast on white
    profit: { color: '#16a34a', label: 'Profit' }   // Good contrast on white
  }"
/>
```

## Screen Reader Experience

When a screen reader user encounters a chart:

1. They will hear the **Label** (e.g., "Monthly Revenue 2023").
2. They will hear the **Role Description** (e.g., "chart").
3. They can access the **Description** if provided.

Example announcement: *"Monthly Revenue 2023, chart. Revenue started at $10k..."*
