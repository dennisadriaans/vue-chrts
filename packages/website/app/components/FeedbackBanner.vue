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
  visible?: boolean
}

const { visible = true } = defineProps<Props>()

const emit = defineEmits<{
  close: []
  setFeedbackCookie: []
}>()

const bannerVisible = ref(visible)
const feedbackFormVisible = ref(false)

const feedbackText = ref('')
const feedbackEmail = ref('')

const thankYouVisible = ref(false)
let thankYouTimeout: ReturnType<typeof setTimeout> | null = null
let autoHideTimeout: ReturnType<typeof setTimeout> | null = null

function showBanner() {
  bannerVisible.value = true
  if (autoHideTimeout) clearTimeout(autoHideTimeout)
  autoHideTimeout = setTimeout(hideBanner, 6000)
}

function openFeedbackDirectly() {
  feedbackFormVisible.value = true
  if (autoHideTimeout) {
    clearTimeout(autoHideTimeout)
    autoHideTimeout = null
  }
}

function hideBanner() {
  bannerVisible.value = false
  if (autoHideTimeout) clearTimeout(autoHideTimeout)
  emit('close')
}

onMounted(() => {
  feedbackFormVisible.value = false

  if (bannerVisible.value) {
    showBanner()
  }
})

onUnmounted(() => {
  if (autoHideTimeout) clearTimeout(autoHideTimeout)
  if (thankYouTimeout) clearTimeout(thankYouTimeout)
})

watch(
  () => visible,
  (newValue) => {
    if (newValue) {
      showBanner()
    } else {
      hideBanner()
    }
  }
)

function toggleFeedbackForm() {
  feedbackFormVisible.value = !feedbackFormVisible.value
  if (feedbackFormVisible.value && autoHideTimeout) {
    clearTimeout(autoHideTimeout)
    autoHideTimeout = null
  }
}

const submitting = ref(false)
async function submitFeedback() {
  if (submitting.value) return
  submitting.value = true
  try {
    await $fetch('/api/feedback', {
      method: 'POST',
      body: {
        token: token.value,
        message: feedbackText.value,
        email: feedbackEmail.value
      }
    })
    feedbackText.value = ''
    feedbackEmail.value = ''
    feedbackFormVisible.value = false
    thankYouVisible.value = true
    bannerVisible.value = true

    emit('setFeedbackCookie')

    // Hide thank you after 5 seconds and close banner
    if (thankYouTimeout) clearTimeout(thankYouTimeout)
    thankYouTimeout = setTimeout(() => {
      thankYouVisible.value = false
      bannerVisible.value = false
    }, 5000)
  } catch (error) {
    console.error('Error submitting feedback:', error)
    alert('Failed to submit feedback. Please try again later.')
  } finally {
    submitting.value = false
  }
}

const token = ref()
</script>

