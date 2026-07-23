<script setup lang="ts">
const props = defineProps<{
  light: string
  dark: string
  alt?: string
}>()

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const sliderPos = ref(50)
const isDragging = ref(false)
const container = ref<HTMLElement | null>(null)

// Use a CSS variable to update the UI without triggering Vue's VDOM diffing
const updateStyles = (percent: number) => {
  if (container.value) {
    container.value.style.setProperty('--slider-pos', `${percent}%`)
  }
}

const onMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value || !container.value) return

  // requestAnimationFrame ensures we sync with the screen's refresh rate
  requestAnimationFrame(() => {
    const rect = container.value!.getBoundingClientRect()
    const x = ('touches' in e) ? e.touches[0].clientX : (e as MouseEvent).clientX

    let position = ((x - rect.left) / rect.width) * 100
    position = Math.max(0, Math.min(100, position))

    sliderPos.value = position
    updateStyles(position)
  })
}

const startDragging = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true
  // Prevents text selection while dragging
  e.preventDefault()
}

const stopDragging = () => {
  isDragging.value = false
}

onMounted(() => {
  // Initialize position
  updateStyles(sliderPos.value)

  // Use passive: true where possible for scroll performance
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', stopDragging)
  window.addEventListener('touchmove', onMove, { passive: true })
  window.addEventListener('touchend', stopDragging)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', stopDragging)
  window.removeEventListener('touchmove', onMove)
  window.removeEventListener('touchend', stopDragging)
})

const topImage = computed(() => isDark.value ? props.dark : props.light)
const bottomImage = computed(() => isDark.value ? props.light : props.dark)
</script>

<template>
  <div
    ref="container"
    class="relative w-full h-full overflow-hidden select-none group/comparison cursor-ew-resize"
    style="--slider-pos: 50%"
    @mousedown="startDragging"
    @touchstart="startDragging"
  >
    <div class="absolute inset-0 w-full h-full pointer-events-none">
      <img
        :src="bottomImage"
        :alt="alt"
        class="w-full h-full object-cover object-top"
      >
    </div>

    <div
      class="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
      :style="{ clipPath: `inset(0 calc(100% - var(--slider-pos)) 0 0)` }"
    >
      <img
        :src="topImage"
        :alt="alt"
        class="w-full h-full object-cover object-top"
      >
    </div>

    <div
      class="absolute top-0 bottom-0 z-30 w-1 bg-white dark:bg-default shadow-xl cursor-ew-resize flex items-center justify-center"
      :style="{ left: `var(--slider-pos)` }"
    >
      <div class="w-8 h-8 rounded-full bg-white dark:bg-default flex items-center justify-center shadow-lg -ml-0.5">
        <UIcon
          name="i-lucide-chevrons-left-right"
          class="w-4 h-4 text-gray-600 dark:text-white"
        />
      </div>
    </div>
  </div>
</template>
