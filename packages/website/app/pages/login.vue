<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

useSeoMeta({
  title: 'Login - Nuxt Charts',
  description:
    'Sign in to access Nuxt Charts and get early access benefits including 50% off lifetime access and updates.',
  ogTitle: 'Login - Nuxt Charts',
  ogDescription:
    'Sign in to access Nuxt Charts and get early access benefits including 50% off lifetime access and updates.',
  ogType: 'website',
  ogSiteName: 'Nuxt Charts',
  ogImage: 'https://nuxtcharts.com/og-image.png', // Assuming you have an OG image
  twitterCard: 'summary_large_image',
  twitterTitle: 'Login - Nuxt Charts',
  twitterDescription:
    'Sign in to access Nuxt Charts and get early access benefits including 50% off lifetime access and updates.'
})

useSeoMeta({
  title: 'Login',
  description: 'Login to your account to continue'
})

const providers = [
  {
    label: 'Google',
    icon: 'i-simple-icons-google',
    onClick: () => {
      window.open('/api/auth/google', '_self')
    }
  },
  {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    onClick: () => {
      window.open('/api/auth/github', '_self')
    }
  }
]

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const fields = [
  {
    name: 'email',
    type: 'email' as const,
    label: 'Email',
    placeholder: 'Email',
    required: true,
    size: 'lg' as const
  },
  {
    name: 'password',
    type: 'password' as const,
    label: 'Password',
    placeholder: 'Password',
    required: true,
    size: 'lg' as const
  }
]

const toast = useToast()

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: payload.data
    })

    toast.add({
      title: 'Success!',
      description: 'You are now logged in.',
      icon: 'i-lucide-check-circle',
      color: 'success'
    })

    navigateTo('/')
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.statusMessage || 'Login failed',
      icon: 'i-lucide-alert-circle',
      color: 'error'
    })
  }
}

const countClicks = ref(0)
</script>

<template>
  <UCard class="mx-auto mt-48 max-w-md">
    <UAuthForm
      :providers="providers"
      title="Welcome back!"
      icon="i-lucide-lock"
      :fields="countClicks < 10 ? [] : fields"
      :schema="schema"
      @submit="onSubmit"
    >
      <template #footer>
        <div @click="countClicks++">
          By signing in, you agree to our
          <ULink
            to="/"
            class="text-primary font-medium"
          >Terms of Service</ULink>.
        </div>
      </template>
    </UAuthForm>
  </UCard>
</template>