<template>
  <Transition
    mode="out-in"
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-4 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-4 scale-95"
  >
    <!-- Main Banner -->
    <div
      v-if="bannerVisible"
      key="banner"
      class="text-primary cursor-pointer rounded-xl border border-green-200/60 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg transition-all duration-300 hover:shadow-xl lg:block dark:border-green-700/40 dark:from-green-900/20 dark:to-emerald-900/20 dark:shadow-green-900/20 dark:hover:shadow-green-900/30"
      @click="!thankYouVisible && toggleFeedbackForm()"
    >
      <div
        class="relative mx-auto flex items-center justify-between px-8 py-4"
      >
        <!-- Decorative gradient overlay -->
        <div
          class="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 transition-opacity duration-300 hover:opacity-100 dark:from-green-400/10 dark:to-emerald-400/10"
        />

        <div class="relative flex items-center gap-3">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 dark:bg-green-400/20"
          >
            <UIcon
              name="i-lucide-message-circle"
              size="18"
              class="text-green-600 dark:text-green-400"
            />
          </div>
          <div class="flex flex-col">
            <span
              class="leading-tight font-semibold text-green-800 dark:text-green-200"
            >
              <template v-if="!thankYouVisible">Share Your Feedback</template>
              <template v-else>Thank you for your feedback!</template>
            </span>
            <span
              class="text-sm text-green-600 opacity-90 dark:text-green-300 dark:opacity-80"
            >
              <template v-if="!thankYouVisible">Help me improve your experience</template>
              <template v-else>Your input is appreciated.</template>
            </span>
          </div>
        </div>

        <button
          class="relative ml-6 flex h-8 w-8 items-center justify-center rounded-full bg-green-600/10 text-green-700 transition-all duration-200 hover:bg-green-600/20 focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:outline-none dark:bg-green-400/20 dark:text-green-300 dark:hover:bg-green-400/30 dark:focus:ring-green-400/50 dark:focus:ring-offset-green-900"
          aria-label="Close feedback banner"
          @click.stop="hideBanner"
        >
          <UIcon
            name="i-lucide-x"
            class="size-4"
          />
        </button>
      </div>
    </div>

    <!-- Sticky Small Icon Toggle -->
    <div
      v-else
      key="toggle"
      class="flex justify-end"
    >
      <button
        class="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary shadow-lg transition-all duration-300 hover:scale-110 hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none dark:bg-primary/20 dark:hover:bg-primary-darker dark:focus:ring-offset-gray-900"
        aria-label="Show feedback banner"
        @click="openFeedbackDirectly"
      >
        <UIcon
          name="i-lucide-message-circle"
          class="size-6"
        />
      </button>
    </div>
  </Transition>

  <!-- Feedback Form - Bottom Right -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 transform translate-y-4 scale-95"
      enter-to-class="opacity-100 transform translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 transform translate-y-0 scale-100"
      leave-to-class="opacity-0 transform translate-y-4 scale-95"
    >
      <div
        v-if="feedbackFormVisible"
        class="dark:bg-default fixed right-6 bottom-6 z-50 w-[348px] rounded-lg border border-gray-200/60 bg-white/95 p-6 shadow-xl dark:border-gray-700/40"
      >
        <!-- Form Header -->
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div
              class="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 dark:bg-green-400/20"
            >
              <UIcon
                name="i-lucide-message-circle"
                size="14"
                class="text-green-600 dark:text-green-400"
              />
            </div>
            <h3 class="dark:text-default font-semibold text-gray-900">
              Quick Feedback
            </h3>
          </div>
          <button
            class="dark:hover:bg-default flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close feedback form"
            @click="feedbackFormVisible = false"
          >
            <UIcon
              name="i-lucide-x"
              size="14"
            />
          </button>
        </div>

        <!-- Form Content -->
        <form
          class="space-y-4"
          @submit.prevent="submitFeedback"
        >
          <NuxtTurnstile
            v-model="token"
          />
          <div>
            <label
              class="mb-1 block font-medium text-gray-700 dark:text-gray-300"
            >
              Your feedback
            </label>
            <textarea
              v-model="feedbackText"
              placeholder="What's on your mind? Any suggestions or issues?"
              rows="3"
              class="dark:bg-muted/20 dark:text-default dark:border-default w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none dark:placeholder-neutral-500 dark:focus:border-green-400 dark:focus:ring-green-400"
            />
          </div>

          <div>
            <label
              class="mb-1 block font-medium text-gray-700 dark:text-gray-300"
            >
              Email (optional)
            </label>
            <input
              v-model="feedbackEmail"
              type="email"
              placeholder="your@email.com"
              class="dark:bg-muted/20 dark:text-default dark:border-default w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none dark:placeholder-neutral-500 dark:focus:border-green-400 dark:focus:ring-green-400"
            >
          </div>

          <div class="flex gap-2 pt-2">
            <button
              type="submit"
              :disabled="!feedbackText.trim() || submitting"
              class="flex-1 rounded-md bg-green-600 px-3 py-2 font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-400 dark:focus:ring-offset-gray-900"
            >
              <span v-if="submitting">Sending...</span>
              <span v-else>Send Feedback</span>
            </button>
            <button
              type="button"
              class="dark:bg-default dark:border-default rounded-md border border-gray-200 bg-white px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
              @click="feedbackFormVisible = false"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>
