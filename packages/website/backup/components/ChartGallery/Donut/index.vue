<script setup lang="ts">
import ChartGalleryCard from '~/components/ChartGallery/Card.vue'
</script>

<template>
  <div
    id="gradient-donuts"
    class="mb-16 scroll-mt-32"
  >
    <div class="mb-6">
      <h3 class="text-2xl font-semibold text-highlighted">
        Gradient Donut Charts
      </h3>
      <p class="text-dimmed text-sm mt-1">
        Advanced circular visualizations with custom color spectrums and layouts
      </p>
    </div>
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <ChartGalleryCard
        title="Purple Spectrum"
        category="chart-gallery/donut"
        block="donut-purple-spectrum"
      >
        <div class="flex items-center justify-center py-4">
          <ChartGalleryDonutPurpleSpectrum />
        </div>
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Success Ring"
        category="chart-gallery/donut"
        block="donut-success-ring"
      >
        <div class="flex items-center justify-center py-4">
          <ChartGalleryDonutSuccessRing />
        </div>
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Browser Share"
        category="chart-gallery/donut"
        block="donut-browser-share"
      >
        <div class="flex items-center justify-center py-4">
          <ChartGalleryDonutBrowserShare />
        </div>
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Priority Levels"
        category="chart-gallery/donut"
        block="donut-priority-levels"
      >
        <div class="flex items-center justify-center py-4">
          <ChartGalleryDonutPriorityLevels />
        </div>
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Sunset Gradient"
        category="chart-gallery/donut"
        block="donut-sunset-gradient"
      >
        <div class="flex items-center justify-center py-4">
          <ChartGalleryDonutSunsetGradient />
        </div>
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Ocean Depths"
        category="chart-gallery/donut"
        block="donut-ocean-depths"
      >
        <div class="flex items-center justify-center py-4">
          <ChartGalleryDonutOceanDepths />
        </div>
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Forest Canopy"
        category="chart-gallery/donut"
        block="donut-forest-canopy"
      >
        <div class="flex items-center justify-center py-4">
          <ChartGalleryDonutForestCanopy />
        </div>
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Royal Purple"
        category="chart-gallery/donut"
        block="donut-royal-purple"
      >
        <div class="flex items-center justify-center py-4">
          <ChartGalleryDonutRoyalPurple />
        </div>
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Golden Hour"
        category="chart-gallery/donut"
        block="donut-golden-hour"
      >
        <div class="flex items-center justify-center py-4">
          <ChartGalleryDonutGoldenHour />
        </div>
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Midnight Blues"
        category="chart-gallery/donut"
        block="donut-midnight-blues"
      >
        <div class="flex items-center justify-center py-4">
          <ChartGalleryDonutMidnightBlues />
        </div>
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Rose Petal"
        category="chart-gallery/donut"
        block="donut-rose-petal"
      >
        <div class="flex items-center justify-center py-4">
          <ChartGalleryDonutRosePetal />
        </div>
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Aurora Borealis"
        category="chart-gallery/donut"
        block="donut-aurora-borealis"
      >
        <div class="flex items-center justify-center py-4">
          <ChartGalleryDonutAuroraBorealis />
        </div>
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Monochrome"
        category="chart-gallery/donut"
        block="donut-monochrome"
      >
        <div class="flex items-center justify-center py-4">
          <ChartGalleryDonutMonochrome />
        </div>
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Citrus Splash"
        category="chart-gallery/donut"
        block="donut-citrus-splash"
      >
        <div class="flex items-center justify-center py-4">
          <ChartGalleryDonutCitrusSplash />
        </div>
      </ChartGalleryCard>
    </div>

    <div class="mt-12">
      <div class="mb-4">
        <h4 class="text-lg font-semibold">
          Classic Donut Charts
        </h4>
        <p class="text-dimmed text-sm mt-1">
          Original block-based donut chart collection
        </p>
      </div>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ChartGalleryCard
          title="Basic Donut Chart"
          category="donut-charts"
          block="basic"
        >
          <BlocksDonutChartsBasic />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Donut with Legend"
          category="donut-charts"
          block="with-legend"
        >
          <BlocksDonutChartsWithLegend />
        </ChartGalleryCard>
      </div>
    </div>
  </div>
</template>
