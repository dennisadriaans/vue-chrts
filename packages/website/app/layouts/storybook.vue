<script setup lang="ts">
const route = useRoute()

const { data: licenseResponse } = useFetch<{ hasAllAccess: boolean }>('/api/payments/has-license', {
  lazy: true,
  server: false
})
const hasAllAccess = computed(() => licenseResponse.value?.hasAllAccess || false)

provide('hasAllAccess', hasAllAccess)

useHead({
  bodyAttrs: {
    class: 'storybook-theme'
  }
})

const appConfig = useAppConfig()
const originalColors = { ...appConfig.ui.colors }

onMounted(() => {
  updateAppConfig({
    ui: {
      colors: {
        neutral: 'zinc'
      }
    }
  })
})

onUnmounted(() => {
  updateAppConfig({
    ui: {
      colors: originalColors
    }
  })
})

const components = [
  { label: 'AreaChart', icon: 'i-lucide-area-chart', to: '/storybook/area-chart' },
  { label: 'LineChart', icon: 'i-lucide-line-chart', to: '/storybook/line-chart' },
  { label: 'BarChart', icon: 'i-lucide-bar-chart', to: '/storybook/bar-chart' },
  { label: 'DonutChart', icon: 'i-lucide-pie-chart', to: '/storybook/donut-chart' },
  { label: 'ProgressCircle', icon: 'i-lucide-loader-circle', to: '/storybook/progress-circle' },
  { label: 'Calendar', icon: 'i-lucide-calendar', to: '/storybook/calendar' },
  { label: 'CategoryDistribution', icon: 'i-lucide-pie-chart', to: '/storybook/category-distribution' },
  { label: 'StatusTracker', icon: 'i-lucide-activity', to: '/storybook/status-tracker' },
  { label: 'CodeBlock', icon: 'i-lucide-code-2', to: '/storybook/code-block' }
]

const isActive = (to: string) => route.path === to
</script>

<template>
  <div class="min-h-screen bg-default">
    <header class="sticky top-0 z-50 border-b border-default bg-(--ui-bg)/80 backdrop-blur-xl">
      <div class="flex h-16 items-center justify-between px-6">
        <div class="flex items-center gap-6">
          <NuxtLink
            to="/storybook"
            class="flex items-center gap-2"
          >
            <UIcon
              name="i-lucide-component"
              class="size-5 text-highlighted"
            />
            <span class="text-sm font-semibold text-highlighted">Components</span>
          </NuxtLink>
          <USeparator
            orientation="vertical"
            class="h-5"
          />
          <NuxtLink to="/">
            <UButton
              label="Back"
              icon="i-hugeicons:arrow-left-01"
              variant="ghost"
              color="neutral"
            />
          </NuxtLink>
        </div>
        <div class="flex items-center gap-3">
          <UBadge
            variant="soft"
            color="neutral"
          >
            <template #leading>
              <span class="size-1.5 rounded-full bg-emerald-500" />
            </template>
            {{ components.length }} Components
          </UBadge>
          <UColorModeButton />
        </div>
      </div>
    </header>

    <div class="flex">
      <aside
        data-testid="storybook-sidebar"
        class="sticky top-16 h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-default bg-default"
      >
        <div class="p-4">
          <div class="mb-4">
            <p class="px-2 text-xs font-medium uppercase tracking-wider text-muted">
              Components
            </p>
          </div>
          <nav
            data-testid="storybook-nav"
            class="space-y-1"
          >
            <NuxtLink
              v-for="component in components"
              :key="component.to"
              :to="component.to"
              :data-testid="`storybook-nav-link-${component.label.toLowerCase()}`"
              class="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all"
              :class="isActive(component.to)
                ? 'bg-elevated text-highlighted'
                : 'text-muted hover:bg-(--ui-bg-elevated)/50 hover:text-default'"
            >
              <UIcon
                :name="component.icon"
                class="size-4 shrink-0"
                :class="isActive(component.to) ? 'text-primary' : 'text-dimmed group-hover:text-muted'"
              />
              <span class="font-medium">{{ component.label }}</span>
              <UIcon
                v-if="isActive(component.to)"
                name="i-lucide-chevron-right"
                class="ml-auto size-4 text-dimmed"
              />
            </NuxtLink>
          </nav>
        </div>
      </aside>

      <main class="min-h-[calc(100vh-4rem)] flex-1 bg-elevated/80 dark:bg-muted/50">
        <slot />
      </main>
    </div>
  </div>
</template>
