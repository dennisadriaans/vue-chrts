<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineOptions({
  tags: ['dashboard', 'panel']
})

const items = [
  [
    {
      label: 'New mail',
      icon: 'i-lucide-send',
      to: '/inbox'
    },
    {
      label: 'New customer',
      icon: 'i-lucide-user-plus',
      to: '/customers'
    }
  ]
] satisfies DropdownMenuItem[][]

const paths = ref([
  {
    label: 'Docs',
    to: '/docs'
  },
  {
    label: 'Components',
    to: '/docs/components'
  },
  {
    label: 'Breadcrumb',
    to: '/docs/components/breadcrumb'
  }
])
</script>

<template>
  <div>
    <UDashboardNavbar
      title="Home"
      :ui="{ right: 'gap-3' }"
    >
      <template #left>
        <div class="space-y-2">
          <UBreadcrumb :items="paths" />
          <div class="text-lg font-semibold">
            Page title
          </div>
        </div>
      </template>

      <template #right>
        <UDropdownMenu :items="items">
          <UButton
            class="rounded-md"
            color="neutral"
            variant="ghost"
            label="Register"
          />
          <UButton
            class="rounded-md"
            variant="soft"
            label="Login"
          />
        </UDropdownMenu>
      </template>
    </UDashboardNavbar>

    <div
      class="border-default text-dimmed m-2 mt-4 flex items-center justify-center border-2 border-dashed p-4"
    >
      content
    </div>
  </div>
</template>
