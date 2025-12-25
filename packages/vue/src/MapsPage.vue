<script lang="ts" setup>
import { computed, ref } from "vue";
import { DottedWorldMap, TopoJSONMap } from "../lib";
import { WorldMapTopoJSON, FranceTopoJSON } from "@unovis/ts/maps";


const hoveredArea = ref<string | null>(null);

// When a point is clicked, we'll set it to zoom/fit to that point
const areas = computed(() =>
  hoveredArea.value === "US" ? [{ id: "US", color: "red" }] : []
);

const worldData = computed(() => ({
  areas: areas.value,
  points: [
    {
      id: "ams",
      latitude: 54,
      longitude: 4.95035,
      label: "Amsterdam",
      color: "transparent",
    },
  ],
}))

const franceData = computed(() => ({
  areas: [],
  points: [],
}))


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
        <h2 class="text-2xl font-bold mb-4">TopoJSON Map</h2>
        <TopoJSONMap
          class="w-[250px] h-[550px] relative"
          :data="worldData"
          :topojson="WorldMapTopoJSON"
          map-feature-key="countries"
          @mouseenter="(d: any) => (hoveredArea = d.id)"
          @mouseleave="() => (hoveredArea = null)"
        />
      </div>

      <div>
        <h2 class="text-2xl font-bold mb-4">TopoJSON Map</h2>
        <TopoJSONMap
          class="w-[250px] h-[550px] relative"
          :data="franceData"
          :topojson="FranceTopoJSON"
          map-feature-key="regions"
        />
      </div>

      <!-- <div class="bg-red-500">
        <h3 class="text-lg font-semibold mb-2">World</h3>
        <DottedWorldMap
          height="1000px"
          :dot-size="4"
          color="purple"
          :map-height="100"
        />
      </div> -->
    </section>
  </div>
</template>
