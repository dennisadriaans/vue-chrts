<script lang="ts" setup>
const route = useRoute()

const menuItems = [
  {
    label: 'Affiliates',
    icon: 'i-lucide-users',
    to: '/admin/affiliates'
  }
]
</script>

<template>
  <div class="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
    <div class="mb-8">
      <h2 class="text-2xl font-bold">
        Admin Panel
      </h2>
    </div>

    <nav class="space-y-2">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        :class="{
          'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400': route.path.startsWith(item.to)
        }"
      >
        <UIcon
          :name="item.icon"
          class="w-5 h-5"
        />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>
