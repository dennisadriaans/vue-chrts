<script setup lang="ts">
definePageMeta({
  layout: 'storybook',
  middleware: ['storybook']
})

const value = ref(75)
const size = ref(80)
const strokeWidth = ref(6)
const textSize = ref('16px')

const textSizeOptions = [
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
  { label: '20px', value: '20px' },
  { label: '24px', value: '24px' },
  { label: '32px', value: '32px' }
]

const componentCode = computed(() => `<ProgressCircle
  :value="${value.value}"
  :size="${size.value}"
  :stroke-width="${strokeWidth.value}"
  text-size="${textSize.value}"
/>`)
</script>

<template>
  <StorybookPage title="ProgressCircle">
    <div class="flex items-start gap-6">
      <StorybookControls class="w-full lg:w-100 shrink-0">
        <StorybookSliderControl
          v-model="value"
          label="Value"
          :min="0"
          :max="100"
          unit="%"
        />
        <StorybookSliderControl
          v-model="size"
          label="Size"
          :min="40"
          :max="200"
          unit="px"
        />
        <StorybookSliderControl
          v-model="strokeWidth"
          label="Stroke Width"
          :min="2"
          :max="20"
          unit="px"
        />
        <StorybookSelectControl
          v-model="textSize"
          label="Text Size"
          :options="textSizeOptions"
          allow-custom
          custom-placeholder="e.g. 1.5rem"
        />
      </StorybookControls>

      <StorybookPreview
        class="w-full"
        :code="componentCode"
      >
        <DynamicChart
          chart-type="ProgressCircle"
          :value="value"
          :size="size"
          :stroke-width="strokeWidth"
          :text-size="textSize"
          :code="componentCode"
        />
      </StorybookPreview>
    </div>
  </StorybookPage>
</template>
