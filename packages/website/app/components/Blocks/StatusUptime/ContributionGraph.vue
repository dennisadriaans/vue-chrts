<script setup lang="ts">
defineOptions({
  tags: ['statusuptime', 'contributiongraph']
})

interface ContributionData {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface Props {
  size?: 'sm' | 'md' | 'lg'
  showLegend?: boolean
}

const { size = 'md', showLegend = true } = defineProps<Props>()

// Generate realistic contribution data for a full year, with empty cells for future dates
const generateContributionData = (year: number): ContributionData[] => {
  const data: ContributionData[] = []
  const today = new Date()
  const currentYear = today.getFullYear()

  // Use a fixed seed for consistent data
  let seed = year * 1000
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  const startDate = new Date(year, 0, 1)
  const endDate = new Date(year, 11, 31) // Always go to end of year

  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const dayOfYear = Math.floor(
      (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    const isFutureDate = year === currentYear && currentDate > today

    let baseActivity = 0

    // Only generate activity for past/current dates
    if (!isFutureDate) {
      if (isWeekend) {
        baseActivity = seededRandom() < 0.3 ? Math.floor(seededRandom() * 3) : 0
      } else {
        const randomFactor = seededRandom()
        if (randomFactor < 0.1) {
          baseActivity = 0
        } else if (randomFactor < 0.4) {
          baseActivity = Math.floor(seededRandom() * 3) + 1
        } else if (randomFactor < 0.8) {
          baseActivity = Math.floor(seededRandom() * 5) + 3
        } else {
          baseActivity = Math.floor(seededRandom() * 8) + 8
        }
      }

      // Create some consistent patterns for streaks and gaps
      if (dayOfYear % 13 === 0) {
        baseActivity = 0 // Regular gaps every 13 days
      }

      // Holiday periods (around day 360-365, and day 1-7)
      if ((dayOfYear > 358 && year !== currentYear) || dayOfYear < 7) {
        baseActivity = Math.floor(baseActivity * 0.3)
      }
    }

    const level
      = baseActivity === 0
        ? 0
        : baseActivity <= 2
          ? 1
          : baseActivity <= 5
            ? 2
            : baseActivity <= 8
              ? 3
              : 4

    data.push({
      date: currentDate.toISOString().split('T')[0]!,
      count: baseActivity,
      level: level as 0 | 1 | 2 | 3 | 4
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return data
}

const selectedYear = ref(new Date().getFullYear())
const contributionData = ref<ContributionData[]>(
  generateContributionData(selectedYear.value)
)
const hoveredDay = ref<ContributionData | null>(null)

// Auto-refresh data daily to keep it current
const lastRefreshDate = ref(new Date().toDateString())

// Check if we need to refresh data (new day)
const checkForDataRefresh = () => {
  const currentDateString = new Date().toDateString()
  if (lastRefreshDate.value !== currentDateString) {
    lastRefreshDate.value = currentDateString
    if (selectedYear.value === new Date().getFullYear()) {
      contributionData.value = generateContributionData(selectedYear.value)
    }
  }
}

// Set up interval to check for new day every minute
if (import.meta.client) {
  setInterval(checkForDataRefresh, 60000)
}

// Group contributions by weeks
const weeklyData = computed(() => {
  const weeks: ContributionData[][] = []
  const startDate = new Date(selectedYear.value, 0, 1)
  const startDayOfWeek = startDate.getDay()

  // Fill empty days at the beginning
  const firstWeek: ContributionData[] = []
  for (let i = 0; i < startDayOfWeek; i++) {
    firstWeek.push({
      date: '',
      count: 0,
      level: 0
    })
  }

  contributionData.value.forEach((day, index) => {
    const weekIndex = Math.floor((index + startDayOfWeek) / 7)
    if (!weeks[weekIndex]) {
      weeks[weekIndex] = [...firstWeek]
      firstWeek.length = 0
    }
    if (!weeks[weekIndex]) {
      weeks[weekIndex] = []
    }
    weeks[weekIndex].push(day)
  })

  // Fill incomplete last week
  const lastWeek = weeks[weeks.length - 1]
  if (lastWeek && lastWeek.length < 7) {
    while (lastWeek.length < 7) {
      lastWeek.push({
        date: '',
        count: 0,
        level: 0
      })
    }
  }

  return weeks
})

// Month labels positioned over weeks
const monthLabels = computed(() => {
  const labels: string[] = []
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  weeklyData.value.forEach((week, weekIndex) => {
    const firstDayWithDate = week.find(day => day.date)
    if (firstDayWithDate) {
      const date = new Date(firstDayWithDate.date)
      const monthIndex = date.getMonth()
      const dayOfMonth = date.getDate()

      if (dayOfMonth <= 7 && months[monthIndex]) {
        labels[weekIndex] = months[monthIndex]
      }
    }
  })

  return labels
})

// Color and size classes
const getCellSize = () => {
  switch (size) {
    case 'sm':
      return 'h-2.5 w-2.5'
    case 'lg':
      return 'h-4 w-4'
    default:
      return 'h-3 w-3'
  }
}

const getCellGap = () => {
  switch (size) {
    case 'sm':
      return 'gap-0.5'
    case 'lg':
      return 'gap-1.5'
    default:
      return 'gap-1'
  }
}

const getLevelClass = (level: number) => {
  switch (level) {
    case 0:
      return 'bg-(--ui-bg-elevated) border border-default'
    case 1:
      return 'bg-(--ui-primary)/20 border border-(--ui-primary)/30'
    case 2:
      return 'bg-(--ui-primary)/40 border border-(--ui-primary)/50'
    case 3:
      return 'bg-(--ui-primary)/60 border border-(--ui-primary)/70'
    case 4:
      return 'bg-(--ui-primary) border border-(--ui-primary)'
    default:
      return 'bg-(--ui-bg-elevated) border border-default'
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <UCard class="!bg-default">
    <UCard class="!bg-default">
      <template #header>
        <h3 class="text-lg font-semibold">
          Contribution Graph
        </h3>
      </template>
      <div class="no-scrollbar space-y-4 overflow-x-auto">
        <!-- Month Labels -->
        <div class="flex">
          <div class="w-12" />
          <div class="flex">
            <div
              v-for="(label, index) in monthLabels"
              :key="index"
              :class="[
                'text-muted text-xs',
                getCellSize().includes('w-2.5')
                  ? 'w-[9px]'
                  : getCellSize().includes('w-4')
                    ? 'w-[18px]'
                    : 'w-[13px]',
                index > 0 ? 'ml-1' : ''
              ]"
            >
              {{ label }}
            </div>
          </div>
        </div>

        <!-- Contribution Grid -->
        <div class="flex">
          <!-- Day Labels -->
          <div class="text-muted flex w-12 flex-col justify-between text-xs">
            <div />
            <div>Mon</div>
            <div />
            <div>Wed</div>
            <div />
            <div>Fri</div>
            <div />
          </div>

          <!-- Weeks Grid -->
          <div :class="['flex', getCellGap()]">
            <div
              v-for="(week, weekIndex) in weeklyData"
              :key="weekIndex"
              :class="['flex flex-col', getCellGap()]"
            >
              <div
                v-for="(day, dayIndex) in week"
                :key="`${weekIndex}-${dayIndex}`"
                :class="[
                  getCellSize(),
                  'cursor-pointer rounded transition-all duration-200',
                  day.date ? getLevelClass(day.level) : 'bg-transparent',
                  day.date ? 'hover:ring-1 hover:ring-(--ui-primary)/50' : ''
                ]"
                @mouseenter="day.date ? (hoveredDay = day) : null"
                @mouseleave="hoveredDay = null"
              />
            </div>
          </div>
        </div>

        <!-- Legend and Tooltip -->
        <div class="flex h-[40px] items-center justify-between">
          <div
            v-if="showLegend"
            class="text-muted flex items-center gap-2 text-xs"
          >
            <span>Less</span>
            <div class="flex gap-1">
              <div
                :class="[
                  getCellSize(),
                  'border-default rounded border bg-(--ui-bg-elevated)'
                ]"
              />
              <div
                :class="[
                  getCellSize(),
                  'rounded border border-(--ui-primary)/30 bg-(--ui-primary)/20'
                ]"
              />
              <div
                :class="[
                  getCellSize(),
                  'rounded border border-(--ui-primary)/50 bg-(--ui-primary)/40'
                ]"
              />
              <div
                :class="[
                  getCellSize(),
                  'rounded border border-(--ui-primary)/70 bg-(--ui-primary)/60'
                ]"
              />
              <div
                :class="[
                  getCellSize(),
                  'rounded border border-(--ui-primary) bg-(--ui-primary)'
                ]"
              />
            </div>
            <span>More</span>
          </div>

          <!-- Tooltip -->
          <div
            v-if="hoveredDay"
            class="text-sm"
          >
            <div class="font-medium">
              {{ hoveredDay.count }} contribution{{
                hoveredDay.count !== 1 ? 's' : ''
              }}
            </div>
            <div class="text-muted">
              {{ formatDate(hoveredDay.date) }}
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </UCard>
</template>
