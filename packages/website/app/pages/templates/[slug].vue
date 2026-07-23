<script lang="ts" setup>
const route = useRoute()
const slug = route.params.slug as string

// Query the product from Nuxt Content by slug
const { data: product } = await useAsyncData(slug, () =>
  queryCollection('products').path(`/products/${slug}`).first()
)

const templateMeta = computed(() => (product.value?.meta as any)?.templateMeta || {})

if (!product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Template not found'
  })
}

useSeoMeta({
  title: product.value.meta.seoData.title,
  description: product.value.meta.hero.subheading,
  ogTitle: `${product.value.meta.hero.heading} `,
  ogDescription: product.value.meta.hero.subheading,
  ogImage: product.value.meta.seoData.ogImageUrl,
  ogImageType: product.value.meta.seoData.ogImageType,
  ogImageWidth: product.value.meta.seoData.ogImageWidth,
  ogImageHeight: product.value.meta.seoData.ogImageHeight,
  twitterCard: product.value.meta.seoData.twitterCard || 'summary_large_image',
  twitterTitle: product.value.meta.seoData.twitterTitle || product.value.meta.seoData.title,
  twitterDescription: product.value.meta.seoData.twitterDescription || product.value.meta.seoData.description,
  twitterImage: product.value.meta.seoData.twitterImage,
  twitterImageAlt: product.value.meta.seoData.twitterImageAlt,
  twitterCreator: product.value.meta.seoData.twitterCreator
})

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
  const scheme = product.value?.meta.colorScheme || 'green'

  if (scheme === 'blue') {
    return 'bg-gradient-to-br from-blue-200/20 via-sky-100/15 to-cyan-200/20 blur-3xl dark:from-blue-900/20 dark:via-sky-800/15 dark:to-cyan-900/20'
  }

  if (scheme === 'red') {
    return 'bg-gradient-to-br from-red-200/30 via-rose-100/20 to-pink-200/10 blur-3xl dark:from-red-900/5 dark:via-rose-800/5 dark:to-pink-900/5'
  }

  if (scheme === 'yellow') {
    return 'bg-gradient-to-br from-yellow-200/30 via-amber-100/20 to-orange-200/10 blur-3xl dark:from-yellow-900/5 dark:via-amber-800/5 dark:to-orange-900/5'
  }

  return 'bg-gradient-to-br from-green-200/40 via-emerald-100/15 to-teal-200/20 blur-3xl dark:from-green-900/40 dark:via-emerald-800/15 dark:to-teal-900/40'
})

const sliderRef = ref<HTMLElement | null>(null)

const navigateToImages = function () {
  // scroll to sliderRef with offset top 250px
  const slider = sliderRef.value
  if (!slider) return
  const yOffset = -250
  const y = slider.getBoundingClientRect().top + window.pageYOffset + yOffset
  window.scrollTo({ top: y, behavior: 'smooth' })
}

const { purchaseDashboard } = usePayments()

async function handlePurchaseDashboard(e: Event) {
  await purchaseDashboard(product.value.meta.priceKey, e)
}

const showStickyBuyButton = ref(false)
const heroRef = ref<HTMLElement | null>(null)

