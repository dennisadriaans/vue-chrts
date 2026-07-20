<script setup lang="ts">
const features = [
  {
    icon: "i-lucide-server",
    title: "SSR-safe by default",
    description:
      "Charts render on the server and hydrate without layout shift or mismatch warnings.",
  },
  {
    icon: "i-lucide-palette",
    title: "Styled with Tailwind",
    description:
      "Theme through CSS variables and utility classes. No wrapper config objects to learn.",
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
  <!-- Why Nuxt Charts -->
  <section class="mx-auto max-w-7xl px-4 py-24 lg:py-32">
    <div class="max-w-2xl">
      <p class="text-primary text-xs font-semibold tracking-[0.12em] uppercase">
        Why Nuxt Charts
      </p>
      <h2
        class="text-highlighted mt-3 text-3xl font-semibold tracking-tight text-balance lg:text-4xl"
      >
        Built for the Nuxt workflow
      </h2>
      <p
        class="text-muted dark:text-dimmed mt-4 text-lg leading-relaxed text-pretty"
      >
        General-purpose chart libraries need adapters, refs and hydration
        workarounds. This one is written for Vue and Nuxt from the start.
      </p>
    </div>

    <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <UCard
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
  </section>
</template>
