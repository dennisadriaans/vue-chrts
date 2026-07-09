<script setup lang="ts">
defineOptions({
  tags: ['blocks', 'pricingtables']
})
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">
        Pricing Tables
      </h2>
      <p class="text-toned dark:text-muted">
        A collection of different price blocks for your (landing) pages.
      </p>
    </div>
    <ClientOnly>
      <div class="mt-12 space-y-24 lg:mt-0">
        <PreviewExample title="Price Section">
          <template #chart>
            <BlocksPricingTablesPriceSection />
          </template>
          <PreviewCode
            id="price-section"
            category="pricing-tables"
            block="price-section"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Alt Price Plan">
          <template #chart>
            <BlocksPricingTablesFeatureShowcase />
          </template>
          <PreviewCode
            id="alt-price-plan"
            category="pricing-tables"
            block="alt-price-plan"
            :lock-code="true"
          />
        </PreviewExample>
      </div>
    </ClientOnly>
  </div>
</template>
