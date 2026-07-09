<script setup lang="ts">
import ChartGalleryCard from '~/components/ChartGallery/Card.vue'

interface Props {
  height: number
}

defineProps<Props>()
</script>

<template>
  <div
    id="pastel-dreams"
    class="mb-16 scroll-mt-32"
  >
    <div class="mb-6">
      <h3 class="text-2xl font-semibold">
        Pastel Dreams
      </h3>
      <p class="text-dimmed text-sm mt-1">
        Soft, calming color palettes
      </p>
    </div>
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <ChartGalleryCard
        title="Rose & Lavender Waves"
        category="chart-gallery/themes/pastel-dreams"
        block="pastel-area"
      >
        <ChartGalleryThemesPastelDreamsPastelArea :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Violet Bars"
        category="chart-gallery/themes/pastel-dreams"
        block="pastel-bar"
      >
        <ChartGalleryThemesPastelDreamsPastelBar :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Triple Pastel Lines"
        category="chart-gallery/themes/pastel-dreams"
        block="pastel-line"
      >
        <ChartGalleryThemesPastelDreamsPastelLine :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Soft Segments"
        category="chart-gallery/themes/pastel-dreams"
        block="pastel-donut"
      >
        <ChartGalleryThemesPastelDreamsPastelDonut :height="height" />
      </ChartGalleryCard>
    </div>
  </div>
</template>
