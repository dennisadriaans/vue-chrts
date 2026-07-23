<script setup lang="ts">
defineOptions({
  tags: ['blocks', 'barlists']
})
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">
        Bar Lists
      </h2>
      <p class="text-toned dark:text-muted">
        Explore some good looking Bar List components to visualize your data
        easily.
      </p>
    </div>

    <ClientOnly>
      <div class="mt-12 space-y-24 lg:mt-0">
        <PreviewExample title="Bar List - Pages">
          <template #chart>
            <BlocksBarListsPages />
          </template>
          <PreviewCode
            id="bar-list-pages"
            category="bar-lists"
            block="pages"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="User Conversion Funnel">
          <template #chart>
            <BlocksBarListsConversionFunnel />
          </template>
          <PreviewCode
            id="bar-list-conversion-funnel"
            category="bar-lists"
            block="conversion-funnel"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="API Performance Monitor">
          <template #chart>
            <BlocksBarListsApiPerformance />
          </template>
          <PreviewCode
            id="bar-list-api-performance"
            category="bar-lists"
            block="api-performance"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Progress">
          <template #chart>
            <BlocksBarListsProgress />
          </template>
          <PreviewCode
            id="bar-list-progress"
            category="bar-lists"
            block="progress"
            :lock-code="true"
          />
        </PreviewExample>
      </div>
    </ClientOnly>
  </div>
</template>
