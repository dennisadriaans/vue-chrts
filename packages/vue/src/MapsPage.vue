<script lang="ts" setup>
import { computed, ref } from "vue";
import { TopoJSONMap, GeoJSONGridMap, DottedWorldMap } from "../lib";
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

// European country ISO codes - comprehensive list for accurate Europe map
const EUROPE_COUNTRIES = [
  "ALB", // Albania
  "AUT", // Austria
  "BLR", // Belarus
  "BEL", // Belgium
  "BIH", // Bosnia and Herzegovina
  "BGR", // Bulgaria
  "HRV", // Croatia
  "CYP", // Cyprus
  "CZE", // Czech Republic
  "DNK", // Denmark
  "EST", // Estonia
  "FIN", // Finland
  "FRA", // France
  "DEU", // Germany
  "GRC", // Greece
  "HUN", // Hungary
  "ISL", // Iceland
  "IRL", // Ireland
  "ITA", // Italy
  "LVA", // Latvia
  "LTU", // Lithuania
  "LUX", // Luxembourg
  "MKD", // Macedonia
  "MLT", // Malta
  "MDA", // Moldova
  "MNE", // Montenegro
  "NLD", // Netherlands
  "NOR", // Norway
  "POL", // Poland
  "PRT", // Portugal
  "ROU", // Romania
  "SRB", // Serbia
  "SVK", // Slovakia
  "SVN", // Slovenia
  "ESP", // Spain
  "SWE", // Sweden
  "CHE", // Switzerland
  "UKR", // Ukraine
  "GBR", // United Kingdom
];

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
          A perfectly clipped map of World using <code>dotted-map</code> with
          exact country codes. This map excludes sea areas and neighboring parts
          of Asia/Africa.
        </p>
        <div
          class=""
        >
          <DottedWorldMap
            height="600px"
            :dot-size="2"
            color="#4f46e5"
            :map-height="100"
            :countries="WORLD_COUNTRIES"
            grid="diagonal"
          />
        </div>
      </div>


      <!-- Europe Dotted Map Example -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-4">Europe Dotted Map</h2>
        <p class="text-gray-600 mb-4">
          A perfectly clipped map of Europe using <code>dotted-map</code> with
          exact country codes. This map excludes sea areas and neighboring parts
          of Asia/Africa.
        </p>
        <div
          class="border border-gray-200 rounded-lg p-4 bg-white dark:bg-gray-900"
        >
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

    <!-- USA Map -->
    <section class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-2">USA States</h2>
      <p class="text-gray-600 mb-4">
        Map of the United States with highlighted states (California, Texas,
        Florida, New York).
      </p>
      <TopoJSONMap
        class="w-full h-[500px] border border-gray-200 rounded"
        :data="usaData"
        :topojson="USATopoJSON"
        map-feature-key="states"
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
  </div>
</template>
