<script setup lang="ts">
import { WorldMapTopoJSON } from '@unovis/ts/maps'
import { geoMercator } from 'd3-geo'

const hoveredArea = ref<string>()

const ChoroplethMapData = computed(() => [
  { id: 'NL', count: 94, name: 'Netherlands' },
  { id: 'US', count: 91, name: 'United States' },
  { id: 'DE', count: 71, name: 'Germany' },
  { id: 'BR', count: 60, name: 'Brazil' },
  { id: 'FR', count: 59, name: 'France' },
  { id: 'ID', count: 48, name: 'Indonesia' },
  { id: 'KE', count: 42, name: 'Kenya' },
  { id: 'GB', count: 35, name: 'United Kingdom' },
  { id: 'CA', count: 30, name: 'Canada' }
])

const worldData = computed(() => ({
  areas: ChoroplethMapData.value.map(d => ({
    id: d.id,
    count: d.count,
    name: d.name
  }))
}))

const maxCount = Math.max(...worldData.value.areas.map(d => d.count))

interface MapArea {
  id: string
  count?: number
  name?: string
  properties?: {
    id?: string
    name?: string
  }
}

const areaColor = computed(() => {
  return (d: MapArea) => {
    if (!d.count) return 'var(--ui-color-primary-900)'
    const t = d.count / maxCount

    if (t > 0.8) return 'var(--ui-color-primary-800)'
    if (t > 0.6) return 'var(--ui-color-primary-700)'
    if (t > 0.4) return 'var(--ui-color-primary-600)'
    if (t > 0.2) return 'var(--ui-color-primary-500)'
    return '#dbeafe'
  }
})

const customProjection = geoMercator().center([0, 0])
</script>

<template>
  <div class="py-6">
    <TopoJSONMap
      :height="400"
      map-feature-key="countries"
      :projection="customProjection"
      :data="worldData"
      :topo-json="WorldMapTopoJSON"
      :area-color="areaColor"
      :zoom-factor="1.1"
      @mouseenter="(d: any) => (hoveredArea = d.id)"
      @mouseleave="() => (hoveredArea = undefined)"
    />
  </div>
</template>

<style>
:root {
    --vis-map-feature-color: var(--ui-bg-elevated);
    --vis-map-boundary-color: var(--ui-border-accented);
    --vis-map-point-label-text-color-dark: var(--ui-text-muted);
    --vis-map-point-label-text-color-light: var(--ui-text-muted);
}
</style>
