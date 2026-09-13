<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

/**
 * Two full-bleed charts spanning a rolling 24-hour window, centered on the
 * current hour: the hour marked by a reference line sits in the middle of the
 * x domain, with 12 hours of history to its left and 12 hours ahead of it to
 * the right. One point per hour.
 */

const HOURS_EACH_SIDE = 12;
/** How often the clock is re-read. Data only changes when the hour rolls. */
const TICK_MS = 30_000;

interface Slot {
  /** Minutes since midnight, used to label and to find the current slot. */
  minutes: number;
  /** `HH:MM`, the x-axis key. */
  time: string;
  visitors: number;
  sessions: number;
  latency: number;
  errors: number;
}

const visitorCategories: Record<string, BulletLegendItemInterface> = {
  visitors: { name: "Visitors", color: "#6366f1" },
  sessions: { name: "Sessions", color: "#22d3ee" },
};

const healthCategories: Record<string, BulletLegendItemInterface> = {
  latency: { name: "Latency (ms)", color: "#8b5cf6" },
  errors: { name: "Errors", color: "#f43f5e" },
};

/** `minutes` since midnight → `HH:MM`, wrapping across the day boundary. */
function label(minutes: number): string {
  const wrapped = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * A smooth, repeatable daily traffic shape: a late-morning bump and a larger
 * afternoon peak, so the curve looks like real usage rather than noise.
 */
function baseline(minutes: number): number {
  const hour = (((minutes % 1440) + 1440) % 1440) / 60;
  const bump = (center: number, width: number, height: number) =>
    height * Math.exp(-((hour - center) ** 2) / (2 * width ** 2));

  return 12 + bump(10.5, 1.2, 120) + bump(15, 1.1, 260);
}

/** Deterministic jitter so each hour keeps the same wobble across renders. */
function jitter(seed: number): number {
  return (Math.sin(seed * 12.9898) * 43758.5453) % 1;
}

const now = ref(new Date());

/** Current time snapped down to the hour — the resolution of the series. */
const currentMinutes = computed(() => now.value.getHours() * 60);

/**
 * The window is centered on the current hour, so the hour the reference line
 * marks lands in the middle of the chart.
 */
const centerMinutes = computed(() => currentMinutes.value);

/** The exact hour the reference line marks, e.g. `13:00`. */
const currentHourLabel = computed(() => label(centerMinutes.value));

/**
 * The rolling window: 12h of history, the current hour, then 12h ahead.
 *
 * Future hours are flat `0` rather than `null` on purpose. The adapter drops
 * any row holding a non-finite value (`normalizeNumericRows`), which would
 * shrink the x domain to just the filled half and push "now" to the right
 * edge. Keeping the rows numeric holds the domain open so the current hour
 * stays centered, with the right half resting on the baseline.
 */
const slots = computed<Slot[]>(() => {
  const start = centerMinutes.value - HOURS_EACH_SIDE * 60;
  const count = HOURS_EACH_SIDE * 2 + 1;

  return Array.from({ length: count }, (_, i) => {
    const minutes = start + i * 60;
    const future = minutes > currentMinutes.value;
    const base = baseline(minutes);
    const wobble = jitter(minutes);

    return {
      minutes,
      time: label(minutes),
      visitors: future ? 0 : Math.max(0, Math.round(base + wobble * 18)),
      sessions: future ? 0 : Math.max(0, Math.round(base * 0.55 + wobble * 12)),
      latency: future ? 0 : Math.round(120 + base * 0.35 + wobble * 40),
      errors: future ? 0 : Math.max(0, Math.round(wobble * 6 + base * 0.02)),
    };
  });
});

/**
 * One tick per hour. The window spans a full 24h, so its first and last ticks
 * land on the same clock time — drop the last to keep the two edge labels
 * distinct (e.g. `01:00` … `00:00`).
 */
const hourTicks = computed(() => {
  const ticks = slots.value.map((slot) => slot.time);
  return ticks.length > 1 && ticks[0] === ticks[ticks.length - 1]
    ? ticks.slice(0, -1)
    : ticks;
});

/**
 * Only the window's first and last hour are labelled, plus the current hour —
 * every other tick stays an unlabelled dot on the axis.
 */
const edgeTicks = computed(() => {
  const ticks = hourTicks.value;
  return new Set([ticks[0], ticks[ticks.length - 1], currentHourLabel.value]);
});

/**
 * Labels only the edge hours and the current hour; other ticks render blank.
 *
 * The chart sets `xAxis`, so the tick arrives translated to its row index in
 * `slots` (v2 parity) rather than as the `HH:MM` string — look the label up on
 * the row. Falls back to treating the tick as the value itself, since a tick
 * with no matching row is passed through untranslated.
 */
function xFormatter(tick: number | string): string {
  const value =
    typeof tick === "number" ? (slots.value[tick]?.time ?? "") : String(tick);
  return edgeTicks.value.has(value) ? value : "";
}

/** The current hour's readout. Future hours are zero-filled padding. */
const latest = computed(() =>
  slots.value.find((slot) => slot.minutes === currentMinutes.value),
);

const referenceLines = computed(() => [
  {
    x: currentHourLabel.value,
    label: currentHourLabel.value,
    color: "#94a3b8",
    strokeWidth: 1,
  },
]);

const padding = { top: 16, right: 24, bottom: 8, left: 24 };

/** Transition length when the hour rolls and the whole series shifts left. */
const DURATION_MS = 600;

/**
 * Growth series for the dotted-column chart — one dot-stack per period, the
 * cap dot carrying the value. Fixed data: this panel shows the shape, not the
 * rolling clock the charts above track.
 */
const growth = [
  { label: "W1", value: 1 },
  { label: "W2", value: 1 },
  { label: "W3", value: 2 },
  { label: "W4", value: 3 },
  { label: "W5", value: 3 },
  { label: "W6", value: 4 },
  { label: "W7", value: 5 },
  { label: "W8", value: 6 },
  { label: "W9", value: 7 },
  { label: "W10", value: 9 },
  { label: "W11", value: 11 },
  { label: "W12", value: 13 },
  { label: "W13", value: 16 },
  { label: "W14", value: 18 },
  { label: "W15", value: 22 },
  { label: "W16", value: 27 },
];

let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date();
  }, TICK_MS);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="py-10">
    <div class="mb-6 flex items-center justify-between gap-4 px-6">
      <div>
        <h1 class="text-2xl font-semibold">Hourly traffic</h1>
        <p class="text-sm text-muted">
          Rolling 24 hours, centered on {{ currentHourLabel }}.
        </p>
      </div>
      <UBadge variant="subtle" color="primary">
        <span class="font-semibold">{{ latest?.visitors ?? 0 }} people</span>
        <span class="ml-1 opacity-70">this hour</span>
      </UBadge>
    </div>

    <!-- Full-bleed: no container, so the chart spans the whole viewport. -->
    <section class="mb-10 w-full">
      <AreaChart
        :data="slots"
        :categories="visitorCategories"
        :height="300"
        x-axis="time"
        :curve-type="CurveType.MonotoneX"
        :x-explicit-ticks="hourTicks"
        :x-formatter="xFormatter"
        :reference-lines="referenceLines"
        :padding="padding"
        :duration="DURATION_MS"
        hide-y-axis
        hide-legend
        :x-domain-line="false"
        :x-tick-line="false"
        :y-grid-line="false"
        aria-label="Hourly visitors over a rolling 24-hour window"
      />
    </section>

    <div class="mb-6 flex items-center justify-between gap-4 px-6">
      <div>
        <h2 class="text-lg font-medium">Experience score</h2>
        <p class="text-sm text-muted">Latency and errors, same window.</p>
      </div>
      <UBadge variant="subtle">
        {{ latest?.latency ?? 0 }} ms · {{ latest?.errors ?? 0 }} errors
      </UBadge>
    </div>

    <section class="w-full">
      <AreaChart
        :data="slots"
        :categories="healthCategories"
        :height="300"
        x-axis="time"
        :curve-type="CurveType.MonotoneX"
        :x-explicit-ticks="hourTicks"
        :x-formatter="xFormatter"
        :reference-lines="referenceLines"
        :padding="padding"
        :duration="DURATION_MS"
        hide-area
        hide-y-axis
        hide-legend
        :x-domain-line="false"
        :x-tick-line="false"
        :y-grid-line="false"
        aria-label="Hourly latency and errors over a rolling 24-hour window"
      />
    </section>

    <div class="mt-10 mb-6 flex items-center justify-between gap-4 px-6">
      <div>
        <h2 class="text-lg font-medium">Weekly growth</h2>
        <p class="text-sm text-muted">New workspaces per week, last 16 weeks.</p>
      </div>
      <UBadge variant="subtle" color="primary">
        {{ growth[growth.length - 1]?.value ?? 0 }} this week
      </UBadge>
    </div>

    <section class="w-full px-6">
      <DotColumnChart :data="growth" :height="340" />
    </section>
  </div>
</template>
