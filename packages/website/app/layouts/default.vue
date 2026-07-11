<script lang="ts" setup>
import { useWindowScroll } from '@vueuse/core'
import { useFaqs } from '@/composables/useFaqs'

const { getAllLicense } = usePayments()

const colorMode = useColorMode()

const route = useRoute()

const { y } = useWindowScroll()
const showStickyHeader = computed(() => y.value > 140)

const { data: licenseResponse } = useFetch<{ hasAllAccess: boolean }>('/api/payments/has-license', {
  lazy: true,
  server: false
})
const hasAllAccess = computed(() => licenseResponse.value?.hasAllAccess || false)

provide('hasAllAccess', hasAllAccess)

if (route.query.start === 'cart') {
  getAllLicense()
}

// const bannerVisible = ref(!!route.query.banner)
const bannerVisible = ref(false)
const blackFridayVisible = ref(false)

if (import.meta.client && (route.query.banner || route.query.start)) {
  const { banner, start, ...rest } = route.query
  const url = `${route.path}${Object.keys(rest).length ? '?' + new URLSearchParams(rest as Record<string, string>).toString() : ''}${route.hash || ''}`
  window.history.replaceState({}, '', url)
}

const feedbackCookie = useCookie('feedbackBannerDismissed', {
  maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
  sameSite: 'lax'
})

onMounted(() => {
  // if (!feedbackCookie.value) {
  //   setTimeout(() => {
  //     feedbackFormVisible.value = true
  //   }, 10000)
  // }
})

provide('bannerVisible', bannerVisible)
provide('blackFridayVisible', blackFridayVisible)
const defaultFaviconLightPNG = '/favicons/favicon-light-96x96.png'
const defaultFaviconDarkPNG = '/favicons/favicon-96x96.png'
const defaultFaviconLightICO = '/favicons/favicon-light.ico'
const defaultFaviconDarkICO = '/favicons/favicon.ico'
const appleTouchIconLight = '/favicons/apple-touch-icon-light-mode.png'
const appleTouchIconDark = '/favicons/apple-touch-icon.png'

const dynamicFaviconPNG = computed(() => {
  return colorMode.value === 'dark'
    ? defaultFaviconDarkPNG
    : defaultFaviconLightPNG
})

const dynamicFaviconICO = computed(() => {
  return colorMode.value === 'dark'
    ? defaultFaviconDarkICO
    : defaultFaviconLightICO
})

const dynamicAppleTouchIcon = computed(() => {
  return colorMode.value === 'dark' ? appleTouchIconDark : appleTouchIconLight
})

// Keep the static favicon links for broader support and defaults
useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '96x96',
      href: dynamicFaviconPNG
    },
    { rel: 'shortcut icon', href: dynamicFaviconICO },
    // ADDING THE DEFAULT FAVICON.ICO HERE
    { rel: 'icon', href: dynamicFaviconICO },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: dynamicAppleTouchIcon
    }
  ]
})

function hideDiscountBanner() {
  bannerVisible.value = false
}

const faqs = useFaqs()

function toggleFaq(id: number) {
  const faq = faqs.value.find(
    (f: { id: number, isOpen: boolean }) => f.id === id
  )
  if (faq) {
    faq.isOpen = !faq.isOpen
  }
}

const displayCopyright = computed(() => {
  const currentYear = new Date().getFullYear()
  return `Made with 💚 ~ ©&nbsp;${currentYear}&nbsp;Dennis Adriaansen, Inc. All rights reserved.`
})

function setFeedbackCookie() {
  feedbackCookie.value = 'set'
}
</script>

