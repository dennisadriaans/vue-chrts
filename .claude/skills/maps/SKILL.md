---
name: maps
description: Build map visualizations with TopoJSONMap and DottedMap. Use for geographical data, choropleth maps, and location-based visualizations.
---

# Map Components

vue-chrts provides two map components:
- **TopoJSONMap**: Full-featured geographic maps using TopoJSON data
- **DottedMap**: Stylized dot-matrix world maps

## TopoJSONMap

Renders geographic regions using TopoJSON data. Supports choropleth coloring, points, and links.

### Mental Model

```
┌─────────────────────────────────────────────────────────────┐
│  TOPOJSONMAP LAYERS                                         │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Areas (regions/countries from TopoJSON)              │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐               │ │
│  │  │  Region │  │  Region │  │  Region │               │ │
│  │  │    A    │──│    B    │──│    C    │               │ │
│  │  └─────────┘  └─────────┘  └─────────┘               │ │
│  │                    ●  ●  ●  Points (cities, etc.)     │ │
│  │                    └──┴──┘  Links (connections)       │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Complete Example

```vue
<script setup lang="ts">
import { TopoJSONMap, LegendPosition } from 'vue-chrts'
import usaTopoJson from './data/usa.topo.json'

interface StateData {
  id: string
  name: string
  value: number
}

const stateData: StateData[] = [
  { id: 'CA', name: 'California', value: 39500000 },
  { id: 'TX', name: 'Texas', value: 29000000 },
  { id: 'FL', name: 'Florida', value: 21500000 },
  // ... more states
]

const categories = {
  low: { name: 'Low Population', color: '#bfdbfe' },
  medium: { name: 'Medium Population', color: '#3b82f6' },
  high: { name: 'High Population', color: '#1e3a8a' }
}

const getAreaColor = (feature: any) => {
  const state = stateData.find(s => s.id === feature.properties.id)
  if (!state) return '#e5e7eb'
  if (state.value > 20000000) return categories.high.color
  if (state.value > 10000000) return categories.medium.color
  return categories.low.color
}
</script>

<template>
  <TopoJSONMap
    :data="{
      mapFeatureKey: 'id',
      data: { areas: stateData },
      topoJson: usaTopoJson
    }"
    :height="500"
    :areaColor="getAreaColor"
    :categories="categories"
    :legendPosition="LegendPosition.BottomRight"
    :fitView="true"
    :zoomExtent="[1, 8]"
  />
</template>
```

### TopoJSONMap Props

| Prop | Type | Description |
|------|------|-------------|
| `data.topoJson` | `object` | TopoJSON data object |
| `data.mapFeatureKey` | `keyof T` | Key to match features with data |
| `data.data` | `MapData` | Areas, points, links data |
| `height` | `string \| number` | Map height |
| `width` | `string \| number` | Map width |
| `projection` | `GeoProjection` | D3 geo projection |
| `areaColor` | `string \| (feature) => string` | Area fill color |
| `areaCursor` | `string \| (feature) => string` | Area cursor style |
| `pointColor` | `string \| (point) => string` | Point color |
| `pointSize` | `number \| (point) => number` | Point radius |
| `pointLabel` | `(point) => string` | Point label accessor |
| `linkColor` | `string \| (link) => string` | Link stroke color |
| `linkWidth` | `number \| (link) => number` | Link stroke width |
| `fitView` | `boolean` | Auto-fit map to container |
| `fitViewPadding` | `number` | Padding when fitting |
| `zoomFactor` | `number` | Initial zoom level |
| `zoomExtent` | `[number, number]` | Min/max zoom levels |

---

## DottedMap

Creates stylized dot-matrix world maps. Great for showing global presence, locations, or minimalist geographic visualizations.

### Mental Model

```
┌─────────────────────────────────────────────────────────────┐
│  DOTTED MAP                                                 │
│                                                             │
│    ·  · ·  ·  · ·  ·  · ·  ·  · ·  ·  · ·  ·             │
│   · ·  ·  · ·  ·  · ·  ·  · ·  ·  · ·  ·  · ·            │
│    ·  · ●  ·  · ·  ·  ● ·  ·  · ·  ·  · ·  ·  ← Pins     │
│   · ·  ·  · ·  ·  · ·  ·  · ·  ●  · ·  ·  · ·            │
│    ·  · ·  ·  · ·  ·  · ·  ·  · ·  ·  · ·  ·             │
│                                                             │
│  Base dots = landmass                                       │
│  Pins = custom locations with lat/lng                       │
└─────────────────────────────────────────────────────────────┘
```

### Complete Example

```vue
<script setup lang="ts">
import { DottedMap, getMap, getPin } from 'vue-chrts'

