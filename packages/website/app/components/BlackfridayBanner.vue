<script lang="ts" setup>
/**
 * DiscountBanner - Black Friday variant with dramatic styling and countdown timer
 *
 * @example
 * <DiscountBanner
 *   :visible="bannerVisible"
 *   sale-end-date="2025-11-30T23:59:59"
 *   discount-code="BLACKFRIDAY50"
 *   discount-amount="50% OFF"
 *   redirect-to="/pricing"
 *   variant="black-friday"
 *   @close="hideBanner"
 * />
 */

interface Props {
  saleEndDate?: string
  discountCode?: string
  discountAmount?: string
  redirectTo?: string
  visible?: boolean
  variant?: 'default' | 'black-friday'
}

const today = new Date()
today.setHours(0, 0, 0, 0)
const midnight = new Date(today)
midnight.setDate(midnight.getDate() + 1)

const {
  discountCode = 'BLACKFRIDAY20OFF',
  discountAmount = '20% OFF',
  redirectTo = '/pricing?start=cart',
  visible = true,
  variant = 'black-friday',
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

let timerId: any = null

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
    <div
      v-if="bannerVisible"
      :class="[
        'relative z-60 cursor-pointer overflow-hidden shadow-2xl',
        variant === 'black-friday'
          ? 'bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border-b border-primary/30'
          : 'border-primary/20 from-primary/10 via-primary/5 border-b bg-gradient-to-r to-transparent backdrop-blur-sm'
      ]"
      @click="redirectTo"
    >
      <!-- Black Friday animated background pattern -->
      <div
        v-if="variant === 'black-friday'"
        class="absolute inset-0 opacity-40"
      >
        <!-- Animated lightning effects -->
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(var(--ui-primary-rgb),0.15),transparent_40%)]"
        />
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(var(--ui-primary-rgb),0.1),transparent_40%)]"
        />
        <!-- Diagonal stripes pattern -->
        <div
          class="absolute inset-0 opacity-5"
          style="background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px);"
        />
      </div>

      <!-- Default variant background -->
      <div
        v-else
        class="from-primary/5 absolute inset-0 bg-gradient-to-r to-transparent opacity-80"
      >
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--ui-primary-rgb),0.07),transparent_70%)]"
        />
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.07),transparent_50%)]"
        />
      </div>

      <!-- Content -->
      <div
        class="relative mx-auto flex flex-col items-center justify-center gap-2 px-4 py-2 lg:flex-row"
      >
        <!-- Black Friday badge -->
        <div
          v-if="variant === 'black-friday'"
          class="flex items-center gap-3"
        >
          <!-- Glowing BLACK FRIDAY badge -->
          <div class="relative">
            <div
              class="absolute inset-0 rounded-lg bg-primary-500/30 blur-sm"
            />
            <span
              class="relative inline-block rounded-lg bg-gradient-to-r from-primary-500 to-primary-400 px-3 py-1 text-xs font-black uppercase tracking-wider text-black shadow-lg"
            >
              ⚡ Black Friday ⚡
            </span>
          </div>

          <div
            class="flex flex-wrap items-center gap-1.5 text-center text-sm font-semibold lg:text-left"
          >
            <span class="text-white">Limited Time:</span>
            <span
              class="bg-gradient-to-r from-primary-400 via-primary-300 to-primary-400 bg-clip-text text-lg font-black text-transparent"
            >
              {{ discountAmount }}
            </span>
            <span class="text-gray-300">with code</span>
            <span
              class="rounded-md border border-primary-500/30 bg-black/60 px-2.5 py-1 font-mono text-xs font-bold text-primary-400 shadow-lg backdrop-blur-sm"
            >
              {{ discountCode }}
            </span>
          </div>
        </div>

        <!-- Default variant content -->
        <div
          v-else
          class="flex items-center gap-2"
        >
          <!-- Pulsing fire icon with glow -->
          <div class="relative">
            <span class=" text-base opacity-80">🔥</span>
            <div class="absolute inset-0 text-base opacity-40">
              🔥
            </div>
          </div>

          <div
            class="flex flex-wrap items-center gap-1 text-center text-sm font-medium lg:text-left dark:text-white/70"
          >
            <span>Get a total of</span>
            <span>
              {{ discountAmount }}
            </span>
            <span>with code</span>
            <span
              class="rounded-lg bg-white/90 px-2 py-0.5 text-xs font-bold text-green-700 shadow backdrop-blur-sm"
            >
              "{{ discountCode }}"
            </span>
          </div>
        </div>

        <!-- Timer with variant-specific styling -->
        <div class="flex items-center gap-2">
          <div
            :class="[
              'flex items-center gap-1 px-2 py-0.5',
              variant === 'black-friday'
                ? 'rounded-md border border-primary-500/20 bg-primary-950/30 backdrop-blur-sm'
                : 'backdrop-blur-sm'
            ]"
          >
            <div
              :class="[
                'flex items-center gap-0.5 font-mono text-xs font-bold',
                variant === 'black-friday' ? 'text-primary-400' : 'dark:text-white/70'
              ]"
            >
              <span>{{ timeLeft.days }}d</span>
              <span :class="variant === 'black-friday' ? 'text-primary-600' : 'text-white/40'">:</span>
              <span>{{ timeLeft.hours.toString().padStart(2, '0') }}h</span>
              <span :class="variant === 'black-friday' ? 'text-primary-600' : 'text-white/40'">:</span>
              <span>{{ timeLeft.minutes.toString().padStart(2, '0') }}m</span>
              <span :class="variant === 'black-friday' ? 'text-primary-600' : 'text-white/40'">:</span>
              <span>{{ timeLeft.seconds.toString().padStart(2, '0') }}s</span>
            </div>
          </div>
        </div>

        <!-- Close button with variant-specific styling -->
        <button
          :class="[
            'absolute top-1/2 right-2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200 hover:scale-105',
            variant === 'black-friday'
              ? 'border border-gray-700 bg-gray-900/80 backdrop-blur-sm hover:bg-gray-800/80'
              : 'border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10'
          ]"
          aria-label="Close banner"
          @click.stop="hideBanner"
        >
          <UIcon
            name="i-lucide-x"
            :class="[
              'h-3 w-3 transition-colors',
              variant === 'black-friday'
                ? 'text-gray-400 hover:text-white'
                : 'dark:text-white/60 dark:hover:text-white'
            ]"
          />
        </button>
      </div>
    </div>
  </Transition>
</template>
