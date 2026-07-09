<script lang="ts" setup>
defineOptions({
  tags: ['application', 'onboardingfeed']
})

const steps = ref([
  {
    title: 'Sign in with your account',
    description: 'To get started, please sign in with your account credentials.',
    button: {
      label: 'Sign in',
      icon: 'i-lucide-user'
    },
    done: true
  },
  {
    title: 'Create your first workspace',
    description: 'Set up your first data workspace to begin organizing your projects.',
    button: {
      label: 'Create workspace',
      icon: 'i-lucide-database'
    },
    done: true
  },
  {
    title: 'Invite team members',
    description: 'Collaborate by inviting team members to your workspace.',
    button: {
      label: 'Invite members',
      icon: 'i-lucide-user-plus'
    },
    done: false
  }
])

const activeStep = ref(1)
</script>

<template>
  <div class="max-w-xl mx-auto bg-default p-8 rounded-xl">
    <div>
      <h2 class="text-2xl font-semibold">
        Hello, John
      </h2>
      <p class="text-dimmed">
        Lets set up your first data workspace
      </p>
    </div>
    <div class=" mt-4">
      <div
        v-for="(step, stepKey) in steps"
        :key="stepKey"
        class="flex gap-6 p-6 cursor-pointer rounded-lg"
        :class="stepKey % 2 === 1 ? 'bg-muted/20' : ''"
        @click="activeStep = stepKey"
      >
        <div
          v-if="step.done"
          class="w-6 h-6 shrink-0 bg-primary flex items-center justify-center mt-1.5 border-3 border-primary rounded-full"
        >
          <UIcon
            name="i-lucide-check"
            class="text-white"
            size="14"
          />
        </div>
        <div
          v-else
          class="w-6 h-6 shrink-0 mt-1.5 rounded-full border-3 border-primary"
        />
        <div>
          <h3 class="text-lg font-semibold">
            {{ step.title }}
          </h3>
          <p class="text-dimmed">
            {{ step.description }}
          </p>
          <UButton
            v-if="stepKey === activeStep"
            v-bind="step.button"
            class="mt-4 font-semibold"
          />
        </div>
      </div>
    </div>
  </div>
</template>
