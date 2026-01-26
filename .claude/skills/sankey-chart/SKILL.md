---
name: sankey-chart
description: Build SankeyChart components. Use for visualizing flows, conversions, and resource distribution between stages.
---

# SankeyChart

SankeyChart visualizes flow quantities between nodes. Perfect for showing energy flows, user journeys, budget allocations, or conversion funnels.

## Mental Model

```
┌─────────────────────────────────────────────────────────────┐
│  NODES & LINKS                                              │
│                                                             │
│   Sources          Intermediates         Destinations       │
│  ┌───────┐                              ┌───────────┐       │
│  │ Coal  │─────────┐                ┌──▶│ Industrial│       │
│  └───────┘         │   ┌──────────┐ │   └───────────┘       │
│  ┌───────┐         └──▶│          │─┤   ┌───────────┐       │
│  │  Gas  │────────────▶│Electricity│─┴──▶│Residential│       │
│  └───────┘         ┌──▶│          │     └───────────┘       │
│  ┌───────┐         │   └──────────┘                         │
│  │ Solar │─────────┘                                        │
│  └───────┘                                                  │
│                                                             │
│  Link width = flow quantity                                 │
└─────────────────────────────────────────────────────────────┘
```

## Data Structure

```typescript
// Nodes: entities in the flow
interface SankeyNode {
  id: string       // unique identifier
  label?: string   // display name
}

// Links: connections with flow values
interface SankeyLink {
  source: string   // source node id
  target: string   // target node id
  value: number    // flow quantity (determines width)
}

// Combined data structure
const data = {
  nodes: [...],
  links: [...]
}
```

## Complete Example

```vue
<script setup lang="ts">
import { SankeyChart, LegendPosition } from 'vue-chrts'
import type { SankeyInputNode, SankeyInputLink } from '@unovis/ts'

type EnergyNode = SankeyInputNode & {
  id: string
  label: string
}

type EnergyLink = SankeyInputLink & {
  source: string
  target: string
  value: number
}

const data = {
  nodes: [
    { id: 'coal', label: 'Coal' },
    { id: 'gas', label: 'Natural Gas' },
    { id: 'solar', label: 'Solar' },
    { id: 'electricity', label: 'Electricity' },
    { id: 'industrial', label: 'Industrial' },
    { id: 'residential', label: 'Residential' },
  ] as EnergyNode[],
  links: [
    { source: 'coal', target: 'electricity', value: 30 },
    { source: 'gas', target: 'electricity', value: 45 },
    { source: 'solar', target: 'electricity', value: 25 },
    { source: 'electricity', target: 'industrial', value: 55 },
    { source: 'electricity', target: 'residential', value: 45 },
  ] as EnergyLink[],
}

const nodeColor = (node: EnergyNode) => {
  const colors: Record<string, string> = {
    coal: '#4b5563',
    gas: '#3b82f6',
    solar: '#f59e0b',
    electricity: '#8b5cf6',
    industrial: '#10b981',
    residential: '#ef4444',
  }
  return colors[node.id] || '#6b7280'
}
</script>

<template>
  <SankeyChart
    :data="data"
    :height="400"
    :label="(node) => node.label"
    :nodeColor="nodeColor"
    :nodeWidth="15"
    :nodePadding="20"
    nodeAlign="justify"
  />
</template>
```

## Key Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `{ nodes: N[], links: L[] }` | required | Nodes and links data |
| `height` | `number` | required | Chart height in pixels |
| `label` | `(node: N) => string` | - | Node label accessor |
| `subLabel` | `(node: N) => string` | - | Node sub-label accessor |
| `nodeColor` | `(node: N) => string` | - | Node fill color accessor |
| `linkColor` | `(link: L) => string` | - | Link fill color accessor |
| `linkValue` | `(link: L) => number` | - | Link value accessor |
| `nodeWidth` | `number` | `10` | Width of node rectangles |
| `nodePadding` | `number` | `10` | Vertical gap between nodes |
| `nodeAlign` | `SankeyNodeAlign` | `'justify'` | Node alignment method |
| `iterations` | `number` | `32` | Layout algorithm iterations |
| `nodeSort` | `(a, b) => number` | - | Custom node sorting |
| `linkSort` | `(a, b) => number` | - | Custom link sorting |
| `hideLegend` | `boolean` | `false` | Hide the legend |
| `legendPosition` | `LegendPosition` | - | Legend placement |
| `categories` | `Record<string, BulletLegendItem>` | - | Legend categories |

## Node Alignment Options

```
nodeAlign: 'left'      nodeAlign: 'right'     nodeAlign: 'justify'
  ┌─┐  ┌─┐  ┌─┐        ┌─┐  ┌─┐  ┌─┐         ┌─┐       ┌─┐
  │ │──│ │──│ │        │ │──│ │──│ │         │ │──┐ ┌──│ │
  └─┘  └─┘  └─┘        └─┘  └─┘  └─┘         └─┘  │ │  └─┘
  ┌─┐                          ┌─┐           ┌─┐  └─┤
  │ │─────────┐        ┌───────│ │           │ │────│──┌─┐
  └─┘         │        │       └─┘           └─┘    └──│ │
              ▼        ▼                               └─┘
  All left    All right        Spread evenly
```

## Common Patterns

### User Journey / Funnel

```vue
<script setup>
const funnelData = {
  nodes: [
    { id: 'visit', label: 'Site Visit' },
    { id: 'signup', label: 'Sign Up' },
    { id: 'trial', label: 'Start Trial' },
    { id: 'paid', label: 'Paid' },
    { id: 'churned', label: 'Churned' },
  ],
  links: [
    { source: 'visit', target: 'signup', value: 1000 },
    { source: 'visit', target: 'churned', value: 4000 },
    { source: 'signup', target: 'trial', value: 600 },
    { source: 'signup', target: 'churned', value: 400 },
    { source: 'trial', target: 'paid', value: 200 },
    { source: 'trial', target: 'churned', value: 400 },
  ],
}

const nodeColor = (node) => {
  if (node.id === 'churned') return '#ef4444'
  if (node.id === 'paid') return '#10b981'
  return '#3b82f6'
}
</script>

<template>
  <SankeyChart
    :data="funnelData"
    :height="300"
    :label="(n) => n.label"
    :nodeColor="nodeColor"
    :linkColor="(link) => link.target === 'churned' ? '#fecaca' : '#bfdbfe'"
  />
</template>
```

### Budget Allocation

```vue
<script setup>
const budgetData = {
  nodes: [
    { id: 'revenue', label: 'Total Revenue' },
    { id: 'salaries', label: 'Salaries' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'operations', label: 'Operations' },
    { id: 'profit', label: 'Profit' },
  ],
  links: [
    { source: 'revenue', target: 'salaries', value: 45 },
    { source: 'revenue', target: 'marketing', value: 20 },
    { source: 'revenue', target: 'operations', value: 15 },
    { source: 'revenue', target: 'profit', value: 20 },
  ],
}
</script>
```

## Gotchas

1. **Node IDs must be unique**: Each node needs a distinct `id` string
2. **Links reference node IDs**: `source` and `target` must match existing node IDs exactly
3. **Circular references fail**: Sankey doesn't support cycles (A→B→A)
4. **Value determines width**: Link `value` is required and affects visual width
5. **Node order**: Nodes auto-arrange into columns based on link structure
