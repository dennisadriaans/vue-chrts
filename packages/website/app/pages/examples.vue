<script setup lang="ts">
/**
 * Focused showcase for the newest chart styles: dithered area fills, cube bars
 * and radar polygons. Bar sections stay one-per-variant — each renders its own
 * chart with its own props, so a section can be copied out as-is. The area and
 * radar sections instead put their variants behind a tab strip, since the only
 * thing that changes between them is a single prop.
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
 * Traced from the light-theme dither reference: a two-week daily series that
 * sits low, dips mid-week, then steps up to a peak of 35 near the end. The
 * shape matters because the halftone ramp is anchored to the plot, so the
 * texture under a tall segment differs from a short one.
 */
const ditherDailyData = (() => {
  const values = [
    13, 17, 21, 16, 14, 13, 14, 15, 13, 12, 12, 20, 26, 27,
    27, 31, 34, 35, 34, 30, 27, 27
  ]
  const start = Date.UTC(2026, 6, 1)
  return values.map((visitors, i) => {
    const date = new Date(start + i * 86_400_000)
    return {
      date: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      visitors
    }
  })
})()

/** Indigo, matching the reference's single blue-violet series. */
const ditherDailyCategories = {
  visitors: { name: 'Visitors', color: '#4f5bd5' }
}

/**
 * Traced from the purple halftone bar reference: eight months with one dominant
 * spike. The tall bar is the point — it shows the whole ramp, from solid on the
 * baseline through the checkerboard to specks at the cap.
 */
const halftoneBarData = [
  { month: 'Dec 25', sessions: 2 },
  { month: 'Jan 26', sessions: 0.4 },
  { month: 'Feb 26', sessions: 7 },
  { month: 'Mar 26', sessions: 17 },
  { month: 'Apr 26', sessions: 16 },
  { month: 'May 26', sessions: 34 },
  { month: 'Jun 26', sessions: 17 },
  { month: 'Jul 26', sessions: 11 }
]

const halftoneBarCategories = {
  sessions: { name: 'Sessions', color: '#8b7cf6' }
}

/** Donut clone — five plan tiers, matching the dark radial reference. */
const halftoneDonutData = [42, 26, 16, 10, 6]

const halftoneDonutCategories = {
  unlimited: { name: 'Unlimited', color: '#3b82f6' },
  monthly: { name: '30-day pass', color: '#8b5cf6' },
  pack: { name: '10-class pack', color: '#22c55e' },
  dropIn: { name: 'Drop-in', color: '#f59e0b' },
  student: { name: 'Student', color: '#64748b' }
}

/**
 * Light-card theme for the halftone clone. The reference sits on white with
 * muted grey chrome, so the shipped dark tokens would render invisible axes.
 */
const lightChartTheme = {
  grid: { color: 'rgba(15, 23, 42, 0.10)', dash: '4 4' },
  axis: {
    tickColor: 'rgba(15, 23, 42, 0.45)',
    lineColor: 'rgba(15, 23, 42, 0.12)'
  },
  legend: { color: 'rgba(15, 23, 42, 0.65)' }
}

