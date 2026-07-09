<script lang="ts" setup>
interface Props {
  height: number
}

const { height } = defineProps<Props>()

const colorMode = useColorMode()

interface ServerDataItem {
  timestamp: string
  server1: number
  server2: number
  server3: number
  server4: number
}

const ServerUptime: ServerDataItem[] = [
  {
    timestamp: '00:00',
    server1: 100,
    server2: 100,
    server3: 100,
    server4: 100
  },
  { timestamp: '04:00', server1: 100, server2: 98, server3: 100, server4: 100 },
  { timestamp: '08:00', server1: 100, server2: 98, server3: 95, server4: 100 },
  { timestamp: '12:00', server1: 99, server2: 98, server3: 95, server4: 100 },
  { timestamp: '16:00', server1: 99, server2: 100, server3: 95, server4: 97 },
  { timestamp: '20:00', server1: 99, server2: 100, server3: 100, server4: 97 },
  { timestamp: '24:00', server1: 100, server2: 100, server3: 100, server4: 97 }
]

const ServerCategories = computed(() => ({
  server1: {
    name: 'Server 1',
    color: colorMode.value === 'dark' ? '#22c55e' : '#16a34a'
  },
  server2: {
    name: 'Server 2',
    color: colorMode.value === 'dark' ? '#3b82f6' : '#2563eb'
  },
  server3: {
    name: 'Server 3',
    color: colorMode.value === 'dark' ? '#a855f7' : '#7c3aed'
  },
  server4: {
    name: 'Server 4',
    color: colorMode.value === 'dark' ? '#f59e0b' : '#d97706'
  }
}))

const xFormatter = (i: number): string => `${ServerUptime[i]?.timestamp}`
const yFormatter = (value: number): string => `${value}%`
</script>

<template>
  <div class="">
    <LineChart
      :key="colorMode.value"
      :data="ServerUptime"
      :height="height"
      :categories="ServerCategories"
      :x-formatter="xFormatter"
      :y-formatter="yFormatter"
      :curve-type="CurveType.StepAfter"
      :legend-position="LegendPosition.BottomCenter"
      :hide-legend="false"
      :x-grid-line="true"
      :y-grid-line="true"
      :x-domain-line="true"
      :y-domain-line="true"
      :x-tick-line="false"
      :y-tick-line="false"
      :x-num-ticks="7"
      :y-num-ticks="6"
      x-label="Time"
      y-label="Uptime"
      v-bind="$attrs"
    />
  </div>
</template>
