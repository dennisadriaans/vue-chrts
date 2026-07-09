<script lang="ts" setup>
useSeoMeta({
  title: 'Nuxt UI: 50+ Premium Blocks & Components | Nuxt Charts',
  description:
    'Discover the collection of copy-paste Nuxt building blocks to help you design and develop faster with Nuxt UI and Nuxt Charts.',
  ogTitle: 'Nuxt UI: 50+ Premium Blocks & Components | Nuxt Charts',
  ogDescription:
    'Discover the collection of copy-paste Nuxt building blocks to help you design and develop faster with Nuxt UI and Nuxt Charts.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Nuxt UI: 50+ Premium Blocks & Components | Nuxt Charts',
  twitterDescription:
    'Discover the collection of copy-paste Nuxt building blocks to help you design and develop faster with Nuxt UI and Nuxt Charts.',
  keywords:
    'premium blocks, UI components, responsive sections, web design, web development, templates, front-end, build faster, design system',
  author: 'Nuxt Charts'
})

const hasAllAccess = inject('hasAllAccess', false)

// Floating CTA state
const isFloatingCTAVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isFloatingCTAVisible.value = !hasAllAccess.value
  }, 2000)
})

const dismissFloatingCTA = () => {
  isFloatingCTAVisible.value = false
}
</script>

<template>
  <div class="overflow-hidden">
    <div class="relative border-default mx-auto max-w-7xl gap-4 py-32 lg:pt-32">
      <div class="absolute -inset-y-32 left-1/2 -translate-x-1/2 w-450 -z-10 pointer-events-none overflow-hidden">
        <svg
          class="w-full h-full stroke-(--ui-primary)/20 dark:stroke-(--ui-primary)/15 mask-[radial-gradient(100%_100%_at_top_left,white,transparent_75%)]"
          fill="none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="5"
            x2="45"
            y2="40"
            stroke-width="0.5"
            vector-effect="non-scaling-stroke"
          />
          <line
            x1="5"
            y1="0"
            x2="50"
            y2="35"
            stroke-width="0.5"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div class="flex justify-between items-center">
        <div class="mt-8 max-w-2xl mb-16 space-y-2 text-center mx-auto">
          <h1
            class="mb-4 text-center text-3xl lg:text-4xl font-bold tracking-tight"
          >
            50+ <span class="text-primary">Premium</span> Nuxt UI Blocks
          </h1>
          <p class="text-dimmed px-16 text-lg">
            Explore the collection of copy-paste building blocks to help you
            design and develop faster with Nuxt UI and Nuxt Charts.
          </p>
        </div>
        <!-- <NuxtLink to="/pricing">
          <UButton
            color="neutral"
            variant="soft"
            trailing-icon="i-lucide-arrow-right"
          >
            Get All-Access Pass
          </UButton>
        </NuxtLink> -->
      </div>

      <div class="flex items-center gap-4 mb-8">
        <!-- <UButton
          v-for="category in categories"
          :key="category"
          :label="category"
          color="neutral"
          variant="soft"
          active-variant="solid"
          :active="activeCategory === category"
          @click="activeCategory = category"
        />
      </div> -->

        <BlocksGrid />
      </div>

      <PurchaseNotification />

      <!-- Enhanced Floating CTA (component) -->
      <EnhancedFloatingCTA
        :show="isFloatingCTAVisible"
        class="hidden lg:block"
        @dismiss="dismissFloatingCTA"
      />
    </div>
  </div>
</template>
