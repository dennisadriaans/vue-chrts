<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'

defineOptions({
  tags: ['accountusers', 'basicsignin']
})

const toast = useToast()

// Define fields matching the screenshot design
const fields = [
  {
    name: 'email',
    type: 'email' as const,
    label: 'Email',
    placeholder: 'contact@bundui.com',
    required: true,
    autofocus: true,
    autofocusDelay: 100,
    autocomplete: 'email'
  },
  {
    name: 'password',
    type: 'password' as const,
    label: 'Password',
    placeholder: '••••••••',
    required: true,
    autocomplete: 'current-password'
  }
]

async function onSubmit(_: FormSubmitEvent<{ email: string, password: string }>) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))

  toast.add({
    title: 'Success!',
    description: 'You have been signed in.',
    icon: 'i-lucide-check-circle',
    color: 'success'
  })
}
</script>

<template>
  <div class="space-y-4">
    <img
      src="https://nuxt.com/assets/design-kit/icon-green.svg"
      alt="Nuxt Logo"
      class="w-12 mx-auto"
    >
    <UCard class="mx-auto max-w-sm border-default">
      <UAuthForm
        title="Welcome Back"
        :fields="fields"
        :submit="{
          label: 'Login',
          block: true,
          color: 'neutral'
        }"
        @submit="onSubmit"
      >
        <template #description>
          <span class="text-muted-foreground text-sm">
            Enter your email below to login to your account
          </span>
        </template>

        <template #password-hint>
          <NuxtLink
            to="#"
            class="text-foreground text-xs font-medium hover:opacity-80"
            tabindex="-1"
          >
            Forgot your password?
          </NuxtLink>
        </template>

        <template #footer>
          <div class="text-muted-foreground text-center text-sm">
            Don't have an account?
            <NuxtLink
              to="#"
              class="text-foreground underline underline-offset-4 hover:opacity-80"
            >
              Sign up
            </NuxtLink>
          </div>
        </template>
      </UAuthForm>
    </UCard>

    <p class="text-center text-sm">
      Already have an account?
      <NuxtLink
        to="/login"
        class="text-primary font-medium hover:underline"
      >
        Sign in
      </NuxtLink>
    </p>
  </div>
</template>
