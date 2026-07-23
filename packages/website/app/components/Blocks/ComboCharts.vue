<script lang="ts" setup>
defineOptions({
  tags: ['blocks', 'combo-charts']
})
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-3 py-16 text-center">
    <h2 class="text-highlighted text-xl font-semibold">
      Combo Charts coming in v3.1
    </h2>
    <p class="text-muted text-sm">
      Dual-axis bar + line charts ship with the upcoming
      <code>ComposedChart</code> adapter. They are not part of the v3 beta.
    </p>
    <UButton to="/blocks" label="Back to blocks" color="neutral" variant="outline" />
  </div>
</template>
