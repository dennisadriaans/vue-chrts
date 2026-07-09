<script lang="ts" setup>
import { useWindowScroll } from '@vueuse/core'
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const navigationItems = computed(() => {
  return navigation?.value[0]?.children || []
})

const { y } = useWindowScroll()
const showStickyHeader = computed(() => y.value > 140)

const feedbackCookie = useCookie('feedbackBannerDismissed', {
  maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
  sameSite: 'lax'
})

const route = useRoute()

function setFeedbackCookie() {
  feedbackCookie.value = 'set'
}
</script>

<template>
  <div class="py-16">
    <div class="fixed right-0 bottom-0 z-50 m-4">
      <FeedbackBanner
        :visible="false"
        @set-feedback-cookie="setFeedbackCookie"
      />
    </div>

    <!-- Sticky Header -->
    <!-- <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="-translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="-translate-y-full"
    >
      <div
        v-if="showStickyHeader"
        class="fixed top-0 left-0 right-0 z-100 hidden px-4 lg:block border-b border-default shadow-xs bg-default/50 backdrop-blur-md"
      >
        <LayoutTopBar class="py-0" />
      </div>
    </Transition> -->

    <div class="fixed top-0 z-50 w-full px-4">
      <LayoutTopBar class="mt-6 transition-all delay-200" />
    </div>

    <UContainer>
      <UPage>
        <template
          v-if="route.path !== '/docs'"
          #left
        >
          <UPageAside>
            <UContentNavigation
              highlight
              :navigation="navigationItems"
            />
          </UPageAside>
        </template>
        <slot />
      </UPage>
    </UContainer>
  </div>
</template>
