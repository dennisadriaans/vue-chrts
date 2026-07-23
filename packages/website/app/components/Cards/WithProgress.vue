<script lang="ts" setup>
const props = defineProps<{
  label: string
  value: string | number
  total: number
  progress: number
  button?: {
    label: string
    icon: string
  }
}>()

const percentage = computed(() => {
  const val
    = typeof props.progress === 'string'
      ? parseFloat(props.progress)
      : props.progress
  if (!props.total || isNaN(val)) return 0
  return Math.round((val / props.total) * 100)
})
</script>

<template>
  <UCard>
    <div class="space-y-1">
      <p class="text-muted dark:text-muted">
        {{ label }}
      </p>
      <h2 class="text-xl font-semibold">
        {{ value }}
      </h2>
    </div>

    <div
      class="text-toned dark:-text-muted mt-2 mb-1 flex items-center justify-between text-xs"
    >
      <div>{{ percentage }}%</div>
      <div>{{ progress }} of {{ total }}</div>
    </div>

    <UProgress v-model="percentage" />

    <div class="flex items-center justify-end mt-4">
      <UButton
        variant="ghost"
        color="neutral"
        :trailing="true"
        class="-mr-2"
        v-bind="props.button"
      />
    </div>
  </UCard>
</template>
