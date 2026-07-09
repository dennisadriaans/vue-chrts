<script lang="ts" setup>
import Onboarding from '~/components/Blocks/Application/Onboarding/Onboarding.vue'
import type { Question } from '~/components/Blocks/Application/Onboarding/types'

defineOptions({
  tags: ['application', 'usage']
})

const questions = ref<Question[]>([
  {
    title: 'How do you plan on using this awesome application?',
    description: 'Which of these best described you?',
    type: 'option' as const,
    options: [
      { label: 'For myself', value: 'myself' },
      { label: 'With my team', value: 'team' },
      { label: 'For my organization', value: 'organization' }
    ],
    value: undefined
  },
  {
    title: 'What would you like to focus on first?',
    description: 'We\'ll personalize your journey based on your selection',
    type: 'option' as const,
    options: [
      { label: 'Analyze competitors and market trends', value: 'analyze' },
      { label: 'Create visualizations and reports', value: 'visualizations' },
      { label: 'Improve SEO and PPC', value: 'seo' },
      { label: 'Find sales leads and personalize outreach', value: 'sales' },
      { label: 'Explore Amazon\'s marketplace demand', value: 'amazon' }
    ]
  },
  {
    title: 'What\'s your job title?',
    description: 'We\'ll personalize your journey based on your selection',
    type: 'search',
    options: [
      { label: 'CEO', value: 'ceo' },
      { label: 'Marketing Manager', value: 'marketing_manager' },
      { label: 'Sales Representative', value: 'sales_representative' },
      { label: 'Data Analyst', value: 'data_analyst' },
      { label: 'Product Manager', value: 'product_manager' }
    ],
    value: undefined
  }
])

const handleFinish = (answers: Question[]) => {
  console.log('Onboarding finished!', answers)
  alert('Onboarding finished! Check the console for the answers.')
}
</script>

<template>
  <Onboarding
    v-model="questions"
    @finish="handleFinish"
  />
</template>
