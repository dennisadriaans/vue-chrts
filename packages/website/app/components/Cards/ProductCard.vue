<script lang="ts" setup>
const nuxtDashboard = Array.from({ length: 14 }, (_, i) => {
  const index = i + 1
  return {
    light:
      index <= 4
        ? `/images/dashboard/screenshots/${index}-light-mode.png`
        : undefined,
    dark: `/images/dashboard/screenshots/${index}.png`,
    alt: `Dashboard Layout ${index}`
  }
})

const product = {
  id: 'nuxt-dashboard',
  name: 'Nuxt Dashboard',
  tagline: 'Complete Admin Dashboard',
  description:
    'Transform your data into actionable insights with a premium dashboard template for Nuxt 3, Nuxt UI v3, and Nuxt Charts.',
  price: 99,
  originalPrice: 199,
  image: nuxtDashboard[0], // default preview image
  images: nuxtDashboard, // all dashboard images
  badge: 'Premium',
  features: [
    '6+ Unique Dashboard Layouts',
    '12+ Interactive Chart Types',
    'Full Data Tables & Filters',
    'Kanban Board System',
    'Project Timeline Views',
    'Responsive Design',
    'TypeScript Support',
    'Dark/Light Mode'
  ],
  technologies: [
    { name: 'Nuxt 3', icon: 'i-lucide-layers' },
    { name: 'Vue 3', icon: 'i-lucide-triangle' },
    { name: 'Nuxt UI v3', icon: 'i-lucide-palette' },
    { name: 'TypeScript', icon: 'i-lucide-code' },
    { name: 'Tailwind CSS', icon: 'i-lucide-wind' }
  ],
  stats: {
    downloads: '100+',
    rating: '4.9',
    updates: 'Regular'
  },
  slug: '/templates/nuxt-dashboard',
  purchaseAction: 'purchaseDashboard',
  demoURL: 'https://nuxtcharts.com/templates/nuxt-dashboard'
}

function handlePurchase(action: string) {
  const purchaseFunction = purchaseFunctions[action]
  if (purchaseFunction) {
    purchaseFunction()
  }
}

function openDemo(url: string) {
  if (import.meta.client) {
    window.open(url)
  }
}
</script>

<template>
  <NuxtLink :to="product.slug">
    <UCard
      :ui="{ body: 'p-0 sm:p-0' }"
      class="overflow-hidden rounded-2xl border border-(--ui-border-muted) bg-(--ui-bg-elevated) transition-all duration-300 hover:border-(--ui-primary)"
    >
      <!-- Template Preview -->
      <div class="relative">
        <div class="h-[210px] overflow-hidden rounded-t-xl">
          <img
            :src="product.image.light"
            class="block h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105 dark:hidden"
          >
          <!-- Dark image -->
          <img
            :src="product.image.dark"
            class="hidden h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105 dark:block"
          >
        </div>

        <!-- Badge -->
        <div class="absolute top-4 right-4">
          <UBadge
            :color="product.badge === 'Premium' ? 'primary' : 'success'"
            :variant="product.badge === 'Premium' ? 'solid' : 'outline'"
          >
            {{ product.badge }}
          </UBadge>
        </div>
      </div>

      <!-- Template Info -->
      <div class="p-8">
        <!-- Header -->
        <div class="mb-6">
          <div class="mb-2 flex items-start justify-between">
            <div>
              <h3 class="text-default mb-2 text-2xl font-bold">
                {{ product.name }}
              </h3>
              <p class="text-sm text-(--ui-primary)">
                {{ product.tagline }}
              </p>
            </div>
            <div
              class="flex flex-col items-center gap-2 text-right lg:flex-row"
            >
              <div class="text-muted text-sm line-through">
                ${{ product.originalPrice }}
              </div>
              <div class="text-default text-2xl font-bold">
                ${{ product.price }}
              </div>
            </div>
          </div>
          <p class="text-toned dark:text-muted">
            {{ product.description }}
          </p>
        </div>

        <!-- Features -->
        <div class="mb-8 hidden">
          <h4 class="text-default mb-3 text-sm font-semibold">Key Features</h4>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="feature in product.features"
              :key="feature"
              class="text-muted flex items-center gap-2 text-sm"
            >
              <UIcon
                name="i-lucide-check"
                class="h-3 w-3 text-(--ui-primary)"
              />
              <span>{{ feature }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-3">
          <UButton
            size="xl"
            class="flex w-full items-center justify-center font-semibold"
            :loading="false"
            :disabled="product.badge === 'Soon'"
            @click="handlePurchase(product.purchaseAction)"
          >
            <UIcon
              name="i-lucide-shopping-cart"
              class="mr-2 h-4 w-4"
            />

            {{
              product.badge === 'Soon'
                ? '(Coming Soon)'
                : product.badge === 'Early'
                  ? 'Early version'
                  : product.badge === 'Free'
                    ? 'Free Download'
                    : `Purchase Now for $${product.price}`
            }}
          </UButton>

          <UButton
            color="neutral"
            variant="outline"
            :disabled="product.badge === 'Soon'"
            size="xl"
            class="flex w-full items-center justify-center font-semibold"
            @click.stop="openDemo(product.demoURL)"
          >
            <UIcon
              name="i-lucide-eye"
              class="mr-2 h-4 w-4"
            />
            Live Preview
            {{ product.badge === 'Soon' ? '(Coming Soon)' : '' }}
          </UButton>
        </div>

        <!-- Guarantee -->
        <div class="mt-4 text-center">
          <div
            class="text-muted flex items-center justify-center gap-6 rounded-lg border border-green-100 bg-green-50 p-3 text-xs dark:border-green-800/30 dark:bg-green-900/10"
          >
            <div class="flex items-center gap-1">
              <UIcon
                name="i-lucide-shield-check"
                class="h-4 w-4 text-green-600"
              />
              <span class="font-medium">Secure Payment</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon
                name="i-lucide-download"
                class="h-4 w-4 text-green-600"
              />
              <span class="font-medium">Instant Access</span>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </NuxtLink>
</template>