const pins = [
  getPin({ lat: 40.7128, lng: -74.0060, color: '#ef4444', radius: 3 }), // New York
  getPin({ lat: 51.5074, lng: -0.1278, color: '#3b82f6', radius: 3 }),  // London
  getPin({ lat: 35.6762, lng: 139.6503, color: '#10b981', radius: 3 }), // Tokyo
  getPin({ lat: -33.8688, lng: 151.2093, color: '#f59e0b', radius: 3 }) // Sydney
]
</script>

<template>
  <DottedMap
    :mapHeight="50"
    :pins="pins"
    color="#4b5563"
    :dotSize="0.4"
    backgroundColor="#1f2937"
    shape="circle"
  />
</template>
```

### DottedMap Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mapHeight` | `number` | - | Height in dots (auto-calculates width) |
| `mapWidth` | `number` | - | Width in dots (auto-calculates height) |
| `countries` | `string[]` | all | ISO 3166-1 alpha-3 country codes to include |
| `region` | `MapRegion` | - | Specific lat/lng bounds to display |
| `grid` | `'vertical' \| 'diagonal'` | `'vertical'` | Dot alignment pattern |
| `pins` | `MapPin[]` | - | Location markers |
| `precomputedMap` | `string \| object` | - | Pre-generated map data |
| `color` | `string` | `'#ffffff'` | Default dot color |
| `dotSize` | `number` | `0.5` | Dot radius |
| `strokeColor` | `string` | - | Dot stroke color |
| `strokeWidth` | `number` | - | Dot stroke width |
| `shape` | `'circle' \| 'hexagon'` | `'circle'` | Dot shape |
| `countryColors` | `Record<string, string>` | - | Per-country colors |
| `backgroundColor` | `string` | - | Container background |
| `avoidOuterPins` | `boolean` | `false` | Hide pins outside region |

### Pin Helper Function

```typescript
import { getPin } from 'vue-chrts'

const pin = getPin({
  lat: 40.7128,
  lng: -74.0060,
  color: '#ef4444',
  radius: 5,
  strokeColor: '#ffffff',
  strokeWidth: 1
})
```

### MapPin Structure

```typescript
interface MapPin {
  lat: number
  lng: number
  svgOptions?: {
    color?: string
    radius?: number
    strokeColor?: string
    strokeWidth?: number
    strokeOpacity?: number
  }
  data?: Record<string, unknown>
}
```

## Common Patterns

### Highlight Specific Countries

```vue
<DottedMap
  :mapHeight="40"
  :countries="['USA', 'GBR', 'DEU', 'JPN', 'AUS']"
  :countryColors="{
    'USA': '#3b82f6',
    'GBR': '#ef4444',
    'DEU': '#f59e0b',
    'JPN': '#10b981',
    'AUS': '#8b5cf6'
  }"
  color="#374151"
/>
```

### Regional Focus

```vue
<DottedMap
  :mapHeight="60"
  :region="{
    lat: { min: 35, max: 72 },
    lng: { min: -25, max: 45 }
  }"
  color="#6b7280"
  :dotSize="0.6"
/>
```

### Office Locations

```vue
<script setup>
import { getPin } from 'vue-chrts'

const offices = [
  { city: 'HQ', lat: 37.7749, lng: -122.4194 },
  { city: 'NYC', lat: 40.7128, lng: -74.0060 },
  { city: 'London', lat: 51.5074, lng: -0.1278 },
]

const pins = offices.map(office => getPin({
  lat: office.lat,
  lng: office.lng,
  color: '#10b981',
  radius: 4
}))
</script>

<template>
  <DottedMap
    :mapHeight="50"
    :pins="pins"
    color="#4b5563"
    backgroundColor="transparent"
  />
</template>
```

## Gotchas

1. **TopoJSON required for TopoJSONMap**: You need valid TopoJSON data for regions
2. **Country codes are ISO 3166-1 alpha-3**: Use 'USA' not 'US', 'GBR' not 'UK'
3. **Lat/Lng order matters**: Latitude first, then longitude
4. **DottedMap dimensions**: Specify either mapHeight OR mapWidth, not both
5. **Large maps are slow**: DottedMap with many dots can be performance-heavy
