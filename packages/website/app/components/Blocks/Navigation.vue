<script setup lang="ts">
defineOptions({
  tags: ['blocks', 'navigation']
})

const route = useRoute()

const { categories } = useBlocksNavigation()

const scrollContainer = ref<HTMLElement>()

const scrollToActiveItem = () => {
  nextTick(() => {
    if (scrollContainer.value) {
      const activeLink = scrollContainer.value.querySelector(
        '.active-link'
      ) as HTMLElement
      if (activeLink) {
        activeLink.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      }
    }
  })
}

watch(
  () => route.path,
  () => {
    scrollToActiveItem()
  },
  { immediate: true }
)

onMounted(() => {
  scrollToActiveItem()
})
</script>

<template>
  <div>
    <div
      ref="scrollContainer"
      class="border-default fixed top-1/2 left-0 z-10 -mt-46 w-64 -translate-y-1/2 space-y-16"
    >
      <div
        v-for="category in categories"
        :key="category.title"
      >
        <div
          class="text-dimmed mb-4 px-8.5 text-xs font-semibold tracking-wide uppercase"
        >
          {{ category.title }}
        </div>
        <div class="space-y-0">
          <NuxtLink
            v-for="(item, itemKey) in category.items"
            :key="itemKey"
            class="block px-6"
            :to="item.path"
          >
            <UButton
              variant="link"
              color="neutral"
              active-variant="soft"
              :active="route.path === item.path"
            >
              {{ item.label }}
              <UBadge
                v-if="item.new"
                size="sm"
                variant="soft"
                label="NEW"
              />
            </UButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
