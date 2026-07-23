<script lang="ts" setup>
/**
 * Type definitions for the Product structure coming from Nuxt Content
 */
export interface Product {
  slug: string
  priceKey: string
  colorScheme: 'blue' | 'red' | 'yellow' | 'green' | 'gray' | 'zinc'
  hero: {
    heading: string
    subheading: string
    cta: {
      label: string
      icon: string
      disabled: boolean
    }
    demoCta: {
      label: string
      href: string
    }
    badges?: string[]
  }
  banner: {
    light: string
    dark: string
  }
  dashboardImages: Array<{
    light: string
    dark: string
    alt: string
    description?: string
  }>
  features: {
    title: string
    description: string
    headline: string
    items: Array<{
      title: string
      description: string
      icon: string
    }>
  }
  galleryTitle?: string
}

const props = defineProps<{
  product: Product
}>()

type DashboardImage = {
  alt: string
  light: string
  dark: string
  description?: string
}

const zoomedImageIndex = ref<number | null>(null)
const colorMode = useColorMode()
colorMode.preference = 'dark'

function closeZoomedImage() {
  zoomedImageIndex.value = null
}

const activeFeatureIndex = ref(0)

const gradientClasses = computed(() => {
  // Default to green if colorScheme is missing or invalid
  const scheme = props.product.colorScheme || 'green'

  switch (scheme) {
    case 'blue':
      return 'bg-gradient-to-br from-blue-200/20 via-sky-100/15 to-cyan-200/20 blur-3xl dark:from-blue-900/20 dark:via-sky-800/15 dark:to-cyan-900/20'
    case 'red':
      return 'bg-gradient-to-br from-red-200/30 via-rose-100/20 to-pink-200/10 blur-3xl dark:from-red-900/5 dark:via-rose-800/5 dark:to-pink-900/5'
    case 'yellow':
      return 'bg-gradient-to-br from-yellow-200/30 via-amber-100/20 to-orange-200/10 blur-3xl dark:from-yellow-900/5 dark:via-amber-800/5 dark:to-orange-900/5'
    case 'gray':
      return 'bg-gradient-to-br from-gray-200/30 via-stone-100/20 to-neutral-200/10 blur-3xl dark:from-gray-900/5 dark:via-stone-800/5 dark:to-neutral-900/5'
    case 'zinc':
      return 'bg-gradient-to-br from-zinc-200/20 via-neutral-100/10 to-stone-200/5 blur-3xl dark:from-zinc-900/20 dark:via-black dark:to-zinc-950'
    case 'green':
    default:
      return 'bg-gradient-to-br from-green-200/40 via-emerald-100/15 to-teal-200/20 blur-3xl dark:from-green-900/40 dark:via-emerald-800/15 dark:to-teal-900/40'
  }
})

const sliderRef = ref<HTMLElement | null>(null)

const navigateToImages = function () {
  const slider = sliderRef.value
  if (!slider) return
  const yOffset = -250
  const y = slider.getBoundingClientRect().top + window.pageYOffset + yOffset
  window.scrollTo({ top: y, behavior: 'smooth' })
}

const { purchaseDashboard } = usePayments()

async function handlePurchaseDashboard(e: Event) {
  if (props.product.priceKey) {
    await purchaseDashboard(props.product.priceKey, e)
  }
}

const showStickyBuyButton = ref(false)
const heroRef = ref<HTMLElement | null>(null)

const dashboardImages = computed<DashboardImage[]>(
  () => (props.product.dashboardImages as DashboardImage[]) || []
)

function showNext() {
  const count = dashboardImages.value.length
  if (!count) return
  if (zoomedImageIndex.value === null) {
    zoomedImageIndex.value = 0
    return
  }
  zoomedImageIndex.value = (zoomedImageIndex.value + 1) % count
}

function showPrev() {
  const count = dashboardImages.value.length
  if (!count) return
  if (zoomedImageIndex.value === null) {
    zoomedImageIndex.value = 0
    return
  }
  zoomedImageIndex.value = (zoomedImageIndex.value - 1 + count) % count
}

