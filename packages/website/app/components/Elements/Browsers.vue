<script setup lang="ts">
const browsers = [
  {
    name: 'Google Chrome',
    icon: 'i-logos-chrome',
    value: 60
  },
  {
    name: 'Mozilla Firefox',
    icon: 'i-logos-firefox',
    value: 78
  },
  {
    name: 'Safari',
    icon: 'i-logos-safari',
    value: 32
  }
]
</script>

<template>
  <UCard class="bg-default dark:bg-elevated/20">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold">
        Browser Usage
      </h2>

      <UButton
        icon="i-heroicons-plus"
        color="indigo"
        variant="solid"
        size="lg"
      />
    </div>

    <div
      class="flex flex-col"
    >
      <div
        v-for="browser in browsers"
        :key="browser.name"
        class="flex items-center gap-6 py-6 px-4 hover:bg-elevated/50 transition -ml-4"
        style="width: calc(100% + 32px);"
      >
        <div class="flex items-center justify-center w-14 h-14 rounded-full border border-default bg-default shrink-0 shadow-sm">
          <UIcon
            :name="browser.icon"
            class="w-7 h-7"
          />
        </div>

        <div class="flex flex-col gap-2 flex-1">
          <span class="font-medium text-default text-base">{{ browser.name }}</span>
          <div class="flex items-center gap-4 w-full">
            <UProgress
              :model-value="browser.value"
              color="indigo"
              size="lg"
              class="flex-1"
            />
            <span class="text-sm font-medium text-muted shrink-0">{{ browser.value }}%</span>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
