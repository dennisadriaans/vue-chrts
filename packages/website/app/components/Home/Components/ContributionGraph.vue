<script setup lang="ts">
interface ContributionData {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

const generateContributionData = (year: number): ContributionData[] => {
  const data: ContributionData[] = []
  const today = new Date()
  const currentYear = today.getFullYear()

  let seed = year * 1000
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  const startDate = new Date(year, 0, 1)
  const endDate = new Date(year, 11, 31)
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const dayOfYear = Math.floor(
      (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    const isFutureDate = year === currentYear && currentDate > today

    let baseActivity = 0

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

      if (dayOfYear % 13 === 0) {
        baseActivity = 0
      }

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

const weeklyData = computed(() => {
  const weeks: ContributionData[][] = []
  const startDate = new Date(selectedYear.value, 0, 1)
  const startDayOfWeek = startDate.getDay()

  const firstWeek: ContributionData[] = []
  for (let i = 0; i < startDayOfWeek; i++) {
    firstWeek.push({ date: '', count: 0, level: 0 })
  }

  contributionData.value.forEach((day, index) => {
    const weekIndex = Math.floor((index + startDayOfWeek) / 7)
    if (!weeks[weekIndex]) {
      weeks[weekIndex] = [...firstWeek]
      firstWeek.length = 0
    }
    weeks[weekIndex]!.push(day)
  })

  const lastWeek = weeks[weeks.length - 1]
  if (lastWeek && lastWeek.length < 7) {
    while (lastWeek.length < 7) {
      lastWeek.push({ date: '', count: 0, level: 0 })
    }
  }

  return weeks
})

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
</script>

<template>
  <div class="no-scrollbar overflow-x-auto">
    <div class="flex gap-0.5 min-w-max">
      <div
        v-for="(week, weekIndex) in weeklyData"
        :key="weekIndex"
        class="flex flex-col gap-0.5"
      >
        <div
          v-for="(day, dayIndex) in week"
          :key="`${weekIndex}-${dayIndex}`"
          class="size-2 rounded-sm"
          :class="day.date ? getLevelClass(day.level) : 'bg-transparent'"
        />
      </div>
    </div>
  </div>
</template>
