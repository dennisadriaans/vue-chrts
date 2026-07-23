<script setup lang="ts">
import Calendar from '~/components/lib/Calendar/Calendar.vue'

import { CalendarSelectionMode } from '~/components/lib/Calendar/types'

defineOptions({
  tags: ['blocks', 'calendar']
})
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">
        Calendar
      </h2>
      <p class="text-toned dark:text-muted">
        Beautiful calendar components for date selection and scheduling.
      </p>
    </div>

    <ClientOnly>
      <div class="mt-12 space-y-24 lg:mt-0">
        <PreviewExample title="Date Picker">
          <template #chart>
            <calendar
              :show-time-picker="true"
              :orientation="Orientation.Horizontal"
            />
          </template>
          <PreviewCode
            id="calendar-date-picker"
            category="calendar"
            block="calendar"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Calendar Dropdown">
          <template #chart>
            <BlocksCalendarDropdown />
          </template>
          <PreviewCode
            id="calendar-dropdown"
            category="calendar"
            block="dropdown"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Date Range Picker">
          <template #chart>
            <calendar :selection-mode="CalendarSelectionMode.Range" />
          </template>
          <PreviewCode
            id="calendar-date-range-picker"
            category="calendar"
            block="calendar"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Calendar Number of Months">
          <template #chart>
            <div class="mx-auto max-w-2xl">
              <calendar
                :selection-mode="CalendarSelectionMode.Range"
                :visible-months="2"
              />
            </div>
          </template>
          <PreviewCode
            id="calendar-number-of-months"
            category="calendar"
            block="calendar"
            :lock-code="true"
          />
        </PreviewExample>
      </div>
    </ClientOnly>
  </div>
</template>
