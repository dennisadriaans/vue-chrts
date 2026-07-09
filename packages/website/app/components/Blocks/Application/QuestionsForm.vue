<script setup lang="ts">
const steps = ref([
  {
    id: '01',
    question: 'What is your current role?',
    options: [
      { label: 'Developer', value: 'developer' },
      { label: 'Designer', value: 'designer' },
      { label: 'Product Manager', value: 'pm' }
    ]
  },
  {
    id: '02',
    question: 'How many years of experience?',
    options: [
      { label: '0-2 years', value: '0-2' },
      { label: '3-5 years', value: '3-5' },
      { label: '5+ years', value: '5+' }
    ]
  },
  {
    id: '03',
    question: 'Which framework do you prefer?',
    options: [
      { label: 'Nuxt', value: 'nuxt' },
      { label: 'Vue', value: 'vue' },
      { label: 'React', value: 'react' }
    ]
  },
  {
    id: '04',
    question: 'What kind of support do you need for this change?',
    options: [
      { label: 'I\'ll handle it myself', value: 'self' },
      { label: 'I want to hire a professional', value: 'hire' },
      { label: 'I want someone to manage it end-to-end', value: 'managed' }
    ]
  },
  {
    id: '05',
    question: 'What is your timeline?',
    options: [
      { label: 'Immediate', value: 'immediate' },
      { label: '1-3 months', value: '1-3m' },
      { label: 'Not sure', value: 'not-sure' }
    ]
  }
])

const currentStepIndex = ref(3)
const currentStep = computed(() => steps.value[currentStepIndex.value])
const selectedOption = ref('')

const progressValue = computed(() => ((currentStepIndex.value + 1) / steps.value.length) * 100)

function nextStep() {
  if (currentStepIndex.value < steps.value.length - 1) {
    currentStepIndex.value++
    selectedOption.value = ''
  }
}

function prevStep() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
    selectedOption.value = ''
  }
}
</script>

<template>
  <UCard
    class="w-full max-w-md bg-default! mx-auto"
    :ui="{
      root: 'rounded-3xl',
      body: 'p-8 sm:p-12'
    }"
  >
    <div class="space-y-12">
      <!-- Progress Indicators -->
      <UProgress
        v-model="progressValue"
        color="neutral"
        size="sm"
      />

      <!-- Question Header -->
      <div class="space-y-4">
        <p class="text-sm font-mono tracking-widest uppercase text-dimmed">
          Question {{ currentStep?.id }}
        </p>
        <h2 class="text-2xl lg:text-3xl font-semibold leading-tight">
          {{ currentStep?.question }}
        </h2>
      </div>

      <!-- Options -->
      <div class="space-y-4">
        <p class="text-sm font-mono tracking-widest uppercase text-dimmed mb-6">
          Select one
        </p>
        <URadioGroup
          v-model="selectedOption"
          color="neutral"
          size="lg"
          :items="currentStep?.options"

          :ui="{
            base: 'rounded-full ring ring-inset ring-accented overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 mr-2',
            item: 'items-center',
            indicator: 'flex items-center justify-center size-full after:bg-default after:rounded-full',
            legend: 'sr-only ',
            label: 'text-lg'
          }"
        />
      </div>

      <!-- Navigation -->
      <div class="flex items-center justify-between pt-4">
        <UButton
          label="Back"
          color="neutral"
          variant="soft"
          size="xl"
          class="px-8 font-medium"
          @click="prevStep"
        />
        <UButton
          label="Next"
          size="xl"
          class="px-10 font-medium"
          @click="nextStep"
        />
      </div>
    </div>
  </UCard>
</template>
