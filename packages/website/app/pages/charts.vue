<script setup lang="ts">
import { provideLicenseCheck } from '~/composables/useBlockCode'

provideLicenseCheck()

useSeoMeta({
  title: 'Charts – Nuxt Charts',
  description: 'Explore chart types with togglable monochrome color palettes.'
})

const navRef = ref<HTMLElement>()
const showFloatingNav = ref(false)
const activeSection = ref<string>('')

const sections = ['area', 'line', 'bar', 'donut']

const sectionLabels: Record<string, string> = {
  area: 'Area',
  line: 'Line',
  bar: 'Bar',
  donut: 'Donut'
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const { height } = useResponsiveHeight({
  default: 200,
  sm: 240
})

const handleScroll = () => {
  if (!navRef.value) return
  const navRect = navRef.value.getBoundingClientRect()
  showFloatingNav.value = navRect.bottom < 0

  const scrollPosition = window.scrollY + 150
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const isNearBottom = scrollPosition + windowHeight >= documentHeight - 300

  let currentSection = ''
  if (isNearBottom) {
    currentSection = sections[sections.length - 1] as string
  } else {
    for (const sectionId of sections) {
      const element = document.getElementById(sectionId)
      if (element) {
        const elementTop = element.offsetTop
        const elementBottom = elementTop + element.offsetHeight
        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          currentSection = sectionId
          break
        }
      }
    }
    if (!currentSection && scrollPosition < 300) {
      currentSection = sections[0] as string
    }
  }
  activeSection.value = currentSection
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="mx-auto max-w-7xl gap-4 px-4 py-24 lg:px-8 lg:py-32">
    <div class="my-8 space-y-2">
      <h2 class="text-3xl font-bold tracking-tight">
        Beautiful Charts
      </h2>
      <p class="text-dimmed">
        Explore chart types with togglable monochrome color palettes.
      </p>
    </div>

    <!-- Navigation -->
    <div
      ref="navRef"
      class="no-scrollbar relative mb-8 overflow-x-auto rounded-lg"
    >
      <div class="bg-elevated border-default mb-4 inline-block rounded-full border p-2">
        <div class="no-scrollbar flex gap-2 overflow-auto">
          <UButton
            v-for="section in sections"
            :key="section"
            :variant="activeSection === section ? 'solid' : 'ghost'"
            color="neutral"
            class="!rounded-full capitalize"
            @click="scrollToSection(section)"
          >
            {{ sectionLabels[section] }} Charts
          </UButton>
        </div>
      </div>
    </div>

    <!-- Floating Navigation -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-full"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-full"
    >
      <div
        v-if="showFloatingNav"
        class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform"
      >
        <div class="border-default rounded-full border bg-elevated p-2 shadow-xl backdrop-blur-sm">
          <div class="flex gap-1 overflow-x-auto px-2 max-w-[90vw]">
            <UButton
              v-for="section in sections"
              :key="section"
              :variant="activeSection === section ? 'solid' : 'ghost'"
              color="neutral"
              size="lg"
              class="rounded-full! capitalize whitespace-nowrap"
              @click="scrollToSection(section)"
            >
              {{ sectionLabels[section] }}
            </UButton>
          </div>
        </div>
      </div>
    </Transition>

    <ChartGallerySectionsAreaSection :height="height" />
    <ChartGallerySectionsLineSection :height="height" />
    <ChartGallerySectionsBarSection :height="height" />
    <ChartGallerySectionsDonutSection :height="height" />
  </div>
</template>
