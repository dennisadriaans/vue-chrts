<script setup lang="ts">
import ChartGalleryCard from '~/components/ChartGallery/Card.vue'

interface Props {
  height: number
}

defineProps<Props>()
</script>

<template>
  <div
    id="elegant-lines"
    class="mb-16 scroll-mt-32"
  >
    <div class="mb-6">
      <h3 class="text-2xl font-semibold">
        Elegant Line Charts
      </h3>
      <p class="text-dimmed text-sm mt-1">
        Smooth curves, refined styling, and various curve types
      </p>
    </div>
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <ChartGalleryCard
        title="Teal Cardinal Smooth Wave"
        category="chart-gallery/line/elegant"
        block="teal-cardinal-smooth-wave"
      >
        <ChartGalleryLineElegantTealCardinalSmoothWave :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Triple Basis Interweaved"
        category="chart-gallery/line/elegant"
        block="triple-basis-interweaved"
      >
        <ChartGalleryLineElegantTripleBasisInterweaved :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Red Blue Step Monitor"
        category="chart-gallery/line/elegant"
        block="red-blue-step-monitor"
      >
        <ChartGalleryLineElegantRedBlueStepMonitor :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Green Growth Natural Curve"
        category="chart-gallery/line/elegant"
        block="green-growth-natural-curve"
      >
        <ChartGalleryLineElegantGreenGrowthNaturalCurve :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Violet Monotone Comparison"
        category="chart-gallery/line/elegant"
        block="violet-monotone-comparison"
      >
        <ChartGalleryLineElegantVioletMonotoneComparison :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Heartbeat Linear Sharp Peaks"
        category="chart-gallery/line/elegant"
        block="heartbeat-linear-sharp-peaks"
      >
        <ChartGalleryLineElegantHeartbeatLinearSharpPeaks :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Stock Tracker CatmullRom"
        category="chart-gallery/line/elegant"
        block="stock-tracker-catmull-rom"
      >
        <ChartGalleryLineElegantStockTrackerCatmullRom :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Quad Series Dense Data"
        category="chart-gallery/line/elegant"
        block="quad-series-dense-data"
      >
        <ChartGalleryLineElegantQuadSeriesDenseData :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Minimalist Clean Aesthetic"
        category="chart-gallery/line/elegant"
        block="minimalist-clean-aesthetic"
      >
        <ChartGalleryLineElegantMinimalistCleanAesthetic :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Oscillation Step After"
        category="chart-gallery/line/elegant"
        block="oscillation-step-after"
      >
        <ChartGalleryLineElegantOscillationStepAfter :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Revenue vs Expenses Cardinal"
        category="chart-gallery/line/elegant"
        block="revenuevs-expenses-cardinal"
      >
        <ChartGalleryLineElegantRevenuevsExpensesCardinal :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Interest Rate Subtle Variations"
        category="chart-gallery/line/elegant"
        block="interest-rate-subtle-variations"
      >
        <ChartGalleryLineElegantInterestRateSubtleVariations :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Spiky Analytics Linear Peaks"
        category="chart-gallery/line/elegant"
        block="spiky-analytics-linear-peaks"
      >
        <ChartGalleryLineElegantSpikyAnalyticsLinearPeaks :height="height" />
      </ChartGalleryCard>

      <ChartGalleryCard
        title="Convergence Triple Trend"
        category="chart-gallery/line/elegant"
        block="convergence-triple-trend"
      >
        <ChartGalleryLineElegantConvergenceTripleTrend :height="height" />
      </ChartGalleryCard>
    </div>

    <div class="mt-12">
      <div class="mb-4">
        <h4 class="text-lg font-semibold">
          Classic Line Charts
        </h4>
        <p class="text-dimmed text-sm mt-1">
          Original block-based line chart collection
        </p>
      </div>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ChartGalleryCard
          title="Single Line Chart"
          category="line-charts"
          block="single-line"
        >
          <BlocksLineChartsSingleLine />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Multi Lines Chart"
          category="line-charts"
          block="multi-lines"
        >
          <BlocksLineChartsMultiLines />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Multi Lines Linear"
          category="line-charts"
          block="multi-lines-linear"
        >
          <BlocksLineChartsMultiLinesLinear />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Step Minimal - CPU Monitoring"
          category="line-charts"
          block="step-minimal"
        >
          <BlocksLineChartsStepMinimal />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Smooth Detailed - Financial Data"
          category="line-charts"
          block="smooth-detailed"
        >
          <BlocksLineChartsSmoothDetailed />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Natural Curve - Growth Analytics"
          category="line-charts"
          block="natural-curve"
        >
          <BlocksLineChartsNaturalCurve />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Basis Curve - Performance Metrics"
          category="line-charts"
          block="basis-curve"
        >
          <BlocksLineChartsBasisCurve />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Step After - Inventory Tracking"
          category="line-charts"
          block="step-after"
        >
          <BlocksLineChartsStepAfter />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="CatmullRom Multi - Content Engagement"
          category="line-charts"
          block="catmull-rom-engagement"
        >
          <BlocksLineChartsCatmullRomEngagement />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Cardinal Multi - Performance Monitoring"
          category="chart-gallery/line"
          block="cardinal-performance"
        >
          <ChartGalleryLineCardinalPerformance />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Step Multi - Server Uptime"
          category="chart-gallery/line"
          block="step-server-uptime"
        >
          <ChartGalleryLineStepServerUptime />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Linear Minimal - Stock Trend"
          category="chart-gallery/line"
          block="minimal-linear-stock"
        >
          <ChartGalleryLineMinimalLinearStock />
        </ChartGalleryCard>

        <ChartGalleryCard
          title="Natural Smooth - User Growth"
          category="chart-gallery/line"
          block="natural-growth-curve"
        >
          <ChartGalleryLineNaturalGrowthCurve />
        </ChartGalleryCard>
      </div>
    </div>
  </div>
</template>
