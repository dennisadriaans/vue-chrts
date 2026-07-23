<script lang="ts" setup>
const data = {
  domain: 'api.example.com',
  uptime: '99.9%',
  operationalStatus: true,
  barWidth: 4,
  barGap: 2,
  startLabel: '90 days ago',
  endLabel: 'Today'
}

const statusData = Array.from({ length: 90 }, (_, index) => {
  const isOffline = index === 3 || index === 45 || index === 88
  return { status: isOffline ? 'offline' : 'online' }
})
</script>

<template>
  <UCard class="w-full">
    <!-- StatusTracker component from CLI see: https://nuxtcharts.com/docs/components/status-tracker -->
    <LibStatusTracker
      :domain="data.domain"
      :uptime="data.uptime"
      :operational-status="data.operationalStatus"
      :status-data="statusData"
      :bar-width="data.barWidth"
      :bar-gap="data.barGap"
      :start-label="data.startLabel"
      :end-label="data.endLabel"
      class="w-full"
    />
  </UCard>
</template>
