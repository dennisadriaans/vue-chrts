<script lang="ts" setup>
defineOptions({
  tags: ['candlestickcharts', 'basic']
})

interface Candle {
  label: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// Default accessors read label/open/high/low/close/volume — no config needed.
const candles: Candle[] = [
  { label: 'Mon', open: 132, high: 138, low: 130, close: 136, volume: 2400 },
  { label: 'Tue', open: 136, high: 141, low: 134, close: 139, volume: 3100 },
  { label: 'Wed', open: 139, high: 140, low: 131, close: 133, volume: 2900 },
  { label: 'Thu', open: 133, high: 135, low: 128, close: 129, volume: 3600 },
  { label: 'Fri', open: 129, high: 137, low: 128, close: 136, volume: 4200 },
  { label: 'Sat', open: 136, high: 144, low: 135, close: 143, volume: 3900 },
  { label: 'Sun', open: 143, high: 147, low: 140, close: 141, volume: 2700 }
]

const usd = (v: number) => `$${v.toFixed(0)}`
</script>

<template>
  <CandlestickChart
    :data="candles"
    :height="340"
    :y-formatter="usd"
    show-volume
  />
</template>
