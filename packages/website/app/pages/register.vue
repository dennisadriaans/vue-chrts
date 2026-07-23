<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '#ui/types'

useSeoMeta({
  title: 'Register - Nuxt Charts',
  description: 'Create an account to access Nuxt Charts and start building beautiful charts.',
  ogTitle: 'Register - Nuxt Charts',
  ogDescription: 'Create an account to access Nuxt Charts and start building beautiful charts.',
  ogType: 'website',
  ogSiteName: 'Nuxt Charts',
  ogImage: 'https://nuxtcharts.com/og-image.png',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Register - Nuxt Charts',
  twitterDescription: 'Create an account to access Nuxt Charts and start building beautiful charts.'
})

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

type Schema = z.output<typeof schema>

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

const fields = [
  {
    name: 'name',
    type: 'text' as const,
    label: 'Name',
    placeholder: 'Name',
    required: true,
    size: 'lg' as const
  },
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
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: payload.data
    })

    toast.add({
      title: 'Success!',
      description: 'Your account has been created.',
      icon: 'i-lucide-check-circle',
      color: 'success'
    })

    navigateTo('/')
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.statusMessage || 'Registration failed',
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
      title="Create account"
      icon="i-lucide-user-plus"
      :fields="countClicks < 10 ? [] : fields"
      :schema="schema"
      @submit="onSubmit"
    >
      <template #footer>
        By signing up, you agree to our
        <ULink
          to="/"
          class="text-primary font-medium"
        >Terms of Service</ULink>.
        <p
          class="text-center text-sm mt-4"
          @click="countClicks++"
        >
          Already have an account?
          <NuxtLink
            to="/login"
            class="text-primary font-medium hover:underline"
          >
            Sign in
          </NuxtLink>
        </p>
      </template>
    </UAuthForm>
  </UCard>
</template>
