<script setup lang="ts">
const { nuxtDashboard, nuxtShadcn, nuxtCleanGray, nuxtPlanner } = useTemplateImages()

const templates = computed(() => [
  {
    id: 'clean-neutral',
    name: 'Clean Gray',
    description: 'A minimal, neutral-scale dashboard for data-heavy applications.',
    light: nuxtCleanGray[0]?.light,
    dark: nuxtCleanGray[0]?.dark
  },
  {
    id: 'shadcn',
    name: 'Shadcn Dashboard',
    description: 'A dashboard template styled with shadcn/vue principles.',
    light: nuxtShadcn[0]?.light,
    dark: nuxtShadcn[0]?.dark
  },
  {
    id: 'planner',
    name: 'Planner',
    description: 'A Linear-inspired project management and planner template.',
    light: nuxtPlanner[0]?.light,
    dark: nuxtPlanner[0]?.dark
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'A comprehensive dashboard layout with charts and tables.',
    light: nuxtDashboard[0]?.light,
    dark: nuxtDashboard[0]?.dark
  }
])
</script>

<template>
  <UPageSection
    title="Grab a template, launch today"
    description="Stop building dashboards from scratch. Your competitors are shipping features while you’re still fighting with your UI."
    :ui="{
      container: 'py-16 sm:py-24 lg:py-8',
      title: 'max-w-2xl mx-auto',
      description: 'max-w-2xl mx-auto'
    }"
    :links="[
      {
        label: 'Get a copy',
        to: '/templates',
        color: 'neutral',
        icon: 'i-hugeicons:download-circle-01'
      },
      {
        label: 'Explore templates',
        to: '/templates',
        color: 'neutral',
        variant: 'subtle',
        trailingIcon: 'i-lucide-arrow-right'
      }
    ]"
  >
    <StackSlider
      :items="templates"
      key-field="id"
      height-class="mt-16 lg:mt-0 h-[240px] md:h-150 lg:h-186"
      show-controls
    >
      <template #default="{ item }">
        <UCard
          class="h-full w-full overflow-hidden"
          :ui="{
            root: 'rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900',
            body: '!p-0 h-full relative group'
          }"
        >
          <div class="h-full w-full">
            <template
              v-for="mode in ['light', 'dark']"
              :key="mode"
            >
              <img
                v-if="item[mode]"
                :src="item[mode]"
                :alt="item.name"
                class="w-full h-full object-cover object-top"
                :class="mode === 'dark' ? 'hidden dark:block' : 'block dark:hidden'"
              >
            </template>
          </div>

          <!-- Content Overlay (Overlaying the image comparison) -->
          <div class="absolute bottom-0 inset-x-0 p-6 bg-linear-to-t from-white/95 to-default-10 dark:from-default pt-32 pointer-events-none">
            <h3 class="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              {{ item.name }}
            </h3>
            <p class="text-dimmed line-clamp-2 max-w-xl">
              {{ item.description }}
            </p>
          </div>
        </UCard>
      </template>
    </StackSlider>
  </UPageSection>
</template>
