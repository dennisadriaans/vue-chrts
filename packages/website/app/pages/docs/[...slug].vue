<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

definePageMeta({
  layout: 'docs'
})

const route = useRoute()
const { toc } = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('docs').path(route.path).first()
)
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('docs', route.path, {
    fields: ['description']
  })
})

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: 'https://nuxtcharts.com/images/home.png',
  ogType: 'article',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: 'https://nuxtcharts.com/images/home.png',
  twitterCard: 'summary_large_image'
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://nuxtcharts.com${route.path}`
    }
  ]
})

const headline = computed(() => findPageHeadline(navigation?.value, page.value))

const navigationItems = computed(() => {
  return navigation?.value?.[0]?.children || []
})

const links = computed(() => {
  const links = []
  if (toc?.bottom?.edit) {
    links.push({
      icon: 'i-lucide-external-link',
      label: 'Edit this page',
      to: `${toc.bottom.edit}/${page?.value?.stem}.${page?.value?.extension}`,
      target: '_blank'
    })
  }

  return [...links, ...(toc?.bottom?.links || [])].filter(Boolean)
})
</script>

<template>
  <div>
    <UPage
      v-if="page"
      :ui="{
        root: 'pt-0'
      }"
    >
      <UPageHeader
        :title="page.title"
        :description="page.description"
        :links="page.links"
        :headline="headline"
      >
        <template #links>
          <github />
        </template>
      </UPageHeader>

      <UPageBody>
        <ContentRenderer
          v-if="page"
          :value="page"
        />

        <USeparator
          v-if="surround?.length"
        />

        <UContentSurround :surround="surround" />
      </UPageBody>

      <template
        v-if="page?.body?.toc?.links?.length || navigationItems?.length"
        #right
      >
        <UContentToc
          :title="toc?.title || 'Menu'"
          :links="page.body?.toc?.links || []"
          :ui="{
            root: 'sticky top-[96px] z-50 bg-(--ui-bg)/80 backdrop-blur border-b border-default -mx-4 mt-4 px-4 lg:mx-0 lg:px-0 lg:top-24 lg:border-none lg:bg-transparent lg:z-0'
          }"
        >
          <template #top>
            <div class="mb-6 lg:hidden">
              <UCollapsible
                class="lg:pt-2"
              >
                <UButton
                  color="neutral"
                  variant="outline"
                  class="w-full justify-between"
                  label="Browse All Documentation"
                  icon="i-lucide-book-open"
                  trailing-icon="i-lucide-chevron-down"
                  size="sm"
                />

                <template #content>
                  <div class="pt-4">
                    <UContentNavigation
                      highlight
                      :navigation="navigationItems"
                    />
                  </div>
                </template>
              </UCollapsible>
              <USeparator
                v-if="page?.body?.toc?.links?.length"
                class="lg:mt-4"
                type="dashed"
              />
            </div>
          </template>

          <template
            v-if="toc?.bottom"
            #bottom
          >
            <div
              class="hidden space-y-6 lg:block"
              :class="{ '!mt-6': page.body?.toc?.links?.length }"
            >
              <USeparator
                v-if="page.body?.toc?.links?.length"
                type="dashed"
              />

              <UPageLinks
                :title="toc.bottom.title"
                :links="links"
              />

              <ClientOnly>
                <DocsSponsorButton class="mt-6" />
              </ClientOnly>
            </div>
          </template>
        </UContentToc>
      </template>
    </UPage>
  </div>
</template>
