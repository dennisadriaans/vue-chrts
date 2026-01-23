---
name: dagre-graph
description: Build DagreGraph components for hierarchical diagrams. Use for org charts, dependency graphs, flowcharts, and decision trees.
---

# DagreGraph

DagreGraph renders directed acyclic graphs with automatic hierarchical layout. Perfect for org charts, dependency trees, system architectures, and flowcharts.

## Mental Model

```
┌─────────────────────────────────────────────────────────────┐
│  HIERARCHICAL LAYOUT                                        │
│                                                             │
│  TB (Top-Bottom)        LR (Left-Right)                     │
│       ┌───┐                                                 │
│       │ A │             ┌───┐   ┌───┐   ┌───┐              │
│       └─┬─┘             │ A │───│ B │───│ D │              │
│     ┌───┴───┐           └───┘   └─┬─┘   └───┘              │
│   ┌─┴─┐   ┌─┴─┐                   │                        │
│   │ B │   │ C │                 ┌─┴─┐                      │
│   └─┬─┘   └───┘                 │ C │                      │
│   ┌─┴─┐                         └───┘                      │
│   │ D │                                                    │
│   └───┘                                                    │
│                                                             │
│  Nodes + Links = Graph                                      │
└─────────────────────────────────────────────────────────────┘
```

## Data Structure

```typescript
interface GraphNodeDatum {
  id: string        // unique identifier
  label?: string    // display text
  level?: number    // optional hierarchy level
  [key: string]: any // custom data
}

interface GraphLinkDatum {
  source: string    // source node id
  target: string    // target node id
  label?: string    // optional link label
  [key: string]: any
}

const data = {
  nodes: [...],
  links: [...]
}
```

## Complete Example

```vue
<script setup lang="ts">
import { DagreGraph, LegendPosition, type GraphNodeDatum, type GraphLinkDatum } from 'vue-chrts'

const orgData = {
  nodes: [
    { id: 'ceo', label: 'CEO', level: 0 },
    { id: 'cto', label: 'CTO', level: 1 },
    { id: 'cfo', label: 'CFO', level: 1 },
    { id: 'eng-lead', label: 'Eng Lead', level: 2 },
    { id: 'design-lead', label: 'Design Lead', level: 2 },
    { id: 'team-a', label: 'Team A', level: 3 },
    { id: 'team-b', label: 'Team B', level: 3 },
  ] as GraphNodeDatum[],
  links: [
    { source: 'ceo', target: 'cto' },
    { source: 'ceo', target: 'cfo' },
    { source: 'cto', target: 'eng-lead' },
    { source: 'cto', target: 'design-lead' },
    { source: 'eng-lead', target: 'team-a' },
    { source: 'eng-lead', target: 'team-b' },
  ] as GraphLinkDatum[],
}

const levelColors: Record<number, string> = {
  0: '#8b5cf6', // CEO - Purple
  1: '#3b82f6', // C-level - Blue
  2: '#10b981', // Leads - Green
  3: '#f59e0b', // Teams - Orange
}

const getNodeColor = (node: GraphNodeDatum) => {
  return levelColors[node.level ?? 0] || '#6b7280'
}

const handleNodeClick = (node: GraphNodeDatum, event?: MouseEvent) => {
  console.log('Node clicked:', node)
}
</script>

<template>
  <DagreGraph
    :data="orgData"
    :height="500"
    :nodeLabel="(n) => n.label || n.id"
    :nodeFillColor="getNodeColor"
    :nodeSize="50"
    :dagreSettings="{
      rankdir: 'TB',
      nodesep: 60,
      ranksep: 80
    }"
    :linkArrows="'end'"
    @node:click="handleNodeClick"
  />
</template>
```

## Key Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `GraphData<N, L>` | required | Nodes and links data |
| `height` | `number` | `600` | Chart height in pixels |
| `width` | `number` | auto | Chart width in pixels |
| `nodeLabel` | `(node: N) => string` | - | Node label accessor |
| `nodeSubLabel` | `(node: N) => string` | - | Node sub-label accessor |
| `nodeFillColor` | `(node: N) => string` | - | Node background color |
| `nodeStrokeColor` | `(node: N) => string` | - | Node border color |
| `nodeSize` | `number \| (node: N) => number` | `40` | Node size in pixels |
| `nodeShape` | `NodeShape \| (node: N) => NodeShape` | `'circle'` | circle/square/triangle/diamond |
| `linkColor` | `(link: L) => string` | - | Link stroke color |
| `linkWidth` | `(link: L) => number` | - | Link stroke width |
| `linkArrows` | `LinkArrowPosition` | `'none'` | start/end/both/none |
| `dagreSettings` | `DagreLayoutSettings` | - | Layout algorithm config |
| `categories` | `Record<string, BulletLegendItem>` | - | Legend categories |
| `legendPosition` | `LegendPosition` | - | Legend placement |
| `disableZoom` | `boolean` | `false` | Disable pan/zoom |
| `disableDrag` | `boolean` | `false` | Disable node dragging |

