<script setup lang="ts">
const props = defineProps<{
  title: string
  category: string
  block: string
  id?: string
}>()

const route = useRoute()
const router = useRouter()

// Slugify title if id is not provided
const componentId = computed(() => {
  if (props.id) return props.id
  return props.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
})

const isOpen = computed({
  get() {
    return route.query.code === componentId.value
  },
  set(value) {
    if (value) {
      router.push({ query: { ...route.query, code: componentId.value } })
    } else {
      const query = { ...route.query }
      delete query.code
      router.push({ query })
    }
  }
})
</script>

<template>
  <UCard class="bg-default dark:bg-elevated/40">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="text-sm font-medium">
          {{ title }}
        </div>
        <UButton
          icon="i-lucide-code-2"
          size="sm"
          color="neutral"
          variant="soft"
          @click="isOpen = true"
        />
      </div>
    </template>

    <slot />

    <USlideover
      v-model:open="isOpen"
      :title="props.title"
    >
      <template #body>
        <PreviewCode
          :id="componentId"
          :category="category"
          :block="block"
          :show-header="false"
          :lock-code="true"
        />
      </template>
    </USlideover>
  </UCard>
</template>