function onKeydown(e: KeyboardEvent) {
  if (zoomedImageIndex.value === null) return
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    showNext()
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    showPrev()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    closeZoomedImage()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)

  const observer = new IntersectionObserver(
    ([entry]) => {
      showStickyBuyButton.value = !entry.isIntersecting
    },
    { threshold: 0 }
  )

  if (heroRef.value) {
    observer.observe(heroRef.value)
  }

  onBeforeUnmount(() => {
    observer.disconnect()
    window.removeEventListener('keydown', onKeydown)
  })
})
</script>

<template>
  <div class="overflow-hidden">
    <!-- Sticky Buy Button -->
    <Transition name="fade">
      <div
        v-if="showStickyBuyButton"
        class="fixed right-0 bottom-0 left-0 z-50 border-b border-(--ui-border) bg-(--ui-bg)/80 backdrop-blur-md"
      >
        <div
          class="mx-auto flex flex-col lg:flex-row gap-6 lg:gap-0 max-w-7xl items-center justify-between px-4 py-6"
        >
          <div class="flex items-center gap-3">
            <h3 class="text-lg font-semibold text-(--ui-text-highlighted)">
              {{ product.hero.heading }}
            </h3>
            <UBadge
              color="primary"
              variant="soft"
            >
              Save $50
            </UBadge>
          </div>
          <div class="flex items-center gap-4">
            <NuxtLink
              v-if="product.hero.demoCta"
              :to="product.hero.demoCta.href"
              target="_blank"
            >
              <UButton
                color="neutral"
                size="lg"
                class="font-bold"
                variant="soft"
                trailing-icon="i-lucide-external-link"
              >
                {{ product.hero.demoCta.label }}
              </UButton>
            </NuxtLink>

            <UButton
              color="primary"
              size="lg"
              class="font-bold"
              trailing-icon="i-lucide-arrow-right"
              @click="handlePurchaseDashboard"
            >
              {{ product.hero.cta.label }}
            </UButton>
          </div>
        </div>
      </div>
    </Transition>

    <div class="mt-42 flex flex-col gap-16 px-4">
      <div
        ref="heroRef"
        class="flex flex-col items-center justify-center space-y-8 lg:items-center"
      >
        <div class="flex items-center gap-4">
          <UBadge
            color="primary"
            variant="soft"
            size="lg"
            class="rounded-full px-3 py-1"
          >
            <UAvatarGroup
              size="3xs"
              class="mr-2"
            >
              <UAvatar
                src="https://github.com/benjamincanac.png"
                alt="Benjamin Canac"
              />
              <UAvatar
                src="https://github.com/romhml.png"
                alt="Romain Hamel"
              />
              <UAvatar
                src="https://github.com/noook.png"
                alt="Neil Richter"
              />
            </UAvatarGroup>
            <span>Trusted by 100+ Devs</span>
          </UBadge>
        </div>

        <!-- Title & Description -->
        <div class="flex flex-col items-center justify-center text-center lg:text-center">
          <h1 class="text-highlighted mx-auto max-w-3xl text-3xl font-bold tracking-tight text-pretty lg:text-7xl text-balance">
            {{ product.hero.heading }}
          </h1>
          <p class="text-muted px-8 lg:px-0 mx-auto mt-3 lg:mt-6 max-w-3xl text-pretty lg:text-xl">
            {{ product.hero.subheading }}
          </p>
        </div>

        <!-- Social Proof -->
        <div class="flex w-full flex-col justify-start gap-4 sm:flex-row sm:items-center lg:w-auto">
          <UButton
            :disabled="product.hero.cta.disabled"
            size="xl"
            class="ring-primary-500/20 hover:bg-primary flex w-full items-center justify-center pr-5 pl-4 font-semibold ring-4 transition duration-400 ease-in-out"
            @click="handlePurchaseDashboard"
          >
            <template #leading>
              <UIcon :name="product.hero.cta.icon" />
            </template>
            <span>{{ product.hero.cta.label }}</span>
          </UButton>

          <UButton
            color="neutral"
            variant="soft"
            size="xl"
            class="flex items-center justify-center"
            @click="handlePurchaseDashboard"
          >
            <template #leading>
              <UIcon
                name="i-lucide-zap"
                class="h-5 w-5 text-yellow-500"
              />
            </template>
            <div class="text-sm">
              <div class="text-muted">
                Save $50 now
              </div>
            </div>
          </UButton>
        </div>

        <div class="text-muted flex items-center justify-center gap-8 text-sm lg:justify-start">
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-download"
              class="text-primary h-4 w-4"
            />
            <span>100+ Downloads</span>
          </div>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-star"
              class="text-primary h-4 w-4"
            />
            <span>4.9/5 Rating</span>
          </div>
          <div class="hidden items-center gap-2 lg:flex">
            <UIcon
              name="i-lucide-refresh-cw"
              class="text-primary h-4 w-4"
            />
            <span>Regular Updates</span>
          </div>
        </div>
      </div>

      <div class="relative mx-auto mt-8 w-full max-w-6xl">
        <div
          class="animate-pulse-slow absolute inset-0 -z-10 mx-auto -mt-24 h-[300px] max-w-xl scale-150 transform rounded-full"
          :class="gradientClasses"
        />
        <UColorModeImage
          :light="product.banner.light"
          :dark="product.banner.dark"
          class="w-full cursor-pointer"
          @click="navigateToImages"
        />
      </div>
    </div>

    <UPageLogos
      marquee
      title="Top-tier projects as foundation"
      class="mx-auto mt-16 mb-24 max-w-2xl"
      :items="[
        'i-simple-icons-tailwindcss',
        'i-simple-icons-nuxt',
        'i-simple-icons-typescript',
        'i-simple-icons-unjs',
        'i-simple-icons-sqlite',
        'i-simple-icons-prettier'
      ]"
    />

    <UPageSection
      :title="product.features.title"
      :description="product.features.description"
      :headline="product.features.headline"
      class="bg-elevated/40 mx-auto max-w-screen-2xl rounded-4xl"
    >
      <UPageGrid>
        <UPageCard
          v-for="(item, index) in product.features.items"
          :key="index"
          v-bind="item"
          spotlight
        />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      headline="Don't Just Take My Word For It..."
      title="See What the Others Are Saying"
      description="Join Successful Nuxt developers who have chosen Nuxt Charts"
      class="py-8"
    >
      <TestimonialsGrid />
    </UPageSection>

    <div class="bg-elevated/40 mx-auto max-w-screen-2xl rounded-4xl px-0 py-24">
      <UMarquee
        pause-on-hover
        :overlay="false"
        :ui="{
          root: '![--duration:420s] [--gap:--spacing(6)]',
          content: 'w-auto py-1'
        }"
      >
        <UColorModeImage
          v-for="(img, idx) in dashboardImages"
          :key="idx"
          :light="img.light"
          :dark="img.dark"
          :height="400"
          class="rounded-2xl border-8 border-(--ui-bg) h-[400px]"
          @click="zoomedImageIndex = idx"
        />
      </UMarquee>
    </div>

    <UPageSection
      id="gallery"
      :title="product.galleryTitle"
    >
      <div class="relative mx-auto max-w-7xl px-4">
        <div
          ref="sliderRef"
          class="mx-auto grid grid-cols-1 gap-8 lg:grid-cols-2"
        >
          <UCard
            v-for="(img, idx) in dashboardImages"
            :key="img.alt"
            :ui="{ body: 'p-0 sm:p-0' }"
            class="bg-muted overflow-hidden rounded-lg dark:p-2"
            :class="[
              product.colorScheme === 'blue' ? 'bg-muted dark:bg-sky-500/10' : '',
              product.colorScheme === 'red' ? 'bg-rose-50/50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-900/50' : '',
              product.colorScheme === 'yellow' ? 'bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-900/50' : '',
              product.colorScheme === 'green' ? 'bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-900/50' : '',
              product.colorScheme === 'gray' ? 'bg-zinc-100 dark:bg-zinc-900' : '',
              product.colorScheme === 'zinc' ? 'bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-zinc-800' : '',
              !['blue', 'red', 'yellow', 'green', 'gray', 'zinc'].includes(product.colorScheme) ? 'bg-elevated' : ''
            ]"
            @click="zoomedImageIndex = idx"
          >
            <img
              :src="img.light"
              :alt="img.alt + ' Light'"
              class="border-default block h-auto w-full rounded-lg group-hover:ring-2 group-hover:ring-(--ui-border) dark:hidden"
            >
            <img
              :src="img.dark"
              :alt="img.alt + ' Dark'"
              class="border-default hidden h-auto w-full rounded-lg group-hover:ring-2 group-hover:ring-(--ui-border) dark:block"
            >
          </UCard>
        </div>
      </div>
    </UPageSection>

    <section id="#gallery">
      <div class="relative mx-auto max-w-7xl px-4">
        <!-- Fullscreen Modal for Zoomed Image -->
        <Transition name="fade">
          <div
            v-if="zoomedImageIndex !== null"
            class="bg-default/10 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
            @click.self="closeZoomedImage"
          >
            <div class="relative flex w-full flex-col items-center p-4 2xl:p-80">
              <UButton
                icon="i-lucide-x"
                size="xl"
                color="neutral"
                variant="soft"
                class="fixed top-4 right-4 z-10"
                aria-label="Close"
                @click="closeZoomedImage"
              />
              <UButton
                icon="i-lucide-chevron-left"
                size="xl"
                color="neutral"
                variant="soft"
                class="absolute top-1/2 left-4 z-10 -translate-y-1/2"
                aria-label="Previous image"
                @click.stop="showPrev"
              />
              <UButton
                icon="i-lucide-chevron-right"
                size="xl"
                color="neutral"
                variant="soft"
                class="absolute top-1/2 right-4 z-10 -translate-y-1/2"
                aria-label="Next image"
                @click.stop="showNext"
              />
              <img
                :src="dashboardImages[zoomedImageIndex]?.light"
                :alt="dashboardImages[zoomedImageIndex]?.alt"
                class="border-default block w-full rounded-xl dark:hidden"
              >
              <img
                :src="dashboardImages[zoomedImageIndex]?.dark"
                :alt="dashboardImages[zoomedImageIndex]?.alt"
                class="border-default border-elevated hidden w-full rounded-xl border-4 dark:block"
              >
              <div
                v-if="dashboardImages[zoomedImageIndex]?.description"
                class="mt-4 text-center text-(--ui-text-dimmed)"
              >
                {{ dashboardImages[zoomedImageIndex]?.description }}
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </section>

    <PurchaseNotification :class="showStickyBuyButton ? 'mb-32' : 'mb-8'" />

    <section class="bg-elevated/40 border-default mx-auto max-w-screen-2xl rounded-4xl border-y py-24 lg:py-32">
      <div class="mx-auto max-w-4xl px-4 text-center">
        <h2 class="text-highlighted mb-6 text-4xl font-semibold lg:text-5xl">
          Ready to build amazing dashboards?
        </h2>
        <p class="text-muted mx-auto mb-12 max-w-2xl text-lg lg:text-xl">
          Start creating beautiful, data-driven applications with production-ready templates and beautifully designed chart library.
        </p>

        <div class="flex flex-col items-center justify-center gap-4 lg:flex-row">
          <NuxtLink to="/pricing">
            <UButton
              color="primary"
              size="xl"
              trailing-icon="i-lucide-arrow-right"
            >
              View Pricing
            </UButton>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
