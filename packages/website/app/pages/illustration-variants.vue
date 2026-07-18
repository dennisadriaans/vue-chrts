<script lang="ts" setup>
useSeoMeta({
  title: 'Illustration variants | Nuxt Charts',
  robots: 'noindex, nofollow'
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://nuxtcharts.com/illustration-variants'
    }
  ]
})

const sections = [
  {
    id: 'variant-1',
    label: 'Variant 1',
    title: 'Clean glyphs',
    description: 'Homepage section A — animated chart marks, no chrome.',
    component: 'one'
  },
  {
    id: 'variant-2',
    label: 'Variant 2',
    title: 'Blueprint cards',
    description: 'Homepage section B — framed UI mockups with axes and markers.',
    component: 'two'
  },
  {
    id: 'variant-3',
    label: 'Variant 3',
    title: 'Soft panels',
    description: 'Soft elevated panels with quiet grids and generous whitespace.',
    component: 'three'
  },
  {
    id: 'variant-4',
    label: 'Variant 4',
    title: 'Geometric',
    description: 'Construction grid, sharp angles, diamond markers — abstract geometric marks.',
    component: 'four'
  },
  {
    id: 'variant-5',
    label: 'Variant 5',
    title: 'Isometric precision',
    description: '30° isometric projection with dimension marks, fine grid, and measured readouts.',
    component: 'five'
  },
  {
    id: 'variant-6',
    label: 'Variant 6',
    title: 'Geist mono',
    description: 'Minimal monochrome — hairline axes, square markers, opacity hierarchy. Design-system calm.',
    component: 'six'
  }
] as const
</script>

<template>
  <div class="relative">
    <header class="mx-auto max-w-3xl px-4 pt-28 pb-12 text-center lg:pt-36">
      <p class="text-primary text-sm font-medium tracking-wide uppercase">
        Internal playground
      </p>
      <h1 class="text-highlighted mt-3 text-3xl font-bold tracking-tight lg:text-5xl">
        Chart illustration variants
      </h1>
      <p class="text-muted mx-auto mt-4 max-w-xl text-pretty lg:text-lg">
        Side-by-side sections to compare illustration quality. Pick the strongest set for the homepage.
      </p>
      <nav class="mt-8 flex flex-wrap items-center justify-center gap-2">
        <UButton
          v-for="section in sections"
          :key="section.id"
          :to="`#${section.id}`"
          size="sm"
          color="neutral"
          variant="soft"
        >
          {{ section.label }}
        </UButton>
      </nav>
    </header>

    <div
      v-for="section in sections"
      :id="section.id"
      :key="section.id"
      class="scroll-mt-24"
    >
      <UPageSection
        :headline="section.label"
        :title="section.title"
        :description="section.description"
        :ui="{
          container: 'max-w-8xl mx-auto mb-8 py-8 sm:py-12 lg:py-20 gap-8 sm:gap-0'
        }"
      >
        <HomeChartCardsWrapper v-if="section.component === 'one'" />
        <HomeChartCardsWrapperTwo v-else-if="section.component === 'two'" />
        <HomeChartCardsWrapperThree v-else-if="section.component === 'three'" />
        <HomeChartCardsWrapperFour v-else-if="section.component === 'four'" />
        <HomeChartCardsWrapperFive v-else-if="section.component === 'five'" />
        <HomeChartCardsWrapperSix v-else-if="section.component === 'six'" />
      </UPageSection>
    </div>
  </div>
</template>
