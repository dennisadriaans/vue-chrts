<script lang="ts" setup>
import Calendar from '~/components/lib/Calendar/Calendar.vue'

import { CalendarSelectionMode } from '~/components/lib/Calendar/types'
</script>

<template>
  <div class="bg-elevated/50 flex w-full items-center justify-center py-16">
    <div
      class="bg-default border-default w-full max-w-md rounded-xl border p-8"
    >
      <calendar :selection-mode="CalendarSelectionMode.Range" />
    </div>
  </div>
</template>
