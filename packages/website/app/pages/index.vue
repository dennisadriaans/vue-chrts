<script lang="ts" setup>
useSeoMeta({
  title: "Beautiful Chart Library for Vue | Nuxt Charts",
  ogTitle: "Beautiful Chart Library for Vue | Nuxt Charts",
  description:
    "Visualize your data with Nuxt Charts. A comprehensive chart library for Nuxt applications, offering easy integration and beautiful, interactive charts.",
  ogDescription:
    "Visualize your data with Nuxt Charts. A comprehensive chart library for Nuxt applications, offering easy integration and beautiful, interactive charts.",
  ogImage: "https://nuxtcharts.com/images/home.png",
  ogImageUrl: "https://nuxtcharts.com/images/home.png",
  ogImageType: "image/png",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: "Beautiful Chart Library for Vue | Nuxt Charts",
  twitterDescription:
    "Visualize your data with Nuxt Charts. A comprehensive chart library for Nuxt applications, offering easy integration and beautiful, interactive charts.",
  twitterImage: "https://nuxtcharts.com/images/home.png",
  twitterImageAlt: "Beautiful Chart Library for Vue | Nuxt Charts",
  twitterCreator: "@DennisAdriaans",
  keywords:
    "nuxt charts, vue charts, charts for nuxt, vue chart library, unovis, d3 charts vue",
});

useHead({
  link: [
    {
      rel: "canonical",
      href: "https://nuxtcharts.com",
    },
  ],
});

const INSTALL_COMMAND = "npx nuxi@latest module add nuxt-charts";

const copyToClipboard = () => {
  navigator.clipboard.writeText(INSTALL_COMMAND);

  const { trackSelectContent } = useButtonTracking();
  trackSelectContent("cli_command", "install_nuxt_charts");

  useToast().add({
    title: "Copied to clipboard",
    description: "Ready to paste!",
    icon: "i-heroicons-check-circle",
  });
};

const isLg = ref(false);

const updateBreakpoint = () => {
  isLg.value = window.innerWidth >= 1024;
};

onMounted(() => {
  updateBreakpoint();
  window.addEventListener("resize", updateBreakpoint);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateBreakpoint);
});


/**
 * Component sandbox — preview/code toggle per chart family.
 * Snippets are illustrative; keep in sync with the docs when the API changes.
 */
const sandboxData = [
  { month: "Jan", revenue: 4200, expenses: 2400 },
  { month: "Feb", revenue: 5100, expenses: 2900 },
  { month: "Mar", revenue: 4800, expenses: 3100 },
  { month: "Apr", revenue: 6400, expenses: 3300 },
  { month: "May", revenue: 7200, expenses: 3800 },
  { month: "Jun", revenue: 8100, expenses: 4100 },
];

const sandboxCategories = {
  revenue: { name: "Revenue", color: "var(--color-green-500)" },
  expenses: { name: "Expenses", color: "var(--color-blue-500)" },
};

const sandboxXFormatter = (i: number) => sandboxData[i]?.month ?? "";
const sandboxYFormatter = (value: number) => `$${(value / 1000).toFixed(1)}k`;

const sandboxTabs = [
  { label: "Area", value: "area" },
  { label: "Line", value: "line" },
  { label: "Bar", value: "bar" },
  { label: "Donut", value: "donut" },
];

const activeSandboxTab = ref("area");
const sandboxView = ref<"preview" | "code">("preview");

const sandboxViews = [
  { label: "Preview", value: "preview" as const },
  { label: "Code", value: "code" as const },
];

const donutData = [62, 28, 10];

const donutCategories = {
  desktop: { name: "Desktop", color: "var(--color-green-500)" },
  mobile: { name: "Mobile", color: "var(--color-blue-500)" },
  tablet: { name: "Tablet", color: "var(--color-purple-500)" },
};

const sandboxSnippets: Record<string, string> = {
  area: `<AreaChart
  :data="data"
  :categories="categories"
  :height="260"
  :x-formatter="xFormatter"
  stacked
/>`,
  line: `<LineChart
  :data="data"
  :categories="categories"
  :height="260"
  :x-formatter="xFormatter"
/>`,
  bar: `<BarChart
  :data="data"
  :categories="categories"
  :y-axis="['revenue', 'expenses']"
  :height="260"
  :x-formatter="xFormatter"
/>`,
  donut: `<DonutChart
  :data="[62, 28, 10]"
  :categories="categories"
  :height="260"
  :radius="0"
/>`,
};

const copySnippet = () => {
  navigator.clipboard.writeText(sandboxSnippets[activeSandboxTab.value] ?? "");

  useToast().add({
    title: "Component copied",
    description: "Paste it straight into your project.",
    icon: "i-heroicons-check-circle",
  });
};

