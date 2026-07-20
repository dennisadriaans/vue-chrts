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

const copyToClipboard = () => {
  navigator.clipboard.writeText("npx nuxi@latest module add nuxt-charts");

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

  // setTimeout(() => {
  //   startScroll()
  // }, 5000)
});

onUnmounted(() => {
  window.removeEventListener("resize", updateBreakpoint);
});

const trustMetrics = [
  { value: "40k+", label: "Monthly downloads" },
  { value: "1.2k", label: "GitHub stars" },
  { value: "20+", label: "Chart components" },
  { value: "MIT", label: "Licensed" },
];

const features = [
  {
    icon: "i-lucide-server",
    title: "SSR-safe by default",
    description:
      "Charts render on the server and hydrate without layout shift or mismatch warnings.",
  },
  {
    icon: "i-lucide-package",
    title: "Auto-imported",
    description:
      "Add the module once. Every chart component is available across your app.",
  },
  {
    icon: "i-lucide-file-code",
    title: "Typed end to end",
    description:
      "Props, data shapes and formatters ship with types, so mistakes surface in your editor.",
  },
];
</script>

<template>
  <div class="relative">
    <div class="relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div class="hero-grid-lines absolute inset-0"></div>
        <div class="hero-grid-cells absolute inset-0"></div>
      </div>

      <header class="relative z-10 px-4 pt-44 pb-24 lg:pt-42 lg:pb-18">
        <div class="relative z-10 mb-8 flex items-center justify-center">
          <Logo />
        </div>

        <h1
          class="text-highlighted mx-auto max-w-4xl text-center text-3xl font-bold tracking-tight lg:text-7xl text-pretty"
        >
          Create beautiful
          <span>charts</span> with Vue and
          <span class="text-primary">Nuxt</span>
        </h1>
        <p
          class="px-8 lg:px-0 dark:text-muted relative z-10 mx-auto mt-3 lg:mt-8 max-w-xl text-center lg:text-xl text-pretty sm:text-xl/8"
        >
          Modern Vue charts and components to build beautiful dashboards. Built
          with Tailwind CSS and Nuxt UI.
        </p>

        <div
          class="relative z-10 mt-16 flex flex-col items-center justify-center gap-4 lg:flex-row"
        >
          <UButton
            variant="soft"
            size="xl"
            color="primary"
            trailing-icon="i-hugeicons:copy-01"
            @click="copyToClipboard"
          >
            npx nuxi@latest module add nuxt-charts
          </UButton>

          <NuxtLink to="/blocks">
            <UButton
              color="neutral"
              class="cursor-pointer"
              size="xl"
              trailing-icon="i-hugeicons:arrow-right-02"
              @click="
                useButtonTracking().trackSelectContent(
                  'navigation',
                  'view_all_blocks',
                )
              "
            >
              View blocks
            </UButton>
          </NuxtLink>
        </div>
      </header>

      <!-- Social proof -->
      <section class="border-default border-y">
        <div class="mx-auto max-w-7xl px-4 py-12">
          <div class="grid grid-cols-2 gap-8 lg:grid-cols-4">
            <div
              v-for="metric in trustMetrics"
              :key="metric.label"
              class="flex flex-col items-center justify-center"
            >
              <p class="text-highlighted text-3xl font-semibold tracking-tight">
                {{ metric.value }}
              </p>
              <p class="text-muted dark:text-dimmed mt-1 text-sm tracking-wide">
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

            <figcaption class="mt-4 flex items-center justify-center gap-x-3">
              <img
                src="https://github.com/atinux.png"
                alt="Sébastien Chopin"
                class="h-10 w-10 rounded-full border-2 border-default"
              />
              <div class="text-left text-sm">
                <div class="font-semibold">Sébastien Chopin</div>
                <div class="text-muted dark:text-dimmed">Creator of Nuxt</div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>
    </div>

    <div class="max-w-7xl mx-auto grid grid-cols-3 my-16 gap-8"> <UCard
        v-for="feature in features"
        :key="feature.title"
        :ui="{ root: 'rounded-2xl h-full' }"
      >
        <UIcon :name="feature.icon" class="text-primary size-6" />
        <h3
          class="text-highlighted mt-4 text-base font-semibold tracking-tight"
        >
          {{ feature.title }}
        </h3>
        <p
          class="text-muted dark:text-dimmed mt-2 text-sm leading-relaxed text-pretty"
        >
          {{ feature.description }}
        </p>
      </UCard>
    </div>

    <div
      class="max-w-7xl mx-auto flex items-center justify-between mt-36 gap-32"
    >
      <h2 class="text-5xl font-semibold text-pretty">
        123
      </h2>
      <p class="text-muted dark:text-dimmed text-2xl text-pretty">
        Subscriptions, usage, seats, credits, trials, and discounts. Compose
        them however your product charges.
      </p>
    </div>

    <div class="max-w-7xl mx-auto grid grid-cols-3 my-16 gap-8">
      <UCard>
        <div class="space-y-1">
          <h2 class="text-2xl font-semibold">Beautiful charts</h2>
          <p class="text-muted dark:text-dimmed">
            Beautiful charts for your dashboard.
          </p>
        </div>
      </UCard>
      <UCard>
        <div class="space-y-1">
          <h2 class="text-2xl font-semibold">Beautiful charts</h2>
          <p class="text-muted dark:text-dimmed">
            Beautiful charts for your dashboard.
          </p>
        </div>
      </UCard>
      <UCard>
        <div class="space-y-1">
          <h2 class="text-2xl font-semibold">Beautiful charts</h2>
          <p class="text-muted dark:text-dimmed">
            Beautiful charts for your dashboard.
          </p>
        </div>
      </UCard>
      <UCard>
        <div class="space-y-1">
          <h2 class="text-2xl font-semibold">Beautiful charts</h2>
          <p class="text-muted dark:text-dimmed">
            Beautiful charts for your dashboard.
          </p>
        </div>
      </UCard>
      <UCard>
        <div class="space-y-1">
          <h2 class="text-2xl font-semibold">Beautiful charts</h2>
          <p class="text-muted dark:text-dimmed">
            Beautiful charts for your dashboard.
          </p>
        </div>
      </UCard>
      <UCard>
        <div class="space-y-1">
          <h2 class="text-2xl font-semibold">Beautiful charts</h2>
          <p class="text-muted dark:text-dimmed">
            Beautiful charts for your dashboard.
          </p>
        </div>
      </UCard>
    </div>

    <div class="my-36 space-y-16">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-32">
        <h2 class="text-5xl font-semibold text-pretty">
          Ship any pricing model in an afternoon
        </h2>
        <p class="text-muted dark:text-dimmed text-2xl text-pretty">
          Subscriptions, usage, seats, credits, trials, and discounts. Compose
          them however your product charges.
        </p>
      </div>

      <UCard class="max-w-7xl mx-auto h-96"> </UCard>
    </div>

    <div class="my-36 space-y-16">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-32">
        <h2 class="text-5xl font-semibold text-pretty">
          Ship any pricing model in an afternoon
        </h2>
        <p class="text-muted dark:text-dimmed text-2xl text-pretty">
          Subscriptions, usage, seats, credits, trials, and discounts. Compose
          them however your product charges.
        </p>
      </div>

      <div class="max-w-7xl mx-auto flex items-center justify-center gap-8">
        <UCard class="w-4/12 mx-auto h-96"> </UCard>
        <UCard class="w-8/12 mx-auto h-96"> </UCard>
      </div>
    </div>

    <div
      class="max-w-7xl mx-auto flex flex-col items-center justify-between mt-64 mb-32 gap-8"
    >
      <h2 class="text-5xl font-semibold text-pretty text-center">
        Ship any pricing model in an afternoon
      </h2>
      <p class="text-muted dark:text-dimmed text-2xl text-pretty">
        Subscriptions, usage, seats, credits, trials, and discounts. Compose
        them however your product charges.
      </p>

      <div class="flex justifycenter gap-8">
        <UButton size="xl">Get started</UButton>
        <UButton size="xl" variant="soft" color="neutral">Open Demo</UButton>
      </div>
    </div>
  </div>
</template>
