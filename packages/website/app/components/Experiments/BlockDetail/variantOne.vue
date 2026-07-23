<script lang="ts" setup>
import type { Ref } from 'vue'
import { BLOCK_CATEGORIES } from '~/config/blocks'

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

const hasAllAccess = inject<Ref<boolean>>('hasAllAccess', ref(false))

const {
  categories: blockCategories,
  blocks: searchResults,
  searchQuery,
  isSearching,
  search
} = useBlocks()

const searchValue = computed({
  get: () => searchQuery.value,
  set: value => search(typeof value === 'string' ? value : '')
})

const categoryConfigBySlug = new Map(BLOCK_CATEGORIES.map(config => [config.slug, config] as const))

const categories = computed(() => {
  return blockCategories.value.map((category) => {
    const config = categoryConfigBySlug.get(category.slug)

    return {
      ...category,
      description: config?.description ?? 'Copy-paste ready blocks for your next interface.',
      icon: config?.icon ?? 'i-lucide-layout-grid',
      isNew: config?.new ?? false
    }
  })
})

const activeCategorySlug = ref(categories.value[0]?.slug || '')

function setActiveCategory(slug: string) {
  activeCategorySlug.value = slug

  // Auto scroll to top of blocks sections
  const element = document.getElementById('blocks-content')
  if (element) {
    const headerOffset = 100
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

function getCategorySectionId(slug: string) {
  return `category-${slug.replaceAll('/', '-')}`
}

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

const getComponent = (slug: string) => {
  switch (slug) {
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
      return null
  }
}
</script>

<template>
  <div>
    <div>
      <div
        v-if="isSearching"
        class="mt-10 rounded-3xl border border-default bg-default/80 p-6"
      >
        <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div class="text-sm text-toned">
              Search results
            </div>
            <h2 class="text-2xl font-semibold text-highlighted">
              {{ searchResults.length }} matching block{{ searchResults.length === 1 ? '' : 's' }}
            </h2>
          </div>

          <div class="text-sm text-muted">
            Showing matches across every block category.
          </div>
        </div>

        <BlocksSearchResults :blocks="searchResults" />
      </div>

      <div
        v-else
        class="mx-auto mt-10 max-w-screen-2xl lg:grid lg:grid-cols-[250px_1fr_100px] lg:gap-8"
      >
        <aside class="hidden lg:block">
          <div class="sticky top-24 rounded-3xl border border-default bg-default/80 p-5">
            <div class="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
              Categories
            </div>

            <div class="space-y-1">
              <UButton
                v-for="category in categories"
                :key="category.slug"
                color="neutral"
                :variant="activeCategorySlug === category.slug ? 'soft' : 'ghost'"
                class="w-full justify-between rounded-xl px-3 py-2"
                @click="setActiveCategory(category.slug)"
              >
                <span class="truncate text-sm">{{ category.title }}</span>
                <UBadge
                  v-if="category.blocks.length"
                  size="sm"
                  variant="subtle"
                  color="neutral"
                  class="bg-muted/30 font-normal text-muted"
                >
                  {{ category.blocks.length }}
                </UBadge>
              </UButton>
            </div>
          </div>
        </aside>

        <div
          id="blocks-content"
          class="w-full space-y-16"
        >
          <template
            v-for="category in categories"
            :key="category.slug"
          >
            <section
              v-if="activeCategorySlug === category.slug"
              :id="getCategorySectionId(category.slug)"
              class="scroll-mt-24"
            >
              <div class="rounded-3xl border border-default bg-default/80 p-6 sm:p-8">
                <component
                  :is="getComponent(category.slug)"
                />
              </div>
            </section>
          </template>
        </div>

        <!-- Spacer for centering -->
        <div class="hidden lg:block" />
      </div>
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
