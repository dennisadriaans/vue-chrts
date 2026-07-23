<script setup lang="ts">
defineOptions({
  tags: ['blocks', 'heatmaps']
})
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">
        Heatmaps
      </h2>
      <p class="text-toned dark:text-muted">
        GitHub-style contribution grids that plot a value per day across weeks
        and months — ideal for activity, streaks and usage density.
      </p>
    </div>

    <ClientOnly>
      <div class="mt-12 space-y-24 lg:mt-0">
        <PreviewExample title="Contribution Year">
          <template #chart>
            <BlocksHeatmapsContributionYear />
          </template>
          <PreviewCode
            id="heatmap-contribution-year"
            category="heatmaps"
            block="contribution-year"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Activity Quarter">
          <template #chart>
            <BlocksHeatmapsActivityQuarter />
          </template>
          <PreviewCode
            id="heatmap-activity-quarter"
            category="heatmaps"
            block="activity-quarter"
            :lock-code="true"
          />
        </PreviewExample>
      </div>
    </ClientOnly>
  </div>
</template>
