<script setup lang="ts">
import ChartGalleryCard from '~/components/ChartGallery/Card.vue'

interface Props {
  height: number
}

defineProps<Props>()
</script>

<template>
  <div
    id="minimal-area"
    class="mb-16 scroll-mt-32"
  >
    <div class="mb-6">
      <h3 class="text-2xl font-semibold">
        Minimal Area Charts
      </h3>
      <p class="text-dimmed text-sm mt-1">
        Clean, understated designs with subtle gradients
      </p>
    </div>

    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <ChartGalleryCard
        title="Area — Monotone Smooth"
        category="chart-gallery/area"
        block="monotone-smooth"
      >
        <ChartGalleryAreaMonotoneSmooth :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Area — Digital Signal"
        category="chart-gallery/area"
        block="digital-signal"
      >
        <ChartGalleryAreaDigitalSignal :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Area — Linear Clean"
        category="chart-gallery/area"
        block="linear-clean"
      >
        <ChartGalleryAreaLinearClean :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Area — Monotone Engagement"
        category="chart-gallery/area"
        block="monotone-engagement"
      >
        <ChartGalleryAreaMonotoneEngagement :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Area — Natural Basis Revenue"
        category="chart-gallery/area"
        block="natural-basis-revenue"
      >
        <ChartGalleryAreaNaturalBasisRevenue :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Area — Step After Multi Metrics"
        category="chart-gallery/area"
        block="step-after-multi-metrics"
      >
        <ChartGalleryAreaStepAfterMultiMetrics :height="height" />
      </ChartGalleryCard>
    </div>

    <div class="mt-12">
      <div class="mb-4">
        <h4 class="text-lg font-semibold">
          Classic Area Charts
        </h4>
        <p class="text-dimmed text-sm mt-1">
          Original block-based examples and research variants
        </p>
      </div>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ChartGalleryCard
          title="Basic Area Chart"
          category="area-charts"
          block="basic"
        >
          <BlocksAreaChartsBasic />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Single Line Area"
          category="area-charts"
          block="single-line"
        >
          <BlocksAreaChartsSingleLine />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Multiple Lines Area"
          category="area-charts"
          block="multiple-lines"
        >
          <BlocksAreaChartsMultipleLines />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Step Chart - Quarterly Data"
          category="area-charts"
          block="gradient-step"
        >
          <BlocksAreaChartsGradientStep />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Detailed Grid - Multi-series"
          category="area-charts"
          block="detailed-grid"
        >
          <BlocksAreaChartsDetailedGrid />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Monotone Smooth - App Analytics"
          category="area-charts"
          block="monotone-smooth"
        >
          <BlocksAreaChartsMonotoneSmooth />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Cardinal Multi - Traffic Analytics"
          category="area-charts"
          block="cardinal-multi"
        >
          <BlocksAreaChartsCardinalMulti />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="CatmullRom Smooth - Sensor Data"
          category="area-charts"
          block="catmull-rom-smooth"
        >
          <BlocksAreaChartsCatmullRomSmooth />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Basis Multi - Performance Metrics"
          category="area-charts"
          block="basis-multi-metrics"
        >
          <BlocksAreaChartsBasisMultiMetrics />
        </ChartGalleryCard>
      </div>
    </div>
  </div>
</template>
