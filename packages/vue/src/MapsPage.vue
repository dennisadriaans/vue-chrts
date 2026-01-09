<script lang="ts" setup>
import { computed, ref } from "vue";
import { TopoJSONMap, DottedMap } from "../lib";
import { geoAlbersUsa } from "d3-geo";
import {
  WorldMapTopoJSON,
  FranceTopoJSON,
  USATopoJSON,
  GermanyTopoJSON,
  UKTopoJSON,
  ChinaTopoJSON,
  IndiaTopoJSON,
  USCountiesTopoJSON,
} from "@unovis/ts/maps";

import NetherlandsTopoJSON from "./data/NetherlandsTopoJSON.json";

const usaProjection = geoAlbersUsa();

const hoveredArea = ref<string | null>(null);

// World Map with interactive areas and points
const areas = computed(() =>
  hoveredArea.value === "US" ? [{ id: "US", color: "#ef4444" }] : []
);

const worldData = computed(() => ({
  areas: areas.value,
  points: [
    {
      id: "ams",
      latitude: 52.3676,
      longitude: 4.9041,
      label: "Amsterdam",
      color: "#3b82f6",
    },
    {
      id: "nyc",
      latitude: 40.7128,
      longitude: -74.006,
      label: "New York",
      color: "#10b981",
    },
    {
      id: "tyo",
      latitude: 35.6762,
      longitude: 139.6503,
      label: "Tokyo",
      color: "#f59e0b",
    },
  ],
}));

// France Map
const franceData = computed(() => ({
  areas: [],
  points: [],
}));

const netherlandsData = computed(() => ({
  areas: [],
  points: [],
}));

// NetherlandsTopoJSON doesn't use the same object key as Unovis' FranceTopoJSON.
// Unovis France uses "regions"; this dataset uses a different key under `topojson.objects`.
const netherlandsMapFeatureKey = computed(() => {
  const objects = (NetherlandsTopoJSON as any)?.objects as
    | Record<string, unknown>
    | undefined;
  if (!objects) return "regions";
  if ("regions" in objects) return "regions";
  const [firstKey] = Object.keys(objects);
  return firstKey ?? "regions";
});

// USA Map with highlighted states
const usaData = computed(() => ({
  areas: [
    { id: "6", color: "#3b82f6" }, // California
    { id: "48", color: "#10b981" }, // Texas
    { id: "12", color: "#f59e0b" }, // Florida
    { id: "36", color: "#ef4444" }, // New York
  ],
  points: [],
}));

// USA Counties Map
const usaCountiesData = computed(() => ({
  areas: [],
  points: [],
}));

// Germany Map
const germanyData = computed(() => ({
  areas: [
    { id: "DE-BY", color: "#3b82f6" },
    { id: "DE-NW", color: "#10b981" },
  ],
  points: [],
}));

// UK Map
const ukData = computed(() => ({
  areas: [],
  points: [],
}));

// India Map
const indiaData = computed(() => ({
  areas: [],
  points: [],
}));

// China Map
const chinaData = computed(() => ({
  areas: [],
  points: [],
}));
</script>

