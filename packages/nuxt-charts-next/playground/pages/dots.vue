<script setup lang="ts">
/**
 * Dot-only charting gallery.
 *
 * Every chart here is drawn from circles alone — no strokes, no fills, no
 * ruled axes — and all of them inherit one ink colour from the page, so the
 * grid reads as a single monochrome system. Each card pairs a chart with the
 * job it does, since the same primitive covers very different chart types.
 */
import type { DotPoint } from "../components/dots/geometry";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Only this year carries data; the other three stay as reserved slots. */
const REPORTED_YEAR = "2025";
const YEARS = ["2023", "2024", REPORTED_YEAR, "2026"];

/** The twelve monthly readings, in order, for the one reported year. */
const reportedMonths = [18, 26, 23, 34, 41, 37, 44, 52, 48, 57, 63, 59];

/**
 * Four years of months on the axis, but only the reported year carries
 * values. Every empty month keeps its slot, so the dotted line sits in the
 * centre of the chart with a full year of blank axis on either side.
 */
const centeredYear: DotPoint[] = YEARS.flatMap((year) =>
  MONTHS.map((label, month) => ({
    label,
    group: year,
    value: year === REPORTED_YEAR ? reportedMonths[month]! : null,
  })),
);

/** Growth curve from the cards page, reused so the column shape is comparable. */
const growth: DotPoint[] = [
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

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const slotLabels = ["00", "03", "06", "09", "12", "15", "18", "21"];

/**
 * Deterministic activity matrix: a weekday working-hours peak with a lighter
 * weekend, so the grid has structure instead of noise.
 */
const activity = days.map((_, row) =>
  slotLabels.map((_, col) => {
    const hour = col * 3;
    const weekend = row >= 5;
    const workday = Math.exp(-((hour - 14) ** 2) / 40);
    const evening = Math.exp(-((hour - 20) ** 2) / 24);
    const base = weekend ? evening * 0.8 : workday + evening * 0.35;
    // Fixed wobble so the grid is stable across renders.
    const wobble = Math.abs(Math.sin((row + 1) * (col + 3) * 1.7)) * 0.18;
    return Math.round((base + wobble) * 100);
  }),
);

const channels: DotPoint[] = [
  { label: "Direct", value: 82 },
  { label: "Search", value: 64 },
  { label: "Social", value: 41 },
  { label: "Email", value: 55 },
  { label: "Referral", value: 28 },
  { label: "Ads", value: 37 },
];

const salaryBands = [
  { label: "Junior", from: 42, to: 58 },
  { label: "Mid", from: 58, to: 82 },
  { label: "Senior", from: 80, to: 115 },
  { label: "Staff", from: 105, to: 150 },
  { label: "Principal", from: 135, to: 190 },
];

/** A smooth double-peaked wave, so the stream has a readable silhouette. */
const traffic: DotPoint[] = Array.from({ length: 40 }, (_, i) => {
  const t = (i / 39) * Math.PI * 2;
  return {
    label: `t${i}`,
    value: 30 + Math.sin(t) * 18 + Math.sin(t * 2.3 + 1) * 11,
  };
});

/** Deterministic cloud with a positive trend, plus a size dimension. */
const samples = Array.from({ length: 26 }, (_, i) => ({
  x: i,
  y: i * 1.7 + Math.sin(i * 2.1) * 9 + 12,
  size: 1 + Math.abs(Math.cos(i * 1.3)) * 9,
}));

const budgets = [
  { label: "Compute", value: 0.86 },
  { label: "Storage", value: 0.54 },
  { label: "Network", value: 0.31 },
  { label: "Support", value: 0.68 },
  { label: "Licences", value: 0.12 },
];
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 pt-8 pb-16">
    <NuxtLink class="text-xs text-muted hover:text-default" to="/">← back</NuxtLink>
    <h1 class="text-4xl font-bold my-5">Dot-only Nuxt Charts</h1>
    <p class="max-w-2xl text-muted leading-relaxed">
      Every chart on this page is built from circles alone — no strokes, no
      fills, no ruled axes. All of them inherit one ink colour from the page,
      so the whole gallery stays monochrome.
    </p>

    <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
      <!-- Charts whose x axis needs the full width to stay legible span both columns. -->
      <UCard class="sm:col-span-2">
        <div class="flex flex-col gap-1">
          <strong class="text-sm font-semibold">Dotted line — partial year</strong>
          <span class="text-xs leading-snug text-muted">
            Four years on the axis, data in the middle one. Empty months keep
            their slot, so the series floats in the centre instead of
            stretching to fill the chart.
          </span>
        </div>
        <DotLineChart class="mt-4" :data="centeredYear" :height="260" />
      </UCard>

      <UCard>
        <div class="flex flex-col gap-1">
          <strong class="text-sm font-semibold">Dotted columns</strong>
          <span class="text-xs leading-snug text-muted">
            A stack per period with a larger cap dot carrying the value; the
            stack fades toward the baseline so the caps read as the line.
          </span>
        </div>
        <DotColumnChart class="mt-4" :data="growth" :height="300" />
      </UCard>

      <UCard>
        <div class="flex flex-col gap-1">
          <strong class="text-sm font-semibold">Density matrix</strong>
          <span class="text-xs leading-snug text-muted">
            Week by time of day. Dot area, not colour, carries intensity — a
            heatmap with no colour scale to decode.
          </span>
        </div>
        <DotMatrixChart
          class="mt-4"
          :data="activity"
          :row-labels="days"
          :column-labels="slotLabels"
        />
      </UCard>

      <UCard>
        <div class="flex flex-col gap-1">
          <strong class="text-sm font-semibold">Radial spokes</strong>
          <span class="text-xs leading-snug text-muted">
            A radar chart without the web: each channel is a spoke, and its
            value is how far the dots reach outward.
          </span>
        </div>
        <DotRadialChart
          class="mt-4 mx-auto max-h-[220px]"
          :data="channels"
          :size="220"
        />
      </UCard>

      <UCard>
        <div class="flex flex-col gap-1">
          <strong class="text-sm font-semibold">Range dumbbells</strong>
          <span class="text-xs leading-snug text-muted">
            Two caps per row with a faint dotted spine between them, so the
            distance is the story rather than the total.
          </span>
        </div>
        <DotRangeChart class="mt-4" :data="salaryBands" :height="170" />
      </UCard>

      <UCard class="sm:col-span-2">
        <div class="flex flex-col gap-1">
          <strong class="text-sm font-semibold">Stream</strong>
          <span class="text-xs leading-snug text-muted">
            Columns grow symmetrically from a mid-line and fade outward, so the
            silhouette emerges from dot density with no outline drawn.
          </span>
        </div>
        <DotStreamChart class="mt-4" :data="traffic" :height="200" />
      </UCard>

      <UCard>
        <div class="flex flex-col gap-1">
          <strong class="text-sm font-semibold">Scatter on a dotted grid</strong>
          <span class="text-xs leading-snug text-muted">
            Even the gridlines are dots. Point area carries a third dimension,
            so it doubles as a bubble chart.
          </span>
        </div>
        <DotScatterChart class="mt-4" :data="samples" :height="250" />
      </UCard>

      <UCard>
        <div class="flex flex-col gap-1">
          <strong class="text-sm font-semibold">Waffle</strong>
          <span class="text-xs leading-snug text-muted">
            Part-to-whole as one dot per unit, filling bottom-up. The count of
            solid dots is the percentage.
          </span>
        </div>
        <!-- The waffle is square; cap it so it does not tower over its card. -->
        <div class="mx-auto mt-4 max-w-[200px]">
          <DotWaffleChart :value="0.64" />
        </div>
      </UCard>

      <UCard class="sm:col-span-2">
        <div class="flex flex-col gap-1">
          <strong class="text-sm font-semibold">Progress tracks</strong>
          <span class="text-xs leading-snug text-muted">
            Every track is the same length, so rows compare directly without an
            axis — a stacked progress bar reduced to its steps.
          </span>
        </div>
        <DotTrackChart class="mt-4" :data="budgets" />
      </UCard>
    </div>
  </main>
</template>
