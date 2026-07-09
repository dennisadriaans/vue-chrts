<script setup lang="ts">
defineOptions({
  tags: ['statusuptime', 'contributionheatmap']
})

interface ContributionData {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

// Generate a full year of contribution data
const generateContributionData = (): ContributionData[] => {
  const data: ContributionData[] = []
  const startDate = new Date(new Date().getFullYear(), 0, 1) // Start of current year
  const endDate = new Date(new Date().getFullYear(), 11, 31) // End of current year

  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    // Generate realistic contribution patterns
    let baseActivity = 0

    // Lower activity on weekends
    if (isWeekend) {
      baseActivity = Math.random() < 0.3 ? Math.floor(Math.random() * 3) : 0
    } else {
      // Weekday pattern with some variability
      const randomFactor = Math.random()
      if (randomFactor < 0.1) {
        baseActivity = 0 // Some days with no activity
      } else if (randomFactor < 0.4) {
        baseActivity = Math.floor(Math.random() * 3) + 1 // Light activity
      } else if (randomFactor < 0.8) {
        baseActivity = Math.floor(Math.random() * 5) + 3 // Moderate activity
      } else {
        baseActivity = Math.floor(Math.random() * 8) + 8 // High activity
      }
    }

    // Create some streaks and gaps
    if (Math.random() < 0.05) {
      baseActivity = 0 // Random gaps
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
      date: currentDate.toISOString().split('T')[0],
      count: baseActivity,
      level: level as 0 | 1 | 2 | 3 | 4
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return data
}

const contributionData = ref<ContributionData[]>(generateContributionData())
const hoveredDay = ref<ContributionData | null>(null)
const selectedYear = ref(new Date().getFullYear())
const years = [2024, 2023, 2022, 2021]

// Group data by weeks for display
const weeklyData = computed(() => {
  const weeks: ContributionData[][] = []
  const startDate = new Date(selectedYear.value, 0, 1)
  const startDayOfWeek = startDate.getDay()

  // Fill in empty days at the beginning if year doesn't start on Sunday
  const firstWeek: ContributionData[] = []
  for (let i = 0; i < startDayOfWeek; i++) {
    firstWeek.push({
      date: '',
      count: 0,
      level: 0
    })
  }

  // Add actual data
  contributionData.value.forEach((day, index) => {
    const weekIndex = Math.floor((index + startDayOfWeek) / 7)
    if (!weeks[weekIndex]) {
      weeks[weekIndex] = [...firstWeek]
      firstWeek.length = 0 // Clear after first use
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

  // Calculate which weeks start new months
  weeklyData.value.forEach((week, weekIndex) => {
    const firstDayWithDate = week.find(day => day.date)
    if (firstDayWithDate) {
      const date = new Date(firstDayWithDate.date)
      const monthIndex = date.getMonth()
      const dayOfMonth = date.getDate()

      // Show month label if it's the first week of the month or close to it
      if (dayOfMonth <= 7) {
        labels[weekIndex] = months[monthIndex]
      }
    }
  })

  return labels
})

const getLevelClass = (level: number) => {
  switch (level) {
    case 0:
      return 'bg-(--ui-bg-elevated) border-gray-200'
    case 1:
      return 'bg-(--ui-primary)/20 border-(--ui-primary)/30'
    case 2:
      return 'bg-(--ui-primary)/40 border-(--ui-primary)/50'
    case 3:
      return 'bg-(--ui-primary)/60 border-(--ui-primary)/70'
    case 4:
      return 'bg-(--ui-primary) border-(--ui-primary)'
    default:
      return 'bg-(--ui-bg-elevated) border-gray-200'
  }
}

const getLevelLabel = (level: number) => {
  switch (level) {
    case 0:
      return 'No contributions'
    case 1:
      return 'Low activity'
    case 2:
      return 'Moderate activity'
    case 3:
      return 'High activity'
    case 4:
      return 'Very high activity'
    default:
      return 'No data'
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

const totalContributions = computed(() =>
  contributionData.value.reduce((sum, day) => sum + day.count, 0)
)

const currentStreak = computed(() => {
  let streak = 0
  for (let i = contributionData.value.length - 1; i >= 0; i--) {
    if (contributionData.value[i].count > 0) {
      streak++
    } else {
      break
    }
  }
  return streak
})

const longestStreak = computed(() => {
  let longest = 0
  let current = 0

  contributionData.value.forEach((day) => {
    if (day.count > 0) {
      current++
      longest = Math.max(longest, current)
    } else {
      current = 0
    }
  })

  return longest
})

const activeDays = computed(
  () => contributionData.value.filter(day => day.count > 0).length
)

const changeYear = (year: number) => {
  selectedYear.value = year
  contributionData.value = generateContributionData()
}
</script>

<template>
  <UCard class="!bg-default">
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold">
            Contribution Activity
          </h3>
          <p class="text-muted text-sm">
            {{ totalContributions.toLocaleString() }} contributions in
            {{ selectedYear }}
          </p>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-4 text-sm">
            <div>
              <span class="text-muted">Current streak:</span>
              <span class="font-semibold">{{ currentStreak }} days</span>
            </div>
            <div>
              <span class="text-muted">Longest streak:</span>
              <span class="font-semibold">{{ longestStreak }} days</span>
            </div>
            <div>
              <span class="text-muted">Active days:</span>
              <span class="font-semibold">{{ activeDays }}</span>
            </div>
          </div>
          <USelect
            :model-value="selectedYear"
            :options="years"
            color="neutral"
            variant="outline"
            @update:model-value="changeYear"
          />
        </div>
      </div>
    </template>

    <div class="space-y-4 overflow-x-auto">
      <!-- Month Labels -->
      <div class="flex">
        <div class="w-12" />
        <div class="flex">
          <div
            v-for="(label, index) in monthLabels"
            :key="index"
            class="text-muted w-[11px] text-xs"
            :class="{ 'ml-2': index > 0 }"
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
        <div class="flex gap-[1px]">
          <div
            v-for="(week, weekIndex) in weeklyData"
            :key="weekIndex"
            class="flex flex-col gap-[1px]"
          >
            <div
              v-for="(day, dayIndex) in week"
              :key="`${weekIndex}-${dayIndex}`"
              :class="[
                'h-[11px] w-[11px] cursor-pointer rounded-sm transition-all duration-200',
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
      <div class="flex items-center justify-between">
        <div class="text-muted flex items-center gap-2 text-xs">
          <span>Less</span>
          <div class="flex gap-1">
            <div
              class="h-[11px] w-[11px] rounded-sm border border-gray-200 bg-(--ui-bg-elevated)"
            />
            <div
              class="h-[11px] w-[11px] rounded-sm border border-(--ui-primary)/30 bg-(--ui-primary)/20"
            />
            <div
              class="h-[11px] w-[11px] rounded-sm border border-(--ui-primary)/50 bg-(--ui-primary)/40"
            />
            <div
              class="h-[11px] w-[11px] rounded-sm border border-(--ui-primary)/70 bg-(--ui-primary)/60"
            />
            <div
              class="h-[11px] w-[11px] rounded-sm border border-(--ui-primary) bg-(--ui-primary)"
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

    <template #footer>
      <div class="text-muted flex items-center justify-between text-sm">
        <div class="flex items-center gap-4">
          <span>{{ getLevelLabel(hoveredDay?.level || 0) }}</span>
          <span>• Learn how we count contributions</span>
        </div>
        <div class="flex gap-2">
          <UButton
            variant="ghost"
            trailing-icon="i-lucide-external-link"
            color="neutral"
          >
            View Profile
          </UButton>
          <UButton
            variant="link"
            trailing-icon="i-lucide-calendar"
            color="neutral"
          >
            Calendar View
          </UButton>
        </div>
      </div>
    </template>
  </UCard>
</template>
