<script lang="ts" setup>
useSeoMeta({
  title: 'Nuxt UI: 50+ Premium Blocks & Components | Nuxt Charts',
  description:
    'Discover the collection of copy-paste Nuxt building blocks to help you design and develop faster with Nuxt UI and Nuxt Charts.',
  ogTitle: 'Nuxt UI: 50+ Premium Blocks & Components | Nuxt Charts',
  ogDescription:
    'Discover the collection of copy-paste Nuxt building blocks to help you design and develop faster with Nuxt UI and Nuxt Charts.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Nuxt UI: 50+ Premium Blocks & Components | Nuxt Charts',
  twitterDescription:
    'Discover the collection of copy-paste Nuxt building blocks to help you design and develop faster with Nuxt UI and Nuxt Charts.',
  keywords:
    'premium blocks, UI components, responsive sections, web design, web development, templates, front-end, build faster, design system',
  author: 'Nuxt Charts'
})

const { data: templates } = await useAsyncData('products', () => queryCollection('products').all())

const { getAllLicense } = usePayments()

const categories = ['All', 'Dashboards', 'Landing']
const route = useRoute()
const router = useRouter()

const activeCategory = computed({
  get: () => (route.query.category as string) || 'Dashboards',
  set: (value) => {
    router.push({ query: { ...route.query, category: value } })
  }
})

const filteredTemplates = computed(() => {
  if (!templates.value) return []
  if (activeCategory.value === 'All') return templates.value

  return templates.value.filter((template) => {
    if (activeCategory.value === 'Dashboards') {
      return template.type === 'dashboard' || !template.type
    } else if (activeCategory.value === 'Landing') {
      return template.type === 'landing'
    }
    return true
  })
})
</script>

<template>
  <div class="overflow-hidden">
    <div class="relative border-default mx-auto max-w-6xl gap-4 py-32">
      <div class="absolute -inset-y-32 left-1/2 -translate-x-1/2 w-450 -z-10 pointer-events-none overflow-hidden">
        <svg
          class="w-full h-full stroke-(--ui-primary)/20 dark:stroke-(--ui-primary)/15 mask-[radial-gradient(100%_100%_at_top_left,white,transparent_75%)]"
          fill="none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="5"
            x2="45"
            y2="40"
            stroke-width="0.5"
            vector-effect="non-scaling-stroke"
          />
          <line
            x1="5"
            y1="0"
            x2="50"
            y2="35"
            stroke-width="0.5"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div class="flex w-full justify-between items-center">
        <div class="flex justify-between items-center mb-6">
          <div class="mt-8 max-w-3xl space-y-2 mx-auto">
            <h1
              class="mb-4 text-3xl lg:text-4xl font-bold tracking-tight"
            >
              Nuxt <span class="text-primary" /> Templates
            </h1>
            <p class="text-dimmed text-lg">
              Save weeks of development time with beautiful Vue charts templates for any project.
            </p>
          </div>
        </div>

        <div class="flex items-center justify-center gap-3">
          <UButton
            v-for="category in categories"
            :key="category"
            :label="category"
            color="neutral"
            variant="soft"
            active-variant="solid"
            :active="activeCategory === category"
            @click="activeCategory = category"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          v-for="(template, templateKey) in filteredTemplates"
          :key="template.id"
          class="group relative"
        >
          <NuxtLink :to="template.slug">
            <!-- Template Preview -->
            <div class="relative">
              <UBadge
                v-if="template.badge"
                color="primary"
                variant="soft"
                class="absolute right-0 top-0 m-8"
              >
                {{ template.badge }}
              </UBadge>
              <div
                class="h-62.5 overflow-hidden rounded-lg p-2 lg:h-110"
                :class="
                  templateKey === 0
                    ? 'bg-primary-500/80 dark:bg-primary-500/20'
                    : templateKey === 1
                      ? 'bg-sky-500/80 dark:bg-sky-500/20'
                      : templateKey === 2
                        ? 'bg-red-500/80 dark:bg-red-500/20'
                        : 'bg-yellow-500/80 dark:bg-yellow-500/20'
                "
              >
                <img
                  :src="template.image?.light"
                  :alt="template.alt + ' Light'"
                  class="block h-full w-full rounded object-cover object-top transition-transform duration-300 group-hover:scale-105 dark:hidden"
                >
                <!-- Dark image -->
                <img
                  :src="template.image?.dark"
                  :alt="template.alt + ' Dark'"
                  class="hidden h-full w-full rounded object-cover object-top-left shadow transition-transform duration-300 group-hover:scale-105 dark:block"
                >
              </div>
            </div>

            <!-- Template Info -->
            <div class="py-8">
              <!-- Header -->
              <div class="mb-6">
                <div class="mb-2 flex items-start justify-between">
                  <div class="w-full">
                    <div class="mb-1 flex w-full items-center justify-between">
                      <div class="flex items-center gap-4">
                        <div
                          v-if="template.logoIcon"
                          v-html="template.logoIcon"
                        />

                        <h3 class="text-default text-xl font-bold">
                          {{ template.name }}
                        </h3>

                      </div>

                      <UBadge
                        v-if="template.badge"
                        color="primary"
                        variant="soft"
                        class="mr-4"
                      >
                        {{ template.badge }}
                      </UBadge>
                    </div>
                    <p class="text-toned dark:text-muted">
                      {{ template.tagline }}
                    </p>
                  </div>
                  <div class="flex" />
                </div>
                <!-- <p class="text-toned dark:text-muted">
                    {{ template.description }}
                  </p> -->
              </div>

              <!-- Features -->
              <div class="mb-8 hidden">
                <h4 class="text-default mb-3 text-sm font-semibold">
                  Key Features
                </h4>
                <div class="grid grid-cols-2 gap-2">
                  <div
                    v-for="feature in template.features"
                    :key="feature"
                    class="text-muted flex items-center gap-2 text-sm"
                  >
                    <UIcon
                      name="i-lucide-check"
                      class="h-3 w-3 text-(--ui-primary)"
                    />
                    <span>{{ feature }}</span>
                  </div>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="mt-16 flex justify-center">
      <UButton
        label="Get All-Access Pass"
        size="xl"
        color="neutral"
        variant="subtle"
        trailing-icon="i-lucide-arrow-right"
        @click="getAllLicense"
      />
    </div>

    <!-- Testimonials Section -->
    <section class="mb-16 py-16">
      <div class="mx-auto max-w-7xl px-8">
        <TestimonialsSection />
      </div>
    </section>

    <section class="pb-24">
      <div class="mx-auto max-w-3xl px-8 lg:px-0">
        <UCard :ui="{ body: 'p-8 sm:p-12' }">
          <h2 class="mb-6 text-3xl font-bold">
            Why start with a Nuxt Template?
          </h2>
          <div class="space-y-4 text-toned dark:text-muted text-lg">
            <p>
              Nuxt templates give you a solid foundation for building Vue apps with
              server-side rendering out of the box. Instead of spending hours on
              setup, you get a ready-made project structure that lets you jump
              straight into building features.
            </p>
            <p>
              Whether you’re working on an e-commerce platform, a SaaS dashboard, or a personal project, a professional template saves time and helps you follow best practices from the start. Our templates come pre-configured with Nuxt UI, Tailwind CSS, and Nuxt Charts.
            </p>
            <p>
              All our templates are built to be highly customizable, TypeScript-ready, and fully responsive. They include common patterns like authentication layouts, data tables, and interactive dashboards, so you don't have to reinvent the wheel.
            </p>
          </div>
        </UCard>
      </div>
    </section>

    <PurchaseNotification />
  </div>
</template>
