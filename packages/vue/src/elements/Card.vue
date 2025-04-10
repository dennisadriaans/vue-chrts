<script lang="ts" setup>
import { useSlots } from 'vue'
const slots = useSlots()
</script>
<template>
  <div class="w-full rounded-lg ring ring-border divide-y divide-border bg-card">
    <div v-if="slots.header" class="p-4 sm:px-6">
        <slot class="p-4 sm:px-6" name="header"></slot>
    </div>
    <div class="p-4 sm:px-6">
        <slot></slot>
    </div>
    <div v-if="slots.footer" class="p-4 sm:px-6">
        <slot class="p-4 sm:px-6" name="footer"></slot>
    </div>
  </div>
</template>