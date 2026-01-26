# Vue-Chrts Claude Skills

This folder contains skill files that help Claude and other LLMs understand how to build charts with the vue-chrts and nuxt-charts libraries.

## Available Skills

| Skill | Description | Use When |
|-------|-------------|----------|
| [vue-chrts-overview](./vue-chrts-overview.md) | Library overview, installation, available components | Starting a new project, exploring capabilities |
| [line-area-chart](./line-area-chart.md) | LineChart and AreaChart components | Building time series, trends, continuous data |
| [bar-chart](./bar-chart.md) | BarChart component | Categorical comparisons, grouped/stacked bars |
| [donut-chart](./donut-chart.md) | DonutChart component | Part-to-whole, percentages, gauges |
| [dual-chart](./dual-chart.md) | DualChart (bars + lines) | Comparing two related metrics |
| [bubble-chart](./bubble-chart.md) | BubbleChart component | Scatter plots with size encoding |
| [sankey-chart](./sankey-chart.md) | SankeyChart component | Flows, conversions, resource distribution |
| [dagre-graph](./dagre-graph.md) | DagreGraph component | Org charts, dependency trees, flowcharts |
| [gantt-chart](./gantt-chart.md) | GanttChart component | Project timelines, schedules |
| [maps](./maps.md) | TopoJSONMap and DottedMap | Geographic visualizations |
| [common-patterns](./common-patterns.md) | Shared patterns across all charts | General guidance, best practices |
| [nuxt-module](./nuxt-module.md) | Nuxt integration | Using charts in Nuxt apps |

## How Skills Work

Each skill file follows this format:

```markdown
---
name: skill-name
description: When this skill should be used
---

# Content

Detailed instructions, examples, and gotchas
```

## Key Concepts Covered

- **Data Structure**: How to format data for each chart type
- **Categories Pattern**: The universal config object for styling series
- **Formatters**: How xFormatter, yFormatter, and tooltipTitleFormatter work
- **Props Reference**: Key properties for each component
- **Gotchas**: Common mistakes and how to avoid them
- **Code Examples**: Complete, working examples

## Quick Reference

### The Universal Pattern

```vue
<template>
  <ChartComponent
    :data="dataArray"
    :categories="categoriesObject"
    :height="300"
    :xFormatter="(tick) => dataArray[tick].label"
  />
</template>
```

### Most Common Gotcha

**xFormatter receives an INDEX, not the data object!**

```typescript
// ❌ Wrong
const xFormatter = (d) => d.month

// ✅ Correct
const xFormatter = (tick) => data[tick].month
```

## Contributing

When adding new skills:
1. Follow the existing file format with YAML frontmatter
2. Include ASCII diagrams for visual concepts
3. Provide complete, runnable code examples
4. Document common gotchas and mistakes
5. Keep the conversational, instructional tone
