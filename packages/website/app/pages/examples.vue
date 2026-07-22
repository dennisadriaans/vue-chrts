<script setup lang="ts">
/**
 * Focused showcase for the two newest chart styles: dithered area fills and
 * cube bars. One section per variant — each renders its own chart with its own
 * props, so a section can be copied out as-is without untangling conditionals.
 */
definePageMeta({
  layout: false
})

useSeoMeta({
  title: 'Examples – Nuxt Charts',
  description:
    'Dithered area fills and cube bar charts, one self-contained example per style.'
})

/* ------------------------------------------------------------------ *
 * Datasets
 * ------------------------------------------------------------------ */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

const monthlyData = [
  { month: 'Jan', revenue: 4200, expenses: 2400 },
  { month: 'Feb', revenue: 5100, expenses: 2900 },
  { month: 'Mar', revenue: 4800, expenses: 3100 },
  { month: 'Apr', revenue: 6400, expenses: 3300 },
  { month: 'May', revenue: 7200, expenses: 3800 },
  { month: 'Jun', revenue: 8100, expenses: 4100 }
]

/**
 * Two-year monthly series for the solid-bars demo. Hand-authored so SSR and
 * client agree; the live control slices this to 6–24 months.
 */
const solidMonthlyData = (() => {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const revenues = [
    4200, 5100, 4800, 6400, 7200, 8100, 7600, 8300, 7900, 9100, 8800, 9500,
    9200, 10100, 9700, 10800, 10400, 11200, 10900, 11800, 11500, 12400, 12100, 13200
  ]
  const expenses = [
    2400, 2900, 3100, 3300, 3800, 4100, 3900, 4200, 4000, 4500, 4300, 4700,
    4600, 5000, 4800, 5300, 5100, 5500, 5400, 5800, 5600, 6100, 5900, 6400
  ]
  return revenues.map((revenue, i) => {
    const year = 2025 + Math.floor(i / 12)
    return {
      month: `${labels[i % 12]} '${String(year).slice(2)}`,
      revenue,
      expenses: expenses[i]!
    }
  })
})()

const monthlyCategories = {
  revenue: { name: 'Revenue', color: 'var(--color-green-500)' },
  expenses: { name: 'Expenses', color: 'var(--color-blue-500)' }
}

/**
 * Daily series shaped like the cube-grid reference (single metric, 0–100).
 * Hand-authored so SSR and client render identical bars.
 *
 * Kept to 40 points on purpose: cube size is clamped to the bar band width
 * (`resolveCubeGrid`), so a denser series shrinks cubes below `cubeMinSize`,
 * which silently disables the size/opacity taper.
 */
const dailyData = (() => {
  const start = Date.UTC(2026, 2, 1)
  const values = [
    12, 18, 8, 22, 35, 28, 15, 42, 55, 38, 20, 14, 48, 62, 71, 45, 30, 18, 25, 40,
    58, 66, 52, 34, 22, 16, 28, 44, 60, 75, 82, 68, 50, 36, 24, 19, 31, 47, 63, 78
  ]
  return values.map((value, i) => {
    const date = new Date(start + i * 86_400_000)
    return {
      date: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      revenue: value
    }
  })
})()

const dailyCategories = {
  revenue: { name: 'Revenue', color: 'var(--color-green-500)' }
}

/** Ghost cubes between the value and the chart top — Nuxt UI `bg-elevated/50`. */
const cubeEmptyColor = 'color-mix(in oklab, var(--ui-bg-elevated) 50%, transparent)'

/**
 * Live-tweaked values for each section's range control. One knob per example so
 * visitors can feel how the prop shapes the chart.
 */
