<script setup lang="ts" generic="T extends {} = {}">
import { Position, Scale, Scatter } from '@unovis/ts'
import { VisXYContainer, VisScatter, VisAxis, VisTooltip, VisBulletLegend } from '@unovis/vue'
import { BubbleChartProps } from './types';

const props = defineProps<BubbleChartProps<T>>()


const palette = [
  '#04c0c7',
  '#e7871a',
  '#da348f',
  '#9089fa',
  '#47e26f',
  '#2780eb',
  '#6f38b1',
  '#268d6c',
  '#d11d55',
  '#ffcc00',
  '#a0d6e5',
  '#f45a6d',
]

const categories = [...new Set(props.data.map((d: any) => d.category))].sort()
const colorScale = Scale.scaleOrdinal(palette).domain(categories)
const formatNumber = Intl.NumberFormat('en', { notation: 'compact' }).format

// scatter props
const x = (d: any) => d.medianSalary
const y = (d: any) => d.employmentRate
const color = (d: any) => colorScale(d.category)
const size = (d: any) => d.total
const label = (d: any) => formatNumber(d.total)

const legendItems = categories.map(v => ({ name: v, color: colorScale(v) }))
const triggers = {
  [Scatter.selectors.point]: (d: any) => `
      ${d.major}<br/>Number of graduates: ${d.total.toLocaleString()}
    `,
}
</script>

<template>
  <h2>American College Graduates, 2010-2012</h2>
  <VisBulletLegend :items="legendItems" />
  <VisXYContainer :data="props.data" :height="600" :scaleByDomain="true">
    <VisScatter :x="x" :y="y" :color="color" :size="size" :label="label" :labelPosition="Position.Bottom"
      :sizeRange="[10, 50]" cursor="pointer" />
    <VisAxis type='x' label='Median Salary ($)' :tickFormat="formatNumber" />
    <VisAxis excludeFromDomainCalculation type='y' label='Employment Rate' :tickPadding="0" />
    <VisTooltip :triggers="triggers" />
  </VisXYContainer>
</template>