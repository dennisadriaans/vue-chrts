<script setup lang="ts">
import ChartGalleryCard from '~/components/ChartGallery/Card.vue'

interface Props { height: number }
defineProps<Props>()
</script>

<template>
  <div
    id="neon-glow"
    class="mb-16 scroll-mt-32"
  >
    <div class="mb-6">
      <h3 class="text-2xl font-semibold">
        Neon Glow Charts
      </h3>
      <p class="text-dimmed text-sm mt-1">
        Bright, electric colors for dark mode impact
      </p>
    </div>
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <ChartGalleryCard
        title="Electric Green - Spike"
        category="chart-gallery/themes/neon-glow"
        block="neon-area"
      >
        <ChartGalleryThemesNeonGlowNeonArea :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Magenta Power"
        category="chart-gallery/themes/neon-glow"
        block="neon-bar"
      >
        <ChartGalleryThemesNeonGlowNeonBar :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Cyan & Orange Pulse"
        category="chart-gallery/themes/neon-glow"
        block="neon-line"
      >
        <ChartGalleryThemesNeonGlowNeonLine :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Neon Spectrum"
        category="chart-gallery/themes/neon-glow"
        block="neon-donut"
      >
        <ChartGalleryThemesNeonGlowNeonDonut :height="height" />
      </ChartGalleryCard>
    </div>
  </div>
</template>
