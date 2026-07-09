<script lang="ts" setup>
defineOptions({
  tags: ['application', 'onboardingfeedtwo']
})

const steps = [
  {
    title: 'Set up your organization',
    description: 'You successfully created your account. You can edit your account details anytime.',
    status: 'completed'
  },
  {
    title: 'Connect to data source',
    description: 'The platform supports more than 50 databases and data warehouses.',
    status: 'current'
  },
  {
    title: 'Create metrics',
    description: 'Create metrics using custom SQL or our intuitive query mask.',
    status: 'pending'
  },
  {
    title: 'Create report',
    description: 'Transform metrics into visualizations and arrange them visually.',
    status: 'pending'
  }
]

const progress = ref(25)
</script>

<template>
  <div class="max-w-xl mx-auto w-full">
    <div class="mb-4">
      <h2 class="text-xl font-semibold mb-2">
        Getting started
      </h2>
      <p class="text-dimmed">
        Follow the steps to set up your workspace. This allows you to create your first dashboard.
      </p>
    </div>

    <div class="flex items-center justify-end gap-4 mb-6">
      <span class="text-sm">Step 1/4</span>
      <UProgress
        v-model="progress"
        class="w-48"
      />
    </div>

    <div class="flex flex-col gap-4">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="border-2 border-default rounded-lg p-6 flex gap-6 items-start bg-default/60  "
      >
        <div class="shrink-0 mt-0.5">
          <div
            v-if="step.status === 'completed'"
            class="w-6 h-6 shrink-0 bg-primary flex items-center justify-center mt-1.5 border-3 border-primary rounded-full"
          >
            <UIcon
              name="i-lucide-check"
              class="text-white"
              size="14"
            />
          </div>
          <span
            v-else
            class="w-6 h-6 flex items-center justify-center font-medium"
          >
            {{ index + 1 }}.
          </span>
        </div>
        <div>
          <h3 class="font-medium mb-1">
            {{ step.title }}
          </h3>
          <p class="text-dimmed">
            {{ step.description }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex justify-end items-center gap-4 mt-8">
      <UButton
        variant="ghost"
        color="neutral"
      >
        Back
      </UButton>
      <UButton color="primary">
        Continue
      </UButton>
    </div>
  </div>
</template>
