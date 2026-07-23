<script lang="ts" setup>
/**
 * DiscountBanner - A reusable discount banner component with countdown timer
 *
 * @example
 * <DiscountBanner
 *   :visible="bannerVisible"
 *   sale-end-date="2025-12-31T23:59:59"
 *   discount-code="SAVE50"
 *   discount-amount="$50 OFF"
 *   redirect-to="/pricing"
 *   @close="hideBanner"
 * />
 */

interface Props {
  saleEndDate?: string
  discountCode?: string
  discountAmount?: string
  redirectTo?: string
  visible?: boolean
  size?: 'sm' | 'md'
}

const today = new Date()
today.setHours(0, 0, 0, 0)
const midnight = new Date(today)
midnight.setDate(midnight.getDate() + 1)

const {
  discountCode = 'SAVE10TODAY',
  discountAmount = '20%',
  redirectTo = '/pricing',
  visible = true,
  size = 'md',
  saleEndDate: saleEndDateProp
} = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const bannerVisible = ref(visible)

// Timer for sales banner
const saleEndDate = new Date(
  saleEndDateProp ?? midnight.toISOString()
).getTime()
const timeLeft = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

function updateTimer() {
  const now = new Date().getTime()
  const distance = saleEndDate - now

  if (distance > 0) {
    timeLeft.value = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    }
  } else {
    timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
}

function hideBanner() {
  bannerVisible.value = false
  emit('close')
}

let timerId: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  updateTimer()
  timerId = setInterval(updateTimer, 1000)
})

onUnmounted(() => {
  if (timerId) {
    clearInterval(timerId)
  }
})

watch(
  () => visible,
  (newValue) => {
    bannerVisible.value = newValue
  }
)
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="transform -translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-full opacity-0"
  >
    <NuxtLink
      v-if="bannerVisible"
      :to="redirectTo"
      external
      target="_blank"
      class="relative z-60 cursor-pointer overflow-hidden"
      :class="[
        size === 'sm'
          ? ''
          : 'border-primary-500/20 from-primary-500/10 via-primary-500/5 border-b bg-linear-to-r to-transparent shadow-xl backdrop-blur-sm'
      ]"
    >
      <!-- Animated background pattern -->
      <div
        v-if="size !== 'sm'"
        class="from-primary-500/5 absolute inset-0 bg-linear-to-r to-transparent opacity-80"
      >
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.07),transparent_70%)]"
        />
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.07),transparent_50%)]"
        />
      </div>

      <!-- Content -->
      <div
        class="relative mx-auto flex items-center justify-center gap-2 px-4"
        :class="size === 'sm' ? 'py-1 flex-row pr-4' : 'py-2 flex-col lg:flex-row lg:py-1.5 pr-10'"
      >
        <!-- Main discount content -->
        <div
          class="flex items-center gap-2"
          :class="size === 'sm' ? 'w-auto' : 'w-full flex-col lg:flex-row lg:w-auto'"
        >
          <!-- Pulsing sparkle icon with glow -->
          <div
            v-if="size !== 'sm'"
            class="relative hidden flex-shrink-0 items-center justify-center lg:flex"
          >
            🎉
            <!-- <UIcon
              name="i-lucide-sparkles"
              class="h-4 w-4 animate-pulse text-primary-400 opacity-80"
            />
            <div class="absolute inset-0 flex items-center justify-center animate-ping">
              <UIcon
                name="i-lucide-sparkles"
                class="h-4 w-4 text-primary-400 opacity-40"
              />
            </div> -->
          </div>

          <div
            class="flex items-center gap-1 text-center text-xs font-medium sm:text-sm dark:text-white/70"
            :class="size === 'sm' ? 'flex-row' : 'flex-col lg:flex-row lg:text-left'"
          >
            <span
              v-if="size !== 'sm'"
              class="text-default mr-1.5"
            >Get an <span class="font-bold ">extra 10%</span> off </span>
            <span
              class="rounded-lg bg-white/90 px-2 py-0.5 text-xs font-bold text-primary-700 shadow backdrop-blur-sm"
            >
              "{{ discountCode }}"
            </span>
            <span
              v-if="size !== 'sm'"
              class="ml-1.5 hidden items-center font-bold text-default lg:inline-flex"
            >
              Get All Access Pass <UIcon
                name="i-lucide-arrow-right"
                class="ml-1 h-3 w-3"
              />
            </span>
            <span
              v-else
              class="ml-1 flex items-center font-bold text-default"
            >
              <UIcon
                name="i-lucide-arrow-right"
                class="h-3 w-3"
              />
            </span>
          </div>
        </div>

        <!-- Timer with glassmorphism design -->
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1 px-2 py-0.5 backdrop-blur-sm">
            <!-- <div class="relative">
              <span class="animate-pulse text-sm opacity-80">⏰</span>
              <div class="absolute inset-0 animate-ping text-sm opacity-30">
                ⏰
              </div>
            </div> -->
            <div
              class="flex items-center gap-0.5 font-mono text-xs font-semibold dark:text-white/80"
            >
              <span>{{ timeLeft.days }}d</span>
              <span class="text-white/40">:</span>
              <span>{{ timeLeft.hours.toString().padStart(2, '0') }}h</span>
              <span class="text-white/40">:</span>
              <span>{{ timeLeft.minutes.toString().padStart(2, '0') }}m</span>
              <span class="text-white/40">:</span>
              <span>{{ timeLeft.seconds.toString().padStart(2, '0') }}s</span>
            </div>
          </div>
        </div>

        <!-- Close button with enhanced styling -->
        <button
          v-if="size !== 'sm'"
          type="button"
          class="absolute top-1/2 right-2 z-10 flex h-6 w-6 -translate-y-1/2 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/10"
          aria-label="Close banner"
          @click.stop.prevent="hideBanner"
        >
          <UIcon
            name="i-lucide-x"
            class="h-3 w-3 transition-colors dark:text-white/60 dark:hover:text-white"
          />
        </button>
      </div>
    </NuxtLink>
  </Transition>
</template>
