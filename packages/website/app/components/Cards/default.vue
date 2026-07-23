<script setup lang="ts">
defineProps<{
  name: string
  stat: string
  change: string
  changeType: string
}>()
</script>

<template>
  <UCard class="!bg-default">
    <div class="mb-2 flex items-center justify-between">
      <div class="text-muted text-sm">
        {{ name }}
      </div>
      <UBadge
        variant="soft"
        :color="changeType === 'positive' ? 'success' : 'error'"
      >
        {{ change }}
      </UBadge>
    </div>

    <div class="flex items-center justify-between">
      <div class="text-2xl font-semibold">
        {{ stat }}
      </div>
    </div>
  </UCard>
</template>
