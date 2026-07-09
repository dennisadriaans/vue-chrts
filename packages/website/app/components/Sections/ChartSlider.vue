<script setup lang="ts">
// This stays as your reactive "stack" for the cards
const cards = ref([
  { id: 3, type: 'area-preview', title: 'Area Preview Chart', description: 'Simple and clean area chart for tracking single metrics.' },
  { id: 5, type: 'area-seven', title: 'Platform Activity', description: 'Last 12 weeks · Production environment' }
])

// A static reference to keep the pagination dots in a consistent order
const staticCards = [...cards.value]

const isTransitioning = ref(false)

const rotateCards = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true

  setTimeout(() => {
    const [first, ...rest] = cards.value
    if (first) {
      cards.value = [...rest, first]
    }
    isTransitioning.value = false
  }, 10)
}

const prevCard = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true

  setTimeout(() => {
    const last = cards.value[cards.value.length - 1]
    const rest = cards.value.slice(0, -1)
    if (last) {
      cards.value = [last, ...rest]
    }
    isTransitioning.value = false
  }, 10)
}

const goToCard = (id: number) => {
  if (isTransitioning.value || cards.value[0]?.id === id) return
  isTransitioning.value = true

  const targetIndex = cards.value.findIndex(c => c.id === id)

  setTimeout(() => {
    const moved = cards.value.slice(0, targetIndex)
    const remaining = cards.value.slice(targetIndex)
    cards.value = [...remaining, ...moved]
    isTransitioning.value = false
  }, 10)
}
</script>

<template>
  <UPageSection
    title="Customize everything"
    description="Customize every tiny detail with Vue Charts for Vue and Nuxt. Pre-built, customizable components ready to drop into your project."
    :ui="{ description: 'max-w-xl mx-auto' }"
  >
    <div class="flex flex-col items-center justify-center p-6">
      <div class="relative w-full h-186">
        <div
          v-for="(card, index) in cards"
          :key="card.id"
          class="absolute inset-0 w-full h-full transition-all duration-300 ease-in-out cursor-pointer rounded-3xl"
          :class="[
            index === 0 ? 'z-30 scale-100 translate-y-0 opacity-100' : '',
            index === 1 ? 'z-20 scale-95 translate-y-8 opacity-70 blur-[0.5px]' : '',
            index >= 2 ? 'z-10 scale-90 translate-y-16 opacity-40 blur-[1px]' : ''
          ]"
          :style="{ zIndex: 30 - index }"
          @click="index === 0 ? rotateCards() : null"
        >
          <UCard
            class="h-full"
            :ui="{
              root: 'rounded-3xl mb-4 bg-[#F9F9F9] dark:!bg-[#101010]'

            }"
          >
            <div>
              <div class="flex items-center justify-between mb-6 ">
                <div class="shrink-0 space-y-1">
                  <h2 class="text-2xl font-bold text-highlighted">
                    {{ card.title }}
                  </h2>
                  <p class="text-dimmed max-w-2xl">
                    {{ card.description }}
                  </p>
                </div>
                <div>
                  <UButton
                    color="neutral"
                    trailing-icon="i-hugeicons-link-forward"
                  >
                    Explore Data
                  </UButton>
                </div>
              </div>

              <UCard
                class="bg-default dark:bg-default/50!"
                :ui="{
                  root: 'rounded-3xl mb-4 !bg-default dark:bg-default/50'
                }"
              >
                <div class="">
                  <template v-if="card.type === 'area-preview'">
                    <HomeChartsAreaPreview
                      :height="380"
                      class="w-full"
                    />
                  </template>
                  <template v-else-if="card.type === 'area-seven'">
                    <HomeChartsAreaSeven
                      :height="380"
                      class="w-full"
                    />
                  </template>
                </div>
              </UCard>
            </div>
          </UCard>
        </div>
      </div>

      <div class="flex items-center justify-center gap-3 mt-28 w-full max-w-4xl relative">
        <div class="flex items-center gap-3">
          <button
            v-for="c in staticCards"
            :key="c.id"
            class="relative h-2 rounded-full transition-all duration-500 ease-in-out cursor-pointer origin-center"
            :class="[
              cards[0]?.id === c.id
                ? 'bg-inverted w-8'
                : 'bg-accented w-2 '
            ]"
            :aria-label="`Go to card ${c.id}`"
            @click="goToCard(c.id)"
          >
            <span
              class="absolute inset-0 rounded-full transition-transform duration-300"
              :class="cards[0]?.id === c.id ? 'scale-110' : 'scale-100'"
            />
          </button>
        </div>

        <div class="absolute right-0 flex items-center gap-2">
          <UButton
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            class="rounded-full"
            aria-label="Previous card"
            @click="prevCard"
          />
          <UButton
            icon="i-lucide-arrow-right"
            color="neutral"
            variant="ghost"
            class="rounded-full"
            aria-label="Next card"
            @click="rotateCards"
          />
        </div>
      </div>
    </div>
  </UPageSection>
</template>