// Mock metrics — replace with live npm/GitHub figures.
const trustMetrics = [
  { value: "40k+", label: "Monthly downloads" },
  { value: "1.2k", label: "GitHub stars" },
  { value: "20+", label: "Chart components" },
  { value: "MIT", label: "Licensed" },
];


// Featured templates pulled from the products collection (same source as /templates).
const { data: allTemplates } = await useAsyncData("home-templates", () =>
  queryCollection("products").all(),
);

const templates = computed(() => (allTemplates.value ?? []).slice(0, 3));

const pricingRows = [
  { feature: "Core chart components", free: "Included", pro: "Included" },
  { feature: "Tailwind & Nuxt UI theming", free: "Included", pro: "Included" },
  { feature: "Dashboard blocks", free: "Basic set", pro: "40+ blocks" },
  { feature: "Full dashboard templates", free: null, pro: "All templates" },
  { feature: "Private GitHub access", free: null, pro: "Included" },
  { feature: "Updates & support", free: "Community", pro: "Priority" },
];

const faqItems = [
  {
    label: "Does it work in plain Vue 3, without Nuxt?",
    content:
      "Yes. The underlying library is a standard Vue 3 package — install vue-chrts and import components directly. The Nuxt module adds auto-imports and SSR wiring on top.",
  },
  {
    label: "How does styling work with Tailwind v4 and Nuxt UI v3?",
    content:
      "Colours come from CSS variables, so charts pick up your existing theme tokens. Pass any Tailwind class to size or position a chart, and override series colours per category.",
  },
  {
    label: "Can I use this in client work?",
    content:
      "The open-source module is MIT licensed and free for commercial use. Templates and blocks are covered by the All-Access licence, which allows unlimited client projects.",
  },
  {
    label: "What renders the charts?",
    content:
      "Unovis and D3 handle the drawing. Nuxt Charts wraps them in a Vue-first API with sensible defaults so you configure props, not scales and axes.",
  },
];
</script>

