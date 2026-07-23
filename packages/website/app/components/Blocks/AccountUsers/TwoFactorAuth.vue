<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'

defineOptions({
  tags: ['accountusers', 'twofactorauth']
})

const toast = useToast()
const loading = ref(false)
const error = ref('')

const fields = [
  {
    name: 'code',
    type: 'text' as const,
    label: 'Verification code',
    placeholder: '000000',
    required: true,
    size: 'lg' as const,
    class: 'text-center font-mono text-2xl tracking-widest',
    maxlength: 6,
    pattern: '[0-9]{6}'
  }
]

async function onSubmit(event: FormSubmitEvent<{ code: string }>) {
  loading.value = true
  error.value = ''

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (event.data.code === '123456') {
      toast.add({
        title: 'Success!',
        description: 'You have been signed in.',
        icon: 'i-lucide-check-circle',
        color: 'success'
      })
      // Redirect to dashboard
    } else {
      throw new Error('Invalid verification code')
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Verification failed'
    toast.add({
      title: 'Error',
      description: error.value,
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

function resendCode() {
  console.log('Resending verification code...')
  toast.add({
    title: 'Code sent',
    description: 'A new verification code has been sent to your email.',
    icon: 'i-lucide-mail'
  })
}
</script>

<template>
  <UCard class="!bg-default mx-auto max-w-sm py-4">
    <UAuthForm
      title="Check your email"
      description="Enter the 6-digit code from the email."
      :fields="fields"
      :submit="{
        label: 'Verify code',
        block: true,
        size: 'lg',
        icon: 'i-lucide-check'
      }"
      :loading="loading"
      @submit="onSubmit"
    >
      <template #footer>
        <div class="flex flex-col items-center space-y-4">
          <UButton
            variant="ghost"
            label="Resend code"
            class="text-sm"
            icon="i-lucide-refresh-cw"
            @click="resendCode"
          />

          <div class="flex w-full items-center justify-between">
            <NuxtLink
              to="#"
              class="hover:text-primary text-muted flex items-center gap-2 text-sm transition"
            >
              <UIcon
                name="i-lucide-arrow-left"
                class="h-4 w-4"
              />
              Back
            </NuxtLink>
          </div>

          <p class="text-dimmed text-center text-xs">
            Having trouble?
            <NuxtLink
              to="#"
              class="text-primary hover:underline"
            >
              Contact support
            </NuxtLink>
          </p>
        </div>
      </template>
    </UAuthForm>
  </UCard>
</template>
