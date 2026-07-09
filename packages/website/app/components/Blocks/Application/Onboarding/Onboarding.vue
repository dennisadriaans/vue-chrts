<script lang="ts" setup>
import OnboardingOptions from './Options.vue'
import OnboardingSelectSearch from './SelectSearch.vue'
import OnboardingHeader from './OnboardingHeader.vue'
import OnboardingQuestion from './OnboardingQuestion.vue'
import OnboardingFooter from './OnboardingFooter.vue'
import OnboardingFinished from './OnboardingFinished.vue'
import type { Question, QuestionOption } from './types'

defineOptions({
  tags: ['application', 'onboarding']
})

const questions = defineModel<Question[]>({ required: true })
const emit = defineEmits<{
  (event: 'finish', payload: Question[]): void
}>()

const questionKey = ref<number>(0)

const isFinished = computed<boolean>(() => questions.value.every(q => q.value !== undefined) && questionKey.value === questions.value.length)

const TOTAL_QUESTIONS = computed(() => questions.value.length)
const PROGRESS_PER_QUESTION = computed(() => 100 / TOTAL_QUESTIONS.value)

const activeQuestion = computed<Question>(() => questions.value[questionKey!.value]!)
const progressValue = computed<number>(() => (questionKey.value) * PROGRESS_PER_QUESTION.value)
const isLastQuestion = computed<boolean>(() => questionKey.value === questions.value.length)
const isFirstQuestion = computed<boolean>(() => questionKey.value === 0)

const handleSelectOption = (option: QuestionOption | undefined): void => {
  questions.value[questionKey.value]!.value = option
}

const goToPreviousQuestion = (): void => {
  if (!isFirstQuestion.value) {
    questionKey.value--
  }
}

const goToNextQuestion = (): void => {
  if (!isLastQuestion.value) {
    questionKey.value++
  }
}

const handleFinish = (): void => {
  emit('finish', questions.value)
}
</script>

<template>
  <div class="relative flex items-center justify-center">
    <img
      src="https://nuxtcharts.com/images/dashboard/screenshots/0.png"
      class="w-full h-full object-cover object-center blur-lg absolute inset-0"
      alt="onboarding-background"
    >

    <div class="bg-default z-10 w-full max-w-4xl p-8 rounded-xl">
      <OnboardingHeader
        :progress-value="progressValue"
        :question-key="questionKey"
        :total-questions="TOTAL_QUESTIONS"
        :is-first-question="isFirstQuestion"
        @previous="goToPreviousQuestion"
      />

      <template v-if="!isFinished">
        <OnboardingQuestion :question="activeQuestion" />

        <OnboardingOptions
          v-if="activeQuestion.type === 'option'"
          :options="activeQuestion.options!"
          :value="activeQuestion.value"
          @update:model-value="handleSelectOption"
        />

        <OnboardingSelectSearch
          v-if="activeQuestion.type === 'search'"
          :options="activeQuestion.options!"
          :value="activeQuestion.value"
          @update:model-value="handleSelectOption"
        />

        <OnboardingFooter
          :is-last-question="isLastQuestion"
          @next="goToNextQuestion"
          @finish="handleFinish"
        />
      </template>

      <template v-else-if="questions">
        <OnboardingFinished :questions="questions" />
      </template>
    </div>
  </div>
</template>
