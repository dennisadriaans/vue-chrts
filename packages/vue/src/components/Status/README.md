# StatusTracker Component

The `StatusTracker` (Status) component displays uptime status information with visual indicators for online/offline periods. It's perfect for showing service status, API uptime, or any time-series status data.

## Features

- **Visual Status Indicators**: Color-coded bars showing status over time
- **Uptime Display**: Shows uptime percentage or statistics
- **Customizable**: Configure domain/service name and status data
- **Responsive**: Adapts to container size
- **Clean API**: Simple, intuitive props

## Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Status } from 'vue-chrts';

const TRACKER = ref({
  domain: '192.168.1.1',
  uptime: '99.9%',
  outages: Array.from({ length: 90 }, (_, index) => {
    const isOffline = index === 3 || index === 45 || index === 88;
    return { hour: index, status: isOffline ? 'offline' : 'online' };
  })
});
</script>

<template>
  <Status v-bind="TRACKER" />
</template>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `domain` | `string` | Service name or domain to display |
| `uptime` | `string` | Uptime percentage or status text |
| `outages` | `Array<{ hour: number; status: 'online' \| 'offline' }>` | Array of status data points |

## Examples

### 1. Simple Status Tracker

Basic usage showing service status over the last 48 hours.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Status } from 'vue-chrts';

const statusData = ref({
  domain: 'api.example.com',
  uptime: '100%',
  outages: Array.from({ length: 48 }, (_, index) => ({
    hour: index,
    status: 'online'
  }))
});
</script>

<template>
  <Status v-bind="statusData" />
</template>
```

### 2. Status with Outages

Showing a service with some offline periods.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Status } from 'vue-chrts';

const TRACKER = ref({
  domain: '192.168.1.1',
  uptime: '99.9%',
  outages: Array.from({ length: 90 }, (_, index) => {
    const isOffline = index === 3 || index === 45 || index === 88;
    return { hour: index, status: isOffline ? 'offline' : 'online' };
  })
});
</script>

<template>
  <Status v-bind="TRACKER" />
</template>
```

### 3. Multiple Services

Display multiple service statuses.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Status } from 'vue-chrts';

const services = ref([
  {
    domain: 'API Server',
    uptime: '99.99%',
    outages: Array.from({ length: 50 }, (_, i) => ({ 
      hour: i, 
      status: i === 11 ? 'offline' : 'online' 
    }))
  },
  {
    domain: 'Database',
    uptime: '100%',
    outages: Array.from({ length: 50 }, (_, i) => ({ 
      hour: i, 
      status: 'online' 
    }))
  },
  {
    domain: 'CDN',
    uptime: '98.5%',
    outages: Array.from({ length: 50 }, (_, i) => ({ 
      hour: i, 
      status: (i === 5 || i === 23 || i === 45) ? 'offline' : 'online' 
    }))
  }
]);
</script>

<template>
  <div class="space-y-4">
    <Status v-for="(service, index) in services" :key="index" v-bind="service" />
  </div>
</template>
```

## TypeScript Support

The component is fully typed for type-safe usage:

```typescript
import { Status } from 'vue-chrts';

type StatusData = {
  domain: string;
  uptime: string;
  outages: Array<{ hour: number; status: 'online' | 'offline' }>;
};

const tracker: StatusData = {
  domain: 'my-service.com',
  uptime: '99.9%',
  outages: [
    { hour: 0, status: 'online' },
    { hour: 1, status: 'online' },
    // ... more data
  ]
};
```

## Using v-bind for Cleaner Code

Instead of binding each prop individually:

```vue
<!-- ❌ Verbose approach -->
<Status
  :domain="data.domain"
  :uptime="data.uptime"
  :outages="data.outages"
/>
```

Use `v-bind` to bind the entire object:

```vue
<!-- ✅ Clean approach -->
<Status v-bind="data" />
```

This is especially useful when you have many props or dynamic data from an API.

## Use Cases

- **Service Status Pages**: Display uptime for multiple services
- **API Monitoring**: Track API availability over time
- **Server Monitoring**: Show server uptime and incidents
- **SLA Reporting**: Visualize service level agreement compliance
- **Incident Tracking**: Display historical outages and uptime

## Browser Support

Works in all modern browsers that support ES6+ and SVG.
