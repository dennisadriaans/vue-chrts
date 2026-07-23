<script setup lang="ts">
const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['dismiss'])

const isVisible = ref(props.show)

const checkScroll = () => {
  const scrollFromBottom = document.documentElement.scrollHeight
    - (window.scrollY + window.innerHeight)

  if (scrollFromBottom < 500 && isVisible.value) {
    isVisible.value = false
    emit('dismiss')
  }
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})

watch(() => props.show, (newValue) => {
  isVisible.value = newValue
})

const dismiss = () => {
  isVisible.value = false
  emit('dismiss')
  window.scrollTo({
    top: document.documentElement.scrollHeight - window.innerHeight - 1200,
    behavior: 'smooth'
  })
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="isVisible"
      class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      <div
        class="rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent shadow-lg backdrop-blur-sm"
      >
        <div class="flex items-center gap-3 px-5 py-3">
          <!-- Pulsing indicator -->
          <div class="relative">
            <div class="h-2 w-2 rounded-full bg-primary" />
            <div class="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-primary opacity-75" />
          </div>

          <span class="whitespace-nowrap text-sm font-medium">
            New blocks below
          </span>

          <button
            class="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            aria-label="Dismiss"
            @click="dismiss"
          >
            <UIcon
              name="i-lucide-chevron-down"
              class="h-3 w-3"
            />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
