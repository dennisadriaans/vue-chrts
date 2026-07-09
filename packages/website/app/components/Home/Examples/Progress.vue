<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

interface VitalItem {
  name: string
  value: number
  icon: string
}

const vitals: VitalItem[] = [
  { name: 'Performance', value: 91, icon: 'i-lucide-zap' },
  { name: 'Accessibility', value: 65, icon: 'i-lucide-eye' },
  { name: 'SEO', value: 43, icon: 'i-lucide-search' }
]

const currentIndex = ref(0)
let interval: ReturnType<typeof setInterval>

onMounted(() => {
  setTimeout(() => {
    interval = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % vitals.length
    }, 6000)
  }, 4000)
})

onUnmounted(() => {
  clearInterval(interval)
})

const currentVital = computed(() => vitals[currentIndex.value])
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <!-- Main Content -->
    <div class="flex flex-col items-center justify-center my-auto">
      <div class="relative flex items-center justify-center mb-4">
        <LibProgressCircle
          :value="currentVital?.value"
          :size="100"
          :stroke-width="10"
          :duration="1000"
          text-size="16px"
        />
      </div>

      <div class="h-14 flex flex-col items-center justify-start w-full">
        <Transition
          name="slide-up"
          mode="out-in"
        >
          <div
            :key="currentVital?.name"
            class="flex flex-col items-center w-full"
          >
            <div class="flex items-center gap-1.5 mb-0.5">
              <UIcon
                :name="currentVital?.icon"
                class="w-4 h-4 text-toned"
              />
              <h3 class="text-xl font-semibold">
                {{ currentVital?.name }}
              </h3>
            </div>
            <p class="text-sm text-muted text-center">
              {{ currentVital?.value >= 90 ? 'Good' : currentVital?.value >= 50 ? 'Needs Improvement' : 'Poor' }} score
            </p>
          </div>
        </Transition>
      </div>
    </div>

    <div class="flex justify-end">
      <div class="flex gap-1">
        <div
          v-for="(_, index) in vitals"
          :key="index"
          class="h-1.5 rounded-full transition-all duration-1000"
          :class="index === currentIndex ? 'w-4 bg-inverted/50' : 'w-1.5 bg-muted'"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
