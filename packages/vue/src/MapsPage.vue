<script lang="ts" setup>
import { computed, ref } from "vue";
import { TopoJSONMap } from "../lib";
import { 
  WorldMapTopoJSON, 
  FranceTopoJSON,
  USATopoJSON,
  USCountiesTopoJSON,
  GermanyTopoJSON,
  UKTopoJSON,
  IndiaTopoJSON,
  ChinaTopoJSON,
  WorldMap110mAlphaTopoJSON,
  WorldMapSimplestTopoJSON,
} from "@unovis/ts/maps";
import { MapProjection } from "@unovis/ts";
import { NetherlandsTopoJSON, netherlandsProvincesData, netherlandsCities } from "./data/NetherlandsMapData";


const hoveredArea = ref<string | null>(null);
const selectedMap = ref<string>('world');

// World Map Example with areas and points
const worldData = computed(() => ({
  areas: hoveredArea.value === "US" ? [{ id: "US", color: "#ef4444" }] : [],
  points: [
    {
      id: "amsterdam",
      latitude: 52.3676,
      longitude: 4.9041,
      label: "Amsterdam",
      color: "#3b82f6",
      radius: 8,
    },
    {
      id: "new-york",
      latitude: 40.7128,
      longitude: -74.0060,
      label: "New York",
      color: "#10b981",
      radius: 10,
    },
    {
      id: "tokyo",
      latitude: 35.6762,
      longitude: 139.6503,
      label: "Tokyo",
      color: "#f59e0b",
      radius: 9,
    },
  ],
}));

// France Map Example
const franceData = computed(() => ({
  areas: [],
  points: [],
}));

// USA States Map Example with colors
const usaStatesData = computed(() => ({
  areas: [
    { id: "CA", color: "#3b82f6" },
    { id: "TX", color: "#10b981" },
    { id: "FL", color: "#f59e0b" },
    { id: "NY", color: "#ef4444" },
  ],
  points: [],
}));

// USA Counties Map Example
const usaCountiesData = computed(() => ({
  areas: [],
  points: [],
}));

// Germany Map Example
const germanyData = computed(() => ({
  areas: [
    { id: "DE-BY", color: "#3b82f6" },
    { id: "DE-NW", color: "#10b981" },
  ],
  points: [],
}));

// UK Map Example
const ukData = computed(() => ({
  areas: [],
  points: [],
}));

// India Map Example
const indiaData = computed(() => ({
  areas: [],
  points: [],
}));

// China Map Example
const chinaData = computed(() => ({
  areas: [],
  points: [],
}));

// Netherlands Map Example with all provinces colored
const netherlandsData = computed(() => ({
  areas: netherlandsProvincesData.map(p => ({
    id: p.id,
    color: p.color,
  })),
  points: netherlandsCities.map(c => ({
    id: c.id,
    latitude: c.latitude,
    longitude: c.longitude,
    label: c.name,
    color: "#ffffff",
    radius: Math.sqrt(c.population / 10000),
  })),
}));

// Example with links between points
const worldWithLinksData = computed(() => ({
  areas: [],
  points: [
    { id: "ams", latitude: 52.3676, longitude: 4.9041, label: "Amsterdam", color: "#3b82f6" },
    { id: "nyc", latitude: 40.7128, longitude: -74.0060, label: "New York", color: "#10b981" },
    { id: "tyo", latitude: 35.6762, longitude: 139.6503, label: "Tokyo", color: "#f59e0b" },
  ],
  links: [
    { source: "ams", target: "nyc", color: "#3b82f6", width: 2 },
    { source: "nyc", target: "tyo", color: "#10b981", width: 2 },
    { source: "tyo", target: "ams", color: "#f59e0b", width: 2 },
  ],
}));

// Example with heatmap mode
const worldHeatmapData = computed(() => ({
  areas: [],
  points: Array.from({ length: 100 }, (_, i) => ({
    id: `point-${i}`,
    latitude: -60 + Math.random() * 120,
    longitude: -180 + Math.random() * 360,
    color: "#3b82f6",
    radius: 5 + Math.random() * 10,
  })),
}));

</script>

