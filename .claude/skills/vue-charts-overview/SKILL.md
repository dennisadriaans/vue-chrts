---
name: vue-chrts-overview
description: Overview of vue-chrts and nuxt-charts libraries. Use when the user asks about available charts, installation, or general library capabilities.
---

# Vue-Chrts / Nuxt-Charts Overview

vue-chrts is a Vue 3 charting library inspired by Tremor, built on Unovis. nuxt-charts is its Nuxt module wrapper.

## Quick Mental Model

Think of vue-chrts like a **restaurant menu**: you pick a chart type (the dish), provide your data (ingredients), and configure categories (the presentation). The library handles the cooking (rendering).

## Installation

```bash
# Vue.js
pnpm add vue-chrts

# Nuxt
pnpm add nuxt-charts
# Add to nuxt.config.ts: modules: ["nuxt-charts"]
```

## Available Chart Components

```
┌─────────────────────────────────────────────────────────────┐
│                    CHART COMPONENTS                         │
├─────────────────────────────────────────────────────────────┤
│  TIME SERIES         │  COMPARISON        │  RELATIONSHIPS  │
│  ─────────────       │  ──────────        │  ─────────────  │
│  • LineChart         │  • BarChart        │  • SankeyChart  │
│  • AreaChart         │  • DonutChart      │  • DagreGraph   │
│  • DualChart         │  • BubbleChart     │                 │
│                      │                    │                 │
├──────────────────────┼────────────────────┼─────────────────┤
│  SPECIALIZED         │  MAPS              │                 │
│  ───────────         │  ────              │                 │
│  • GanttChart        │  • TopoJSONMap     │                 │
│                      │  • DottedMap       │                 │
└──────────────────────┴────────────────────┴─────────────────┘
```

## Core Pattern for ALL Charts

Every chart follows this structure:

```vue
<template>
  <ChartComponent
    :data="dataArray"
    :categories="categoriesObject"
    :height="number"
    :xFormatter="formatterFunction"
    <!-- ...other props -->
  />
</template>

<script setup>
// 1. Your raw data array
const data = [{ label: 'A', value1: 10, value2: 20 }, ...]

// 2. Categories define which data keys to plot and how they look
const categories = {
  value1: { name: 'Display Name', color: '#hexcolor' },
  value2: { name: 'Another Series', color: '#hexcolor2' }
}

// 3. Formatter to display x-axis labels
const xFormatter = (tick) => data[tick].label
</script>
```

## Key Imports

```typescript
// Components
import { 
  LineChart, AreaChart, BarChart, DonutChart,
  BubbleChart, GanttChart, DagreGraph, DualChart,
  SankeyChart, TopoJSONMap, DottedMap
} from 'vue-chrts';

// Enums & Types
import { 
  LegendPosition,  // TopLeft, TopCenter, TopRight, BottomLeft, BottomCenter, BottomRight
  CurveType,       // Linear, MonotoneX, Step, Natural, Basis, Cardinal, etc.
  Orientation,     // Horizontal, Vertical
  DonutType        // Half, Full
} from 'vue-chrts';
```

## Common Gotcha

**xFormatter receives an INDEX, not the data object!**

```typescript
// ❌ WRONG
const xFormatter = (d) => d.month

// ✅ CORRECT  
const xFormatter = (tick) => data[tick].month
```
