<script setup lang="ts" generic="T extends {} = {}">
import { Position, Scale, Scatter } from '@unovis/ts'
import { VisXYContainer, VisScatter, VisAxis, VisTooltip, VisBulletLegend } from '@unovis/vue'
import { BubbleChartProps } from './types';
import { LegendPosition } from '../../types';

const props = withDefaults(defineProps<BubbleChartProps<T>>(), {
  hideXAxis: false,
  hideYAxis: false,
  xLabel: '',
  yLabel: '',
  xGridLine: false,
  yGridLine: true,
  xDomainLine: true,
  yDomainLine: true,
  xTickLine: true,
  yTickLine: true,
  xNumTicks: undefined,
  yNumTicks: undefined,
  xExplicitTicks: undefined,
  minMaxTicksOnly: false,
  hideLegend: false,
  legendPosition: LegendPosition.Bottom,
})

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
  <div
    v-if="!props.hideLegend"
    class="flex items-center justify-end"
    :class="{ 'pb-4': props.legendPosition === LegendPosition.Top }"
  >
    <VisBulletLegend :items="legendItems" />
  </div>
  <VisXYContainer :data="props.data" :height="600" :scaleByDomain="true">
    <VisScatter :x="x" :y="y" :color="color" :size="size" :label="label" :labelPosition="Position.Bottom"
      :sizeRange="[10, 50]" cursor="pointer" />
    <VisAxis
      v-if="!props.hideXAxis"
      type='x'
      :label="props.xLabel"
      :tickFormat="props.xFormatter"
      :gridLine="props.xGridLine"
      :domainLine="!!props.xDomainLine"
      :tickLine="props.xTickLine"
      :numTicks="props.xNumTicks"
      :tickValues="props.xExplicitTicks"
      :minMaxTicksOnly="props.minMaxTicksOnly"
    />
    <VisAxis
      v-if="!props.hideYAxis"
      type='y'
      :label="props.yLabel"
      :tickFormat="props.yFormatter"
      :gridLine="props.yGridLine"
      :domainLine="!!props.yDomainLine"
      :tickLine="props.yTickLine"
      :numTicks="props.yNumTicks"
    />
    <VisTooltip :triggers="triggers" />
  </VisXYContainer>
</template>