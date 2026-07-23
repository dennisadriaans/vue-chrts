<script setup lang="ts">
definePageMeta({
  layout: 'storybook',
  middleware: ['storybook']
})

const selectionMode = ref('single')

const componentCode = computed(() => `<Calendar
  selection-mode="${selectionMode.value}"
/>`)
</script>

<template>
  <StorybookPage title="Calendar">
    <div class="flex items-start gap-6">
      <StorybookControls class="w-full lg:w-100 shrink-0">
        <StorybookSelectControl
          v-model="selectionMode"
          label="Selection Mode"
          description="How dates can be selected"
          :options="[
            { label: 'Single', value: 'single' },
            { label: 'Range', value: 'range' },
            { label: 'Multiple', value: 'multiple' }
          ]"
        />
      </StorybookControls>

      <StorybookPreview
        resizable
        :default-width="60"
        :code="componentCode"
      >
        <DynamicChart
          chart-type="Calendar"
          :selection-mode="selectionMode"
          :code="componentCode"
        />
      </StorybookPreview>
    </div>
  </StorybookPage>
</template>
