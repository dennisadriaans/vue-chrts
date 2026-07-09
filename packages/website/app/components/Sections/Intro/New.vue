<script setup lang="ts">
const activeTabIndex = ref('1')

const items = [
  {
    label: 'Area Charts',
    title: 'Revenue Growth',
    description: 'Revenue performance comparison from last year.'
  },
  {
    label: 'Bar Charts',
    title: 'Spending Overview',
    description: 'Detailed monthly spending breakdown for current year.'
  },
  {
    label: 'Line Charts',
    title: 'Income vs Expenses',
    description: 'Comparison between monthly income and total expenses.'
  },
  {
    label: 'Donut Charts',
    title: 'Revenue Distribution',
    description: 'Monthly revenue breakdown by product category.'
  }
]

const activeItem = computed(() => items[Number(activeTabIndex.value)])
</script>

<template>
  <UCard
    class="max-w-5xl mx-auto"
    :ui="{ root: 'rounded-3xl sm:p-2 relative lg:pb-24' }"
    variant="subtle"
  >
    <div class="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar px-4 sm:px-0 -mt-2 mb-2">
      <UTabs
        v-model="activeTabIndex"
        :items="items"
        :content="false"
        variant="pill"
        color="neutral"
        size="xl"
        class="min-w-max"
        :ui="{
          list: 'bg-transparent',
          indicator: 'bg-default shadow-xs border border-default',
          trigger: 'data-[state=active]:text-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverted px-4 py-2.5 whitespace-nowrap'
        }"
      />
    </div>

    <div class="max-w-3xl mx-auto mt-3">
      <UCard
        class="bg-default/60!"
        :ui="{ root: 'rounded-3xl shadow-sm', body: 'sm:pb-4 pb-4' }"
      >
        <div class="space-y-4">
          <div>
            <h2 class="text-lg font-semibold text-highlighted">
              {{ activeItem.title }}
            </h2>
            <p class="text-muted line-clamp-1">
              {{ activeItem.description }}
            </p>
          </div>

          <UCard
            variant="subtle"
            :ui="{ root: 'overflow-hidden flex flex-col lg:min-h-[320px]', body: 'flex-1 p-0 relative h-full' }"
          >
            <div class="grid h-full w-full">
              <Transition name="slide-up">
                <div
                  :key="activeTabIndex"
                  class="col-start-1 row-start-1 h-full w-full p-6 flex flex-col justify-center"
                >
                  <SectionsIntroChartsAreaPreview v-if="activeTabIndex === '0'" />
                  <SectionsIntroChartsBarPreview v-if="activeTabIndex === '1'" />
                  <SectionsIntroChartsLinePreview v-if="activeTabIndex === '2'" />
                  <SectionsIntroChartsDonutPreview v-if="activeTabIndex === '3'" />
                </div>
              </Transition>
            </div>
          </UCard>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="bg-primary h-2 w-2 animate-pulse rounded-full" />
              <span class="dark:text-muted text-sm tracking-tighter">Live performance</span>
            </div>
            <div class="flex gap-2">
              <UButton
                icon="i-lucide-arrow-right"
                trailing
                color="neutral"
                variant="ghost"
              >
                View Details
              </UButton>
            </div>
          </div>
        </div>
      </UCard>

      <div class="flex justify-center gap-1 mt-8">
        <div
          v-for="(_, index) in items"
          :key="index"
          class="h-1.5 rounded-full transition-all duration-500 cursor-pointer"
          :class="String(index) === activeTabIndex ? 'w-4 bg-inverted/50' : 'w-1.5 bg-muted'"
          @click="activeTabIndex = String(index)"
        />
      </div>
    </div>

    <div class="lg:mt-8 lg:absolute lg:left-0 lg:bottom-0 py-6 px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full">
      <div>
        <h4 class="text-lg font-semibold text-highlighted">
          Charts for Vue and Nuxt
        </h4>
        <p class="text-sm text-dimmed">
          Learn more about all different type of charts and checkout the docs.
        </p>
      </div>
      <NuxtLink
        to="/blocks"
        class="w-full sm:w-auto"
      >
        <UButton
          color="neutral"
          trailing-icon="i-hugeicons-arrow-right-02"
          class="w-full sm:w-auto justify-center"
        >
          Premium Blocks
        </UButton>
      </NuxtLink>
    </div>
  </UCard>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
