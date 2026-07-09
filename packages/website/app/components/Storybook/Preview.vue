<script setup lang="ts">
const props = defineProps<{
  maxWidth?: string
  resizable?: boolean
  minWidth?: number
  defaultWidth?: number
  code?: string
}>()

const isCodeModalOpen = ref(false)

const containerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const isResizing = ref(false)
const width = ref(props.defaultWidth || 100) // percentage of container width
const containerWidth = ref(0)

// Preset widths for responsive testing
const presets = [
  { label: 'Mobile', width: 375, icon: 'i-lucide-smartphone' },
  { label: 'Desktop', width: 100, icon: 'i-lucide-monitor', isPercentage: true }
]

const currentWidthPx = computed(() => {
  if (!containerWidth.value) return '100%'
  const pxWidth = (width.value / 100) * containerWidth.value
  return `${Math.round(pxWidth)}px`
})

const displayWidth = computed(() => {
  if (!containerWidth.value) return '100%'
  const pxWidth = Math.round((width.value / 100) * containerWidth.value)
  return `${pxWidth}px`
})

function updateContainerWidth() {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.offsetWidth
  }
}

function setPresetWidth(preset: typeof presets[0]) {
  if (preset.isPercentage) {
    width.value = preset.width
  } else if (containerWidth.value > 0) {
    // Convert pixel width to percentage
    const percentage = (preset.width / containerWidth.value) * 100
    width.value = Math.min(percentage, 100)
  }
}

function startResize(event: MouseEvent | TouchEvent) {
  if (!props.resizable) return

  isResizing.value = true
  const startX = 'touches' in event ? event.touches[0]?.clientX ?? 0 : event.clientX
  const startWidth = width.value

  function onMove(e: MouseEvent | TouchEvent) {
    if (!containerRef.value) return

    const currentX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX
    const containerRect = containerRef.value.getBoundingClientRect()
    const deltaX = currentX - startX
    const deltaPercent = (deltaX / containerRect.width) * 100

    const minPercent = props.minWidth
      ? (props.minWidth / containerRect.width) * 100
      : 20

    width.value = Math.max(minPercent, Math.min(100, startWidth + deltaPercent))
  }

  function onEnd() {
    isResizing.value = false
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onEnd)
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', onEnd)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onEnd)
  document.addEventListener('touchmove', onMove)
  document.addEventListener('touchend', onEnd)
}

function resetWidth() {
  width.value = 100
}

onMounted(() => {
  updateContainerWidth()
  window.addEventListener('resize', updateContainerWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateContainerWidth)
})
</script>

<template>
  <div
    data-testid="storybook-preview"
    class="overflow-hidden rounded-xl border border-default bg-default w-full"
  >
    <div class="border-b border-default px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="size-3 rounded-full bg-red-500/80" />
          <span class="size-3 rounded-full bg-yellow-500/80" />
          <span class="size-3 rounded-full bg-green-500/80" />
          <span class="ml-4 text-xs text-(--ui-text-muted)">Preview</span>
        </div>

        <div class="flex items-center gap-2">
          <UButton
            v-if="code"
            label="Export Code"
            icon="i-lucide-code"
            variant="ghost"
            color="neutral"
            size="xs"
            @click="isCodeModalOpen = true"
          />

          <!-- Responsive controls -->
          <div
            v-if="resizable"
            class="flex items-center gap-2"
          >
            <div class="flex items-center gap-1">
              <UTooltip
                v-for="preset in presets"
                :key="preset.label"
                :text="preset.label"
              >
                <UButton
                  :icon="preset.icon"
                  variant="ghost"
                  color="neutral"
                  @click="setPresetWidth(preset)"
                />
              </UTooltip>
            </div>
            <USeparator
              orientation="vertical"
              class="h-4"
            />
            <span class="min-w-16 text-center font-mono text-xs text-(--ui-text-muted)">
              {{ displayWidth }}
            </span>
          </div>
        </div>
      </div>

      <UModal
        v-model:open="isCodeModalOpen"
        title="Export Code"
        description="Copy the code below to use this component in your project."
        :ui="{ content: 'max-w-4xl sm:max-w-4xl' }"
      >
        <template #body>
          <PreviewCode
            id="export-code"
            :code="code"
            class="max-h-[60vh] overflow-y-auto"
          />
        </template>
      </UModal>

      <div
        ref="containerRef"
        class="relative flex min-h-80 items-center justify-center bg-[repeating-linear-gradient(45deg,var(--ui-bg)_0,var(--ui-bg-muted)_1px,transparent_0,transparent_50%)] bg-[length:10px_10px] p-12"
        :class="{ 'select-none': isResizing }"
      >
        <!-- Resizable content wrapper -->
        <div
          v-if="resizable"
          ref="contentRef"
          class="relative w-full rounded-lg bg-(--ui-bg) shadow-sm ring-1 ring-(--ui-border)"
          :style="{ maxWidth: currentWidthPx }"
        >
          <div class="p-4">
            <slot />
          </div>

          <!-- Resize handle on right edge -->
          <div
            class="absolute -right-3 top-0 bottom-0 z-10 flex w-6 cursor-ew-resize items-center justify-center"
            @mousedown="startResize"
            @touchstart="startResize"
            @dblclick="resetWidth"
          >
            <div
              class="flex h-8 w-1.5 items-center justify-center rounded-full transition-colors"
              :class="isResizing ? 'bg-(--ui-primary)' : 'bg-(--ui-border-accented) hover:bg-(--ui-primary)'"
            >
              <UIcon
                name="i-lucide-grip-vertical"
                class="size-3 text-(--ui-text-muted)"
              />
            </div>
          </div>
        </div>

        <!-- Non-resizable content -->
        <template v-else>
          <div
            v-if="maxWidth"
            class="w-full"
            :style="{ maxWidth }"
          >
            <slot />
          </div>
          <slot v-else />
        </template>
      </div>
    </div>
  </div>
</template>
