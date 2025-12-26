<script lang="ts" setup>
import { computed, ref } from "vue";
import { DottedWorldMap, TopoJSONMap, GeoJSONGridMap } from "../lib";
import { WorldMapTopoJSON, FranceTopoJSON } from "@unovis/ts/maps";

import NetherlandsTopoJSON from './data/NetherlandsTopoJSON.json';

console.log(FranceTopoJSON, 'FranceTopoJSON')
console.log(NetherlandsTopoJSON, 'NetherlandsTopoJSON')

// European country ISO codes - comprehensive list for accurate Europe map
const EUROPE_COUNTRIES = [
  'ALB', // Albania
  'AUT', // Austria
  'BLR', // Belarus
  'BEL', // Belgium
  'BIH', // Bosnia and Herzegovina
  'BGR', // Bulgaria
  'HRV', // Croatia
  'CYP', // Cyprus
  'CZE', // Czech Republic
  'DNK', // Denmark
  'EST', // Estonia
  'FIN', // Finland
  'FRA', // France
  'DEU', // Germany
  'GRC', // Greece
  'HUN', // Hungary
  'ISL', // Iceland
  'IRL', // Ireland
  'ITA', // Italy
  'LVA', // Latvia
  'LTU', // Lithuania
  'LUX', // Luxembourg
  'MKD', // Macedonia
  'MLT', // Malta
  'MDA', // Moldova
  'MNE', // Montenegro
  'NLD', // Netherlands
  'NOR', // Norway
  'POL', // Poland
  'PRT', // Portugal
  'ROU', // Romania
  'SRB', // Serbia
  'SVK', // Slovakia
  'SVN', // Slovenia
  'ESP', // Spain
  'SWE', // Sweden
  'CHE', // Switzerland
  'UKR', // Ukraine
  'GBR', // United Kingdom
];

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

const netherlandsData = computed(() => ({
  areas: [],
  points: [],
}))

// NetherlandsTopoJSON doesn't use the same object key as Unovis' FranceTopoJSON.
// Unovis France uses "regions"; this dataset uses a different key under `topojson.objects`.
const netherlandsMapFeatureKey = computed(() => {
  const objects = (NetherlandsTopoJSON as any)?.objects as Record<string, unknown> | undefined
  if (!objects) return 'regions'
  if ('regions' in objects) return 'regions'
  const [firstKey] = Object.keys(objects)
  return firstKey ?? 'regions'
})


</script>

<template>
  <div class="p-8 space-y-8">
    <section>
      <h1 class="text-3xl font-bold mb-6">Map Examples</h1>
      
      <!-- Europe Dotted Map Example -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-4">Europe Dotted Map</h2>
        <p class="text-gray-600 mb-4">
          A perfectly clipped map of Europe using <code>dotted-map</code> with exact country codes.
          This map excludes sea areas and neighboring parts of Asia/Africa.
        </p>
        <div class="border border-gray-200 rounded-lg p-4 bg-white dark:bg-gray-900">
          <DottedWorldMap
            height="900px"
            :dot-size="1.5"
            color="#4f46e5"
            :map-height="100"
            :countries="EUROPE_COUNTRIES"
            grid="diagonal"
          />
        </div>
      </div>

      <!-- TopoJSON World Map -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-4">TopoJSON World Map</h2>
        <p class="text-gray-600 mb-4">
          Interactive world map using TopoJSON data from Unovis.
        </p>
        <div class="border border-gray-200 rounded-lg p-4 bg-white dark:bg-gray-900">
          <TopoJSONMap
            class="w-full h-[550px] relative"
            :data="worldData"
            :topojson="WorldMapTopoJSON"
            map-feature-key="countries"
            @mouseenter="(d: any) => (hoveredArea = d.id)"
            @mouseleave="() => (hoveredArea = null)"
          />
        </div>
      </div>

      <!-- TopoJSON France Map -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-4">TopoJSON France Regions Map</h2>
        <p class="text-gray-600 mb-4">
          Detailed regional map of France using TopoJSON data.
        </p>
        <div class="border border-gray-200 rounded-lg p-4 bg-white dark:bg-gray-900">
          <TopoJSONMap
            class="w-full h-[550px] relative"
            :data="franceData"
            :topojson="FranceTopoJSON"
            map-feature-key="regions"
          />
        </div>
      </div>

      <!-- TopoJSON Netherlands Map -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-4">TopoJSON Netherlands Regions Map</h2>
        <p class="text-gray-600 mb-4">
          Detailed regional map of Netherlands using TopoJSON data.
        </p>
        <div class="border border-gray-200 rounded-lg p-4 bg-white dark:bg-gray-900">
          <TopoJSONMap
            class="w-full h-[550px] relative"
            :data="netherlandsData"
            :topojson="NetherlandsTopoJSON"
            :map-feature-key="netherlandsMapFeatureKey"
          />
        </div>
      </div>
    </section>
  </div>
</template>
