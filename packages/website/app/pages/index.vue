<script lang="ts" setup>
import { motion } from "motion-v";

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
</script>

<template>
  <div class="relative">
    <div class="relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div class="hero-grid-lines absolute inset-0"></div>
        <div class="hero-grid-cells absolute inset-0"></div>
      </div>

      <header class="relative z-10 px-4 pt-44 pb-24 lg:pt-52 lg:pb-18">
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

      <div
        class="relative z-10 mx-auto max-w-screen-2xl pt-24 lg:pt-6 lg:pb-12"
      >
        <div class="mx-auto max-w-3xl">
          <LogoBanner />
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto grid grid-cols-3 my-16 gap-8">
      <UCard>
        <div class="text-center space-y-1">
          <h2 class="text-2xl font-semibold">Beautiful charts</h2>
          <p class="text-muted dark:text-dimmed">
            Beautiful charts for your dashboard.
          </p>
        </div>
      </UCard>
      <UCard>
        <div class="text-center space-y-1">
          <h2 class="text-2xl font-semibold">Beautiful charts</h2>
          <p class="text-muted dark:text-dimmed">
            Beautiful charts for your dashboard.
          </p>
        </div>
      </UCard>
      <UCard>
        <div class="text-center space-y-1">
          <h2 class="text-2xl font-semibold">Beautiful charts</h2>
          <p class="text-muted dark:text-dimmed">
            Beautiful charts for your dashboard.
          </p>
        </div>
      </UCard>
    </div>

    <div
      class="max-w-7xl mx-auto flex items-center justify-between my-36 gap-32"
    >
      <h2 class="text-5xl font-semibold text-pretty">
        Ship any pricing model in an afternoon
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
      class="max-w-7xl mx-auto flex flex-col items-center justify-between my-64 gap-8"
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

    <div class="mb-96"></div>
  </div>
</template>
