<script lang="ts" setup>
const { seo } = useAppConfig()

onMounted(() => {
  agreedToCookiesScriptConsent.accept()
})

useScript('https://www.google-analytics.com/analytics.js', {
  trigger: useScriptTriggerConsent({
    consent: true
  })
})

const { data: navigation } = await useAsyncData('navigation', () =>
  queryCollectionNavigation('docs')
)

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  ogSiteName: seo?.siteName,
  twitterCard: 'summary_large_image'
})

provide('navigation', navigation)
const code = `<script setup lang="ts">
const count = ref(0)
<\/script>

<template>
  <div class="flex flex-col items-center gap-4 p-8">
    <p class="text-lg font-semibold">Count: {{ count }}</p>
    <UButton @click="count++">Increment</UButton>
  </div>
</template>`
</script>

<template>
  <UApp
    :toaster="{
      position: 'top-right'
    }"
  >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ScrollDebugger />
  </UApp>
</template>
