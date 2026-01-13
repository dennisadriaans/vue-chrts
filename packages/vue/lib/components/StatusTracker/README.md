# StatusTracker Component

The `StatusTracker` component displays uptime status information with visual indicators for online/offline periods over time. It's perfect for showing service status, API uptime, system health, or any time-series status data.

## Features

- **Visual Status Indicators**: Color-coded bars showing online/offline status over time
- **Uptime Display**: Shows uptime percentage or statistics
- **Operational Status**: Visual indicator for current service status
- **Customizable Bars**: Configure bar width and gap spacing
- **Time Labels**: Display start and end time labels
- **Responsive**: Adapts to container size
- **Clean API**: Simple v-bind pattern for easy usage

## Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { StatusTracker } from 'vue-chrts';

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
</script>

<template>
  <StatusTracker v-bind="TRACKER" />
</template>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `domain` | `string` | Service name, domain, or identifier to display |
| `uptime` | `string` | Uptime percentage or status text (e.g., "99.9%") |
| `operationalStatus` | `boolean` | Current operational status (true = online, false = offline) |
| `statusData` | `Array<{ status: 'online' \| 'offline' }>` | Array of status data points for the timeline |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `barWidth` | `number` | `4` | Width of each status bar in pixels |
| `barGap` | `number` | `2` | Gap between status bars in pixels |
| `startLabel` | `string` | `''` | Label for the start of the timeline |
| `endLabel` | `string` | `''` | Label for the end of the timeline |

## Examples

### 1. Simple Status Tracker with v-bind

The recommended way to use StatusTracker is with v-bind for clean, readable code:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { StatusTracker } from 'vue-chrts';

const TRACKER = ref({
  domain: 'api.example.com',
  uptime: '100%',
  operationalStatus: true,
  barWidth: 4,
  barGap: 2,
  startLabel: '30 days ago',
  endLabel: 'Today',
  statusData: Array.from({ length: 30 }, () => ({ 
    status: 'online' 
  }))
});
</script>

<template>
  <StatusTracker v-bind="TRACKER" />
</template>
```

### 2. Service with Outages

Tracking a service with some downtime:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { StatusTracker } from 'vue-chrts';

const SERVICE_STATUS = ref({
  domain: 'database.internal',
  uptime: '99.2%',
  operationalStatus: true,
  barWidth: 5,
  barGap: 1,
  startLabel: '7 days ago',
  endLabel: 'Now',
  statusData: Array.from({ length: 168 }, (_, index) => {
    // Mark hours 23, 67, and 145 as offline
    const isOffline = index === 23 || index === 67 || index === 145;
    return { status: isOffline ? 'offline' : 'online' };
  })
});
</script>

<template>
  <StatusTracker v-bind="SERVICE_STATUS" />
</template>
```

### 3. Multiple Services Dashboard

Display multiple service statuses on a dashboard:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { StatusTracker } from 'vue-chrts';

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
  <div class="space-y-4">
    <StatusTracker 
      v-for="(service, index) in services" 
      :key="index" 
      v-bind="service" 
    />
  </div>
</template>
```

### 4. Real-time Data from API

Fetching status data from an API:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { StatusTracker } from 'vue-chrts';

const tracker = ref({
  domain: 'Loading...',
  uptime: '0%',
  operationalStatus: false,
  barWidth: 4,
  barGap: 2,
  startLabel: '90 days ago',
  endLabel: 'Today',
  statusData: []
});

onMounted(async () => {
  const response = await fetch('/api/status/my-service');
  const data = await response.json();
  tracker.value = data;
});
</script>

<template>
  <StatusTracker v-bind="tracker" />
</template>
```

## TypeScript Support

The component is fully typed for type-safe usage:

```typescript
import { StatusTracker } from 'vue-chrts';

type StatusTrackerData = {
  domain: string;
  uptime: string;
  operationalStatus: boolean;
  barWidth?: number;
  barGap?: number;
  startLabel?: string;
  endLabel?: string;
  statusData: Array<{ status: 'online' | 'offline' }>;
};

const tracker: StatusTrackerData = {
  domain: 'my-service.com',
  uptime: '99.9%',
  operationalStatus: true,
  barWidth: 4,
  barGap: 2,
  startLabel: '90 days ago',
  endLabel: 'Today',
  statusData: [
    { status: 'online' },
    { status: 'online' },
    { status: 'offline' },
    // ... more data
  ]
};
```

## Using v-bind for Cleaner Code

**❌ Verbose approach** - Binding each prop individually:

```vue
<StatusTracker
  :domain="data.domain"
  :uptime="data.uptime"
  :operational-status="data.operationalStatus"
  :bar-width="data.barWidth"
  :bar-gap="data.barGap"
  :start-label="data.startLabel"
  :end-label="data.endLabel"
  :status-data="data.statusData"
/>
```

**✅ Clean approach** - Using v-bind to bind the entire object:

```vue
<StatusTracker v-bind="data" />
```

This is especially useful when:
- You have many props
- You're working with dynamic data from an API
- You want cleaner, more maintainable code
- You need to pass all props from a parent component

## Customization

### Bar Styling

Control the appearance of status bars:

```vue
<script setup lang="ts">
const TRACKER = ref({
  domain: 'Custom Service',
  uptime: '99.5%',
  operationalStatus: true,
  barWidth: 6,    // Wider bars
  barGap: 1,      // Smaller gaps for denser visualization
  startLabel: '6 months ago',
  endLabel: 'Today',
  statusData: Array.from({ length: 180 }, (_, i) => ({ 
    status: Math.random() > 0.95 ? 'offline' : 'online' 
  }))
});
</script>

<template>
  <StatusTracker v-bind="TRACKER" />
</template>
```

### Time Ranges

Display different time ranges:

```vue
<!-- Last 24 hours (hourly) -->
<StatusTracker v-bind="{
  domain: 'API Server',
  uptime: '99.9%',
  operationalStatus: true,
  startLabel: '24 hours ago',
  endLabel: 'Now',
  statusData: hourlyData
}" />

<!-- Last 30 days (daily) -->
<StatusTracker v-bind="{
  domain: 'Database',
  uptime: '100%',
  operationalStatus: true,
  startLabel: '30 days ago',
  endLabel: 'Today',
  statusData: dailyData
}" />

<!-- Last 12 months (monthly) -->
<StatusTracker v-bind="{
  domain: 'CDN',
  uptime: '99.95%',
  operationalStatus: true,
  startLabel: '1 year ago',
  endLabel: 'This month',
  statusData: monthlyData
}" />
```

## Use Cases

- **Service Status Pages**: Public-facing status pages for SaaS products
- **API Monitoring**: Track API availability and uptime
- **Server Monitoring**: Monitor server health and incidents
- **SLA Reporting**: Visualize service level agreement compliance
- **Incident Tracking**: Display historical outages and recovery
- **Infrastructure Monitoring**: Track database, CDN, and service health
- **DevOps Dashboards**: Real-time operational status overview

## Browser Support

Works in all modern browsers that support ES6+ and SVG.