<template>
  <div class="p-8 space-y-12 bg-gray-50 min-h-screen">
    <!-- Header -->
    <section>
      <h1 class="text-4xl font-bold mb-2">TopoJSON Maps Examples</h1>
      <p class="text-gray-600">
        Comprehensive examples of TopoJSON maps using Unovis and Vue. All maps support
        areas, points, links, custom projections, and zoom interactions.
      </p>
    </section>

    <!-- Map Selector -->
    <section class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">Quick Navigation</h2>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="map in ['world', 'world-links', 'world-heatmap', 'usa-states', 'usa-counties', 'france', 'germany', 'uk', 'india', 'china', 'netherlands']"
          :key="map"
          @click="selectedMap = map"
          :class="[
            'px-4 py-2 rounded-md font-medium transition-colors',
            selectedMap === map
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ map.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') }}
        </button>
      </div>
    </section>

    <!-- World Map with Points -->
    <section v-if="selectedMap === 'world'" class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">World Map with Areas & Points</h2>
      <p class="text-gray-600 mb-4">
        Interactive world map with countries. Hover over the USA to highlight it.
        Click on points to zoom in.
      </p>
      <div class="flex gap-8">
        <TopoJSONMap
          class="w-full h-[500px] border border-gray-200 rounded"
          :data="worldData"
          :topojson="WorldMapTopoJSON"
          map-feature-key="countries"
          :zoom-factor="1"
          @mouseenter="(d: any) => (hoveredArea = d.id)"
          @mouseleave="() => (hoveredArea = null)"
        />
      </div>
      <div class="mt-4 text-sm text-gray-500">
        Hovered area: <span class="font-mono">{{ hoveredArea || 'none' }}</span>
      </div>
    </section>

    <!-- World Map with Links -->
    <section v-if="selectedMap === 'world-links'" class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">World Map with Links Between Points</h2>
      <p class="text-gray-600 mb-4">
        Demonstrates connections between cities using links.
      </p>
      <TopoJSONMap
        class="w-full h-[500px] border border-gray-200 rounded"
        :data="worldWithLinksData"
        :topojson="WorldMapSimplestTopoJSON"
        map-feature-key="countries"
        :zoom-factor="1"
      />
    </section>

    <!-- World Map Heatmap Mode -->
    <section v-if="selectedMap === 'world-heatmap'" class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">World Map with Heatmap Mode</h2>
      <p class="text-gray-600 mb-4">
        Random points with blur effect creating a heatmap visualization.
      </p>
      <TopoJSONMap
        class="w-full h-[500px] border border-gray-200 rounded"
        :data="worldHeatmapData"
        :topojson="WorldMapSimplestTopoJSON"
        map-feature-key="countries"
        :zoom-factor="1"
        :heatmap-mode="true"
        :heatmap-mode-blur-std-deviation="15"
      />
    </section>

    <!-- USA States Map -->
    <section v-if="selectedMap === 'usa-states'" class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">USA States Map</h2>
      <p class="text-gray-600 mb-4">
        Map of USA with highlighted states (California, Texas, Florida, New York).
      </p>
      <TopoJSONMap
        class="w-full h-[500px] border border-gray-200 rounded"
        :data="usaStatesData"
        :topojson="USATopoJSON"
        map-feature-key="states"
        :zoom-factor="1.2"
      />
    </section>

    <!-- USA Counties Map -->
    <section v-if="selectedMap === 'usa-counties'" class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">USA Counties Map</h2>
      <p class="text-gray-600 mb-4">
        Detailed map showing all US counties. Zoom in to see county boundaries.
      </p>
      <TopoJSONMap
        class="w-full h-[500px] border border-gray-200 rounded"
        :data="usaCountiesData"
        :topojson="USCountiesTopoJSON"
        map-feature-key="counties"
        :zoom-factor="1.2"
      />
    </section>

    <!-- France Map -->
    <section v-if="selectedMap === 'france'" class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">France Regions Map</h2>
      <p class="text-gray-600 mb-4">
        Map of France showing all regions.
      </p>
      <TopoJSONMap
        class="w-full h-[500px] border border-gray-200 rounded"
        :data="franceData"
        :topojson="FranceTopoJSON"
        map-feature-key="regions"
        :zoom-factor="1.5"
      />
    </section>

    <!-- Germany Map -->
    <section v-if="selectedMap === 'germany'" class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">Germany Regions Map</h2>
      <p class="text-gray-600 mb-4">
        Map of Germany with highlighted regions (Bavaria, North Rhine-Westphalia).
      </p>
      <TopoJSONMap
        class="w-full h-[500px] border border-gray-200 rounded"
        :data="germanyData"
        :topojson="GermanyTopoJSON"
        map-feature-key="regions"
        :zoom-factor="1.5"
      />
    </section>

    <!-- UK Map -->
    <section v-if="selectedMap === 'uk'" class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">United Kingdom Regions Map</h2>
      <p class="text-gray-600 mb-4">
        Map of the United Kingdom showing all regions.
      </p>
      <TopoJSONMap
        class="w-full h-[500px] border border-gray-200 rounded"
        :data="ukData"
        :topojson="UKTopoJSON"
        map-feature-key="regions"
        :zoom-factor="1.5"
      />
    </section>

    <!-- India Map -->
    <section v-if="selectedMap === 'india'" class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">India Regions Map</h2>
      <p class="text-gray-600 mb-4">
        Map of India showing all states and territories.
      </p>
      <TopoJSONMap
        class="w-full h-[500px] border border-gray-200 rounded"
        :data="indiaData"
        :topojson="IndiaTopoJSON"
        map-feature-key="regions"
        :zoom-factor="1.2"
      />
    </section>

    <!-- China Map -->
    <section v-if="selectedMap === 'china'" class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">China Provinces Map</h2>
      <p class="text-gray-600 mb-4">
        Map of China showing all provinces.
      </p>
      <TopoJSONMap
        class="w-full h-[500px] border border-gray-200 rounded"
        :data="chinaData"
        :topojson="ChinaTopoJSON"
        map-feature-key="provinces"
        :zoom-factor="1.2"
      />
    </section>

    <!-- Netherlands Map -->
    <section v-if="selectedMap === 'netherlands'" class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">Netherlands Provinces Map</h2>
      <p class="text-gray-600 mb-4">
        Map of the Netherlands showing all 12 provinces with colors and major cities.
        Point sizes represent population.
      </p>
      <TopoJSONMap
        class="w-full h-[600px] border border-gray-200 rounded"
        :data="netherlandsData"
        :topojson="NetherlandsTopoJSON"
        map-feature-key="netherlands"
        :zoom-factor="2"
        :area-id="(d: any) => d.id"
      />
      <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        <div
          v-for="province in netherlandsProvincesData"
          :key="province.id"
          class="flex items-center gap-2 text-sm"
        >
          <div
            class="w-4 h-4 rounded"
            :style="{ backgroundColor: province.color }"
          ></div>
          <span>{{ province.name }}</span>
        </div>
      </div>
    </section>

    <!-- Different Projections Example -->
    <section class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">Different Map Projections</h2>
      <p class="text-gray-600 mb-4">
        The same data visualized with different projections.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-semibold mb-2">Mercator Projection</h3>
          <TopoJSONMap
            class="w-full h-[300px] border border-gray-200 rounded"
            :data="worldData"
            :topojson="WorldMapSimplestTopoJSON"
            map-feature-key="countries"
            :projection="MapProjection.Mercator()"
          />
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-2">Equal Earth Projection</h3>
          <TopoJSONMap
            class="w-full h-[300px] border border-gray-200 rounded"
            :data="worldData"
            :topojson="WorldMapSimplestTopoJSON"
            map-feature-key="countries"
            :projection="MapProjection.EqualEarth()"
          />
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-2">Orthographic Projection</h3>
          <TopoJSONMap
            class="w-full h-[300px] border border-gray-200 rounded"
            :data="worldData"
            :topojson="WorldMapSimplestTopoJSON"
            map-feature-key="countries"
            :projection="MapProjection.Orthographic()"
          />
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-2">Natural Earth Projection</h3>
          <TopoJSONMap
            class="w-full h-[300px] border border-gray-200 rounded"
            :data="worldData"
            :topojson="WorldMapSimplestTopoJSON"
            map-feature-key="countries"
            :projection="MapProjection.NaturalEarth1()"
          />
        </div>
      </div>
    </section>

    <!-- Features Summary -->
    <section class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">Available Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-semibold mb-2">✓ Built-in Maps</h3>
          <ul class="list-disc list-inside text-gray-600 space-y-1">
            <li>World Map (3 detail levels)</li>
            <li>USA States & Counties</li>
            <li>France Regions</li>
            <li>Germany Regions</li>
            <li>UK Regions</li>
            <li>India Regions</li>
            <li>China Provinces</li>
            <li>Netherlands Provinces (custom)</li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-2">✓ Map Elements</h3>
          <ul class="list-disc list-inside text-gray-600 space-y-1">
            <li>Areas with custom colors</li>
            <li>Points with labels and sizes</li>
            <li>Links between points</li>
            <li>Heatmap mode</li>
            <li>Tooltips on hover</li>
            <li>Click events</li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-2">✓ Projections</h3>
          <ul class="list-disc list-inside text-gray-600 space-y-1">
            <li>Mercator</li>
            <li>Equal Earth</li>
            <li>Orthographic</li>
            <li>Natural Earth</li>
            <li>And 15+ more...</li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-2">✓ Interactions</h3>
          <ul class="list-disc list-inside text-gray-600 space-y-1">
            <li>Pan & Zoom</li>
            <li>Zoom to points</li>
            <li>Configurable zoom extent</li>
            <li>Custom zoom duration</li>
            <li>Disable zoom option</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