onMounted(() => {
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
  })
})
const dashboardImages = computed<DashboardImage[]>(
  () => (product.value?.meta.dashboardImages as DashboardImage[]) || []
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
    (entries) => {
      const entry = entries[0]
      if (entry) {
        showStickyBuyButton.value = !entry.isIntersecting
      }
    },
    { threshold: 0 }
  )

  if (heroRef.value) {
    observer.observe(heroRef.value)
  }

  onBeforeUnmount(() => {
    observer.disconnect()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="overflow-hidden">
    <!-- Sticky Buy Button -->
    <Transition name="fade">
      <div
        v-if="showStickyBuyButton"
        class="fixed right-0 bottom-0 left-0 z-50 border-b border-default bg-(--ui-bg)/80 backdrop-blur-md"
      >
        <div
          class="mx-auto flex flex-col lg:flex-row gap-6 lg:gap-0 max-w-7xl items-center justify-between px-4 py-6"
        >
          <div class="flex  items-center gap-3">
            <h3 class="text-lg font-semibold text-highlighted">
              {{ product?.heading }}
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
              :to="product?.meta?.hero?.demoCta.href"
              target="_blank"
            >
              <UButton
                color="neutral"
                size="lg"
                class="font-bold"
                variant="soft"
                trailing-icon="i-lucide-external-link"
              >
                {{ product?.meta?.hero?.demoCta.label }}
              </UButton>
            </NuxtLink>

            <UButton
              color="primary"
              size="lg"
              class="font-bold"
              trailing-icon="i-lucide-arrow-right"
              @click="handlePurchaseDashboard"
            >
              {{ product?.meta.hero.cta.label }}
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
        <div
          class="flex flex-col items-center justify-center text-center lg:text-center"
        >
          <h1
            class="text-highlighted mx-auto max-w-3xl text-3xl font-bold tracking-tight text-pretty lg:text-7xl text-balance"
          >
            {{ product.meta.hero.heading }}
          </h1>
          <p class="text-muted px-8 lg:px-0 mx-auto mt-3 lg:mt-6 max-w-3xl text-pretty lg:text-xl">
            {{ product.meta.hero.subheading }}
          </p>
        </div>

        <!-- Social Proof -->
        <div
          class="flex w-full flex-col justify-start gap-4 sm:flex-row sm:items-center lg:w-auto"
        >
          <UButton
            :disabled="product.meta.hero.cta.disabled"
            size="xl"
            class="ring-primary-500/20 hover:bg-primary flex w-full items-center justify-center pr-5 pl-4 font-semibold ring-4 transition duration-400 ease-in-out"
            @click="handlePurchaseDashboard"
          >
            <template #leading>
              <UIcon :name="product.meta.hero.cta.icon" />
            </template>
            <span>{{ product.meta.hero.cta.label }}</span>
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

        <div
          class="text-muted flex items-center justify-center gap-8 text-sm lg:justify-start"
        >
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

      <div class="relative mx-auto mt-8 w-full max-w-6xl ">
        <div
          class="animate-pulse-slow absolute inset-0 -z-10 mx-auto -mt-24 h-75 max-w-xl scale-150 transform rounded-full "
          :class="gradientClasses"
        />

        <div class="bg-default/20 border-2 border-default overflow-hidden rounded-xl dark:p-2">
          <UColorModeImage
            :light="product?.image.light"
            :dark="product?.image.dark"
            class="w-full cursor-pointer rounded-lg"
            @click="navigateToImages"
          />
        </div>
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

    <div class="hidden grid grid-cols-1 gap-12 lg:grid-cols-4 max-w-5xl mx-auto my-32">
      <!-- Main Content -->
      <div class="lg:col-span-3">
        <!-- Description -->
        <section class="mb-10">
          <p class="text-lg leading-relaxed text-(--ui-text-muted)">
            {{ product?.meta.hero.subheading }}
          </p>
        </section>

        <!-- About This Template -->
        <section class="mb-10">
          <h2 class="mb-4 text-xl font-semibold text-(--ui-text-highlighted)">
            About this Template
          </h2>
          <div class="prose prose-invert max-w-none text-(--ui-text-muted)">
            <p
              v-for="(paragraph, idx) in (product?.meta.aboutTemplate || '').split('\n\n')"
              :key="idx"
              class="mb-4 leading-relaxed"
            >
              {{ paragraph }}
            </p>
          </div>
        </section>

        <!-- Features List -->
        <section class="mb-10">
          <h2 class="mb-4 text-xl font-semibold text-highlighted">
            Features
          </h2>
          <ul class="space-y-2">
            <li
              v-for="(feature, idx) in templateMeta.featuresList"
              :key="idx"
              class="flex items-center gap-3 text-(--ui-text-muted)"
            >
              <UIcon
                name="i-lucide-check"
                class="h-4 w-4 shrink-0 text-(--ui-primary)"
              />
              <span>{{ feature }}</span>
            </li>
          </ul>
        </section>
      </div>

      <!-- Sidebar -->
      <section class="max-w 4xl mx-auto">
        <aside class="lg:col-span-1">
          <div class="sticky top-24 space-y-8">
            <!-- Details -->
            <div>
              <h3 class="mb-4 font-semibold text-default">
                Details
              </h3>
              <ul class="space-y-3 text-sm text-muted">
                <li class="flex items-center gap-3">
                  <UAvatar
                    :src="templateMeta.creator?.avatar || '/images/avatars/nuxtcharts.png'"
                    :alt="templateMeta.creator?.name"
                    size="2xs"
                  />
                  <span>{{ templateMeta.creator?.name || 'Nuxt Charts' }}</span>
                </li>
                <li class="flex items-center gap-3">
                  <UIcon
                    name="i-lucide-calendar"
                    class="h-4 w-4"
                  />
                  <span>Updated {{ templateMeta.lastUpdated || 'recently' }}</span>
                </li>
                <li class="flex items-center gap-3">
                  <UIcon
                    name="i-lucide-eye"
                    class="h-4 w-4"
                  />
                  <span>{{ templateMeta?.views || '21.2K' }} views</span>
                </li>
              </ul>
            </div>

            <!-- Categories -->
            <div>
              <h3 class="mb-4 font-semibold text-(--ui-text)">
                Categories
              </h3>
              <ul class="space-y-3 text-sm text-(--ui-text-muted)">
                <li class="flex items-center gap-3">
                  <UIcon
                    name="i-lucide-layout-dashboard"
                    class="h-4 w-4"
                  />
                  <span>{{ templateMeta.category || 'Dashboard' }}</span>
                </li>
                <li
                  v-for="tech in templateMeta.builtWith"
                  :key="tech"
                  class="flex items-center gap-3"
                >
                  <UIcon
                    name="i-lucide-tag"
                    class="h-4 w-4"
                  />
                  <span>{{ tech }}</span>
                </li>
              </ul>
            </div>

            <!-- Pages -->
            <div>
              <h3 class="mb-4 font-semibold text-(--ui-text)">
                Pages
              </h3>
              <ul class="space-y-3 text-sm text-(--ui-text-muted)">
                <li class="flex items-center gap-3">
                  <UIcon
                    name="i-lucide-file"
                    class="h-4 w-4"
                  />
                  <span>{{ templateMeta.pages || '20+' }} Pages</span>
                </li>
              </ul>
            </div>

            <!-- Support -->
            <div>
              <h3 class="mb-4 font-semibold text-(--ui-text)">
                Support
              </h3>
              <ul class="space-y-3 text-sm text-(--ui-text-muted)">
                <li class="flex items-center gap-3">
                  <UIcon
                    name="i-lucide-help-circle"
                    class="h-4 w-4"
                  />
                  <NuxtLink
                    to="#faq"
                    class="hover:text-(--ui-primary)"
                  >
                    About Templates
                  </NuxtLink>
                </li>
                <li class="flex items-center gap-3">
                  <UIcon
                    name="i-lucide-rotate-ccw"
                    class="h-4 w-4"
                  />
                  <NuxtLink
                    to="#faq"
                    class="hover:text-(--ui-primary)"
                  >
                    Refund Policy
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </section>
    </div>

    <UPageSection
      :title="product?.features.title"
      :description="product?.features.description"
      :headline="product?.features.headline"
      class="bg-elevated/40 mx-auto max-w-screen-2xl rounded-4xl"
    >
      <UPageGrid>
        <UPageCard
          v-for="(item, index) in product?.features.items"
          :key="index"
          v-bind="item"
          spotlight
        />
      </UPageGrid>
    </UPageSection>

    <!-- <UPageSection
      headline="Perfect for any SaaS"
      title="Core Features for Dashboards"
      description="Transform raw data into actionable insights. Built with essential dashboard components that drive decisions and engagement."
      :ui="{ container: 'px-0 sm:px-0 lg:px-0' }"
    >
      <UPageSection
        v-for="(section, index) in product?.sections"
        :key="index"
        :title="section.title"
        :headline="section.headline"
        :description="section.description"
        :orientation="section.orientation"
        :reverse="section.reverse"
        :features="section.features"
        :ui="{
          container: 'py-0 sm:py-0 lg:py-16',
          title: 'lg:text-3xl',
        }"
      >
        <img src="/images/dashboard/screenshots/0.png" alt="" />
      </UPageSection>

      <UPageSection
        v-for="(section, index) in product?.sections"
        :key="index"
        :title="section.title"
        :headline="section.headline"
        :description="section.description"
        :orientation="section.orientation"
        :reverse="section.reverse"
        :features="section.features"
        :ui="{
          container: 'py-0 sm:py-0 lg:py-16',
          title: 'lg:text-3xl',
        }"
      >
        <img src="/images/dashboard/screenshots/0.png" alt="" />
      </UPageSection>
    </UPageSection> -->

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
      :title="(product?.meta as any)?.galleryTitle"
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
            class="bg-muted overflow-hidden rounded-xl dark:p-2"
            :class="
              product?.colorScheme === 'blue'
                ? 'bg-muted dark:bg-sky-500/10'
                : product?.colorScheme === 'red'
                  ? 'bg-elevated'
                  : 'bg-elevated'
            "
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
            <div
              class="relative flex w-full flex-col items-center p-4 2xl:p-80 z-50 "
            >
              <UButton
                icon="i-lucide-x"
                size="xl"
                color="neutral"
                variant="soft"
                class="fixed top-18 right-4 z-50"
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

    <section class="my-16 hidden py-16">
      <div class="mb-12 text-center">
        <h2 class="mb-4 text-3xl font-bold text-(--ui-text-highlighted)">
          What's Included
        </h2>
        <p class="text-dimmed mx-auto max-w-3xl text-xl">
          Everything you need to build a professional dashboard.
        </p>
      </div>

      <div class="mx-auto max-w-7xl px-4">
        <!-- 3 columns grid feature section here -->
        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div
            v-for="(feature, featuresKey) in (product as any)?.features"
            :key="featuresKey"
            :class="[
              'border-default bg-default group rounded-2xl border p-8 shadow-sm transition-all duration-500 ease-out',
              featuresKey === activeFeatureIndex
                ? 'hover:shadow-primary/5 hover:border-primary/20 shadow-primary/5 border-primary/20 -translate-y-1 shadow-xl hover:-translate-y-1 hover:shadow-xl'
                : 'hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1 hover:shadow-xl'
            ]"
            @mouseenter="activeFeatureIndex = featuresKey"
          >
            <div
              :class="[
                'bg-elevated text-default border-default mb-4 flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300',
                featuresKey === activeFeatureIndex
                  ? 'bg-primary/10 border-primary/30 scale-110'
                  : 'group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:scale-110'
              ]"
            >
              <UIcon
                :name="feature.icon"
                :class="[
                  'h-6 w-6 transition-all duration-300',
                  featuresKey === activeFeatureIndex
                    ? 'text-primary scale-110'
                    : 'group-hover:text-primary group-hover:scale-110'
                ]"
              />
            </div>
            <h3
              :class="[
                'text-default mb-2 text-xl font-semibold transition-colors duration-300',
                featuresKey === activeFeatureIndex
                  ? 'text-primary'
                  : 'group-hover:text-primary'
              ]"
            >
              {{ feature.title }}
            </h3>
            <p
              :class="[
                'text-dimmed transition-colors duration-300',
                featuresKey === activeFeatureIndex
                  ? 'text-default'
                  : 'group-hover:text-default'
              ]"
            >
              {{ feature.text }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <PurchaseNotification :class="showStickyBuyButton ? 'mb-32' : 'mb-8'" />

    <section
      class="bg-elevated/40 border-default mx-auto max-w-screen-2xl rounded-4xl border-y py-24 lg:py-32"
    >
      <div class="mx-auto max-w-4xl px-4 text-center">
        <h2 class="text-highlighted mb-6 text-4xl font-semibold lg:text-5xl">
          Ready to build amazing dashboards?
        </h2>
        <p class="text-muted mx-auto mb-12 max-w-2xl text-lg lg:text-xl">
          Start creating beautiful, data-driven applications with
          production-ready templates and beautifully designed chart library.
        </p>

        <div
          class="flex flex-col items-center justify-center gap-4 lg:flex-row"
        >
          <NuxtLink to="/pricing">
            <UButton
              color="primary"
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
