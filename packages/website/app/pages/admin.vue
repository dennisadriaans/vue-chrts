<script lang="ts" setup>
definePageMeta({
  title: 'Admin',
  layout: 'admin',
  middleware: 'admin'
})
</script>

<template>
  <AdminSidePanel />
  <div class="ml-64 p-8">
    <NuxtPage />
  </div>
</template>
