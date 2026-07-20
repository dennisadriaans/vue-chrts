<script setup lang="ts">
import { shallowRef } from 'vue'
import { CalendarDate, type DateValue } from '@internationalized/date'
import type { DateRange } from 'reka-ui'

const range = shallowRef<DateRange>({
  start: new CalendarDate(2026, 7, 5) as DateValue,
  end: new CalendarDate(2026, 7, 9) as DateValue,
})
</script>

<template>
  <div class="vc-calendar-band inline-flex rounded-lg border border-default bg-default p-2 max-h-40 overflow-hidden">
    <UCalendar
      v-model="range"
      range
      color="primary"
    />
  </div>
</template>

<style>
/*
 * Continuous range band for the stock UCalendar.
 *
 * The default theme tints each selected day individually, which reads as a row
 * of disconnected pills. Here the band is painted on the `cell` (a square, gap-free
 * grid item) while the `cellTrigger` stays round, so the highlight runs edge to edge
 * and only the two bounds get the solid accent.
 */
.vc-calendar-band {
  --vc-band: color-mix(in oklab, var(--ui-primary) 12%, transparent);
  --vc-accent: var(--ui-primary);
  --vc-accent-text: var(--ui-text-inverted);
}

/* Band lives on the square cell so adjacent days touch with no seam. */
.vc-calendar-band [data-slot='cell']:has([data-selected]),
.vc-calendar-band [data-slot='cell']:has([data-highlighted]) {
  background: var(--vc-band);
}

/* Bounds get a half-width band so the round trigger caps the run. */
.vc-calendar-band [data-slot='cell']:has([data-selection-start]),
.vc-calendar-band [data-slot='cell']:has([data-highlighted-start]) {
  background: linear-gradient(to right, transparent 50%, var(--vc-band) 50%);
}

.vc-calendar-band [data-slot='cell']:has([data-selection-end]),
.vc-calendar-band [data-slot='cell']:has([data-highlighted-end]) {
  background: linear-gradient(to left, transparent 50%, var(--vc-band) 50%);
}

/* Single-day range: no band to trail off in either direction. */
.vc-calendar-band [data-slot='cell']:has([data-selection-start][data-selection-end]) {
  background: transparent;
}

/* Keep the trigger above the band. */
.vc-calendar-band [data-slot='cellTrigger'] {
  position: relative;
  z-index: 1;
}

/* Strip the per-day theme fill so only the band shows through mid-range. */
.vc-calendar-band [data-slot='cellTrigger'][data-selected],
.vc-calendar-band [data-slot='cellTrigger'][data-highlighted] {
  background: transparent;
  color: var(--ui-text-highlighted);
  font-weight: 400;
}

/* Solid accent on the two bounds. */
.vc-calendar-band [data-slot='cellTrigger'][data-selection-start],
.vc-calendar-band [data-slot='cellTrigger'][data-selection-end],
.vc-calendar-band [data-slot='cellTrigger'][data-highlighted-start],
.vc-calendar-band [data-slot='cellTrigger'][data-highlighted-end] {
  background: var(--vc-accent);
  color: var(--vc-accent-text);
  font-weight: 500;
}
</style>
