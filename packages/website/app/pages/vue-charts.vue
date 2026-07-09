<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('landing')
    .path('/landing' + route.path)
    .first()
)
const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: 'https://nuxtcharts.com/images/home.png',
  ogImageUrl: 'https://nuxtcharts.com/images/home.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageType: 'image/png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: 'https://nuxtcharts.com/images/home.png',
  twitterImageAlt: title,
  twitterCreator: '@DennisAdriaans',
  keywords: 'vue charts, vue chart library, nuxt charts, vue data visualization, interactive charts vue'
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://nuxtcharts.com${route.path}`
    }
  ]
})

const isFloatingCTAVisible = ref(false)
</script>

<template>
  <div class="mx-auto my-4 max-w-2xl p-4 mt-32">
    <UCard class="bg-default dark:bg-elevated/40">
      <ContentRenderer
        v-if="page"
        :value="page"
      />
    </UCard>

    <EnhancedFloatingCTA
      :show="isFloatingCTAVisible"
      @dismiss="isFloatingCTAVisible = false"
    />
  </div>
</template>
