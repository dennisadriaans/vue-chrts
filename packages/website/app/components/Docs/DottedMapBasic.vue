<script lang="ts" setup>
const pins = [
  {
    lat: 40.7128,
    lng: -74.006,
    svgOptions: { color: '#3b82f6', radius: 0.75 }
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    svgOptions: { color: '#22c55e', radius: 0.75 }
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    svgOptions: { color: '#f59e0b', radius: 0.75 }
  },
  { lat: 48.8566, lng: 2.3522, svgOptions: { color: '#8b5cf6', radius: 0.75 } },
  {
    lat: -33.8688,
    lng: 151.2093,
    svgOptions: { color: '#ef4444', radius: 0.75 }
  },
  {
    lat: 55.7558,
    lng: 37.6173,
    svgOptions: { color: '#06b6d4', radius: 0.75 }

  }
]
</script>

<template>
  <div class="flex items-center justify-center">
    <DottedMap
      :map-height="75"
      :pins="pins"
      color="var(--ui-bg-accented)"
      :dot-size="0.3"
    />
  </div>
</template>
