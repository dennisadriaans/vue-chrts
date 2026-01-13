<script lang="ts" setup>
import { ref } from 'vue';
import { StatusTracker } from "../lib";

const TRACKER = ref({
  domain: '192.168.1.1',
  uptime: '99.9%',
  operationalStatus: true,
  barWidth: 4,
  barGap: 2,
  startLabel: '90 days ago',
  endLabel: 'Today',
  statusData: Array.from({ length: 90 }, (_, index) => {
    const isOffline = index === 3 || index === 45 || index === 88;
    return { status: isOffline ? 'offline' : 'online' };
  })
});

const services = ref([
  {
    domain: 'API Gateway',
    uptime: '99.99%',
    operationalStatus: true,
    barWidth: 4,
    barGap: 2,
    startLabel: '90 days ago',
    endLabel: 'Today',
    statusData: Array.from({ length: 90 }, (_, i) => ({ 
      status: i === 45 ? 'offline' : 'online' 
    }))
  },
  {
    domain: 'Database Cluster',
    uptime: '100%',
    operationalStatus: true,
    barWidth: 4,
    barGap: 2,
    startLabel: '90 days ago',
    endLabel: 'Today',
    statusData: Array.from({ length: 90 }, () => ({ 
      status: 'online' 
    }))
  },
  {
    domain: 'CDN',
    uptime: '98.5%',
    operationalStatus: false,
    barWidth: 4,
    barGap: 2,
    startLabel: '90 days ago',
    endLabel: 'Today',
    statusData: Array.from({ length: 90 }, (_, i) => ({ 
      status: (i === 3 || i === 45 || i === 88 || i === 89) ? 'offline' : 'online' 
    }))
  }
]);
</script>

<template>
  <div class="my-24 space-y-8 max-w-4xl mx-auto">
    <div>
      <h2 class="text-2xl font-bold mb-4">Single Service Status</h2>
      <StatusTracker v-bind="TRACKER" />
    </div>

    <div>
      <h2 class="text-2xl font-bold mb-4">Multiple Services Dashboard</h2>
      <div class="space-y-4">
        <StatusTracker 
          v-for="(service, index) in services" 
          :key="index" 
          v-bind="service" 
        />
      </div>
    </div>
  </div>
</template>
