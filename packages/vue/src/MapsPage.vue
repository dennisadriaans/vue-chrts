<script lang="ts" setup>
import {
  DottedWorldMap,
} from "../lib";
</script>

<template>
  <div class="p-8 space-y-8">
    <section>
      <h2 class="text-2xl font-bold mb-4">Dotted Maps</h2>
      <p class="text-gray-600 mb-4">
        Generated using <code>dotted-map</code> and rendered with Unovis
        <code>VisScatter</code>.
      </p>

  <div>
          <h3 class="text-lg font-semibold mb-2">World</h3>
          <DottedWorldMap
            height="600px"
            :dot-size="1.5"
            color="#ffffff"
            :map-height="100"
          />
        </div>
    </section>
  </div>

</template>
