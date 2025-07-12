<script setup lang="ts">
import { VisXYContainer, VisLine, VisAxis, VisBulletLegend } from '@unovis/vue'

export type StackedDataRecord = {
  x: number;
  ys: number[];
}

// 1. Prepare data and legend items
const data = [
  { "x": 0, "ys": [15, 25, 12, 21, 16, 11] },
  { "x": 1, "ys": [18, 23, 14, 22, 19, 12] },
  { "x": 2, "ys": [22, 28, 11, 24, 20, 13] },
  { "x": 3, "ys": [20, 31, 15, 26, 22, 14] },
  { "x": 4, "ys": [25, 29, 18, 28, 24, 15] },
  { "x": 5, "ys": [28, 35, 22, 30, 26, 16] },
  { "x": 6, "ys": [31, 33, 21, 32, 27, 17] },
  { "x": 7, "ys": [35, 38, 25, 36, 30, 18] },
  { "x": 8, "ys": [33, 42, 23, 34, 29, 19] },
  { "x": 9, "ys": [38, 45, 28, 39, 34, 20] }
]
const legendItems = Array(data[0].ys.length).fill(0).map((_, i) => ({ name: `Y${i}` }))

// 2. Define your SVG markers as a string
// Each <marker> needs a unique id to be referenced later.
  const svgDefs = `
    <marker id="circle-marker" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
      <circle cx="5" cy="5" r="4" stroke-width="1" stroke="var(--vis-color2)" fill="#fff"/>
    </marker>
    <marker id="square-marker" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
      <polygon points="5,0 10,5 5,10 0,5" stroke="none" fill="var(--vis-color4)"/>
    </marker>
    <marker id="arrow-marker" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--vis-color5)"/>
    </marker>
  `

// 3. Define accessors and the marker array for the line component
const x = (d: StackedDataRecord) => d.x
const y = legendItems.map((_, i) => (d: StackedDataRecord) => d.ys[i])

console.log(legendItems, 'legendItems')
</script>

<template>
  <div class="legends">
    <VisBulletLegend bulletShape='line' bulletSize='12px' :items="legendItems" />

    <VisXYContainer :data="data" :svg-defs="svgDefs" :height="400">

      <VisLine
        :x="x"
        :y="y"
        :duration="5"
         />

      <VisAxis :duration="5" type="x" />
      <VisAxis :duration="5" type="y" />

    </VisXYContainer>
  </div>
</template>

<style>
.legends *[stroke="var(--vis-color1)"]:not([style*="fill"]) {
    stroke-dasharray: 5;
}

.legends *[stroke="var(--vis-color2)"]:not([style*="fill"]) {
    marker: url('#circle-marker');
  }
  
.legends *[stroke="var(--vis-color3)"]:not([style*="fill"]) {
    stroke-dasharray: 2;
  }
  
.legends *[stroke="var(--vis-color4)"]:not([style*="fill"]) {
  marker: url('#square-marker');
}

.legends *[stroke="var(--vis-color5)"]:not([style*="fill"]) {
  marker: url('#arrow-marker');
  stroke-dasharray: 2 7;
}</style>