<template>
  <div class="relative">
    <!-- Hero -->
    <div class="relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div class="hero-grid-lines absolute inset-0"></div>
        <div class="hero-grid-cells absolute inset-0"></div>
      </div>

      <header
        class="relative z-10 mx-auto max-w-7xl px-4 pt-32 pb-16 lg:pt-40 lg:pb-24"
      >
        <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <!-- Copy & CTA -->
          <div>
            <div class="mb-8 flex lg:justify-start">
              <Logo />
            </div>

            <h1
              class="text-highlighted max-w-xl text-4xl font-bold tracking-tighter text-balance lg:text-6xl"
            >
              Beautiful, SSR-ready charts for
              <span class="text-primary">Nuxt</span> and Vue
            </h1>

            <p
              class="text-muted dark:text-dimmed mt-6 max-w-lg text-lg leading-relaxed text-pretty"
            >
              Customizable, accessible chart components built on Tailwind CSS
              and Nuxt UI. Install the module and start plotting.
            </p>

            <div class="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <UButton
                variant="soft"
                size="xl"
                color="primary"
                trailing-icon="i-hugeicons:copy-01"
                class="font-mono text-sm"
                @click="copyToClipboard"
              >
                {{ INSTALL_COMMAND }}
              </UButton>
            </div>

            <div class="mt-6 flex flex-wrap items-center gap-3">
              <NuxtLink to="/blocks">
                <UButton
                  color="neutral"
                  size="xl"
                  trailing-icon="i-hugeicons:arrow-right-02"
                  @click="
                    useButtonTracking().trackSelectContent(
                      'navigation',
                      'view_all_blocks',
                    )
                  "
                >
                  Explore components
                </UButton>
              </NuxtLink>

              <NuxtLink to="/docs">
                <UButton color="neutral" variant="ghost" size="xl">
                  Read the docs
                </UButton>
              </NuxtLink>
            </div>
          </div>

          <SectionsHeroWidget :height="260" />
        </div>
      </header>
    </div>

    <!-- Social proof -->
    <section class="border-default border-y">
      <div class="mx-auto max-w-7xl px-4 py-12">
        <div class="grid grid-cols-2 gap-8 lg:grid-cols-4">
          <div v-for="metric in trustMetrics" :key="metric.label">
            <p class="text-highlighted text-3xl font-semibold tracking-tight">
              {{ metric.value }}
            </p>
            <p
              class="text-muted dark:text-dimmed mt-1 text-sm tracking-wide"
            >
              {{ metric.label }}
            </p>
          </div>
        </div>

        <div class="mx-auto mt-12 max-w-3xl">
          <LogoBanner />
        </div>

        <figure class="mx-auto mt-12 max-w-2xl text-center">
          <blockquote
            class="text-default text-lg leading-relaxed text-pretty"
          >
            “My favorite way to add charts to Nuxt. Clean, simple and
            beautiful.”
          </blockquote>
          <figcaption
            class="text-muted dark:text-dimmed mt-3 text-sm"
          >
            Sébastien Chopin — creator of Nuxt
          </figcaption>
        </figure>
      </div>
    </section>

    <SectionsWhyNuxt></SectionsWhyNuxt>

    <!-- Templates -->
    <section class="mx-auto max-w-7xl px-4 py-24 lg:py-32">
      <div
        class="flex flex-col justify-between gap-8 lg:flex-row lg:items-end"
      >
        <div class="max-w-2xl">
          <p
            class="text-primary text-xs font-semibold tracking-[0.12em] uppercase"
          >
            Templates
          </p>
          <h2
            class="text-highlighted mt-3 text-3xl font-semibold tracking-tight text-balance lg:text-4xl"
          >
            Complete dashboards, not just charts
          </h2>
          <p
            class="text-muted dark:text-dimmed mt-4 text-lg leading-relaxed text-pretty"
          >
            Production-ready screens assembled from the same components, with
            layout, states and responsive behaviour already handled.
          </p>
        </div>

        <NuxtLink to="/templates">
          <UButton
            color="neutral"
            size="lg"
            trailing-icon="i-hugeicons:arrow-right-02"
          >
            Browse templates
          </UButton>
        </NuxtLink>
      </div>

      <div class="mt-12 grid gap-6 lg:grid-cols-3">
        <UCard
          v-for="template in templates"
          :key="template.id"
          :ui="{ root: 'rounded-2xl h-full overflow-hidden', body: 'p-0' }"
          class="group"
        >
          <NuxtLink :to="template.slug" class="block">
            <!-- Thumbnail -->
            <div class="bg-muted aspect-16/10 w-full overflow-hidden rounded-xl">
              <!-- Light image -->
              <img
                v-if="template.image?.light"
                :src="template.image.light"
                :alt="template.image.alt || template.name"
                loading="lazy"
                class="block size-full object-cover object-top border-4 border-default transition-transform duration-300 group-hover:scale-105 dark:hidden"
              >
              <!-- Dark image -->
              <img
                v-if="template.image?.dark"
                :src="template.image.dark"
                :alt="template.image.alt || template.name"
                loading="lazy"
                class="hidden size-full object-cover object-top border-4 border-default rounded-xl transition-transform duration-300 group-hover:scale-105 dark:block"
              >
            </div>

            <div class="p-6">
              <h3
                class="text-highlighted text-base font-semibold tracking-tight"
              >
                {{ template.name }}
              </h3>
              <p
                class="text-muted dark:text-dimmed mt-2 text-sm leading-relaxed text-pretty"
              >
                {{ template.tagline }}
              </p>
            </div>
          </NuxtLink>
        </UCard>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="mx-auto max-w-7xl px-4 py-24 lg:py-32">
      <div class="mx-auto max-w-2xl text-center">
        <p
          class="text-primary text-xs font-semibold tracking-[0.12em] uppercase"
        >
          Reviews
        </p>
        <h2
          class="text-highlighted mt-3 text-3xl font-semibold tracking-tight text-balance lg:text-4xl"
        >
          What developers say
        </h2>
      </div>

      <div class="mt-12">
        <TestimonialsGrid />
      </div>
    </section>

    <!-- FAQ -->
    <section class="mx-auto max-w-3xl px-4 py-24 lg:py-32">
      <div class="max-w-2xl">
        <p
          class="text-primary text-xs font-semibold tracking-[0.12em] uppercase"
        >
          FAQ
        </p>
        <h2
          class="text-highlighted mt-3 text-3xl font-semibold tracking-tight text-balance lg:text-4xl"
        >
          Common questions
        </h2>
      </div>

      <UAccordion :items="faqItems" class="mt-10" />
    </section>

    <!-- Closing CTA -->
    <section class="mx-auto max-w-7xl px-4 pt-16 pb-32">
      <UCard
        :ui="{ root: 'rounded-3xl', body: 'px-6 py-16 sm:px-16 sm:py-20' }"
      >
        <div class="mx-auto max-w-2xl text-center">
          <h2
            class="text-highlighted text-3xl font-semibold tracking-tight text-balance lg:text-4xl"
          >
            Add your first chart in a minute
          </h2>
          <p
            class="text-muted dark:text-dimmed mx-auto mt-4 max-w-lg text-lg leading-relaxed text-pretty"
          >
            One command installs the module and registers every component.
          </p>

          <div
            class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <UButton
              variant="soft"
              size="xl"
              color="primary"
              trailing-icon="i-hugeicons:copy-01"
              class="font-mono text-sm"
              @click="copyToClipboard"
            >
              {{ INSTALL_COMMAND }}
            </UButton>

            <NuxtLink to="/docs">
              <UButton
                color="neutral"
                size="xl"
                trailing-icon="i-hugeicons:arrow-right-02"
              >
                Read the docs
              </UButton>
            </NuxtLink>
          </div>
        </div>
      </UCard>
    </section>
  </div>
</template>
