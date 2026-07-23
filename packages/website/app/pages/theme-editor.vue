<script lang="ts" setup>
useSeoMeta({
  title: 'Nuxt UI Theme Editor, Generator & Builder - Nuxt Charts',
  description: 'The one and only Nuxt UI theme builder, generator, and editor. A variant of TweakCN for Nuxt UI. Customize your theme visually and sync it directly with your local project.',
  ogTitle: 'Nuxt UI Theme Editor, Generator & Builder - Nuxt Charts',
  ogDescription: 'The one and only Nuxt UI theme builder, generator, and editor. A variant of TweakCN for Nuxt UI. Customize your theme visually and sync it directly with your local project.',
  ogImage: 'https://nuxtcharts.com/images/ui-editor-og.png',
  ogImageUrl: 'https://nuxtcharts.com/images/ui-editor-og.png',
  ogImageType: 'image/png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Nuxt UI Theme Editor, Generator & Builder',
  twitterDescription:
    'Visualize your data with Nuxt Charts. A comprehensive chart library for Nuxt applications, offering easy integration and beautiful, interactive charts.',
  twitterImage: 'https://nuxtcharts.com/images/ui-editor-og.png',
  twitterImageAlt: 'Nuxt UI Theme Editor, Generator & Builder',
  twitterCreator: '@DennisAdriaans',
  keywords: 'nuxt ui theme generator, nuxt ui theme builder, nuxt ui theme editor, nuxt ui theme configurator, tweakcn nuxt ui, tweakcn for nuxt ui'
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://nuxtcharts.com/theme-editor'
    }
  ]
})
const testimonials = [
  {
    name: 'Alex Rivera',
    role: 'Senior Frontend Engineer',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    content: 'Finally, a custom theme builder for Nuxt UI that actually works. The CLI sync is a lifesaver for our team.',
    rating: 5
  },
  {
    name: 'Sarah Chen',
    role: 'Product Designer',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    content: 'The visual editor is so intuitive. I was able to match our brand colors in minutes without touching a single CSS file.',
    rating: 5
  },
  {
    name: 'Marcus Thorne',
    role: 'Fullstack Developer',
    avatar: 'https://i.pravatar.cc/150?u=marcus',
    content: 'The contrast checker is a great touch. It\'s nice to know our theme is accessible from the start. Highly recommended!',
    rating: 5
  }
]
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <header class="relative px-4 pt-40 pb-16 lg:pt-52">
      <div class="absolute inset-0 flex hidden items-center justify-center lg:top-16 dark:flex">
        <div
          class="absolute h-[600px] w-[400px] rounded-full opacity-60 blur-3xl lg:h-[800px] lg:w-[1200px]"
          style="
            background: radial-gradient(
              circle,
              rgba(var(--ui-primary), 0.15) 0%,
              rgba(var(--ui-primary), 0.08) 50%,
              rgba(var(--ui-primary), 0.05) 100%
            );
          "
        />
      </div>

      <div class="relative z-10 mx-auto max-w-4xl text-center mt-16">
        <h1 class="text-highlighted text-5xl font-bold tracking-tight text-pretty lg:text-7xl">
          NEW: <span class="text-primary">Nuxt UI</span> <br> Theme Editor & Builder
        </h1>
        <p class="text-muted mx-auto mt-6 max-w-2xl text-lg text-pretty sm:text-xl/8">
          The one and only Nuxt UI theme builder, generator, and editor. A variant of TweakCN for Nuxt UI. Customize your theme visually and sync it directly with your local project.
        </p>

        <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <UButton
            to="https://ui.nuxtcharts.com"
            target="_blank"
            size="xl"
            color="primary"
            icon="i-lucide-external-link"
            :ui="{
              leadingIcon: 'size-5'
            }"
          >
            Open Theme Editor
          </UButton>
          <UButton
            to="/payments?tab=tokens"
            size="xl"
            color="neutral"
            variant="outline"
          >
            Get API Token
          </UButton>
        </div>
      </div>
    </header>

    <!-- Live Editor Preview -->
    <UContainer class="relative mt-16 mb-24">
      <div class="overflow-hidden rounded-xl border border-default bg-elevated shadow-2xl">
        <!-- Browser Header -->
        <div class="flex items-center justify-between border-b border-default bg-default px-4 py-2">
          <div class="flex items-center gap-1.5 w-20">
            <div class="h-2.5 w-2.5 rounded-full bg-red-500/20" />
            <div class="h-2.5 w-2.5 rounded-full bg-yellow-500/20" />
            <div class="h-2.5 w-2.5 rounded-full bg-green-500/20" />
          </div>

          <div class="flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-[11px] text-dimmed border border-muted w-full max-w-[240px] justify-center">
            <UIcon
              name="i-lucide-lock"
              class="h-3 w-3 text-muted"
            />
            <span class="font-medium tracking-tight">ui.nuxtcharts.com</span>
          </div>

          <div class="flex items-center justify-end gap-3 w-20">
            <UIcon
              name="i-lucide-plus"
              class="h-3.5 w-3.5 text-muted"
            />
            <UIcon
              name="i-lucide-share-2"
              class="h-3.5 w-3.5 text-muted"
            />
          </div>
        </div>
        <!-- Demo Preview -->
        <div class="relative h-[600px] w-full overflow-hidden bg-default lg:h-[800px]">
          <!-- Blurred Background Image -->
          <img
            src="/images/demo.png"
            alt="Theme Editor Demo"
            class="h-full w-full object-cover object-top blur-xxs "
          >

          <!-- Launch Overlay -->
          <div class="absolute inset-0 flex items-center justify-center bg-default/20 backdrop-blur-sm">
            <div class="text-center p-8 rounded-2xl bg-default/90 shadow-2xl max-w-sm transform transition-all hover:scale-105 backdrop-blur-md">
              <div class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
                <UIcon
                  name="i-lucide-external-link"
                  class="h-8 w-8 text-primary"
                />
              </div>
              <h3 class="text-xl font-bold mb-2 text-highlighted">
                Full Editor Experience
              </h3>
              <p class="text-dimmed mb-8 text-sm">
                The interactive editor is best experienced in its own environment. Launch it to customize every detail of your Nuxt UI theme.
              </p>
              <UButton
                to="https://ui.nuxtcharts.com"
                target="_blank"
                size="xl"
                color="primary"
                block
                icon="i-lucide-rocket"
              >
                Launch Full Editor
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </UContainer>

    <!-- Features Section -->

    <!-- Features Grid -->
    <UContainer class="py-24">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
          Powerful Customization Tools
        </h2>
        <p class="mt-4 text-lg text-dimmed max-w-2xl mx-auto">
          Everything you need to customize your Nuxt UI components and make them unique to your brand.
        </p>
      </div>

      <UPageGrid>
        <UPageCard
          icon="i-lucide-paint-bucket"
          title="Color Control"
          description="Customize background, text, and border colors with an intuitive color picker. Support for primary, secondary, and semantic colors."
          spotlight
        />
        <UPageCard
          icon="i-lucide-type"
          title="Typography Settings"
          description="Fine-tune font sizes, weights, and line heights to create the perfect typographic hierarchy for your brand."
          spotlight
        />
        <UPageCard
          icon="i-lucide-zap"
          title="Tailwind v4 Ready"
          description="Built with the future in mind. Full support for Tailwind CSS v4 and v3, including OKLCH and HSL color formats."
          spotlight
        />
        <UPageCard
          icon="i-lucide-eye"
          title="Real-time Preview"
          description="See your changes instantly. Our live preview updates as you tweak, so you never have to guess the final result."
          spotlight
        />
        <UPageCard
          icon="i-lucide-accessibility"
          title="Accessibility First"
          description="Built-in contrast checking ensures your theme meets WCAG standards, making your app accessible to everyone."
          spotlight
        />
        <UPageCard
          icon="i-lucide-terminal"
          title="CLI Integration"
          description="Stop copying and pasting. Use our CLI to sync your theme directly to your local project with a single command."
          spotlight
        />
      </UPageGrid>
    </UContainer>

    <!-- Testimonials Section -->
    <UContainer class="py-24">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
          Loved by Developers
        </h2>
        <p class="mt-4 text-lg text-dimmed max-w-2xl mx-auto">
          See what other developers are saying about the Nuxt UI Theme Configurator.
        </p>
      </div>
      <TestimonialsSection :testimonials="testimonials" />
    </UContainer>

    <!-- CTA Section -->
    <UContainer class="mt-24">
      <UCard class="bg-primary/5 border-primary/20 overflow-hidden">
        <div class="flex flex-col items-center gap-8 py-12 text-center lg:flex-row lg:text-left lg:px-12">
          <div class="flex-1">
            <h2 class="text-3xl font-bold">
              Ready to build your brand?
            </h2>
            <p class="text-dimmed mt-2 text-lg">
              Start customizing your Nuxt UI theme today and take your project's design to the next level.
            </p>
          </div>
          <div class="flex flex-col gap-4 sm:flex-row">
            <UButton
              to="https://ui.nuxtcharts.com"
              target="_blank"
              size="xl"
              color="primary"
            >
              Launch Editor
            </UButton>
            <UButton
              to="/payments?tab=tokens"
              size="xl"
              color="neutral"
              variant="ghost"
            >
              Manage Tokens
            </UButton>
          </div>
        </div>
      </UCard>
    </UContainer>

    <!-- SEO Section -->
    <UContainer class="py-24 border-t border-default mt-24">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 class="text-sm font-semibold text-highlighted mb-2">
            Nuxt UI Theme Builder
          </h3>
          <p class="text-xs text-dimmed leading-relaxed">
            The most comprehensive visual builder for <a
              href="https://ui.nuxt.com"
              target="_blank"
              class="text-primary hover:underline"
            >Nuxt UI</a>. Create a cohesive design system by configuring global styles, component variants, and layout primitives. Our builder ensures that every component in your <a
              href="https://nuxt.com"
              target="_blank"
              class="text-primary hover:underline"
            >Nuxt application</a> maintains visual consistency while reflecting your unique brand identity.
          </p>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-highlighted mb-2">
            Nuxt UI Theme Generator
          </h3>
          <p class="text-xs text-dimmed leading-relaxed">
            Instantly generate production-ready theme configurations. Leveraging modern color spaces like OKLCH and HSL, our generator creates balanced palettes with automatic contrast validation. It handles the heavy lifting of calculating semantic colors and state variations, so you can focus on building features with <a
              href="https://tailwindcss.com"
              target="_blank"
              class="text-primary hover:underline"
            >Tailwind CSS</a>.
          </p>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-highlighted mb-2">
            Nuxt UI Theme Editor
          </h3>
          <p class="text-xs text-dimmed leading-relaxed">
            A powerful real-time editing environment for your Nuxt UI theme. Tweak typography, spacing, and border radii with immediate visual feedback. The editor integrates seamlessly with our <a
              href="https://ui.nuxtcharts.com"
              target="_blank"
              class="text-primary hover:underline"
            >Theme Editor</a>, allowing you to push changes directly to your local project without manual copy-pasting.
          </p>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-highlighted mb-2">
            TweakCN for Nuxt UI
          </h3>
          <p class="text-xs text-dimmed leading-relaxed">
            Inspired by the <a
              href="https://tweakcn.com"
              target="_blank"
              class="text-primary hover:underline"
            >TweakCN</a> philosophy, this tool brings visual configuration to the Nuxt UI ecosystem. It bridges the gap between design and code by providing a GUI for <a
              href="https://tailwindcss.com/blog/tailwindcss-v4-alpha"
              target="_blank"
              class="text-primary hover:underline"
            >Tailwind CSS v4</a> and v3 properties. It's the perfect companion for developers who want the speed of Nuxt UI with the precision of a custom design.
          </p>
        </div>
      </div>
    </UContainer>
  </div>
</template>
