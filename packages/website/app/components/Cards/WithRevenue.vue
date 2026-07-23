<script lang="ts" setup>
defineProps<{
  amount: string
  change: string
  label: string
}>()
</script>

<template>
  <UCard class="!bg-default">
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">
          {{ amount }}
        </h2>
        <UBadge
          color="success"
          variant="solid"
        >
          {{ change }}
        </UBadge>
      </div>
      <p class="text-muted text-sm">
        {{ label }}
      </p>
    </div>
  </UCard>
</template>