const ditherDailyXFormatter = (i: number) => {
  const row = ditherDailyData[i]
  if (!row) return ''
  return i % 7 === 0 || i === ditherDailyData.length - 1 ? row.label : ''
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

/** Two-team skill comparison — one row per spoke on the angle axis. */
const radarData = [
  { skill: 'Speed', alpha: 88, beta: 62 },
  { skill: 'Reliability', alpha: 74, beta: 91 },
  { skill: 'Coverage', alpha: 61, beta: 78 },
  { skill: 'Cost', alpha: 92, beta: 55 },
  { skill: 'Support', alpha: 58, beta: 84 },
  { skill: 'Docs', alpha: 79, beta: 69 }
]

const radarCategories = {
  alpha: { name: 'Team Alpha', color: 'var(--color-green-500)' },
  beta: { name: 'Team Beta', color: 'var(--color-blue-500)' }
}

/** Single-series slice for the "one polygon" radar variant. */
const radarSoloCategories = {
  alpha: { name: 'Team Alpha', color: 'var(--color-green-500)' }
}

/** Ghost cubes between the value and the chart top — Nuxt UI `bg-elevated/50`. */
const cubeEmptyColor = 'color-mix(in oklab, var(--ui-bg-elevated) 50%, transparent)'

/**
 * Live-tweaked values for each section's range control. One knob per example so
 * visitors can feel how the prop shapes the chart.
 */
const live = reactive({
  /**
   * Top stop opacity of the area fade ramp. Shared by every area tab: with no
   * `dither` it shapes the plain gradient, with one it shapes the wash the
   * pattern is composed over.
   */
  areaOpacity: 0.6,
  /** Tile edge (px) for the dither pattern. Ignored by the gradient tab. */
  areaTile: 8,
  /** Halftone clone: 8x8 lattice edge, so a cell is an eighth of this. */
  halftoneTile: 16,
  /** Halftone clone: ramp curve. Above 1 holds the sparse end longer. */
  halftoneBias: 1,
  /** Halftone bars: cell edge (px); the lattice is 8 cells across. */
  halftoneBarCell: 2,
  /** Halftone bars: solid cap height (px) at the top of each column. */
  halftoneBarCap: 3,
  /** Halftone donut: cell edge (px) and ring thickness. */
  halftoneDonutCell: 2,
  halftoneDonutArc: 56,
  /** Fill opacity of each radar polygon. */
  radarFillOpacity: 0.6,
  /** Angle (deg) the radius axis is drawn along; 90 = straight up. */
  radarAxisAngle: 90,
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

const areaGradientStops = computed(() => [
  { offset: '0%', stopOpacity: live.areaOpacity },
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

/* ------------------------------------------------------------------ *
 * Tabbed variants — area fills and radar polygons. Both sections render a
 * single chart whose props come from the active tab, the way the hero widget
 * cycles styles, rather than one section per variant.
 * ------------------------------------------------------------------ */

interface AreaTab {
  id: string
  label: string
  /** `undefined` renders the plain gradient fill — the no-dither baseline. */
  dither?: 'bayer' | 'noise' | 'fade' | 'halftone'
  /** Overrides the section's default cardinal curve for this tab only. */
  curveType?: (typeof CurveType)[keyof typeof CurveType]
  description: string
}

const areaTabs: AreaTab[] = [
  {
    id: 'gradient',
    label: 'Gradient',
    dither: undefined,
    description:
      'Baseline for comparison — no `dither` prop, so the area fades out with a plain vertical gradient.'
  },
  {
    id: 'halftone',
    label: 'Halftone',
    dither: 'halftone',
    // A stepped edge keeps the top of the area on the same pixel lattice as the
    // dither underneath, so the whole fill reads as one quantised shape.
    curveType: CurveType.Step,
    description:
      'The fill stays solid and the dither is punched *out* of it on a hard-edged pixel lattice that opens up toward the baseline — a 1-bit ordered dither, so the area dissolves into the page instead of fading in alpha.'
  },
  {
    id: 'bayer',
    label: 'Bayer',
    dither: 'bayer',
    description:
      'A 4×4 Bayer matrix tiles under the line, with the same vertical fade as the gradient fill.'
  },
  {
    id: 'noise',
    label: 'Noise',
    dither: 'noise',
    description:
      'Randomised dot placement instead of a fixed matrix — grainier, less obviously tiled.'
  },
  {
    id: 'fade',
    label: 'Fade',
    dither: 'fade',
    description:
      'Dot density drops off with height, so the pattern dissolves toward the top of the area.'
  }
]

const areaTabId = ref(areaTabs[0]!.id)
const areaTab = computed(() => areaTabs.find(t => t.id === areaTabId.value) ?? areaTabs[0]!)

interface RadarTab {
  id: string
  label: string
  categories: Record<string, { name: string, color: string }>
  hideRadiusAxis: boolean
  description: string
}

const radarTabs: RadarTab[] = [
  {
    id: 'compare',
    label: 'Two series',
    categories: radarCategories,
    hideRadiusAxis: false,
    description:
      'One polygon per key in `categories`, overlaid on a shared grid. The radius axis labels the 0–max scale.'
  },
  {
    id: 'solo',
    label: 'Single series',
    categories: radarSoloCategories,
    hideRadiusAxis: false,
    description:
      'Drop to one series and the polygon shape carries the whole read — no colour matching needed.'
  },
  {
    id: 'bare',
    label: 'No radius axis',
    categories: radarCategories,
    hideRadiusAxis: true,
    description:
      'Add `hide-radius-axis` to drop the numeric scale, leaving the grid rings as the only reference.'
  }
]

const radarTabId = ref(radarTabs[0]!.id)
const radarTab = computed(() => radarTabs.find(t => t.id === radarTabId.value) ?? radarTabs[0]!)

type LiveKey = keyof typeof live

interface SectionControl {
  label: string
  key: LiveKey
  min: number
  max: number
  step: number
  format: (value: number) => string
  /** Omit the control while the active tab ignores the prop it drives. */
  visible?: () => boolean
}

const sectionControls: Record<string, SectionControl[]> = {
  area: [
    {
      label: 'opacity',
      key: 'areaOpacity',
      min: 0,
      max: 1,
      step: 0.05,
      format: v => v.toFixed(2)
    },
    {
      label: 'dither-tile',
      key: 'areaTile',
      min: 4,
      max: 24,
      step: 1,
      format: v => `${v}px`,
      visible: () => areaTab.value.dither !== undefined
    }
  ],
  'dither-light': [
    {
      label: 'dither-tile',
      key: 'halftoneTile',
      min: 8,
      max: 40,
      step: 4,
      format: v => `${v}px`
    },
    {
      label: 'dither-bias',
      key: 'halftoneBias',
      min: 0.4,
      max: 2.5,
      step: 0.1,
      format: v => v.toFixed(1)
    }
  ],
  'halftone-bars': [
    {
      label: 'halftone-cell',
      key: 'halftoneBarCell',
      min: 1,
      max: 6,
      step: 1,
      format: v => `${v}px`
    },
    {
      label: 'halftone-cap',
      key: 'halftoneBarCap',
      min: 0,
      max: 10,
      step: 1,
      format: v => `${v}px`
    }
  ],
  'halftone-donut': [
    {
      label: 'dither-cell',
      key: 'halftoneDonutCell',
      min: 1,
      max: 6,
      step: 1,
      format: v => `${v}px`
    },
    {
      label: 'arc-width',
      key: 'halftoneDonutArc',
      min: 24,
      max: 90,
      step: 2,
      format: v => `${v}px`
    }
  ],
  radar: [
    {
      label: 'fill-opacity',
      key: 'radarFillOpacity',
      min: 0,
      max: 1,
      step: 0.05,
      format: v => v.toFixed(2)
    },
    {
      label: 'radius-axis-angle',
      key: 'radarAxisAngle',
      min: 0,
      max: 360,
      step: 15,
      format: v => `${v}°`,
      visible: () => !radarTab.value.hideRadiusAxis
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
  /** Static blurb; tabbed sections leave this out and use the tab's own copy. */
  description?: string
}

const sections: SectionDef[] = [
  {
    id: 'area',
    name: 'Area',
    eyebrow: 'Area chart · dither',
    title: 'Gradient and dithered fills'
  },
  {
    id: 'dither-light',
    name: 'Halftone light',
    eyebrow: 'Area chart · halftone',
    title: 'A 1-bit ordered dither, on light',
    description:
      'The mask carries the whole gradient: coverage sweeps from a solid edge, through an exact checkerboard at 50%, down to isolated specks at the baseline. Because each cell is fully on or off, every edge stays hard — no alpha fade anywhere.'
  },
  {
    id: 'halftone-bars',
    name: 'Halftone bars',
    eyebrow: 'Bar chart · halftone',
    title: 'Dithered columns',
    description:
      '`variant="halftone"` slices each column into coverage levels: solid on the baseline, an exact checkerboard midway, isolated specks under the cap. Tall bars show the whole ramp; short ones only ever reach its dense end.'
  },
  {
    id: 'halftone-donut',
    name: 'Halftone donut',
    eyebrow: 'Donut chart · halftone',
    title: 'A radial dither ring',
    description:
      'The same ordered dither run along the radius instead of a vertical axis — solid at the outer edge, dissolving toward the hole. Each segment gets its own lattice, so colours never bleed across the ring.'
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
  },
  {
    id: 'radar',
    name: 'Radar',
    eyebrow: 'Radar chart',
    title: 'Polygons on a polar grid'
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

/** Section blurb — the active tab's copy on tabbed sections, else the static one. */
function sectionDescription(section: SectionDef) {
  if (section.id === 'area') return areaTab.value.description
  if (section.id === 'radar') return radarTab.value.description
  return section.description
}

/** Controls for a section, minus any the active tab makes irrelevant. */
function visibleControls(sectionId: string) {
  return (sectionControls[sectionId] ?? []).filter(c => c.visible?.() ?? true)
}

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

const radarAngleFormatter = (value: unknown) => String(value)

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
              {{ sectionDescription(section) }}
            </p>
          </header>

          <!-- Variant tabs — only the tabbed sections render a strip. -->
          <div
            v-if="section.id === 'area'"
            class="flex flex-wrap gap-1 self-start rounded-full border border-white/10 bg-white/5 p-1"
            role="tablist"
            aria-label="Area fill style"
          >
            <button
              v-for="tab in areaTabs"
              :key="tab.id"
              type="button"
              role="tab"
              :aria-selected="areaTabId === tab.id"
              class="rounded-full px-3.5 py-1.5 text-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-green-500/60"
              :class="areaTabId === tab.id
                ? 'bg-green-500 font-medium text-black'
                : 'text-white/60 hover:text-white'"
              @click="areaTabId = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>

          <div
            v-else-if="section.id === 'radar'"
            class="flex flex-wrap gap-1 self-start rounded-full border border-white/10 bg-white/5 p-1"
            role="tablist"
            aria-label="Radar variant"
          >
            <button
              v-for="tab in radarTabs"
              :key="tab.id"
              type="button"
              role="tab"
              :aria-selected="radarTabId === tab.id"
              class="rounded-full px-3.5 py-1.5 text-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-green-500/60"
              :class="radarTabId === tab.id
                ? 'bg-green-500 font-medium text-black'
                : 'text-white/60 hover:text-white'"
              @click="radarTabId = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>

          <!--
            The halftone clone is traced from a light-theme reference, and the
            effect depends on the fill reading against the page — so that one
            section gets a light card instead of the usual dark one.
          -->
          <div
            class="rounded-2xl border p-4 sm:p-6"
            :class="section.id === 'dither-light'
              ? 'border-black/5 bg-white'
              : 'border-white/10 bg-[#0e0e0e]'"
          >
            <ClientOnly>
              <!--
                Area · gradient or dither, per the active tab.

                `:key` remounts on a tab switch: the fill is painted from a
                `<defs>` pattern whose id is derived from the variant, so
                swapping `dither` in place can leave the old fill referenced.
              -->
              <!--
                Area · halftone, traced from the light-theme reference.

                `gradient: false` is essential — the ordered dither *is* the
                gradient, and layering an opacity ramp on top would soften the
                cells and collapse it back into a plain wash. `dither-to` stops
                just short of 1 so even the densest rows keep a little texture,
                the way the reference does under its line.
              -->
              <AreaChart
                v-if="section.id === 'dither-light'"
                :key="`dither-light-${live.halftoneTile}-${live.halftoneBias}`"
                :data="ditherDailyData"
                :height="chartHeight"
                :categories="ditherDailyCategories"
                x-axis="date"
                :x-formatter="ditherDailyXFormatter"
                :curve-type="CurveType.Step"
                dither="halftone"
                :dither-tile="live.halftoneTile"
                :dither-bias="live.halftoneBias"
                :dither-to="0.92"
                :gradient="false"
                :line-width="0"
                :x-grid-line="false"
                :y-grid-line="true"
                :x-domain-line="true"
                :y-domain-line="false"
                :y-num-ticks="3"
                :y-domain="[0, 35]"
                :theme="lightChartTheme"
              />

              <AreaChart
                v-else-if="section.id === 'area'"
                :key="`area-${areaTab.id}`"
                :data="monthlyData"
                :height="chartHeight"
                :categories="monthlyCategories"
                x-axis="month"
                :x-formatter="monthFormatter"
                :y-formatter="currencyFormatter"
                :curve-type="areaTab.curveType ?? CurveType.Cardinal"
                :dither="areaTab.dither"
                :dither-tile="live.areaTile"
                :gradient-stops="areaGradientStops"
                :x-grid-line="false"
                :y-grid-line="true"
                :x-domain-line="false"
                :y-domain-line="false"
                :x-num-ticks="6"
                :y-num-ticks="4"
                stacked
              />

              <!--
                Bar · halftone, traced from the purple reference.

                `:key` forces a remount when a halftone prop changes: vccs
                renders bar shapes in a render fn whose only reactive dep is the
                bar data, so a shape-only prop change patches nothing on its own.
              -->
              <BarChart
                v-else-if="section.id === 'halftone-bars'"
                :key="`ht-bars-${live.halftoneBarCell}-${live.halftoneBarCap}`"
                :data="halftoneBarData"
                :height="chartHeight"
                :categories="halftoneBarCategories"
                :y-axis="['sessions']"
                x-axis="month"
                variant="halftone"
                :halftone-cell="live.halftoneBarCell"
                :halftone-cap="live.halftoneBarCap"
                :duration="0"
                :x-grid-line="false"
                :y-domain="[0, 36]"
                :y-explicit-ticks="[0, 10, 20, 30]"
                hide-legend
              />

              <!-- Donut · radial halftone, traced from the dark ring reference. -->
              <DonutChart
                v-else-if="section.id === 'halftone-donut'"
                :key="`ht-donut-${live.halftoneDonutCell}-${live.halftoneDonutArc}`"
                :data="halftoneDonutData"
                :height="chartHeight"
                :categories="halftoneDonutCategories"
                dither="halftone"
                :dither-cell="live.halftoneDonutCell"
                :arc-width="live.halftoneDonutArc"
                :pad-angle="2"
                :legend-position="LegendPosition.BottomCenter"
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

              <!-- Radar · per the active tab -->
              <RadarChart
                v-else-if="section.id === 'radar'"
                :key="`radar-${radarTab.id}`"
                :data="radarData"
                :height="chartHeight"
                :categories="radarTab.categories"
                data-key="skill"
                :angle-formatter="radarAngleFormatter"
                :fill-opacity="live.radarFillOpacity"
                :hide-radius-axis="radarTab.hideRadiusAxis"
                :radius-axis-angle="live.radarAxisAngle"
              />

              <template #fallback>
                <div :style="{ height: `${chartHeight}px` }" />
              </template>
            </ClientOnly>
          </div>

          <div
            v-if="visibleControls(section.id).length"
            class="flex w-full max-w-md flex-col gap-2 self-center"
          >
            <div
              v-for="control in visibleControls(section.id)"
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
