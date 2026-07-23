<script lang="ts" setup>
definePageMeta({
  middleware: ['auth'],
  alias: ['/payments/failed']
})

const errorCode
  = 'ERR-'
    + Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')
const errorDate = new Date()
const errorMessage = 'Something went wrong. Please try again'
// const errorMessage = 'Card was declined. Please use a different payment method.'

// Format date
const formattedDate = computed(() => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(errorDate)
})

function goToHome() {
  navigateTo('/')
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4">
    <div class="w-full max-w-md rounded-lg p-8 text-center shadow-lg">
      <div
        class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100"
      >
        <Icon
          name="heroicons:x-circle"
          class="h-10 w-10 text-red-600"
        />
      </div>

      <!-- Failed Message -->
      <h1 class="mb-2 text-2xl font-bold">
        Payment Failed
      </h1>
      <p class="text-muted mb-6">
        We couldn't process your payment. Please check your payment details and
        try again.
      </p>

      <!-- Error Details -->
      <div class="mb-6 rounded-md p-4">
        <div class="mb-2 flex justify-between">
          <span class="text-muted">Error Code:</span>
          <span class="font-medium">{{ errorCode }}</span>
        </div>
        <div class="mb-2 flex justify-between">
          <span class="text-muted">Date:</span>
          <span class="font-medium">{{ formattedDate }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-muted">Message:</span>
          <span class="font-medium text-red-600">{{ errorMessage }}</span>
        </div>
      </div>

      <!-- Support Information -->
      <div class="text-sm0 mb-6">
        <p>
          Need help?
          <a
            href="#"
            class="hover:underline"
          >Contact our support team</a>
        </p>
      </div>

      <!-- Centered Buttons -->
      <div class="space-y-3">
        <UButton
          color="primary"
          size="lg"
          class="mx-auto"
          block
          @click="goToHome"
        >
          Try Again
        </UButton>
      </div>
    </div>
  </div>
</template>
