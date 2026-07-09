<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineOptions({
  tags: ['dashboard', 'withsearch']
})

const items: NavigationMenuItem[][] = [
  [
    {
      label: 'General',
      active: true
    },
    {
      label: 'Members'
    },
    {
      label: 'Notifications'
    }
  ],
  [
    {
      label: 'Documentation',
      icon: 'i-lucide-book-open',
      to: 'https://ui.nuxt.com/docs',
      target: '_blank'
    },
    {
      label: 'Help & Feedback',
      icon: 'i-lucide-help-circle',
      to: 'https://github.com/nuxt/ui/issues',
      target: '_blank'
    }
  ]
]

const paths = ref([
  {
    label: 'Dashboard',
    to: '/dashboard'
  },
  {
    label: 'Payments',
    to: '/docs/payments'
  }
])
</script>

<template>
  <div class="bg-default border-default rounded-lg border pb-4">
    <UDashboardNavbar
      title="Home"
      :ui="{ right: 'gap-3 lg:gap-4' }"
    >
      <template #left>
        <div class="flex items-center gap-3 lg:gap-4">
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-lucide-panel-left"
          />
          <UBreadcrumb
            :ui="{ separatorIcon: 'size-4' }"
            :items="paths"
            class="hidden lg:flex"
          />
        </div>
      </template>

      <template #right>
        <UButton
          class="hidden rounded-md lg:inline-flex"
          color="neutral"
          variant="ghost"
          label="Register"
        />
        <UButton
          class="rounded-md"
          color="neutral"
          variant="ghost"
        >
          <span class="hidden lg:inline">Login</span>
          <UIcon
            name="i-lucide-log-in"
            class="lg:hidden"
          />
        </UButton>
      </template>
    </UDashboardNavbar>

    <UDashboardToolbar>
      <div
        class="flex w-full flex-col items-start justify-between gap-4 lg:flex-row lg:items-center"
      >
        <div class="py-2">
          <div class="text-base font-semibold lg:text-lg">
            Page title
          </div>
          <p class="text-dimmed text-sm">
            Manage Dashboard content however you need
          </p>
        </div>
        <UInput
          icon="i-lucide-search"
          size="md"
          variant="outline"
          placeholder="Search..."
          class="w-full lg:w-auto"
        />
      </div>
    </UDashboardToolbar>

    <div
      class="border-default text-dimmed mx-4 my-4 flex items-center justify-center border-2 border-dashed p-4 lg:mx-6 lg:p-8"
    >
      content
    </div>
  </div>
</template>
