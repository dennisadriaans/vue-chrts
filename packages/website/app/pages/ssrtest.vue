<script setup lang="ts">
import Sparkline from '~/components/lib/Sparkline/Sparkline.vue'
import StatTile from '~/components/lib/StatTile/StatTile.vue'
</script>

<template>
  <div>
    <div data-testid="raw-sparkline">
      <Sparkline
        :data="[1, 4, 2, 6, 3, 8]"
        type="line"
      />
    </div>
    <div data-testid="raw-stattile">
      <StatTile
        label="Test metric"
        value="123"
        :trend="{ value: '+1%', direction: 'up' }"
        :sparkline="[1, 2, 3, 4]"
      />
    </div>
    <div data-testid="raw-docs-sparkline">
      <DocsExamplesSparkline />
    </div>
  </div>
</template>