const live = reactive({
  /** Top stop opacity for the plain gradient fill. */
  gradientOpacity: 0.6,
  /**
   * Top stop opacity for Bayer dither — same fade ramp as the gradient
   * example, composed over the halftone pattern.
   */
  bayerOpacity: 0.6,
  /** Tile edge (px) for noise / fade dither patterns. */
  noiseTile: 8,
  fadeTile: 8,
  /**
   * Dense cube grid: preferred size at the top of the plot, floor size at the
   * baseline, and opacity floor for the same taper.
   */
  trendCubeSize: 10,
  trendCubeMinSize: 3,
  trendMinOpacity: 0.24,
  /**
   * Grouped-cubes category gap as a % of the band. Cubes are clamped to
   * `cube-size` and centered, so band width — not `bar-gap` — separates them.
   */
  groupedCategoryGap: 30,
  /** Cube edge (px) for the stacked demo. */
  stackedCubeSize: 14,
  /** How many months the solid bar reference shows (6–24). */
  solidMonths: 6
})

const gradientStops = computed(() => [
  { offset: '0%', stopOpacity: live.gradientOpacity },
  { offset: '100%', stopOpacity: 0 }
])

const bayerGradientStops = computed(() => [
  { offset: '0%', stopOpacity: live.bayerOpacity },
  { offset: '100%', stopOpacity: 0 }
])

const solidData = computed(() => solidMonthlyData.slice(0, live.solidMonths))

/** Stacked cubes always show a full year so the shared track reads clearly. */
const stackedMonthlyData = solidMonthlyData.slice(0, 12)

/** Keep the size floor from overtaking the preferred cube size. */
watch(
  () => live.trendCubeSize,
  (size) => {
    if (live.trendCubeMinSize > size) live.trendCubeMinSize = size
  }
)

const trendCubeMinSizeMax = computed(() => live.trendCubeSize)

type LiveKey = keyof typeof live

interface SectionControl {
  label: string
  key: LiveKey
  min: number
  max: number
  step: number
  format: (value: number) => string
}

const sectionControls: Record<string, SectionControl[]> = {
  gradient: [
    {
      label: 'opacity',
      key: 'gradientOpacity',
      min: 0,
      max: 1,
      step: 0.05,
      format: v => v.toFixed(2)
    }
  ],
  bayer: [
    {
      label: 'opacity',
      key: 'bayerOpacity',
      min: 0,
      max: 1,
      step: 0.05,
      format: v => v.toFixed(2)
    }
  ],
  noise: [
    {
      label: 'dither-tile',
      key: 'noiseTile',
      min: 4,
      max: 24,
      step: 1,
      format: v => `${v}px`
    }
  ],
  fade: [
    {
      label: 'dither-tile',
      key: 'fadeTile',
      min: 4,
      max: 24,
      step: 1,
      format: v => `${v}px`
    }
  ],
  'cubes-trend': [
    {
      label: 'cube-size',
      key: 'trendCubeSize',
      min: 4,
      max: 16,
      step: 1,
      format: v => `${v}px`
    },
    {
      label: 'cube-min-size',
      key: 'trendCubeMinSize',
      min: 1,
      max: 12,
      step: 1,
      format: v => `${v}px`
    },
    {
      label: 'cube-min-opacity',
      key: 'trendMinOpacity',
      min: 0,
      max: 1,
      step: 0.01,
      format: v => v.toFixed(2)
    }
  ],
  'cubes-grouped': [
    {
      label: 'bar-category-gap',
      key: 'groupedCategoryGap',
      min: 0,
      max: 40,
      step: 1,
      format: v => `${v}%`
    }
  ],
  'cubes-stacked': [
    {
      label: 'cube-size',
      key: 'stackedCubeSize',
      min: 6,
      max: 28,
      step: 1,
      format: v => `${v}px`
    }
  ],
  solid: [
    {
      label: 'months',
      key: 'solidMonths',
      min: 6,
      max: 24,
      step: 1,
      format: v => String(v)
    }
  ]
}

/* ------------------------------------------------------------------ *
 * Sections — nav metadata only, each chart is written out inline below.
 * ------------------------------------------------------------------ */