<template>
  <div class="p-8 space-y-12 bg-gray-50 min-h-screen">
    <!-- Header -->
    <section>
      <h1 class="text-3xl font-bold mb-6">Map Examples</h1>

      <!-- World Dotted Map Example -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-4">World Dotted Map</h2>
        <p class="text-gray-600 mb-4">
          A perfectly clipped map of the world using
          <code>dotted-map</code> with exact country codes. This map excludes
          sea areas and neighboring parts of Asia/Africa.
        </p>
        <div
          class="border border-gray-200 rounded-lg p-4 bg-white dark:bg-gray-900"
        >
          <DottedMap 
            :dot-size="0.5"
            color="#3b82f6" 
            :pins="[
              { lat: 40.73061, lng: -73.935242, svgOptions: { color: '#ef4444', radius: 0.8 } },
              { lat: 48.8534, lng: 2.3488, svgOptions: { color: '#10b981', radius: 0.8 } }
            ]"
          />
        </div>
      </div>

      <!-- TopoJSON World Map -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-4">TopoJSON World Map</h2>
        <p class="text-gray-600 mb-4">
          Interactive world map using TopoJSON data from Unovis.
        </p>
        <div
          class="border border-gray-200 rounded-lg p-4 bg-white dark:bg-gray-900"
        >
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
    </section>

    <!-- France Map -->
    <section class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-2">France Regions</h2>
      <p class="text-gray-600 mb-4">
        Map of France showing all administrative regions.
      </p>
      <TopoJSONMap
        class="w-full h-[500px] border border-gray-200 rounded"
        :data="franceData"
        :topojson="FranceTopoJSON"
        map-feature-key="regions"
      />
    </section>

    <!-- USA Single Map -->
    <section class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-2">USA</h2>
      <p class="text-gray-600 mb-4">
        Detailed map of the United States showing all counties. Zoom in to see
        county boundaries.
      </p>
      <TopoJSONMap
        class="w-full h-[500px] border border-gray-200 rounded"
        :data="usaCountiesData"
        :topojson="USATopoJSON"
        map-feature-key="states"
        :projection="usaProjection"
      />
    </section>

    <!-- USA Counties Map -->
    <section class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-2">USA Counties</h2>
      <p class="text-gray-600 mb-4">
        Detailed map of the United States showing all counties. Zoom in to see
        county boundaries.
      </p>
      <TopoJSONMap
        class="w-full h-[500px] border border-gray-200 rounded"
        :data="usaCountiesData"
        :topojson="USCountiesTopoJSON"
        map-feature-key="counties"
        :projection="usaProjection"
      />
    </section>

    <!-- Germany Map -->
    <section class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-2">Germany Regions</h2>
      <p class="text-gray-600 mb-4">
        Map of Germany with highlighted regions (Bavaria, North
        Rhine-Westphalia).
      </p>
      <TopoJSONMap
        class="w-full h-[500px] border border-gray-200 rounded"
        :data="germanyData"
        :topojson="GermanyTopoJSON"
        map-feature-key="regions"
      />
    </section>

    <!-- UK Map -->
    <section class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-2">United Kingdom Regions</h2>
      <p class="text-gray-600 mb-4">
        Map of the United Kingdom showing all regions.
      </p>
      <TopoJSONMap
        class="w-full h-[500px] border border-gray-200 rounded"
        :data="ukData"
        :topojson="UKTopoJSON"
        map-feature-key="regions"
      />
    </section>

    <!-- India Map -->
    <section class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-2">India Regions</h2>
      <p class="text-gray-600 mb-4">
        Map of India showing all states and territories.
      </p>
      <TopoJSONMap
        class="w-full h-[500px] border border-gray-200 rounded"
        :data="indiaData"
        :topojson="IndiaTopoJSON"
        map-feature-key="regions"
      />
    </section>

    <!-- China Map -->
    <section class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-2">China Provinces</h2>
      <p class="text-gray-600 mb-4">Map of China showing all provinces.</p>
      <TopoJSONMap
        class="w-full h-[500px] border border-gray-200 rounded"
        :data="chinaData"
        :topojson="ChinaTopoJSON"
        map-feature-key="provinces"
      />
    </section>

    <!-- Available Maps Summary -->
    <section class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4">Available Maps</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 class="text-lg font-semibold mb-2">
            ✓ Built-in Maps from @unovis/ts/maps
          </h3>
          <ul class="list-disc list-inside text-gray-600 space-y-1">
            <li>WorldMapTopoJSON - World countries</li>
            <li>WorldMap110mAlphaTopoJSON - World (simplified)</li>
            <li>WorldMapSimplestTopoJSON - World (basic)</li>
            <li>USATopoJSON - USA states</li>
            <li>USCountiesTopoJSON - USA counties</li>
            <li>FranceTopoJSON - France regions</li>
            <li>GermanyTopoJSON - Germany regions</li>
            <li>UKTopoJSON - UK regions</li>
            <li>IndiaTopoJSON - India regions</li>
            <li>ChinaTopoJSON - China provinces</li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-2">✓ Features</h3>
          <ul class="list-disc list-inside text-gray-600 space-y-1">
            <li>Interactive areas with hover effects</li>
            <li>Custom points with labels</li>
            <li>Area highlighting with custom colors</li>
            <li>Zoom and pan controls</li>
            <li>Tooltips on hover</li>
            <li>Event handlers (click, hover)</li>
            <li>Responsive layouts</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2 mt-4">✓ Customization</h3>
          <ul class="list-disc list-inside text-gray-600 space-y-1">
            <li>Custom TopoJSON data support</li>
            <li>Configurable zoom levels</li>
            <li>Custom colors and styles</li>
            <li>Point labels and markers</li>
          </ul>
        </div>
      </div>

      <!-- TopoJSON Netherlands Map -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-4">
          TopoJSON Netherlands Regions Map
        </h2>
        <p class="text-gray-600 mb-4">
          Detailed regional map of Netherlands using TopoJSON data.
        </p>
        <div
          class="border border-gray-200 rounded-lg p-4 bg-white dark:bg-gray-900"
        >
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
