---
name: gantt-chart
description: Build GanttChart (timeline) components. Use for project timelines, schedules, and temporal data visualization.
---

# GanttChart

GanttChart displays temporal data as horizontal bars on a timeline. Perfect for project schedules, resource allocation, and time-based event visualization.

## Mental Model

```
┌─────────────────────────────────────────────────────────────┐
│  TIMELINE STRUCTURE                                         │
│                                                             │
│  Labels      │ Timeline Bars                                │
│  ───────────────────────────────────────────────────────   │
│  Task A      │ ████████░░░░░░░░░░░░░░░░░░                  │
│  Task B      │ ░░░░░░░░████████████░░░░░░                  │
│  Task C      │ ░░░░░░░░░░░░░░░████████████                  │
│              │                                              │
│              │ Jan    Feb    Mar    Apr    May              │
│                                                             │
│  Each bar: x (start) + length (duration) + type (category) │
└─────────────────────────────────────────────────────────────┘
```

## Data Structure

```typescript
interface TimelineItem {
  label: string      // row label
  start: number      // x position (timestamp or index)
  duration: number   // bar length
  category: string   // determines color from categories
}
```

## Complete Example

```vue
<script setup lang="ts">
import { GanttChart, LegendPosition } from 'vue-chrts'

interface ProjectTask {
  name: string
  start: number      // start date as timestamp
  duration: number   // duration in days
  phase: string      // category for coloring
}

const tasks: ProjectTask[] = [
  { name: 'Research', start: Date.parse('2024-01-01'), duration: 14, phase: 'planning' },
  { name: 'Design', start: Date.parse('2024-01-10'), duration: 21, phase: 'planning' },
  { name: 'Backend Dev', start: Date.parse('2024-01-25'), duration: 30, phase: 'development' },
  { name: 'Frontend Dev', start: Date.parse('2024-02-01'), duration: 35, phase: 'development' },
  { name: 'Testing', start: Date.parse('2024-03-01'), duration: 14, phase: 'testing' },
  { name: 'Deployment', start: Date.parse('2024-03-15'), duration: 7, phase: 'deployment' },
]

const categories = {
  planning: { name: 'Planning', color: '#3b82f6' },
  development: { name: 'Development', color: '#10b981' },
  testing: { name: 'Testing', color: '#f59e0b' },
  deployment: { name: 'Deployment', color: '#8b5cf6' }
}

// Convert duration from days to milliseconds for x-axis scale
const dayInMs = 24 * 60 * 60 * 1000
</script>

<template>
  <GanttChart
    :data="tasks"
    :categories="categories"
    :x="(d) => d.start"
    :length="(d) => d.duration * dayInMs"
    :type="(d) => d.phase"
    :height="300"
    :labelWidth="150"
    :legendPosition="LegendPosition.TopRight"
    :lineWidth="20"
    :rowHeight="36"
  />
</template>
```

## Key Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | required | Array of timeline items |
| `categories` | `Record<string, BulletLegendItem>` | required | Color mapping for types |
| `x` | `(d: T) => number` | required | Accessor for start position |
| `length` | `(d: T) => number` | required | Accessor for bar duration |
| `type` | `(d: T) => string` | required | Accessor for category/type |
| `height` | `number` | - | Chart height in pixels |
| `labelWidth` | `number` | `220` | Width of label column |
| `lineWidth` | `number` | `12` | Height of timeline bars |
| `rowHeight` | `number` | `24` | Height of each row |
| `showLabels` | `boolean` | `true` | Show row labels |
| `xNumTicks` | `number` | auto | Number of x-axis ticks |
| `title` | `string` | - | Chart title |
| `hideTooltip` | `boolean` | `false` | Hide tooltips |
| `getTooltipText` | `(label, index, data) => string` | - | Custom tooltip content |
| `tooltipTitleFormatter` | `(data: T) => string` | - | Custom tooltip title |
| `legendPosition` | `LegendPosition` | `TopRight` | Legend placement |

## Accessor Functions Explained

```typescript
// The three required accessors tell GanttChart how to read your data

const data = [
  { task: 'Write docs', startDate: 100, days: 5, status: 'active' }
]

// x: where does the bar start?
const x = (d) => d.startDate

// length: how long is the bar?
const length = (d) => d.days

// type: which category for coloring?
const type = (d) => d.status
```

## Common Patterns

### Simple Task List

```vue
<script setup>
const tasks = [
  { name: 'Task 1', start: 0, duration: 3, status: 'done' },
  { name: 'Task 2', start: 2, duration: 4, status: 'active' },
  { name: 'Task 3', start: 5, duration: 2, status: 'pending' },
]

const categories = {
  done: { name: 'Completed', color: '#10b981' },
  active: { name: 'In Progress', color: '#3b82f6' },
  pending: { name: 'Pending', color: '#9ca3af' }
}
</script>

<template>
  <GanttChart
    :data="tasks"
    :categories="categories"
    :x="(d) => d.start"
    :length="(d) => d.duration"
    :type="(d) => d.status"
    :height="200"
    :showLabels="true"
    :labelWidth="120"
  />
</template>
```

### Sprint Timeline

```vue
<script setup>
const sprintData = [
  { story: 'User Auth', sprint: 1, points: 5, team: 'backend' },
  { story: 'Dashboard UI', sprint: 1, points: 8, team: 'frontend' },
  { story: 'API Integration', sprint: 2, points: 5, team: 'backend' },
  { story: 'Testing', sprint: 3, points: 3, team: 'qa' },
]

const categories = {
  backend: { name: 'Backend', color: '#10b981' },
  frontend: { name: 'Frontend', color: '#3b82f6' },
  qa: { name: 'QA', color: '#f59e0b' }
}

// Convert sprint number to x position
const sprintToX = (d) => (d.sprint - 1) * 14 // 14 days per sprint
const pointsToDuration = (d) => d.points * 1 // 1 day per point
</script>

<template>
  <GanttChart
    :data="sprintData"
    :categories="categories"
    :x="sprintToX"
    :length="pointsToDuration"
    :type="(d) => d.team"
    :height="250"
  />
</template>
```

### With Custom Tooltips

```vue
<template>
  <GanttChart
    :data="tasks"
    :categories="categories"
    :x="(d) => d.start"
    :length="(d) => d.duration"
    :type="(d) => d.phase"
    :getTooltipText="(label, index, data) => {
      const task = data[index]
      return `${task.name}\nDuration: ${task.duration} days\nPhase: ${task.phase}`
    }"
  />
</template>
```

## Gotchas

1. **Three required accessors**: `x`, `length`, and `type` are all required functions
2. **Same units for x and length**: Both must use the same scale (timestamps, days, indices, etc.)
3. **Categories must cover all types**: Every value returned by `type()` needs a category entry
4. **Labels from data array**: Row labels come from the data array order; customize with label accessor
5. **Height vs rowHeight**: `height` is total chart height; `rowHeight` affects individual row spacing
