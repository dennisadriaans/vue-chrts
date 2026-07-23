<script></script>

<template>
  <div class="mx-auto mt-16 grid grid-cols-2 gap-6 px-16">
    <UCard class="bg-default dark:bg-elevated/40">
      <template #header>
        <div class="text-sm font-medium">
          StepAfter Multi - System Monitoring
        </div>
      </template>
      <ResearchAreaStepAfterMultiMetrics :height="height" />
    </UCard>

    <UCard class="bg-default dark:bg-elevated/40">
      <template #header>
        <div class="text-sm font-medium">
          Natural Minimal - Revenue Streams
        </div>
      </template>
      <ResearchAreaNaturalBasisRevenue :height="height" />
    </UCard>

    <UCard class="bg-default dark:bg-elevated/40">
      <template #header>
        <div class="text-sm font-medium">
          Monotone Multi - Social Engagement
        </div>
      </template>
      <ResearchAreaMonotoneEngagement :height="height" />
    </UCard>
  </div>
</template>
