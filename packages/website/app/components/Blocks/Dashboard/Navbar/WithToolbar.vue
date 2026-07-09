<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineOptions({
  tags: ['dashboard', 'withtoolbar']
})

const activeTab = ref('General')

const items = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: 'General',
      active: activeTab.value === 'General',
      onSelect: () => (activeTab.value = 'General')
    },
    {
      label: 'Members',
      active: activeTab.value === 'Members',
      onSelect: () => (activeTab.value = 'Members')
    },
    {
      label: 'Notifications',
      active: activeTab.value === 'Notifications',
      onSelect: () => (activeTab.value = 'Notifications')
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
])

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
  <div class="bg-default rounded-lg p-4 lg:p-6">
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
          variant="soft"
        >
          <span class="hidden lg:inline">Login</span>
          <UIcon
            name="i-lucide-log-in"
            class="lg:hidden"
          />
        </UButton>
      </template>
    </UDashboardNavbar>

    <UDashboardToolbar class="overflow-x-auto">
      <UNavigationMenu
        :items="items"
        highlight
        class="min-w-0 flex-1"
      />
    </UDashboardToolbar>

    <div
      class="border-default text-dimmed m-2 mt-4 flex items-center justify-center border-2 border-dashed p-4 lg:p-8"
    >
      content
    </div>
  </div>
</template>