interface SectionDef {
  id: string
  name: string
  eyebrow: string
  title: string
  description: string
}

const sections: SectionDef[] = [
  {
    id: 'gradient',
    name: 'Gradient',
    eyebrow: 'Area chart',
    title: 'The default gradient fill',
    description:
      'Baseline for comparison — no `dither` prop, so the area fades out with a plain vertical gradient. Drag to set the top opacity.'
  },
  {
    id: 'bayer',
    name: 'Bayer',
    eyebrow: 'Area chart · dither',
    title: 'Ordered Bayer dithering',
    description:
      'A 4×4 Bayer matrix tiles under the line, with the same vertical fade as the gradient fill. Drag to set the top opacity.'
  },
  {
    id: 'noise',
    name: 'Noise',
    eyebrow: 'Area chart · dither',
    title: 'Random noise dithering',
    description:
      'Randomised dot placement instead of a fixed matrix — grainier, less obviously tiled. Drag to set the tile size.'
  },
  {
    id: 'cubes-trend',
    name: 'Cube trend',
    eyebrow: 'Bar chart · cubes',
    title: 'A dense single-metric cube grid',
    description:
      'Daily values with `cube-empty-color` painting the ghost column above each bar. Cubes taper from `cube-size` at the top to `cube-min-size` at the baseline — drag to set both, plus the opacity floor.'
  },
  {
    id: 'cubes-grouped',
    name: 'Cube group',
    eyebrow: 'Bar chart · cubes',
    title: 'Grouped cube bars',
    description:
      'Two series side by side with larger cubes. Cubes are clamped to `cube-size` and centered in their band, so the band width — not `bar-gap` — is what separates them. Drag to squeeze it.'
  },
  {
    id: 'cubes-stacked',
    name: 'Cube stack',
    eyebrow: 'Bar chart · cubes',
    title: 'Stacked cube bars',
    description:
      'Add `stacked` and the cube columns share a track, each series picking up where the last stopped. Drag to set the cube size.'
  },
  {
    id: 'solid',
    name: 'Solid',
    eyebrow: 'Bar chart',
    title: 'Solid bars for reference',
    description:
      'The standard bar variant with rounded corners — what the cube variants replace. Drag to show anywhere from 6 to 24 months.'
  }
]

/* ------------------------------------------------------------------ *
 * Snap scrolling — one section per gesture, rAF-eased (native
 * behavior:'smooth' is often instant under prefers-reduced-motion).
 * ------------------------------------------------------------------ */

const activeIndex = ref(0)
const activeSection = computed(() => sections[activeIndex.value]!.id)
const scroller = ref<HTMLElement>()

const locked = ref(false)
let rafId = 0

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2
}

function cancelScroll() {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
}

function unlock() {
  locked.value = false
  cancelScroll()
}

function animateTo(root: HTMLElement, target: number) {
  const start = root.scrollTop
  const distance = target - start
  if (Math.abs(distance) < 1) {
    unlock()
    return
  }

  const duration = Math.max(450, Math.min(750, Math.abs(distance) * 0.55))
  let startTime: number | null = null

  const frame = (now: number) => {
    if (startTime === null) startTime = now
    const progress = Math.min((now - startTime) / duration, 1)
    root.scrollTop = start + distance * easeInOutCubic(progress)
    if (progress < 1) {
      rafId = requestAnimationFrame(frame)
    } else {
      rafId = 0
      locked.value = false
    }
  }

  rafId = requestAnimationFrame(frame)
}

function sectionOffset(index: number) {
  const root = scroller.value
  if (!root) return 0
  const el = root.children[index] as HTMLElement | undefined
  if (!el) return index * root.clientHeight
  return el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop
}

