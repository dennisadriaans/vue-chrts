<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  tags: ['ai']
})

const query = ref('')

const tools = [
  { label: 'Create image', icon: 'i-lucide-sparkles' },
  { label: 'Create music', icon: 'i-lucide-music' },
  { label: 'Boost my day', icon: 'i-lucide-sun' },
  { label: 'Write anything', icon: 'i-lucide-pen-line' }
]

const dropdownItems = [
  [
    {
      label: 'Fast',
      icon: 'i-lucide-zap'
    },
    {
      label: 'Advanced',
      icon: 'i-lucide-brain'
    }
  ]
]
</script>

<template>
  <UCard class="bg-default!">
    <div class="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
      <div class="flex flex-col items-center text-center space-y-8">
        <div class="space-y-2 w-full text-left max-w-2xl px-2">
          <div class="flex items-center gap-2 text-primary">
            <UIcon
              name="i-lucide-sparkles"
              class="w-5 h-5"
            />
            <span class="font-medium">Hi there!</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight">
            Where should we start?
          </h1>
        </div>

        <UCard
          variant="subtle"
          class="w-full max-w-2xl bg-default rounded-3xl"
          :ui="{
            body: 'p-2 sm:p-2'
          }"
        >
          <div class="flex flex-col relative">
            <UTextarea
              v-model="query"
              size="xl"
              placeholder="Ask Gemini 3"
              class="w-full"
              variant="none"
              :autoresize="true"
              :rows="1"
              :ui="{
                base: 'px-4 py-3 min-h-14 bg-transparent shadow-none border-transparent focus:ring-0 resize-none'
              }"
            />

            <div class="flex items-center justify-between px-2 pb-2">
              <div class="flex items-center gap-1">
                <UButton
                  icon="i-lucide-plus"
                  color="neutral"
                  variant="ghost"
                  class="rounded-full"
                  size="sm"
                />
                <UButton
                  icon="i-lucide-wrench"
                  label="Tools"
                  color="neutral"
                  variant="ghost"
                  class="rounded-full"
                  size="sm"
                />
              </div>

              <div class="flex items-center gap-1">
                <UDropdownMenu
                  :items="dropdownItems"
                  :ui="{
                    itemLeadingIcon: 'size-4'
                  }"
                >
                  <UButton
                    color="neutral"
                    variant="ghost"
                    label="Fast"
                    trailing-icon="i-lucide-chevron-down"
                    class="rounded-full"
                    size="sm"
                  />
                  <UButton
                    icon="i-lucide-mic"
                    color="neutral"
                    variant="ghost"
                    class="rounded-full"
                    size="sm"
                  />
                </UDropdownMenu>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Action Chips -->
        <div
          class="flex flex-wrap items-center justify-center gap-2 max-w-2xl w-full px-2"
        >
          <UButton
            v-for="tool in tools"
            :key="tool.label"
            :icon="tool.icon"
            :label="tool.label"
            color="neutral"
            variant="subtle"
            class="rounded-full py-2 px-4 shadow-none"
            size="sm"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>
