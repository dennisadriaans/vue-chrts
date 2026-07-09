<script setup lang="ts">
const model = defineModel<string>({ required: true })

const props = defineProps<{
  label: string
  description?: string
  options: { label: string, value: string }[]
  allowCustom?: boolean
  customPlaceholder?: string
}>()

const isPresetValue = (val: string) => props.options.some(opt => opt.value === val)

const isCustom = computed(() => props.allowCustom && !isPresetValue(model.value))

const selectValue = computed(() => isCustom.value ? 'custom' : model.value)

const allOptions = computed(() => {
  if (props.allowCustom) {
    return [...props.options, { label: 'Custom', value: 'custom' }]
  }
  return props.options
})

function onSelectChange(val: string) {
  if (val !== 'custom') {
    model.value = val
  }
}

function onCustomInput(val: string) {
  model.value = val
}
</script>

<template>
  <StorybookCustomControl
    :label="label"
    :description="description"
  >
    <div class="flex items-center gap-2">
      <USelect
        :model-value="selectValue"
        :items="allOptions"
        class="w-32"
        @update:model-value="onSelectChange"
      />
      <UInput
        v-if="isCustom"
        :model-value="model"
        :placeholder="customPlaceholder ?? 'e.g. 1.5rem'"
        class="w-28"
        @update:model-value="onCustomInput"
      />
    </div>
  </StorybookCustomControl>
</template>