function goTo(index: number) {
  const root = scroller.value
  const clamped = Math.max(0, Math.min(sections.length - 1, index))
  if (!root) return
  if (clamped === activeIndex.value && !locked.value) return

  cancelScroll()
  activeIndex.value = clamped
  locked.value = true
  animateTo(root, sectionOffset(clamped))
}

function step(delta: number) {
  if (locked.value) return
  goTo(activeIndex.value + delta)
}

function scrollToSection(id: string) {
  goTo(sections.findIndex(s => s.id === id))
}

function onWheel(event: WheelEvent) {
  if (locked.value || Math.abs(event.deltaY) < 8) return
  step(event.deltaY > 0 ? 1 : -1)
}

let touchStartY = 0

function onTouchStart(event: TouchEvent) {
  touchStartY = event.touches[0]?.clientY ?? 0
}

function onTouchEnd(event: TouchEvent) {
  const endY = event.changedTouches[0]?.clientY ?? 0
  const delta = touchStartY - endY
  if (Math.abs(delta) > 50) step(delta > 0 ? 1 : -1)
}

function onScroll() {
  const root = scroller.value
  if (locked.value || !root || !root.clientHeight) return
  const index = Math.round(root.scrollTop / root.clientHeight)
  activeIndex.value = Math.max(0, Math.min(sections.length - 1, index))
}

const NEXT_KEYS = new Set(['ArrowDown', 'PageDown', ' '])
const PREV_KEYS = new Set(['ArrowUp', 'PageUp'])

function onKeydown(event: KeyboardEvent) {
  if (NEXT_KEYS.has(event.key)) {
    event.preventDefault()
    step(1)
  } else if (PREV_KEYS.has(event.key)) {
    event.preventDefault()
    step(-1)
  } else if (event.key === 'Home') {
    event.preventDefault()
    goTo(0)
  } else if (event.key === 'End') {
    event.preventDefault()
    goTo(sections.length - 1)
  }
}

onMounted(() => {
  scroller.value?.focus({ preventScroll: true })
})

onBeforeUnmount(() => {
  unlock()
})

/* ------------------------------------------------------------------ *
 * Formatters
 * ------------------------------------------------------------------ */

const monthFormatter = (i: number) => MONTHS[i] ?? ''
const currencyFormatter = (value: number) => `$${(value / 1000).toFixed(1)}k`
const plainFormatter = (value: number) => String(value)

const solidXFormatter = (i: number) => {
  const n = live.solidMonths
  const row = solidMonthlyData[i]
  if (!row) return ''
  if (i === 0 || i === n - 1) return row.month
  const step = Math.max(1, Math.round((n - 1) / 5))
  return i % step === 0 ? row.month : ''
}

const stackedXFormatter = (i: number) => stackedMonthlyData[i]?.month ?? ''

const dailyXFormatter = (i: number) => {
  const row = dailyData[i]
  if (!row) return ''
  return i === 0 || i === dailyData.length - 1 || i % 10 === 0 ? row.label : ''
}

const { height: chartHeight } = useResponsiveHeight({
  default: 300,
  sm: 420
})
</script>

