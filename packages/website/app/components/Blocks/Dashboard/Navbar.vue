<script setup lang="ts">
defineOptions({
  tags: ['dashboard', 'navbar']
})
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">
        Dashboard
      </h2>
      <p class="text-toned dark:text-muted">
        Modern dashboard navigation components with various layouts and
        features.
      </p>
    </div>

    <ClientOnly>
      <div class="mt-12 space-y-24 lg:mt-0">
        <PreviewExample title="Navbar - Variant One">
          <template #chart>
            <BlocksDashboardNavbarVariantOne />
          </template>
          <PreviewCode
            id="dashboard-navbar-variant-one"
            category="dashboard/navbar"
            block="variant-one"
            :lock-code="true"
          />
        </PreviewExample>
      </div>
    </ClientOnly>

    <ClientOnly>
      <div class="mt-12 space-y-24 lg:mt-0">
        <PreviewExample title="Navbar - Variant Two">
          <template #chart>
            <BlocksDashboardNavbarVariantTwo />
          </template>
          <PreviewCode
            id="dashboard-navbar-variant-two"
            category="dashboard/navbar"
            block="variant-two"
            :lock-code="true"
          />
        </PreviewExample>
      </div>
    </ClientOnly>

    <ClientOnly>
      <div class="mt-12 space-y-24 lg:mt-0">
        <PreviewExample title="Navbar - With Search">
          <template #chart>
            <BlocksDashboardNavbarWithSearch />
          </template>
          <PreviewCode
            id="dashboard-navbar-with-search"
            category="dashboard/navbar"
            block="with-search"
            :lock-code="true"
          />
        </PreviewExample>
      </div>
    </ClientOnly>

    <ClientOnly>
      <div class="mt-12 space-y-24 lg:mt-0">
        <PreviewExample title="Navbar - With Toolbar">
          <template #chart>
            <BlocksDashboardNavbarWithToolbar />
          </template>
          <PreviewCode
            id="dashboard-navbar-with-toolbar"
            category="dashboard/navbar"
            block="with-toolbar"
            :lock-code="true"
          />
        </PreviewExample>
      </div>
    </ClientOnly>
  </div>
</template>
