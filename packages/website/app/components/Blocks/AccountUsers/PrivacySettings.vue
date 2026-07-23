<script setup lang="ts">
defineOptions({
  tags: ['accountusers', 'privacysettings']
})

const privacySettings = ref({
  analyticsConsent: true
})
</script>

<template>
  <UCard class="!bg-default mx-auto my-16 max-w-3xl">
    <h3 class="text-lg font-semibold tracking-tight">
      Privacy & Data
    </h3>
    <div class="max-w-7xl space-y-6">
      <div class="flex items-start gap-8">
        <div class="w-1/2 pt-2 font-medium">
          Data Sharing
        </div>
        <div class="flex-1">
          <UCheckbox
            v-model="privacySettings.analyticsConsent"
            label="Share anonymous usage data"
          />
        </div>
      </div>

      <div class="flex items-start gap-8">
        <div class="w-1/2 pt-2 font-medium">
          Data Export
        </div>
        <div class="flex-1">
          <UButton
            color="neutral"
            variant="subtle"
            icon="i-lucide-download"
          >
            Export All Data
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>