<template>
  <div class="fixed inset-0 overflow-hidden bg-[#0a0a0a] text-white">
    <!-- Dot nav -->
    <nav
      class="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-2 lg:flex"
      aria-label="Chart examples"
    >
      <button
        v-for="section in sections"
        :key="section.id"
        type="button"
        class="group flex items-center gap-2 outline-none"
        :aria-current="activeSection === section.id ? 'true' : undefined"
        @click="scrollToSection(section.id)"
      >
        <span
          class="text-xs tabular-nums transition-opacity"
          :class="activeSection === section.id
            ? 'text-white opacity-100'
            : 'text-white/40 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'"
        >
          {{ section.name }}
        </span>
        <span
          class="size-2 rounded-full transition-all"
          :class="activeSection === section.id
            ? 'scale-125 bg-green-500'
            : 'bg-white/25 group-hover:bg-white/60'"
        />
      </button>
    </nav>

    <!-- Back to site -->
    <NuxtLink
      to="/"
      class="fixed left-4 top-4 z-30 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-white/70 backdrop-blur transition-colors hover:text-white"
    >
      <UIcon name="i-lucide-arrow-left" class="size-3.5" />
      Nuxt Charts
    </NuxtLink>

    <div
      ref="scroller"
      tabindex="0"
      class="h-full overflow-y-auto overscroll-none outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      @wheel.capture.prevent="onWheel"
      @touchstart.passive="onTouchStart"
      @touchmove.prevent
      @touchend.passive="onTouchEnd"
      @keydown="onKeydown"
      @scroll.passive="onScroll"
    >
      <section
        v-for="section in sections"
        :id="section.id"
        :key="section.id"
        class="flex h-dvh shrink-0 flex-col justify-center px-5 py-16 sm:px-10"
      >
        <div class="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <header class="max-w-2xl">
            <p class="text-xs font-semibold uppercase tracking-wider text-green-500">
              {{ section.eyebrow }}
            </p>
            <h2 class="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {{ section.title }}
            </h2>
            <p class="mt-2 text-sm leading-relaxed text-white/50">
              {{ section.description }}
            </p>
          </header>

          <div class="rounded-2xl border border-white/10 bg-[#0e0e0e] p-4 sm:p-6">
            <ClientOnly>
              <!-- Area · plain gradient fill -->
              <AreaChart
                v-if="section.id === 'gradient'"
                :data="monthlyData"
                :height="chartHeight"
                :categories="monthlyCategories"
                x-axis="month"
                :x-formatter="monthFormatter"
                :y-formatter="currencyFormatter"
                :curve-type="CurveType.Cardinal"
                :gradient-stops="gradientStops"
                :x-grid-line="false"
                :y-grid-line="true"
                :x-domain-line="false"
                :y-domain-line="false"
                :x-num-ticks="6"
                :y-num-ticks="4"
                stacked
              />

              <!-- Area · bayer dither -->
              <AreaChart
                v-else-if="section.id === 'bayer'"
                :data="monthlyData"
                :height="chartHeight"
                :categories="monthlyCategories"
                x-axis="month"
                :x-formatter="monthFormatter"
                :y-formatter="currencyFormatter"
                :curve-type="CurveType.Cardinal"
                dither="bayer"
                :gradient-stops="bayerGradientStops"
                :x-grid-line="false"
                :y-grid-line="true"
                :x-domain-line="false"
                :y-domain-line="false"
                :x-num-ticks="6"
                :y-num-ticks="4"
                stacked
              />

              <!-- Area · noise dither -->
              <AreaChart
                v-else-if="section.id === 'noise'"
                :data="monthlyData"
                :height="chartHeight"
                :categories="monthlyCategories"
                x-axis="month"
                :x-formatter="monthFormatter"
                :y-formatter="currencyFormatter"
                :curve-type="CurveType.Cardinal"
                dither="noise"
                :dither-tile="live.noiseTile"
                :x-grid-line="false"
                :y-grid-line="true"
                :x-domain-line="false"
                :y-domain-line="false"
                :x-num-ticks="6"
                :y-num-ticks="4"
                stacked
              />

              <!--
                Bar · single-metric cube grid.

                `:key` forces a remount when the opacity floor changes. vccs
                renders bar shapes inside a render fn whose only reactive dep is
                the bar data, and its per-rect keys are derived from x/y/value —
                so a cube-only prop change patches nothing on its own.
              -->
              <BarChart
                v-else-if="section.id === 'cubes-trend'"
                :key="`cubes-trend-${live.trendCubeSize}-${live.trendCubeMinSize}-${live.trendMinOpacity}`"
                :data="dailyData"
                :height="chartHeight"
                :categories="dailyCategories"
                :y-axis="['revenue']"
                x-axis="date"
                :x-formatter="dailyXFormatter"
                :y-formatter="plainFormatter"
                variant="cubes"
                :cube-size="live.trendCubeSize"
                :cube-min-size="live.trendCubeMinSize"
                :cube-min-opacity="live.trendMinOpacity"
                :cube-gap="2"
                :duration="0"
                :cube-radius="1"
                :cube-empty-color="cubeEmptyColor"
                :bar-category-gap="1"
                :y-domain="[0, 82]"
                :y-explicit-ticks="[0, 30, 60, 90]"
                :x-grid-line="false"
                :y-grid-line="true"
                :x-domain-line="false"
                :y-domain-line="false"
                :x-num-ticks="5"
                :y-num-ticks="4"
                hide-legend
              />

              <!-- Bar · grouped cubes -->
              <BarChart
                v-else-if="section.id === 'cubes-grouped'"
                :data="monthlyData"
                :height="chartHeight"
                :categories="monthlyCategories"
                :y-axis="['revenue', 'expenses']"
                x-axis="month"
                :x-formatter="monthFormatter"
                :y-formatter="currencyFormatter"
                variant="cubes"
                :cube-size="14"
                :bar-gap="0"
                :bar-category-gap="`${live.groupedCategoryGap}%`"
                :x-grid-line="false"
                :y-grid-line="false"
                :x-domain-line="false"
                :y-domain-line="false"
                :x-num-ticks="6"
                :y-num-ticks="4"
              />

              <!-- Bar · stacked cubes -->
              <BarChart
                v-else-if="section.id === 'cubes-stacked'"
                :key="`cubes-stacked-${live.stackedCubeSize}`"
                :data="stackedMonthlyData"
                :height="chartHeight"
                :categories="monthlyCategories"
                :y-axis="['expenses', 'revenue']"
                x-axis="month"
                :x-formatter="stackedXFormatter"
                :y-formatter="currencyFormatter"
                variant="cubes"
                stacked
                :cube-size="live.stackedCubeSize"
                :duration="0"
                :x-grid-line="false"
                :y-grid-line="false"
                :x-domain-line="false"
                :y-domain-line="false"
                :x-num-ticks="6"
                :y-num-ticks="4"
              />

              <!-- Bar · solid reference -->
              <BarChart
                v-else-if="section.id === 'solid'"
                :data="solidData"
                :height="chartHeight"
                :categories="monthlyCategories"
                :y-axis="['revenue', 'expenses']"
                x-axis="month"
                :x-formatter="solidXFormatter"
                :y-formatter="currencyFormatter"
                :radius="4"
                :x-grid-line="false"
                :y-grid-line="true"
                :x-domain-line="false"
                :y-domain-line="false"
                :x-num-ticks="Math.min(live.solidMonths, 8)"
                :y-num-ticks="4"
              />

              <template #fallback>
                <div :style="{ height: `${chartHeight}px` }" />
              </template>
            </ClientOnly>
          </div>

          <div
            v-if="sectionControls[section.id]"
            class="flex w-full max-w-md flex-col gap-2 self-center"
          >
            <div
              v-for="control in sectionControls[section.id]"
              :key="control.key"
              class="flex w-full items-center gap-4 rounded-full border border-white/10 bg-white/5 px-5 py-2.5"
            >
              <label :for="`${section.id}-${control.key}`" class="shrink-0 text-xs text-white/60">
                {{ control.label }}
              </label>
              <input
                :id="`${section.id}-${control.key}`"
                v-model.number="live[control.key]"
                type="range"
                :min="control.min"
                :max="control.key === 'trendCubeMinSize' ? trendCubeMinSizeMax : control.max"
                :step="control.step"
                class="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/15 accent-green-500 outline-none focus-visible:ring-2 focus-visible:ring-green-500/60"
              >
              <span class="w-10 shrink-0 text-right text-xs tabular-nums text-white">
                {{ control.format(live[control.key]) }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
