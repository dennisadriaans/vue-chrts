<script setup lang="ts">
import { statusCategories, statusHistory } from "../data";
</script>

<template>
  <main style="font-family: sans-serif; max-width: 760px; margin: 2rem auto">
    <NuxtLink to="/">← back</NuxtLink>
    <h1>Status tracker charts</h1>

    <h2>Responsive status history</h2>
    <StatusTrackerChart
      :data="statusHistory"
      :categories="statusCategories"
      title="api.example.com"
      summary="99.94% uptime"
      start-label="90 days ago"
      end-label="Today"
      :height="30"
      :bar-width="7"
      :bar-gap="3"
    />

    <h2>Fixed visible window</h2>
    <StatusTrackerChart
      :data="statusHistory.slice(-30)"
      :categories="statusCategories"
      title="checkout.example.com"
      summary="Last 30 days"
      start-label="30 days ago"
      end-label="Today"
      :visible-bars="30"
      :height="36"
      :bar-width="12"
      :bar-gap="4"
    />
  </main>
</template>
