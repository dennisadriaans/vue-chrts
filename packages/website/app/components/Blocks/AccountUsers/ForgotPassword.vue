<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'

defineOptions({
  tags: ['accountusers', 'forgotpassword']
})

const toast = useToast()
const loading = ref(false)
const sent = ref(false)

const fields = [
  {
    name: 'email',
    type: 'email' as const,
    label: 'Email address',
    placeholder: 'you@example.com',
    required: true,
    size: 'lg' as const
  }
]

async function onSubmit(_: FormSubmitEvent<{ email: string }>) {
  loading.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  sent.value = true
  loading.value = false
  toast.add({
    title: 'Reset link sent!',
    description: 'Check your email for instructions to reset your password.',
    icon: 'i-lucide-check-circle',
    color: 'success'
  })
}
</script>

<template>
  <UCard class="!bg-default mx-auto max-w-sm py-4">
    <div
      v-if="sent"
      class="space-y-6"
    >
      <UAlert
        color="success"
        variant="soft"
        icon="i-lucide-check-circle"
        title="Reset link sent!"
        description="Check your email for instructions to reset your password."
      />
      <UButton
        label="Back to sign in"
        variant="outline"
        block
        icon="i-lucide-arrow-left"
        @click="sent = false"
      />
    </div>
    <UAuthForm
      v-else
      title="Reset your password"
      description="Enter your email to receive a reset link"
      :fields="fields"
      :submit="{
        label: 'Send reset link',
        block: true,
        size: 'lg',
        icon: 'i-lucide-mail'
      }"
      :loading="loading"
      @submit="onSubmit"
    >
      <template #footer>
        <div class="flex flex-col items-center space-y-4">
          <NuxtLink
            to="#"
            class="hover:text-primary text-muted flex items-center gap-2 text-sm transition"
          >
            <UIcon
              name="i-lucide-arrow-left"
              class="h-4 w-4"
            />
            Back to sign in
          </NuxtLink>

          <p class="text-dimmed text-center text-xs">
            Remember your password?
            <NuxtLink
              to="#"
              class="text-primary font-medium hover:underline"
            >
              Sign in here
            </NuxtLink>
          </p>
        </div>
      </template>
    </UAuthForm>
  </UCard>
</template>
