<script lang="ts" setup>
defineOptions({
  tags: ['barlists', 'pages']
})

const PageData = [
  {
    page: '/products/overview',
    visits: 1250
  },
  {
    page: '/pricing',
    visits: 1100
  },
  {
    page: '/features',
    visits: 980
  },
  {
    page: '/contact-us',
    visits: 720
  },
  {
    page: '/about-us',
    visits: 650
  },
  {
    page: '/blog/latest-post',
    visits: 580
  },
  {
    page: '/docs/getting-started',
    visits: 450
  },
  {
    page: '/examples/bar-list',
    visits: 390
  },
  {
    page: '/components/card',
    visits: 310
  },
  {
    page: '/components/button',
    visits: 280
  },
  {
    page: '/docs/configuration',
    visits: 210
  },
  {
    page: '/examples/line-chart',
    visits: 180
  }
]

const maxTraffic = Math.max(...PageData.map(p => p.visits))

const getTrafficBarWidth = (traffic: number) => {
  const percentage = (traffic / maxTraffic) * 100
  return { width: `${percentage}%` }
}

const initialVisibleRows = 5
const visibleRows = ref(initialVisibleRows)

const displayedPages = computed(() => PageData.slice(0, visibleRows.value))

const showMore = () => {
  visibleRows.value = Math.min(visibleRows.value + 5, PageData.length)
}

const showLess = () => {
  visibleRows.value = Math.max(visibleRows.value - 5, initialVisibleRows)
}

const canShowMore = computed(() => visibleRows.value < PageData.length)
const canShowLess = computed(() => visibleRows.value > initialVisibleRows)
</script>

<template>
  <UCard class="!bg-default mx-auto max-w-lg">
    <div
      class="border-default flex items-center justify-between border-b pb-4 text-sm font-medium"
    >
      <h2 class="text-xl font-semibold tracking-tight">
        Top pages
      </h2>
      <span>Visitors</span>
    </div>

    <div class="space-y-2 py-4">
      <div
        v-for="(pageItem, key) in displayedPages"
        :key="key"
        class="flex items-center justify-between text-sm"
      >
        <div class="w-3/4">
          <div
            :style="getTrafficBarWidth(pageItem.visits)"
            class="border-default flex items-center truncate rounded border bg-(--ui-primary) px-2 py-1 text-(--ui-text-inverted)"
          >
            {{ pageItem.page }}
          </div>
        </div>
        <span class="text-muted font-medium">
          {{ pageItem.visits }}
        </span>
      </div>
    </div>

    <div class="flex justify-center gap-4 pt-4">
      <UButton
        v-if="canShowLess"
        color="neutral"
        variant="subtle"
        label="Show Less"
        @click="showLess"
      />
      <UButton
        v-if="canShowMore"
        color="neutral"
        variant="subtle"
        label="Show More"
        @click="showMore"
      />
    </div>
  </UCard>
</template>
