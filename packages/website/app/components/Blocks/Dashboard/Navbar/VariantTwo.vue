<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineOptions({
  tags: ['dashboard', 'varianttwo']
})

const _items = [
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
          v-for="(i, iKey) in ['Dashboard', 'Orders', 'Products', 'Customers']"
          :key="iKey"
          class="hidden rounded-md xl:inline-flex"
          color="neutral"
          variant="ghost"
          :label="i"
        />
        <UButton
          class="rounded-md"
          variant="soft"
          label="Upgrade"
        />
      </template>
    </UDashboardNavbar>

    <div
      class="border-default text-dimmed mx-4 mt-4 flex items-center justify-center border-2 border-dashed p-4 lg:mx-6 lg:p-8"
    >
      content
    </div>
  </div>
</template>
