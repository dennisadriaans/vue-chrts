<script setup lang="ts">
const emit = defineEmits(['dismiss'])
const { getAllLicense } = usePayments()

defineProps({
  show: {
    type: Boolean,
    default: true
  }
})

const handleDismiss = () => {
  emit('dismiss')
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="transform translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-full opacity-0"
  >
    <div
      v-if="show"
      class="fixed right-0 bottom-0 z-50 mb-4 flex items-end justify-end px-4"
    >
      <div class="max-w-sm">
        <!-- Main CTA Card -->
        <div
          class="border-primary/20 from-primary/10 via-primary/5 relative overflow-hidden rounded-2xl border bg-gradient-to-r to-transparent shadow-2xl backdrop-blur-sm"
        >
          <!-- Animated background pattern -->
          <div
            class="from-primary/5 absolute inset-0 right-0 bg-gradient-to-r to-transparent"
          >
            <div
              class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--ui-primary-rgb),0.1),transparent_70%)]"
            />
          </div>

          <!-- Close button -->
          <button
            class="absolute top-3 right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
            aria-label="Dismiss"
            @click="handleDismiss"
          >
            <UIcon
              name="i-lucide-x"
              class="h-3 w-3 text-white/80"
            />
          </button>

          <!-- Content -->
          <div class="relative p-4">
            <!-- Header with pulsing dot -->
            <div class="mb-2 flex items-center gap-2">
              <div class="relative">
                <div class="h-2 w-2 rounded-full bg-green-500" />
                <div
                  class="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-green-500 opacity-75"
                />
              </div>
              <span class="font-semibold"> Unlock All Premium Blocks</span>
            </div>

            <p class="text-toned mb-4 pr-4">
              Get instant access to 100+ chart & blocks
            </p>

            <!-- CTA Button -->
            <UButton
              class="group flex w-full animate-pulse items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:animate-none hover:bg-white hover:shadow-xl dark:bg-white/90"
              color="neutral"
              @click="getAllLicense"
            >
              <template #leading>
                <UIcon
                  name="i-lucide-zap"
                  class="transition-transform duration-300 group-hover:animate-spin"
                />
              </template>
              Last Chance - $149
              <template #trailing>
                <UIcon
                  name="i-lucide-arrow-right"
                  class="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </template>
            </UButton>

            <!-- Features list -->
            <div
              class="mt-3 flex items-center justify-center gap-4 text-xs dark:text-white/70"
            >
              <div class="flex items-center gap-1">
                <UIcon
                  name="i-lucide-check"
                  class="text-primary h-3 w-3"
                />
                <span>Instant Access</span>
              </div>
              <div class="flex items-center gap-1">
                <UIcon
                  name="i-lucide-check"
                  class="text-primary h-3 w-3"
                />
                <span>No Subscription</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
