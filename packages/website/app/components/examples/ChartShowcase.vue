<script setup lang="ts">
</script>

<template>
  <div class="space-y-12">
    <div>
      <h3 class="text-lg font-semibold mb-4">
        Area Chart
      </h3>
      <ClientOnly>
        <div class="w-full p-4 bg-elevated/50 rounded-lg">
          <BlocksAreaChartsMultipleLines />
        </div>
      </ClientOnly>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-4">
        Bar Chart
      </h3>
      <ClientOnly>
        <div class="w-full p-4 bg-elevated/50 rounded-lg">
          <BlocksBarChartsStackedHorizontal />
        </div>
      </ClientOnly>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-4">
        Line Chart
      </h3>
      <ClientOnly>
        <div class="w-full p-4 bg-elevated/50 rounded-lg">
          <BlocksLineChartsMultiLines />
        </div>
      </ClientOnly>
    </div>

    <slot />
  </div>
</template>
