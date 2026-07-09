<script setup lang="ts">
defineOptions({
  tags: ['ai', 'promptinput']
})
</script>

<template>
  <div class="mx-auto max-w-5xl p-4">
    <UCard class="bg-default!">
      <div class="mx-auto flex w-full max-w-4xl flex-col items-center p-6">
        <div class="mb-12 flex items-center">
          <div
            class="relative mr-4 flex h-12 w-12 items-center justify-center text-(--ui-bg)"
          >
            <div
              class="absolute h-12 w-12 rounded-full bg-primary opacity-20"
            />
            <div class="absolute h-9 w-9 rounded-full bg-primary" />
            <UIcon
              name="i-lucide-mic"
              size="md"
            />
          </div>
          <h1 class="mb-4 text-2xl font-semibold tracking-tight">
            How can I help you?
          </h1>
        </div>

        <div class="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
          <UCard>
            <div class="mb-2 flex items-center">
              <UIcon
                name="i-lucide-palette"
                class="mr-2 text-primary"
              />
              <span class="font-semibold">Color Palette</span>
            </div>
            <p class="text-dimmed">
              Generate a color palette from an image
            </p>
          </UCard>

          <UCard>
            <div class="mb-2 flex items-center">
              <UIcon
                name="i-lucide-image"
                class="mr-2 text-primary"
              />
              <span class="font-medium">Generate Image</span>
            </div>
            <p class="text-dimmed">
              Generate an image from a text prompt
            </p>
          </UCard>

          <UCard>
            <div class="mb-2 flex items-center">
              <UIcon
                name="i-lucide-code"
                class="mr-2 text-primary"
              />
              <span class="font-semibold">Vue component</span>
            </div>
            <p class="text-dimmed">
              Generate a Vue component from prompt
            </p>
          </UCard>

          <UCard>
            <div class="mb-2 flex items-center">
              <UIcon
                name="i-lucide-wand-sparkles"
                class="mr-2 text-primary"
              />
              <span class="font-semibold">Voice Component</span>
            </div>
            <p class="text-dimmed">
              Create a component from your Voice
            </p>
          </UCard>
        </div>

        <div class="mt-12 flex w-full items-center  bg-elevated shadow rounded-2xl">
          <UTextarea
            size="xl"
            placeholder="Ask Nuxt Charts"
            class="w-full"
            variant="none"
            :autoresize="true"
            :rows="1"
            :ui="{
              base: 'px-4 py-3 min-h-14 bg-transparent shadow-none border-transparent focus:ring-0 resize-none'
            }"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>
