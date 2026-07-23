<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineOptions({
  tags: ['dashboard', 'variantone']
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
  <div class="bg-default border-default rounded-lg border pb-4">
    <UDashboardNavbar
      title="Home"
      :ui="{ right: 'gap-3 lg:gap-4' }"
    >
      <template #left>
        <div class="flex items-center gap-3 lg:gap-4">
          <div class="truncate text-base font-semibold lg:text-lg">
            Page title
          </div>
          <UBreadcrumb
            :items="paths"
            class="hidden lg:flex"
          />
        </div>
      </template>

      <template #right>
        <UDropdownMenu :items="items">
          <UButton
            class="rounded-md"
            color="neutral"
            variant="ghost"
            trailing-icon="i-lucide-chevron-down"
          >
            <span class="hidden lg:inline">Actions</span>
            <UIcon
              name="i-lucide-plus"
              class="lg:hidden"
            />
          </UButton>
        </UDropdownMenu>
      </template>
    </UDashboardNavbar>

    <div
      class="border-default text-dimmed mx-4 mt-4 flex items-center justify-center border-2 border-dashed p-4 lg:mx-6 lg:p-8"
    >
      content
    </div>
  </div>
</template>
