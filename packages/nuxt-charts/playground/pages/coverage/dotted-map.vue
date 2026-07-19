<script setup lang="ts">
const pins = [
  { lat: 40.73061, lng: -73.935242, svgOptions: { color: "#ef4444", radius: 0.8 } },
  { lat: 48.8534, lng: 2.3488, svgOptions: { color: "#10b981", radius: 0.8 } },
]
</script>

<template>
  <div data-testid="chart-host">
    <DottedMap :dot-size="0.5" color="#3b82f6" :pins="pins" />
  </div>
</template>
