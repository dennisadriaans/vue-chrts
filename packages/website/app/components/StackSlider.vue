<script setup lang="ts" generic="T">
const props = withDefaults(defineProps<{
  items: T[]
  keyField?: string
  heightClass?: string
  showControls?: boolean
}>(), {
  keyField: 'id',
  heightClass: 'h-150 md:h-186',
  showControls: false
})

const stack = ref([...props.items]) as Ref<T[]>
const originalItems = ref([...props.items]) as Ref<T[]>

// Flattened values: rotations set to 0, tx/ty adjusted for a simple 2D offset
const currentPerspective = ref({
  tx: -15, // Horizontal offset for the stack effect
  ty: -10, // Vertical offset
  tz: 0, // No depth needed
  rx: 0, // No X rotation
  ry: 0, // No Y rotation
  rz: 0 // No Z rotation
})

const rotate = () => {
  const [first, ...rest] = stack.value
  if (first) stack.value = [...rest, first]
}

const prev = () => {
  const last = stack.value[stack.value.length - 1]
  const rest = stack.value.slice(0, -1)
  if (last) stack.value = [last, ...rest]
}

const goTo = (id: string | number) => {
  const targetId = String(id)
  const firstItem = stack.value[0] as Record<string, any>
  if (String(firstItem[props.keyField]) === targetId) return

  const targetIndex = stack.value.findIndex(c => String((c as Record<string, any>)[props.keyField]) === targetId)
  if (targetIndex === -1) return

  const moved = stack.value.slice(0, targetIndex)
  const remaining = stack.value.slice(targetIndex)
  stack.value = [...remaining, ...moved]
}

defineExpose({ rotate, prev, goTo, stack })

watch(() => props.items, (newItems) => {
  stack.value = [...newItems]
  originalItems.value = [...newItems]
}, { deep: true })
</script>

<template>
  <div class="flex flex-col items-center justify-center p-6 w-full overflow-hidden">
    <div
      class="relative w-full max-w-4xl lg:max-w-screen-2xl"
      :class="heightClass"
    >
      <div
        v-for="(item, index) in stack"
        :key="String((item as Record<string, any>)[keyField]) || index"
        class="absolute inset-0 w-full h-full transition-all duration-700 cursor-pointer"
        :style="{
          zIndex: 30 - index,
          // Simplified transform using only 2D translation and scale
          transform: `translate(
            ${index * currentPerspective.tx}px,
            ${index * currentPerspective.ty}px
          ) scale(${1 - (index * 0.05)})`,
          opacity: index > 4 ? 0 : 1,
          transitionTimingFunction: 'cubic-bezier(0.2, 1, 0.4, 1)'
        }"
        @click="index === 0 ? null : goTo((item as Record<string, any>)[keyField])"
      >
        <div class="w-full h-full rounded-3xl transition-all duration-700">
          <slot
            :item="item"
            :index="index"
            :rotate="rotate"
          />
        </div>
      </div>
    </div>

    <div
      v-if="showControls"
      class="flex flex-col md:flex-row items-center justify-end gap-6 mt-16 w-full max-w-4xl relative px-4"
    >
      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="ghost"
          class="rounded-full border border-default"
          @click="prev"
        />
        <UButton
          icon="i-lucide-arrow-right"
          color="neutral"
          variant="ghost"
          class="rounded-full border border-default"
          @click="rotate"
        />
      </div>
    </div>
  </div>
</template>
