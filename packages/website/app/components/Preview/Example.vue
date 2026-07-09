<script lang="ts" setup>
const props = defineProps<{
  title: string
  id?: string
}>()
const slots = useSlots()
const route = useRoute()
const router = useRouter()

const exampleId = computed(() => {
  if (props.id) return props.id
  return props.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
})

const codePreview = computed({
  get() {
    return route.query.code === exampleId.value
  },
  set(value) {
    if (value) {
      router.push({
        query: { ...route.query, code: exampleId.value }
      })
    } else {
      const query = { ...route.query }
      delete query.code
      router.push({ query })
    }
  }
})

function openCode() {
  if (codePreview.value) return
  codePreview.value = true

  const { trackSelectContent } = useButtonTracking()
  trackSelectContent('code', exampleId.value)
}

function closeCode() {
  if (!codePreview.value) return
  codePreview.value = false
}
</script>

<template>
  <div
    :id="exampleId"
    class="scroll-mt-24"
  >
    <div class="mb-4 flex items-center justify-between">
      <div class="text-lg font-semibold">
        {{ title }}
      </div>
      <div
        v-if="slots.default"
        class="inline-flex gap-2 rounded-lg p-1.25"
      >
        <UButton
          :variant="!codePreview ? 'solid' : 'ghost'"
          color="neutral"
          icon="i-lucide-eye"
          label="Example"
          @click="closeCode"
        />
        <UButton
          :variant="codePreview ? 'solid' : 'ghost'"
          color="neutral"
          icon="i-lucide-code"
          label="Code"
          @click="openCode"
        />
      </div>
    </div>

    <ClientOnly>
      <div>
        <slot v-if="codePreview" />

        <UCard
          v-else
          class="h-full bg-elevated/60 dark:bg-elevated/20"
          variant="subtle"
        >
          <UCard>
            <div
              class="py-8"
            >
              <slot
                name="chart"
              />
            </div>
          </UCard>
        </UCard>
      </div>
    </ClientOnly>
  </div>
</template>
