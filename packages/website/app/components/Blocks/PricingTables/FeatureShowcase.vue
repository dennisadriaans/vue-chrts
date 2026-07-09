<script setup lang="ts">
const plans = [
  {
    name: 'Nuxt Dashboard',
    price: 99,
    description: 'Access to Nuxt Dashboard Template',
    features: [
      {
        title: 'Access To Nuxt Dashboard',
        description: 'Get full access to the Nuxt Dashboard template.',
        icon: 'i-lucide-layout-dashboard'
      },
      {
        title: 'One-time Purchase',
        description: 'No recurring fees, pay once and own it forever.',
        icon: 'i-lucide-credit-card'
      },
      {
        title: 'Support the Project',
        description: 'Help us continue developing great tools for the Nuxt ecosystem.',
        icon: 'i-lucide-heart'
      }
    ]
  },
  {
    name: 'All-Access Pass',
    price: 149,
    tag: 'MOST POPULAR',
    description: 'Access to all blocks and templates',
    features: [
      {
        title: 'Blocks & Templates',
        description: 'Unlimited access to all our premium blocks and templates.',
        icon: 'i-lucide-component'
      },
      {
        title: 'CLI Access',
        description: 'Speed up your workflow with our dedicated command-line tool.',
        icon: 'i-lucide-terminal'
      },
      {
        title: 'Nuxt UI Theme Editor',
        description: 'Customize your theme with our intuitive visual editor.',
        icon: 'i-lucide-palette'
      },
      {
        title: '50+ Charts',
        description: 'Wide variety of beautiful, responsive chart components.',
        icon: 'i-lucide-bar-chart'
      },
      {
        title: 'Lifetime Updates & Support',
        description: 'Get all future updates and priority support.',
        icon: 'i-lucide-refresh-cw'
      },
      {
        title: 'Commercial License Included',
        description: 'Use our components in your commercial projects.',
        icon: 'i-lucide-shield-check'
      }
    ]
  },
  {
    name: 'Teams',
    price: 499,
    description: 'Invite up to 5 team members',
    features: [
      {
        title: '5 Team Members',
        description: 'Collaborate with your whole team on multiple projects.',
        icon: 'i-lucide-users'
      },
      {
        title: 'Enterprise Support',
        description: 'Direct access to our development team for any issues.',
        icon: 'i-lucide-headset'
      },
      {
        title: 'Infinite Projects',
        description: 'Use our tools in as many projects as your team needs.',
        icon: 'i-lucide-infinity'
      }
    ]
  }
]

const selectedPlan = ref('All-Access Pass')
const isAnnual = ref(false)

const currentPlanFeatures = computed(() => {
  const plan = plans.find(p => p.name === selectedPlan.value)
  return plan?.features || []
})

const avatars = [
  'https://github.com/benjamincanac.png',
  'https://github.com/romhml.png',
  'https://github.com/noook.png'
]
</script>

<template>
  <div class="p-8">
    <div class="max-w-5xl w-full bg-default dark:bg-elevated/50 rounded-4xl overflow-hidden shadow-sm flex flex-col md:flex-row border border-muted">
      <!-- Left Column: Selection -->
      <div class="flex-1 p-6 md:p-8 space-y-8">
        <div class="flex items-center gap-3">
          <UButton
            icon="i-lucide-arrow-left"
            variant="ghost"
            color="neutral"
            size="sm"
            class="-ml-2"
          />
          <h2 class="text-xl font-bold tracking-tight text-default">
            Secure your sanctuary
          </h2>
        </div>

        <UCard
          variant="subtle"
          :ui="{
            root: 'rounded-3xl'
          }"
        >
          <div class="space-y-3">
            <div
              v-for="plan in plans"
              :key="plan.name"
              class="relative flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer group bg-default dark:bg-muted"
              :class="[
                '',
                selectedPlan === plan.name
                  ? 'border-primary ring-1 bg-primary/5 ring-primary'
                  : 'border border-dashed border-accented'
              ]"
              @click="selectedPlan = plan.name"
            >
              <div class="flex items-center gap-4">
                <div
                  class="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200"
                  :class="selectedPlan === plan.name ? 'border-primary-500' : 'border-default'"
                >
                  <div
                    v-if="selectedPlan === plan.name"
                    class="h-2.5 w-2.5 rounded-full bg-primary-500"
                  />
                </div>

                <span class="font-bold text-lg text-default">{{ plan.name }}</span>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-default">${{ plan.price }}</span>
                <span class="text-dimmed text-sm ml-1">/ month</span>
              </div>
            </div>
          </div>

          <!-- Annual Billing Toggle Card -->
          <div class="px-6 mt-6 space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="font-bold text-default">
                Save $60 with annual billing
              </h4>
              <USwitch
                v-model="isAnnual"
                color="primary"
              />
            </div>
          </div>
        </UCard>

        <UButton
          size="xl"
          block
          label="Start 30-Day Free Trial"
          class="rounded-2xl font-bold py-4"
        />

        <div class="flex items-center justify-center gap-3 pt-2">
          <div class="flex -space-x-2.5">
            <UAvatar
              v-for="(src, i) in avatars"
              :key="i"
              :src="src"
              size="md"
            />
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-1.5">
              <div class="flex gap-0.5">
                <UIcon
                  v-for="i in 5"
                  :key="i"
                  name="i-lucide-star"
                  class="w-3.5 h-3.5 text-warning-500 fill-warning-500"
                />
              </div>
              <span class="text-sm font-bold text-default">4.9/5</span>
            </div>
            <p class="text-[11px] text-dimmed font-medium">
              Trusted by 50,000+ homeowners
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column: Features & Testimonial -->
      <div class="flex-1 p-8 md:p-8 space-y-10">
        <div class="space-y-2">
          <h1 class="text-3xl font-bold text-default tracking-tight">
            {{ selectedPlan }}
          </h1>
          <p class="text-muted">
            {{ plans.find(p => p.name === selectedPlan)?.description }}
          </p>
        </div>

        <div class="space-y-6">
          <p class="text-sm font-bold tracking-wide text-muted uppercase">
            System Features
          </p>
          <div class="space-y-4">
            <div
              v-for="feature in currentPlanFeatures"
              :key="feature.title"
              class="flex gap-4"
            >
              <div class="shrink-0">
                <div class="w-10 h-10 flex items-center justify-center rounded-xl text-primary-600 dark:text-primary-400">
                  <UIcon
                    :name="feature.icon"
                    class="w-5 h-5"
                  />
                </div>
              </div>
              <div>
                <h4 class="font-bold text-default leading-snug">
                  {{ feature.title }}
                </h4>
                <p class="text-sm text-dimmed leading-relaxed">
                  {{ feature.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
