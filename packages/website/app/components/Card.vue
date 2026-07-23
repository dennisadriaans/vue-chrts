<script lang="ts" setup>
import { useSlots } from 'vue'

const slots = useSlots()
</script>

<template>
  <div
    class="ring-border divide-border bg-card w-full divide-y rounded-lg ring"
  >
    <div
      v-if="slots.header"
      class="p-4 sm:px-6"
    >
      <slot
        class="p-4 sm:px-6"
        name="header"
      />
    </div>
    <div
      v-if="slots.body"
      class="p-4 sm:px-6"
    >
      <slot
        class="p-4 sm:px-6"
        name="body"
      />
    </div>
    <div
      v-if="slots.footer"
      class="p-4 sm:px-6"
    >
      <slot
        class="p-4 sm:px-6"
        name="footer"
      />
    </div>
  </div>
</template>