## Layout Settings (dagreSettings)

```typescript
interface DagreLayoutSettings {
  rankdir?: 'TB' | 'BT' | 'LR' | 'RL'  // Direction
  align?: 'UL' | 'UR' | 'DL' | 'DR'     // Alignment
  nodesep?: number   // Horizontal spacing (default: 50)
  edgesep?: number   // Edge spacing (default: 10)
  ranksep?: number   // Vertical spacing (default: 50)
  ranker?: 'network-simplex' | 'tight-tree' | 'longest-path'
  marginx?: number   // Horizontal margin
  marginy?: number   // Vertical margin
}
```

## Direction Options

```
TB (default)          BT                   LR                   RL
Top → Bottom       Bottom → Top        Left → Right        Right → Left

    ┌─┐               ┌─┐                                           
    │A│              ┌┴─┴┐            ┌─┐   ┌─┐           ┌─┐   ┌─┐  
    └┬┘              │B│C│            │A│───│B│           │B│───│A│  
   ┌─┴─┐             └─┬┘             └─┘   └─┘           └─┘   └─┘  
   │B│C│               ▲                     │             │         
   └───┘             ┌─┴─┐                   ▼             ▼         
                     │ A │               ┌─┐   ┌─┐     ┌─┐   ┌─┐    
                     └───┘               │C│   │D│     │D│   │C│    
```

## Node Shapes

```
circle (default)    square          triangle         diamond
     ○               □                △                ◇
```

## Events

```vue
<DagreGraph
  :data="data"
  @node:click="(node, event) => handleNodeClick(node)"
  @node:mouseover="(node, event) => showTooltip(node)"
  @node:mouseout="(node, event) => hideTooltip()"
  @link:click="(link, event) => handleLinkClick(link)"
  @link:mouseover="(link, event) => highlightLink(link)"
  @link:mouseout="(link, event) => unhighlightLink()"
/>
```

## Common Patterns

### Dependency Graph with Status

```vue
<script setup>
const taskData = {
  nodes: [
    { id: 'task-1', label: 'Design', status: 'completed' },
    { id: 'task-2', label: 'Backend', status: 'in-progress' },
    { id: 'task-3', label: 'Frontend', status: 'pending' },
    { id: 'task-4', label: 'Testing', status: 'pending' },
  ],
  links: [
    { source: 'task-1', target: 'task-2' },
    { source: 'task-1', target: 'task-3' },
    { source: 'task-2', target: 'task-4' },
    { source: 'task-3', target: 'task-4' },
  ],
}

const statusColors = {
  completed: '#10b981',
  'in-progress': '#3b82f6',
  pending: '#9ca3af',
}

const getNodeColor = (node) => statusColors[node.status] || '#6b7280'

const getNodeShape = (node) => {
  if (node.status === 'completed') return 'square'
  if (node.status === 'in-progress') return 'circle'
  return 'triangle'
}
</script>

<template>
  <DagreGraph
    :data="taskData"
    :height="400"
    :nodeFillColor="getNodeColor"
    :nodeShape="getNodeShape"
    :linkArrows="'end'"
    :dagreSettings="{ rankdir: 'LR', nodesep: 80 }"
  />
</template>
```

### System Architecture

```vue
<script setup>
const systemData = {
  nodes: [
    { id: 'web', label: 'Web App', type: 'frontend' },
    { id: 'api', label: 'API Server', type: 'backend' },
    { id: 'db', label: 'Database', type: 'database' },
    { id: 'cache', label: 'Redis', type: 'infrastructure' },
  ],
  links: [
    { source: 'web', target: 'api' },
    { source: 'api', target: 'db' },
    { source: 'api', target: 'cache' },
  ],
}
</script>
```

## Gotchas

1. **Node IDs must be unique**: Each node needs a distinct `id` string
2. **Links reference node IDs**: `source` and `target` must match existing node IDs
3. **Avoid cycles**: Dagre works best with acyclic graphs
4. **Large graphs need space**: Increase height/width for many nodes
5. **nodeLabel vs label**: `nodeLabel` is the accessor prop, `label` is the data property
