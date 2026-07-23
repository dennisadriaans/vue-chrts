<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'

defineOptions({
  tags: ['accountusers', 'socialauth']
})

const toast = useToast()

const fields = [
  {
    name: 'email',
    type: 'email' as const,
    label: 'Email',
    placeholder: 'you@example.com',
    required: true,
    autofocus: true,
    autofocusDelay: 100,
    autocomplete: 'email',
    size: 'lg' as const
  },
  {
    name: 'password',
    type: 'password' as const,
    label: 'Password',
    placeholder: '••••••••',
    required: true,
    autocomplete: 'current-password',
    size: 'lg' as const
  }
]

const providers = [
  {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    color: 'neutral' as const,
    variant: 'outline' as const,
    onClick: () => {
      toast.add({
        title: 'GitHub Sign In',
        description: 'Redirecting to GitHub...',
        icon: 'i-simple-icons-github'
      })
    }
  },
  {
    label: 'Google',
    icon: 'i-simple-icons-google',
    color: 'neutral' as const,
    variant: 'outline' as const,
    onClick: () => {
      toast.add({
        title: 'Google Sign In',
        description: 'Redirecting to Google...',
        icon: 'i-simple-icons-google'
      })
    }
  }
]

async function onSubmit(event: FormSubmitEvent<{ email: string, password: string }>) {
  await new Promise(resolve => setTimeout(resolve, 1000))

  toast.add({
    title: 'Success!',
    description: 'You have been signed in.',
    icon: 'i-lucide-check-circle',
    color: 'success'
  })
}
</script>

<template>
  <UCard class="!bg-default mx-auto max-w-sm py-4">
    <UAuthForm
      title="Welcome back"
      :fields="fields"
      :providers="providers"
      :submit="{
        label: 'Sign in',
        block: true,
        size: 'lg'
      }"
      @submit="onSubmit"
    >
      <template #description>
        <span class="text-muted text-sm">
          Sign in to continue to your account
        </span>
      </template>

      <template #providers>
        <div class="flex flex-col w-full max-w-sm gap-4">
          <UButton
            v-for="provider in providers"
            :key="provider.label"
            size="sm"
            color="neutral"
            :icon="provider.icon"
            class="flex w-full items-center justify-center"
            @click="provider.onClick"
          >
            {{ provider.label }}
          </UButton>
        </div>
      </template>

      <template #footer>
        <p class="text-dimmed text-center text-xs">
          By continuing, you agree to our
          <NuxtLink
            to="#"
            class="text-primary hover:underline"
          >
            Terms of Service
          </NuxtLink>
          and
          <NuxtLink
            to="#"
            class="text-primary hover:underline"
          >
            Privacy Policy
          </NuxtLink>
        </p>
      </template>
    </UAuthForm>
  </UCard>
</template>
