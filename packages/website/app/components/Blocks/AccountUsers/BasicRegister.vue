<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'

defineOptions({
  tags: ['accountusers', 'basicregister']
})

const toast = useToast()

const fields = [
  {
    name: 'name',
    type: 'text' as const,
    label: 'Name',
    placeholder: 'Name',
    required: true,
    autofocus: true,
    autofocusDelay: 100,
    autocomplete: 'name',
    size: 'lg' as const
  },
  {
    name: 'email',
    type: 'email' as const,
    label: 'Email',
    placeholder: 'john@company.com',
    required: true,
    autocomplete: 'email',
    size: 'lg' as const
  },
  {
    name: 'password',
    type: 'password' as const,
    label: 'Password',
    placeholder: 'Password',
    required: true,
    autocomplete: 'new-password',
    size: 'lg' as const
  },
  {
    name: 'confirmPassword',
    type: 'password' as const,
    label: 'Confirm password',
    placeholder: 'Password',
    required: true,
    autocomplete: 'new-password',
    size: 'lg' as const
  },
  {
    name: 'newsletter',
    type: 'checkbox' as const,
    label: 'Sign up to our newsletter'
  }
]

async function onSubmit(event: FormSubmitEvent<{ name: string, email: string, password: string, confirmPassword: string, newsletter?: boolean }>) {
  // Validate passwords match
  if (event.data.password !== event.data.confirmPassword) {
    toast.add({
      title: 'Error',
      description: 'Passwords do not match',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
    return
  }

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  toast.add({
    title: 'Success!',
    description: 'Your account has been created.',
    icon: 'i-lucide-check-circle',
    color: 'success'
  })
}
</script>

<template>
  <div>
    <UCard class="mx-auto max-w-sm border-default">
      <UAuthForm
        title="Create new account"
        :fields="fields"
        :submit="{
          label: 'Create account',
          color: 'neutral',
          block: true,
          size: 'lg'
        }"
        @submit="onSubmit"
      >
        <template #description>
          <span class="text-muted text-sm">
            Fill in your data to create a new account
          </span>
        </template>

        <template #footer>
          <p class="text-muted text-center text-xs">
            By signing in, you agree to our
            <NuxtLink
              to="/terms"
              class="text-primary hover:underline"
            >
              Terms Of Use
            </NuxtLink>
            and
            <NuxtLink
              to="/privacy"
              class="text-primary hover:underline"
            >
              Privacy Policy
            </NuxtLink>
          </p>
        </template>
      </UAuthForm>
    </UCard>

    <p class="text-center text-sm mt-4">
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
