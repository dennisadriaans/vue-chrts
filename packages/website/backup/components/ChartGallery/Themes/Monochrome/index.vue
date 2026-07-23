<script setup lang="ts">
import ChartGalleryCard from '~/components/ChartGallery/Card.vue'

interface Props { height: number }
defineProps<Props>()
</script>

<template>
  <div
    id="monochrome"
    class="mb-16 scroll-mt-32"
  >
    <div class="mb-6">
      <h3 class="text-2xl font-semibold">
        Monochrome Collection
      </h3>
      <p class="text-dimmed text-sm mt-1">
        Grayscale elegance for professional dashboards
      </p>
    </div>
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <ChartGalleryCard
        title="Gray Area - Monotone"
        category="chart-gallery/themes/monochrome"
        block="mono-area"
      >
        <ChartGalleryThemesMonochromeMonoArea :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Charcoal Bars - Sharp"
        category="chart-gallery/themes/monochrome"
        block="mono-bar"
      >
        <ChartGalleryThemesMonochromeMonoBar :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Dual Tone Lines"
        category="chart-gallery/themes/monochrome"
        block="mono-line"
      >
        <ChartGalleryThemesMonochromeMonoLine :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Progress Ring"
        category="chart-gallery/themes/monochrome"
        block="mono-donut"
      >
        <ChartGalleryThemesMonochromeMonoDonut :height="height" />
      </ChartGalleryCard>
    </div>
  </div>
</template>
