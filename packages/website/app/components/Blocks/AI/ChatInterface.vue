<script setup lang="ts">
defineOptions({
  tags: ['blocks', 'ai']
})

const isThoughtExpanded = ref(false)
const isSearchingExpanded = ref(false)
</script>

<template>
  <div class="flex gap-4 h-200 w-full rounded-2xl overflow-hidden font-sans  shadow">
    <UCard
      class="bg-default! w-4/12"
      :ui="{
        header: 'border-b border-default'
      }"
    >
      <template #header>
        <div>
          <div class="flex items-center justify-end gap-2 pb-2 backdrop-blur-md rounded-2xl">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-chat-bubble-oval-left"
              class="rounded-xl px-3 py-2"
            />
            <UButton
              color="neutral"
              variant="subtle"
              icon="i-heroicons-view-columns"
              label="Change mode"
              class="rounded-xl px-4 py-2"
            />
            <UButton
              color="neutral"
              variant="subtle"
              icon="i-heroicons-adjustments-horizontal"
              class="rounded-xl px-3 py-2"
            />
          </div>
        </div>
      </template>
    </UCard>

    <UCard class="bg-default! w-8/12">
      <div class="flex flex-col shrink-0">
        <div class="flex items-center justify-between px-4">
          <div class="flex items-center gap-2 text-muted font-semibold">
            <UIcon
              name="i-heroicons-sparkles"
              class="size-5 "
            />
            Nuxt Charts AI
          </div>
          <div class="flex items-center gap-1">
            <UButton
              icon="i-heroicons-star"
              color="neutral"
              variant="ghost"
            />
            <UButton
              icon="i-heroicons-plus"
              color="neutral"
              variant="ghost"
            />
            <UButton
              icon="i-heroicons-x-mark"
              color="neutral"
              variant="ghost"
            />
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-5 pb-8 space-y-6 text-sm">
          <div class="flex justify-end">
            <div class=" bg-elevated dark:bg-elevated/20 rounded-3xl px-5 py-3 max-w-[90%]">
              Create personalized email draft to David
            </div>
          </div>

          <div class="space-y-3">
            <div class="space-y-2">
              <button
                class="flex items-center justify-between w-full text-left p-2 rounded-lg transition-colors group hover:bg-elevated"
                @click="isThoughtExpanded = !isThoughtExpanded"
              >
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-light-bulb"
                    class="size-4"
                  />
                  <span>Thought for 4 seconds</span>
                </div>
                <UIcon
                  name="i-heroicons-chevron-right"
                  class="size-4 transition-transform duration-200"
                  :class="{ 'rotate-90': isThoughtExpanded }"
                />
              </button>
              <transition
                enter-active-class="transition-all duration-200 ease-out"
                leave-active-class="transition-all duration-150 ease-in"
                enter-from-class="opacity-0 -translate-y-2 max-h-0"
                enter-to-class="opacity-100 translate-y-0 max-h-40"
                leave-from-class="opacity-100 translate-y-0 max-h-40"
                leave-to-class="opacity-0 -translate-y-2 max-h-0"
              >
                <div
                  v-if="isThoughtExpanded"
                  class="pl-9 pr-2 py-2 text-muted text-sm leading-relaxed border-l-2  ml-4 overflow-hidden"
                >
                  Analyzing the request for a personalized email draft to David. Identifying key objectives: SaaS activation, conversion optimization, and value clarification. Mapping David's role as a potential client...
                </div>
              </transition>
            </div>

            <div class="space-y-2">
              <button
                class="flex items-center justify-between w-full text-left p-2 rounded-lg transition-colors group hover:bg-elevated"
                @click="isSearchingExpanded = !isSearchingExpanded"
              >
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-magnifying-glass"
                    class="size-4"
                  />
                  <span>Searching for 15 sources</span>
                  <div
                    v-if="!isSearchingExpanded"
                    class="flex ml-1"
                  >
                    <div class="size-5 rounded-full flex items-center justify-center text-sm">
                      <UIcon name="i-heroicons-building-storefront" />
                    </div>
                    <div class="size-5 rounded-full flex items-center justify-center text-sm">
                      <UIcon name="i-heroicons-camera" />
                    </div>
                    <div class="size-5 rounded-full flex items-center justify-center text-sm">
                      <UIcon name="i-heroicons-briefcase" />
                    </div>
                  </div>
                </div>
                <UIcon
                  name="i-heroicons-chevron-right"
                  class="size-4  transition-transform duration-200"
                  :class="{ 'rotate-90': isSearchingExpanded }"
                />
              </button>
              <transition
                enter-active-class="transition-all duration-200 ease-out"
                leave-active-class="transition-all duration-150 ease-in"
                enter-from-class="opacity-0 -translate-y-2 max-h-0"
                enter-to-class="opacity-100 translate-y-0 max-h-40"
                leave-from-class="opacity-100 translate-y-0 max-h-40"
                leave-to-class="opacity-0 -translate-y-2 max-h-0"
              >
                <div
                  v-if="isSearchingExpanded"
                  class="pl-9 pr-2 py-2 text-muted text-sm space-y-2 border-l-2 border-default ml-4 overflow-hidden"
                >
                  <div class="flex items-center gap-2">
                    <UIcon
                      name="i-heroicons-link"
                      class="size-3"
                    />
                    <span class="truncate">https://linkedin.com/in/david-profile</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <UIcon
                      name="i-heroicons-link"
                      class="size-3"
                    />
                    <span class="truncate">https://david-saas-website.com/about</span>
                  </div>
                  <div class="flex items-center gap-2 text-primary font-medium">
                    +13 more sources...
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <div class="leading-relaxed">
            <p class="mb-5">
              Got it! I'll draft personalized email for David so you can maximize the sales
            </p>

            <div class="rounded-2xl overflow-hidden mb-5 shadow-sm relative">
              <div class="flex items-center justify-between px-4 py-3">
                <div class="flex items-center gap-2 font-medium ">
                  <UIcon
                    name="i-heroicons-envelope"
                    class="size-4"
                  />
                  Email
                </div>
                <div class="flex items-center gap-1">
                  <UButton
                    icon="i-heroicons-document-duplicate"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                  />
                  <UButton
                    icon="i-heroicons-sparkles"
                    color="warning"
                    variant="ghost"
                    size="xs"
                  />
                </div>
              </div>
              <div class="p-5 max-h-56 overflow-hidden relative bg-elevated dark:bg-elevated/20">
                <p class="font-medium  mb-4">
                  Quick idea for you
                </p>
                <p class="mb-4">
                  Hi David,
                </p>
                <p class="mb-4">
                  I have a few ideas to improve your product's first-time user experience and conversions.
                </p>
                <p class="mb-4">
                  I help SaaS teams increase activation by simplifying hierarchy and clarifying value quickly.
                </p>
                <p class="">
                  Happy to share a short tailored teardown with...
                </p>
              </div>
            </div>

            <p>
              Let me know if you need more tweak or variations. Happy to jump on!
            </p>
          </div>

          <div class="flex items-center gap-2 pt-2 text-gray-400">
            <UButton
              icon="i-heroicons-document-duplicate"
              color="neutral"
              variant="ghost"
              size="xs"
            />
            <UButton
              icon="i-heroicons-sparkles"
              color="neutral"
              variant="ghost"
              size="xs"
            />
            <UButton
              icon="i-heroicons-hand-thumb-down"
              color="neutral"
              variant="ghost"
              size="xs"
            />
            <UButton
              icon="i-heroicons-arrow-path"
              color="neutral"
              variant="ghost"
              size="xs"
            />
            <UButton
              icon="i-heroicons-square-3-stack-3d"
              color="neutral"
              variant="ghost"
              size="xs"
            />
          </div>
        </div>

        <div class="p-4 bg-elevated shadow-sm rounded-xl">
          <div class="relative">
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
            <UButton
              icon="i-heroicons-paper-airplane"
              color="neutral"
              variant="ghost"
              size="sm"
              class="absolute right-2 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
