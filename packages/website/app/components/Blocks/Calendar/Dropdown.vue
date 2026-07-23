<script lang="ts" setup>
import Calendar from '~/components/lib/Calendar/Calendar.vue'

defineOptions({
  tags: ['calendar', 'dropdown']
})

const value = ref({
  start: new Date(),
  end: new Date()
})

function formatDate() {
  const start = value.value.start.toLocaleDateString('nl-NL')
  const end = value.value.end.toLocaleDateString('nl-NL')
  return `${start} - ${end}`
}

const calendarVisible = ref(false)

function toggleDropdown() {
  calendarVisible.value = !calendarVisible.value
}
const quickRanges = [
  'Today',
  'Yesterday',
  'This week (Sun–Today)',
  'Last week (Sun–Sat)',
  'Last 7 days',
  'Last 30 days',
  'Last 90 days'
]

const duration = ref('Yesterday')
</script>

<template>
  <div class="relative flex items-start justify-center">
    <UButton
      ref="trigger"
      size="lg"
      @click="toggleDropdown"
    >
      <template #leading>
        <UIcon name="i-lucide-calendar" />
        <span class="border-default mr-1 ml-1 border-l-1 pl-2 font-normal">{{
          formatDate()
        }}</span>
      </template>
    </UButton>
    <div
      v-if="calendarVisible"
      class="absolute left-1/2 z-10 mt-8 flex -translate-x-1/2 items-stretch shadow-lg"
    >
      <UCard class="!bg-default">
        <div class="flex gap-4">
          <div class="space-y-2">
            <UButton
              v-for="(label, labelKey) in quickRanges"
              :key="labelKey"
              variant="link"
              color="neutral"
              :active="duration === label"
              active-color="primary"
              class="block whitespace-nowrap"
              @click="duration = label"
            >
              {{ label }}
            </UButton>
          </div>

          <div class="w-80">
            <calendar />
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              variant="link"
              color="primary"
              size="xl"
              @click="toggleDropdown"
            >
              Cancel
            </UButton>
            <UButton
              variant="link"
              color="primary"
              size="xl"
              @click="toggleDropdown"
            >
              Apply
            </UButton>
          </div>
        </template>
      </UCard>
    </div>
    <div
      v-if="calendarVisible"
      class="dark:bg-default/50 fixed inset-0 z-5 size-full"
      @click="toggleDropdown"
    />
  </div>
</template>
