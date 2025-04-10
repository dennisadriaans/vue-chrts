# Vue Charts Monorepo

A monorepo for Vue chart components and their corresponding Nuxt module.

## Packages

- [`vue-chrts`](./packages/vue) - Vue 3 chart components library
- [`@vue-chrts/nuxt`](./packages/nuxt) - Nuxt 3 module for Vue Charts

## Development

This project uses pnpm as the package manager.

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Development mode for Vue package
pnpm dev:vue

# Development mode for Nuxt module
pnpm dev:nuxt
```

## Usage

### Vue Package

```bash
npm install vue-chrts
```

```vue
<template>
  <LineChart 
    :data="data" 
    :height="300"
    :accessor="accessor"
  />
</template>

<script setup>
import { LineChart } from 'vue-chrts'

const data = [
  { date: '2023-01', value: 100 },
  { date: '2023-02', value: 200 },
  { date: '2023-03', value: 150 }
]

const accessor = (d) => d.value
</script>
```

### Nuxt Module

```bash
npm install @vue-chrts/nuxt
```

Add to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@vue-chrts/nuxt'],
  
  // Optional configuration
  vueChrts: {
    prefix: 'Chrt', // default
    global: true,    // default
    include: []      // default, include all components
  }
})
```

Then use in your Nuxt components:

```vue
<template>
  <ChrtLineChart 
    :data="data" 
    :height="300"
    :accessor="accessor"
  />
</template>

<script setup>
const data = [
  { date: '2023-01', value: 100 },
  { date: '2023-02', value: 200 },
  { date: '2023-03', value: 150 }
]

const accessor = (d) => d.value
</script>
```

## License

MIT