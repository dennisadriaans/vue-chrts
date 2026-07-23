<script setup lang="ts">
defineOptions({
  tags: ['pricingtables', 'pricesection']
})

const newAppConfig = {
  ui: {
    pricingPlan: {
      slots: {
        root: 'lg:px-8 xl:p-8',
        titleWrapper: 'flex items-center justify-between gap-3',
        title: 'text-highlighted text-xl sm:text-xl'
      },
      variants: {
        variant: {
          outline: {
            root: 'bg-default dark:bg-transparent'
          }
        }
      }
    }
  }
}

updateAppConfig(newAppConfig)

const billingCycle = ref('monthly')

const tabs = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Annually', value: 'annually' }
]

const plans = computed(() => [
  {
    title: 'Free',
    description: 'For small personal projects',
    price: '$0',
    billingCycle: billingCycle.value === 'monthly' ? '/ month' : '/ year',
    button: {
      label: 'Get started',
      color: 'neutral' as const,
      variant: 'subtle' as const,
      size: 'xl' as const
    },
    features: [
      { title: '1 user seat', icon: 'i-lucide-circle-check' },
      { title: '1 workspace', icon: 'i-lucide-circle-check' },
      { title: 'Single Sign-On (SSO)', icon: 'i-lucide-x' },
      { title: 'Two-factor authentication', icon: 'i-lucide-x' },
      { title: 'Caching and pre-aggregation', icon: 'i-lucide-x' }
    ]
  },
  {
    title: 'Starter',
    description: 'For growing teams',
    price: billingCycle.value === 'monthly' ? '$49' : '$470',
    billingCycle: billingCycle.value === 'monthly' ? '/ month' : '/ year',
    badge: 'Recommended',
    highlight: true,
    button: {
      label: 'Get started',
      color: 'primary' as const,
      size: 'xl' as const
    },
    features: [
      { title: '10 user seats', icon: 'i-lucide-circle-check' },
      { title: '5 workspaces', icon: 'i-lucide-circle-check' },
      { title: 'Single Sign-On (SSO)', icon: 'i-lucide-x' },
      { title: 'Two-factor authentication', icon: 'i-lucide-circle-check' },
      { title: 'Caching and pre-aggregation', icon: 'i-lucide-circle-check' }
    ]
  },
  {
    title: 'Enterprise',
    description: 'For large organizations',
    price: billingCycle.value === 'monthly' ? '$199' : '$1900',
    billingCycle: billingCycle.value === 'monthly' ? '/ month' : '/ year',
    button: {
      label: 'Contact sales',
      color: 'neutral' as const,
      variant: 'subtle' as const,
      size: 'xl' as const
    },
    features: [
      { title: 'Unlimited user seats', icon: 'i-lucide-circle-check' },
      { title: 'Unlimited workspaces', icon: 'i-lucide-circle-check' },
      { title: 'Single Sign-On (SSO)', icon: 'i-lucide-circle-check' },
      { title: 'Two-factor authentication', icon: 'i-lucide-circle-check' },
      { title: 'Caching and pre-aggregation', icon: 'i-lucide-circle-check' }
    ]
  }
])

/*
  Reset styles for this component to override Nuxt Charts own app.config settings.
  You can remove this part, you probably don't need it.
*/
const reset = {
  section: {
    container: 'py-0 sm:py-0 lg:py-0 sm:gap-6  max-w-full'
  },
  pricingPlan: {
  }
}
</script>

<template>
  <UPageSection
    headline="Pricing Section"
    title="Choose your plan"
    description="Add a concise value statement that addresses price sensitivity and showcases plan flexibility while keeping it under two lines."
    :ui="reset.section"
  >
    <div class="flex flex-col items-center gap-8">
      <UTabs
        v-model="billingCycle"
        :items="tabs"
        class="w-fit"
        variant="pill"
      >
        <template #trailing="{ item }">
          <UBadge
            v-if="item.value === 'annually'"
            label="Save 20%"
            color="neutral"
            variant="subtle"
            size="sm"
          />
        </template>
      </UTabs>

      <UPricingPlans
        :plans="plans"
        :ui="reset.pricingPlan"
      />
    </div>
  </UPageSection>
</template>
