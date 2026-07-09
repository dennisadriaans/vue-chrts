<script setup lang="ts">
defineOptions({
  tags: ['blocks', 'application']
})
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">
        Application Blocks
      </h2>
      <p class="text-toned dark:text-muted">
        A collection of different application blocks for your applications.
      </p>
    </div>
    <ClientOnly>
      <div class="mt-12 space-y-24 lg:mt-0">
        <PreviewExample title="Nuxt UI Questions Form">
          <template #chart>
            <BlocksApplicationQuestionsForm />
          </template>
          <PreviewCode
            id="questions-form"
            category="application"
            block="questions-form"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Nuxt UI Onboarding Form">
          <template #chart>
            <BlocksApplicationOnboardingUsage />
          </template>
          <PreviewCode
            id="onboarding-one"
            category="application/onboarding"
            block="onboarding/usage"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Nuxt UI Onboarding Feed">
          <template #chart>
            <BlocksApplicationOnboardingFeed />
          </template>
          <PreviewCode
            id="onboarding-feed"
            category="application/onboarding"
            block="onboarding-feed"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Nuxt UI Onboarding Feed Two">
          <template #chart>
            <BlocksApplicationOnboardingFeedTwo />
          </template>
          <PreviewCode
            id="onboarding-feed-two"
            category="application/onboarding"
            block="onboarding-feed-two"
            :lock-code="true"
          />
        </PreviewExample>
      </div>
    </ClientOnly>
  </div>
</template>