<template>
  <div class="wrapper relative pb-272.5 lg:pb-101.25">
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />

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
        class="fixed top-0 left-0 right-0 z-100 hidden px-4 lg:block border-b-2 border-default shadow-xs bg-default/50 backdrop-blur-md"
      >
        <LayoutTopBar class="py-0 max-w-6xl" />
      </div>
    </Transition> -->

    <div class="fixed right-0 bottom-0 z-50 m-4">
      <FeedbackBanner
        :visible="false"
        @set-feedback-cookie="setFeedbackCookie"
      />
    </div>

    <DiscountBanner
      class="z-50"
      :visible="bannerVisible"
      @close="hideDiscountBanner"
    />

    <div
      class="top-0 z-50 w-full"
      :class="route.path === '/pricing' ? 'absolute' : 'fixed'"
    >
      <LayoutTopBar
        :class="bannerVisible ? 'mt-12' : ''"
        class="transition-all delay-200"
      />
    </div>

    <!-- style="
      background-image: url('/images/bg-tile.png');
      background-position:0 0, 25% 0;
      background-repeat: repeat, repeat;
      background-size: 70px;
    " -->

    <div>
      <slot />
    </div>

    <!-- FAQ Section -->
    <section
      v-if="route.path !== '/payments'"
      class="mx-auto max-w-2xl px-4 py-24 lg:pb-32"
    >
      <div class="mb-12 text-center">
        <h2 class="text-default mb-4 text-3xl font-bold">
          Frequently Asked Questions
        </h2>
        <p class="text-muted dark:text-dimmed text-lg">
          Everything you need to know about our templates
        </p>
      </div>

      <UCard
        id="faq"
        class="lg:px-2"
        variant="subtle"
      >
        <div class="w-full">
          <div
            v-for="(faq, index) in faqs"
            :key="faq.id"
            :class="[
              'cursor-pointer py-4',
              index < faqs.length - 1 ? 'border-default border-b' : ''
            ]"
            @click="toggleFaq(faq.id)"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-default pr-4 text-base font-medium sm:text-lg">
                {{ faq.question }}
              </h3>
              <UIcon
                name="i-lucide-chevron-down"
                :class="[
                  'text-muted h-5 w-5 flex-shrink-0 transition-transform duration-200 ease-in-out',
                  faq.isOpen ? 'rotate-180' : 'rotate-0'
                ]"
              />
            </div>
            <Transition
              enter-active-class="transition-all duration-300 ease-in-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-96"
              leave-active-class="transition-all duration-300 ease-in-out"
              leave-from-class="opacity-100 max-h-96"
              leave-to-class="opacity-0 max-h-0"
            >
              <div
                v-if="faq.isOpen"
                class="overflow-hidden"
              >
                <div class="text-muted mt-3 text-sm leading-relaxed">
                  {{ faq.answer }}
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </UCard>
    </section>

    <div
      class="pointer-events-none relative -mb-16 flex select-none justify-center overflow-hidden lg:-mb-16"
    >
      <span class="text-[16vw] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-(--ui-text)/10 to-transparent select-none whitespace-nowrap">
        Nuxt Charts
      </span>
    </div>

    <footer
      class="border-default absolute right-0 bottom-0 left-0 z-50 w-full border-t bg-elevated/50 dark:bg-elevated/20"
    >
      <div class="mx-auto max-w-6xl px-8 py-12">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <!-- Charts Column -->
          <div>
            <h3
              class="text-default mb-4 text-sm font-semibold tracking-wider uppercase"
            >
              Charts
            </h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink
                  to="/docs/charts/area-chart"
                  class="text-muted hover:text-default text-sm"
                >Area Charts</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/docs/charts/bar-chart"
                  class="text-muted hover:text-default text-sm"
                >Bar Charts</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/docs/charts/line-chart"
                  class="text-muted hover:text-default text-sm"
                >Line Charts</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/docs/charts/donut-chart"
                  class="text-muted hover:text-default text-sm"
                >Donut Charts</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/docs/components/status-tracker"
                  class="text-muted hover:text-default text-sm"
                >Tracker</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/charts"
                  class="text-muted hover:text-default text-sm"
                >All Charts</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Components Column -->
          <div>
            <h3
              class="text-default mb-4 text-sm font-semibold tracking-wider uppercase"
            >
              Components
            </h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink
                  to="/blocks"
                  class="text-muted hover:text-default text-sm"
                >Blocks</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="https://nuxt-dashboard-demo.nuxt.dev"
                  target="_blank"
                  class="text-muted hover:text-default text-sm"
                >Dashboard Demo</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/storybook"
                  class="text-muted hover:text-default text-sm"
                >Playground</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Templates & Docs Column -->
          <div>
            <h3
              class="text-default mb-4 text-sm font-semibold tracking-wider uppercase"
            >
              Templates & Docs
            </h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink
                  to="/templates"
                  class="text-muted hover:text-default text-sm"
                >Nuxt Templates</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/vue-charts"
                  class="text-muted hover:text-default text-sm"
                >Vue charts</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/angular-charts"
                  class="text-muted hover:text-default text-sm"
                >Angular Charts</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/laravel-charts"
                  class="text-muted hover:text-default text-sm"
                >Laravel Charts</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/templates/nuxt-dashboard"
                  class="text-muted hover:text-default text-sm"
                >Nuxt Dashboard</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/docs/getting-started/installation"
                  class="text-muted hover:text-default text-sm"
                >Documentation</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/theme-editor"
                  class="text-muted hover:text-default text-sm"
                >Theme Editor</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Company & Social Column -->
          <div>
            <h3
              class="text-default mb-4 text-sm font-semibold tracking-wider uppercase"
            >
              Connect
            </h3>
            <ul class="space-y-2">
              <li>
                <a
                  href="https://github.com/dennisadriaans/vue-chrts"
                  target="_blank"
                  class="text-muted hover:text-default text-sm"
                >GitHub</a>
              </li>
              <li>
                <a
                  href="https://x.com/DennisAdriaans"
                  target="_blank"
                  class="text-muted hover:text-default text-sm"
                >X (Twitter)</a>
              </li>
              <li>
                <NuxtLink
                  to="/login"
                  class="text-muted hover:text-default text-sm"
                >Login</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="mailto:dennis@nuxtcharts.com"
                  class="text-muted hover:text-default text-sm"
                >Email Support</NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/buy/all-access"
                  external
                  target="_blank"
                  class="text-muted hover:text-default text-left text-sm"
                >
                  Get All-Access
                </NuxtLink>
              </li>
              <li>
                <a
                  class="text-muted hover:text-default text-left text-sm"
                  href="/account?tab=affiliate"
                >Affiliate Program</a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Section -->
        <div class="border-default mt-8 border-t pt-8">
          <div
            class="flex flex-col items-center justify-between gap-4 md:flex-row"
          >
            <div class="flex items-center gap-4">
              <Logo />
            </div>

            <div class="flex items-center gap-4">
              <a
                href="https://x.com/DennisAdriaans"
                target="_blank"
                class="text-muted hover:text-default"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 30 30"
                  width="20px"
                  height="20px"
                >
                  <path
                    fill="currentColor"
                    d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"
                  />
                </svg>
              </a>

              <a
                href="https://github.com/dennisadriaans/vue-chrts"
                target="_blank"
                class="text-muted hover:text-default flex items-center"
              >
                <UIcon
                  name="i-simple-icons:github"
                  class="h-5 w-5"
                />
              </a>
            </div>

            <div
              class="text-muted text-sm"
              v-html="displayCopyright"
            />
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
