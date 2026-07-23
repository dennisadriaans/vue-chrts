<script lang="ts" setup>

</script>

<template>
  <div class="max-w-screen-2xl mx-auto py-48 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
    <UCard>
      <ElementsMiniBarChart />
    </UCard>

    <UCard
      variant="subtle"
      :ui="{
        body: 'h-full'
      }"
    >
      <ElementsCompanyLogos />
    </UCard>

    <UCard>
      <ElementsModernChart />
    </UCard>

    <UCard>
      <ElementsModernDonut />
    </UCard>

    <UCard>
      <ElementsBrowsers />
    </UCard>

    <UCard>
      <ElementsTeamSales />
    </UCard>

    <UCard>
      <ElementsMiniLineChart />
    </UCard>
  </div>
</template>
