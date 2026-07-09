<template>
  <div class="space-y-12 max-w-5xl mx-auto py-24">
    <div class="flex flex-col md:flex-row items-center justify-between w-full gap-8 md:gap-16">
      <h2 class="text-4xl md:text-5xl font-semibold w-full text-balance text-highlighted">
        Customize everything
      </h2>

      <p class="text-muted text-lg text-pretty w-full md:max-w-md">
        Customize every tiny detail with Vue Charts for Vue and Nuxt. Pre-built, customizable components ready to drop into your project.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Card 1 -->
      <UCard
        class="bg-default border-default h-full"
        :ui="{ root: 'rounded-3xl flex flex-col', body: 'bg-elevated/5 flex-1 flex flex-col' }"
      >
        <div class="mb-4">
          <div class="text-lg font-medium text-highlighted">
            Step Minimal
          </div>
          <div class="text-muted text-sm">
            CPU Monitoring
          </div>
        </div>
        <div class="flex-1 min-h-[200px] flex items-end">
          <BlocksLineChartsStepMinimal :height="200" />
        </div>
      </UCard>

      <!-- Card 2 -->
      <UCard
        class="bg-default border-default h-full"
        :ui="{ root: 'rounded-3xl flex flex-col', body: 'bg-elevated/5 flex-1 flex flex-col' }"
      >
        <div class="mb-4">
          <div class="text-lg font-medium text-highlighted">
            Cardinal Multi
          </div>
          <div class="text-muted text-sm">
            Traffic Analytics
          </div>
        </div>
        <div class="flex-1 min-h-[200px] flex items-end">
          <BlocksAreaChartsCardinalMulti :height="200" />
        </div>
      </UCard>

      <!-- Card 3 -->
      <UCard
        class="bg-default border-default h-full"
        :ui="{ root: 'rounded-3xl flex flex-col', body: 'bg-elevated/5 flex-1 flex flex-col' }"
      >
        <div class="mb-4">
          <div class="text-lg font-medium text-highlighted">
            Stacked Bar
          </div>
          <div class="text-muted text-sm">
            Horizontal Distribution
          </div>
        </div>
        <div class="flex-1 min-h-50 flex items-end">
          <BlocksBarChartsStackedHorizontal :height="200" />
        </div>
      </UCard>

      <!-- Card 4 -->
      <UCard
        class="bg-default border-default h-full"
        :ui="{ root: 'rounded-3xl flex flex-col', body: 'bg-elevated/5 flex-1 flex flex-col' }"
      >
        <div class="mb-4 flex items-start justify-between">
          <div>
            <div class="text-lg font-medium text-highlighted">
              Smooth Detailed
            </div>
            <div class="text-muted text-sm">
              Financial Data
            </div>
          </div>
          <UButton
            icon="i-lucide-arrow-up-right"
            color="neutral"
            variant="ghost"
            to="/pricing"
            @click="useButtonTracking().trackSelectContent('chart_card', 'smooth_detailed')"
          />
        </div>
        <div class="flex-1 min-h-[200px] flex items-end">
          <BlocksLineChartsSmoothDetailed :height="200" />
        </div>
      </UCard>

      <!-- Card 5 -->
      <UCard
        class="bg-default border-default h-full"
        :ui="{ root: 'rounded-3xl flex flex-col', body: 'bg-elevated/5 flex-1 flex flex-col' }"
      >
        <div class="mb-4">
          <div class="text-lg font-medium text-highlighted">
            Distribution
          </div>
          <div class="text-muted text-sm">
            Category Breakdown
          </div>
        </div>
        <div class="flex-1 min-h-[200px] flex items-center justify-center">
          <div class="w-full">
            <DocsExamplesCategoryDistribution class="overflow-hidden" />
          </div>
        </div>
      </UCard>

      <!-- Card 6 -->
      <UCard
        class="bg-default border-default h-full"
        :ui="{ root: 'rounded-3xl flex flex-col', body: 'bg-elevated/5 flex-1 flex flex-col' }"
      >
        <div class="mb-4">
          <div class="text-lg font-medium text-highlighted">
            Status Tracker
          </div>
          <div class="text-muted text-sm">
            Live Updates
          </div>
        </div>
        <div class="flex-1 min-h-[200px] flex items-center justify-center">
          <div class="w-full">
            <DocsExamplesStatusTracker />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
