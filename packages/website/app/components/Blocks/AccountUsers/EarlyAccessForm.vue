<script setup lang="ts">
defineOptions({
  tags: ['accountusers', 'earlyaccessform']
})

const state = reactive({
  firstName: 'Emma',
  lastName: 'Crown',
  email: 'emma@company.com',
  company: 'Company, Inc.',
  companySize: undefined,
  package: 'starter'
})

const companySizes = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '500+'
]

const packages = [
  {
    value: 'starter',
    label: 'Starter',
    description: 'Up to 10,000 requests per day.',
    price: 'Free'
  },
  {
    value: 'premium',
    label: 'Premium',
    description: 'Up to 500,000 requests per day¹',
    price: '$900/month²'
  },
  {
    value: 'enterprise',
    label: 'Enterprise',
    description: 'Based on your specific needs',
    price: 'Custom'
  }
]
</script>

<template>
  <UCard class="w-full max-w-3xl mx-auto">
    <div class="space-y-8">
      <div>
        <h2 class="text-lg font-semibold mb-2">
          Apply for early access
        </h2>
        <p class="text-dimmed text-sm">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.
        </p>
      </div>

      <form class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormField
            label="First name"
            required
            name="firstName"
          >
            <UInput
              v-model="state.firstName"
              placeholder="Emma"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Last name"
            name="lastName"
          >
            <UInput
              v-model="state.lastName"
              placeholder="Crown"
              class="w-full"
            />
          </UFormField>
        </div>

        <UFormField
          label="Work email"
          required
          name="email"
        >
          <UInput
            v-model="state.email"
            type="email"
            placeholder="emma@company.com"
            class="w-full"
          />
        </UFormField>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormField
            label="Company"
            name="company"
          >
            <UInput
              v-model="state.company"
              placeholder="Company, Inc."
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Company size (employees)"
            name="companySize"
          >
            <USelect
              v-model="state.companySize"
              :items="companySizes"
              placeholder="Select..."
              class="w-full"
            />
          </UFormField>
        </div>

        <USeparator />

        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium">Select a workspace package</label>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UCard
              v-for="pkg in packages"
              :key="pkg.value"
              :variant="state.package === pkg.value ? 'outline' : 'soft'"
              class="cursor-pointer relative"
              @click="state.package = pkg.value"
            >
              <div class="w-full flex justify-between items-start">
                <span class="font-medium">{{ pkg.label }}</span>
                <UIcon
                  :name="state.package === pkg.value ? 'i-lucide-circle-check' : 'i-lucide-circle'"
                  class="w-4 h-4"
                  :class="{ 'text-primary': state.package === pkg.value }"
                />
              </div>
              <p class="text-sm font-normal text-left text-dimmed mt-2">
                {{ pkg.description }}
              </p>
              <p class="font-medium mt-6">
                {{ pkg.price }}
              </p>
            </UCard>
          </div>
        </div>

        <div class="space-y-1 text-xs text-dimmed">
          <p>² No credit card required for registration.</p>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-default">
          <UButton
            variant="outline"
            color="neutral"
          >
            Go back
          </UButton>
          <UButton color="primary">
            Apply
          </UButton>
        </div>
      </form>
    </div>
  </UCard>
</template>
