<script lang="ts" setup>
const route = useRoute()
const slugArray = Array.isArray(route.params.slug)
  ? route.params.slug
  : [route.params.slug]
const fullPath = slugArray.join('/')

const getComponent = () => {
  switch (fullPath) {
    case 'account-users':
      return resolveComponent('BlocksAccountUsers')
    case 'ai':
      return resolveComponent('BlocksAI')
    case 'area-charts':
      return resolveComponent('BlocksAreaCharts')
    case 'bar-charts':
      return resolveComponent('BlocksBarCharts')
    case 'bar-lists':
      return resolveComponent('BlocksBarLists')
    case 'cards':
      return resolveComponent('BlocksCards')
    case 'donut-charts':
      return resolveComponent('BlocksDonutCharts')
    case 'line-charts':
      return resolveComponent('BlocksLineCharts')
    case 'pricing-tables':
      return resolveComponent('BlocksPricingTables')
    case 'status':
      return resolveComponent('BlocksStatusUptime')
    case 'calendar':
      return resolveComponent('BlocksCalendar')
    case 'dashboard/navbar':
      return resolveComponent('BlocksDashboardNavbar')
    case 'application/onboarding':
      return resolveComponent('BlocksApplication')
    case 'application/file-upload':
      return resolveComponent('BlocksFileUpload')

    default:
      throw createError({
        statusCode: 404,
        statusMessage: 'Block not found'
      })
  }
}

const DynamicComponent = getComponent()

const titleMap: Record<string, string> = {
  'account-users': 'Account Users',
  'ai': 'AI Components',
  'charts': 'Charts',
  'area-charts': 'Area Charts',
  'bar-charts': 'Bar Charts',
  'bar-lists': 'Bar Lists',
  'cards': 'Cards',
  'donut-charts': 'Donut Charts',
  'line-charts': 'Line Charts',
  'sections': 'Sections',
  'status': 'Status',
  'heatmaps': 'Heatmaps',
  'timelines': 'Timelines',
  'sparklines': 'Sparklines',
  'dashboard': 'Dashboard',
  'navbar': 'Navbar'
}

const title = titleMap[fullPath] || 'Block'

useSeoMeta({
  title: `${title} | Nuxt Charts Blocks`,
  description: `Explore ${title.toLowerCase()} blocks and components for your Nuxt application with Nuxt Charts.`,
  ogTitle: `${title} Blocks | Nuxt Charts`,
  ogDescription: `Explore ${title.toLowerCase()} blocks and components for your Nuxt application with Nuxt Charts.`
})

const hasAllAccess = inject('hasAllAccess', false)

// Floating CTA state
const isFloatingCTAVisible = ref(false)

// Drawer state for mobile
const drawerOpen = ref(false)

const { categories } = useBlocksNavigation()

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
  <div class="pb-24 pt-12 lg:pt-30">
    <!-- <BlocksNavigation
      key="blocks"
      class="hidden lg:block"
    /> -->

    <div class="fixed right-4 bottom-4 z-50 lg:hidden">
      <UDrawer
        v-model:open="drawerOpen"
        direction="bottom"
      >
        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="soft"
          size="xl"
          class="shadow-lg"
        />

        <template #body>
          <div class="space-y-4">
            <div
              v-for="category in categories"
              :key="category.title"
              class="space-y-1"
            >
              <div
                class="text-dimmed mb-2 text-xs font-semibold tracking-wide uppercase"
              >
                {{ category.title }}
              </div>
              <NuxtLink
                v-for="(item, itemKey) in category.items"
                :key="itemKey"
                :to="item.path"
                @click="drawerOpen = false"
              >
                <UButton
                  variant="link"
                  color="neutral"
                  active-variant="soft"
                  :active="route.path === item.path"
                  class="w-full justify-start"
                >
                  {{ item.label }}
                </UButton>
              </NuxtLink>
            </div>
          </div>
        </template>
      </UDrawer>
    </div>

    <div class="mx-auto max-w-6xl space-y-2 px-6">
      <BlocksBackButton class="mb-8" />
      <component
        :is="DynamicComponent"
      />
      <BlocksBackButton class="mt-8" />
    </div>

    <PurchaseNotification />

    <!-- Enhanced Floating CTA (component) -->
    <EnhancedFloatingCTA
      :show="isFloatingCTAVisible"
      class="hidden lg:block"
      @dismiss="dismissFloatingCTA"
    />
  </div>
</template>
