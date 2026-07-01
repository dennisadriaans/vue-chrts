<script setup lang="ts">
import { candles } from "../data";

const usd = (v: number) => `$${v.toFixed(0)}`;
</script>

<template>
  <main style="font-family: sans-serif; max-width: 760px; margin: 2rem auto">
    <NuxtLink to="/">← back</NuxtLink>
    <h1>Candlestick charts</h1>

    <h2>Daily stock monitor</h2>
    <CandlestickChart
      :data="candles"
      :height="360"
      :y-formatter="usd"
    />

    <h2>With volume histogram</h2>
    <CandlestickChart
      :data="candles"
      :height="400"
      :y-formatter="usd"
      show-volume
    />

    <h2>Custom colours &amp; wider candles</h2>
    <CandlestickChart
      :data="candles"
      :height="360"
      :y-formatter="usd"
      up-color="#2662d9"
      down-color="#e23670"
      :candle-width="10"
    />
  </main>
</template>
