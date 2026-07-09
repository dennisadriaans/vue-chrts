<script lang="ts" setup>
const code = `<script setup lang="ts">
const count = ref(0)
<\/script>

<template>
  <div class="flex flex-col items-center gap-4 p-8">
    <p class="text-lg font-semibold">Count: {{ count }}</p>
    <UButton @click="count++">Increment</UButton>
  </div>
</template>`
</script>

<template>
  <div class="w-full p-4">
    <LibCodeBlock
      :code="code"
      filename="Counter.vue"
    />
  </div>
</template>
