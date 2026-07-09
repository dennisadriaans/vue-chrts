<script setup lang="ts">
import ChartGalleryCard from '~/components/ChartGallery/Card.vue'

interface Props { height: number }
defineProps<Props>()
</script>

<template>
  <div
    id="bold-contrast"
    class="mb-16 scroll-mt-32"
  >
    <div class="mb-6">
      <h3 class="text-2xl font-semibold">
        Bold Contrast
      </h3>
      <p class="text-dimmed text-sm mt-1">
        High contrast pairs for maximum visual impact
      </p>
    </div>
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <ChartGalleryCard
        title="Fire & Ice Collision"
        category="chart-gallery/themes/bold-contrast"
        block="bold-area"
      >
        <ChartGalleryThemesBoldContrastBoldArea :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Dark & Light Bars"
        category="chart-gallery/themes/bold-contrast"
        block="bold-bar"
      >
        <ChartGalleryThemesBoldContrastBoldBar :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Hot to Cold Transition"
        category="chart-gallery/themes/bold-contrast"
        block="bold-line"
      >
        <ChartGalleryThemesBoldContrastBoldLine :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Yin Yang Balance"
        category="chart-gallery/themes/bold-contrast"
        block="bold-donut"
      >
        <ChartGalleryThemesBoldContrastBoldDonut :height="height" />
      </ChartGalleryCard>
    </div>
  </div>
</template>
