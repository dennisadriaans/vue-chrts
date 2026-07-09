<script setup lang="ts">
const model = defineModel<number>({ required: true })

defineProps<{
  label: string
  description?: string
  min?: number
  max?: number
  step?: number
  unit?: string
}>()
</script>

<template>
  <StorybookCustomControl
    :label="label"
    :description="description"
  >
    <div class="flex items-center gap-4 w-48">
      <span class="w-10 text-right text-xs tabular-nums text-muted">{{ model }}{{ unit ?? '' }}</span>
      <USlider
        v-model="model"
        :min="min ?? 0"
        :max="max ?? 100"
        :step="step ?? 1"
        size="xs"
        class="flex-1"
        :ui="{
          track: 'h-[3px]',
          range: '',
          thumb: 'size-2 bg-primary'
        }"
      />
    </div>
  </StorybookCustomControl>
</template>
