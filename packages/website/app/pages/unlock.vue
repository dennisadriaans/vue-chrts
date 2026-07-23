<script setup lang="ts">
const config = useRuntimeConfig()
const codeInput = ref('')
const error = ref(false)
const codeCookie = useCookie('auth_code', {
  maxAge: 60 * 60 * 24 * 30, // 30 days
  path: '/'
})

const unlock = () => {
  if (codeInput.value === config.public.lockCode) {
    codeCookie.value = codeInput.value
    navigateTo('/')
  } else {
    error.value = true
  }
}

// Redirect if already unlocked
onMounted(() => {
  if (codeCookie.value === config.public.lockCode) {
    navigateTo('/')
  }
})

// Define meta to prevent infinite loops in middleware
definePageMeta({
  layout: false,
  middleware: []
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4 bg-default">
    <UCard class="w-full max-w-sm">
      <template #header>
        <div class="flex flex-col items-center gap-2">
          <Logo class="size-12" />
          <h1 class="text-xl font-semibold text-highlighted">
            Restricted Access
          </h1>
          <p class="text-sm text-dimmed text-center">
            This site is for testing purposes only. Enter the access code to continue.
          </p>
        </div>
      </template>

      <form
        class="space-y-4"
        @submit.prevent="unlock"
      >
        <UFormField
          label="Access Code"
          :error="error ? 'Invalid code. Please try again.' : undefined"
        >
          <UInput
            v-model="codeInput"
            type="password"
            placeholder="****"
            autofocus
            autocomplete="off"
            @input="error = false"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          size="lg"
          label="Unlock Site"
          icon="i-lucide-lock-open"
        />
      </form>

      <template #footer>
        <p class="text-xs text-muted text-center italic">
          &copy; 2026 Nuxt Charts. All rights reserved.
        </p>
      </template>
    </UCard>
  </div>
</template>
