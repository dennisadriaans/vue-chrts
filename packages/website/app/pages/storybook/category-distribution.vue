<script setup lang="ts">
definePageMeta({
  layout: 'storybook',
  middleware: ['storybook']
})

const data = ref({
  primaryValue: '$12,450',
  gap: 'sm' as 'sm' | 'lg' | 'xl',
  categories: [
    { label: 'Sales', percentage: 45, color: '#10b981', value: '$5,603' },
    { label: 'Marketing', percentage: 30, color: '#3b82f6', value: '$3,735' },
    { label: 'Development', percentage: 25, color: '#8b5cf6', value: '$3,112' }
  ],
  trend: { value: '+12.5%', direction: 'up' as 'up' | 'down' | 'neutral' }
})

// Schema for the categories array
const categoriesSchema = {
  type: 'array' as const,
  items: {
    type: 'object' as const,
    properties: {
      label: { type: 'string' as const, label: 'Label' },
      percentage: { type: 'number' as const, label: 'Percentage' },
      color: { type: 'string' as const, label: 'Color' },
      value: { type: 'string' as const, label: 'Value' }
    }
  }
}

const gapOptions = [
  { label: 'Small', value: 'sm' },
  { label: 'Large', value: 'lg' },
  { label: 'Extra Large', value: 'xl' }
]

const componentCode = computed(() => `<CategoryDistribution
  primary-value="${data.value.primaryValue}"
  :categories='${JSON.stringify(data.value.categories, null, 2)}'
  :trend='${JSON.stringify(data.value.trend)}'
  gap="${data.value.gap}"
/>`)
</script>

<template>
  <StorybookPage title="CategoryDistribution">
    <StorybookPreview
      resizable
      :default-width="60"
      :code="componentCode"
    >
      <DynamicChart
        chart-type="CategoryDistribution"
        :primary-value="data.primaryValue"
        :categories="data.categories"
        :trend="data.trend"
        :gap="data.gap"
        :code="componentCode"
      />
    </StorybookPreview>

    <StorybookControls>
      <StorybookInputControl
        v-model="data.primaryValue"
        label="Primary Value"
        description="Main display value"
      />
      <StorybookJsonEditorControl
        v-model="data.categories"
        label="Categories"
        description="Category breakdown data"
        :schema="categoriesSchema"
      />
      <StorybookSelectControl
        v-model="data.gap"
        label="Gap"
        description="Spacing between category lines"
        :options="gapOptions"
      />
      <StorybookTabsControl
        v-model="data.trend.direction"
        label="Trend Direction"
        description="Indicator direction"
        :items="[
          { label: 'Up', value: 'up', icon: 'i-lucide-trending-up' },
          { label: 'Neutral', value: 'neutral', icon: 'i-lucide-minus' },
          { label: 'Down', value: 'down', icon: 'i-lucide-trending-down' }
        ]"
      />
    </StorybookControls>
  </StorybookPage>
</template>
