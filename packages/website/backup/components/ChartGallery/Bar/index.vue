<script setup lang="ts">
import ChartGalleryCard from '~/components/ChartGallery/Card.vue'

interface Props {
  height: number
}

defineProps<Props>()
</script>

<template>
  <div
    id="vibrant-bars"
    class="mb-16 scroll-mt-32"
  >
    <div class="mb-6">
      <h3 class="text-2xl font-semibold">
        Vibrant Bar Charts
      </h3>
      <p class="text-dimmed text-sm mt-1">
        Bold colors with various radius, grouping, and styling options
      </p>
    </div>
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <ChartGalleryCard
        title="Bar — Vibrant Rose Rounded"
        category="chart-gallery/bar"
        block="vibrant-rose-rounded"
      >
        <ChartGalleryBarVibrantRoseRounded :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Bar — Purple Cyan Grouped"
        category="chart-gallery/bar"
        block="vibrant-purple-cyan-grouped"
      >
        <ChartGalleryBarVibrantPurpleCyanGrouped :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Bar — Vibrant Sunset Stacked"
        category="chart-gallery/bar"
        block="vibrant-sunset-stacked"
      >
        <ChartGalleryBarVibrantSunsetStacked :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Bar — Vibrant Hot Pink Sharp"
        category="chart-gallery/bar"
        block="vibrant-hot-pink-sharp"
      >
        <ChartGalleryBarVibrantHotPinkSharp :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Bar — Emerald Horizontal"
        category="chart-gallery/bar"
        block="vibrant-emerald-horizontal"
      >
        <ChartGalleryBarVibrantEmeraldHorizontal :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Bar — Vibrant Rainbow Stacked"
        category="chart-gallery/bar"
        block="vibrant-rainbow-stacked"
      >
        <ChartGalleryBarVibrantRainbowStacked :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Bar — Electric Blue Pill"
        category="chart-gallery/bar"
        block="vibrant-electric-blue-pill"
      >
        <ChartGalleryBarVibrantElectricBluePill :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Bar — Coral Contrast Grouped"
        category="chart-gallery/bar"
        block="vibrant-coral-contrast-grouped"
      >
        <ChartGalleryBarVibrantCoralContrastGrouped :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Bar — Vibrant Violet Minimal"
        category="chart-gallery/bar"
        block="vibrant-violet-minimal"
      >
        <ChartGalleryBarVibrantVioletMinimal :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Bar — Dual Tone Comparison"
        category="chart-gallery/bar"
        block="vibrant-dual-tone-comparison"
      >
        <ChartGalleryBarVibrantDualToneComparison :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Bar — Rose Tasks Tight"
        category="chart-gallery/bar"
        block="vibrant-rose-tasks-tight"
      >
        <ChartGalleryBarVibrantRoseTasksTight :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Bar — Ocean Depths Horizontal"
        category="chart-gallery/bar"
        block="vibrant-ocean-depths-horizontal-stacked"
      >
        <ChartGalleryBarVibrantOceanDepthsHorizontalStacked :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Bar — Tangerine Wide Padding"
        category="chart-gallery/bar"
        block="vibrant-tangerine-wide-padding"
      >
        <ChartGalleryBarVibrantTangerineWidePadding :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Bar — Emerald Triple Stacked"
        category="chart-gallery/bar"
        block="vibrant-emerald-triple-stacked"
      >
        <ChartGalleryBarVibrantEmeraldTripleStacked :height="height" />
      </ChartGalleryCard>
    </div>

    <div class="mt-12">
      <div class="mb-4">
        <h4 class="text-lg font-semibold">
          Classic Bar Charts
        </h4>
        <p class="text-dimmed text-sm mt-1">
          Original block-based bar chart collection
        </p>
      </div>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ChartGalleryCard
          title="Grouped Financial - Department Budgets"
          category="bar-charts"
          block="grouped-financial"
        >
          <BlocksBarChartsGroupedFinancial />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Grouped Multi - Financial Overview"
          category="chart-gallery/bar"
          block="grouped-financials"
        >
          <ChartGalleryBarGroupedFinancials />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Stacked Multi - Team Hours Tracking"
          category="chart-gallery/bar"
          block="stacked-team-hours"
        >
          <ChartGalleryBarStackedTeamHours />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Grid Detailed - Period Comparison"
          category="chart-gallery/bar"
          block="grid-detailed-comparison"
        >
          <ChartGalleryBarGridDetailedComparison />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Minimal Rounded - Product Ratings"
          category="chart-gallery/bar"
          block="minimal-ratings"
        >
          <ChartGalleryBarMinimalRatings />
        </ChartGalleryCard>
      </div>
    </div>
  </div>
</template>
