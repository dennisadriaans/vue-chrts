<script lang="ts" setup>
import { DottedWorldMap } from "../lib";

// European country ISO codes - comprehensive list for accurate Europe map
const EUROPE_COUNTRIES = [
  // Western Europe
  "FRA", // France
  "DEU", // Germany
  "BEL", // Belgium
  "NLD", // Netherlands
  "LUX", // Luxembourg
  "CHE", // Switzerland
  "AUT", // Austria
  "CZE", // Czechia
  "POL", // Poland
  "SVK", // Slovakia
  "HUN", // Hungary
  "SVN", // Slovenia
  "ITA", // Italy
  "ESP", // Spain
  "PRT", // Portugal
  "GBR", // United Kingdom
  "IRL", // Ireland

  // Nordics
  "DNK", // Denmark
  "SWE", // Sweden
  "FIN", // Finland
  "ISL", // Iceland

  // Baltics
  "EST", // Estonia
  "LVA", // Latvia
  "LTU", // Lithuania

  // // Central Europe
  "HRV", // Croatia
  "SRB", // Serbia
  "BIH", // Bosnia and Herzegovina
  "MNE", // Montenegro
  "MKD", // North Macedonia

  // Eastern Europe
  "UKR", // Ukraine
  "BLR", // Belarus
];

const EUROPEAN_PINS = [
  {
    lat: 48.8566,
    lng: 2.3522,
    svgOptions: { color: "#ef4444", radius: 0.15 },
    data: { city: "Paris" },
  },
  {
    lat: 52.52,
    lng: 13.405,
    svgOptions: { color: "#ef4444", radius: 0.15 },
    data: { city: "Berlin" },
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    svgOptions: { color: "#ef4444", radius: 0.15 },
    data: { city: "London" },
  },
  {
    lat: 41.9028,
    lng: 12.4964,
    svgOptions: { color: "#ef4444", radius: 0.15 },
    data: { city: "Rome" },
  },
  {
    lat: 40.4168,
    lng: -3.7038,
    svgOptions: { color: "#ef4444", radius: 0.15 },
    data: { city: "Madrid" },
  },
  {
    lat: 52.3676,
    lng: 4.9041,
    svgOptions: { color: "#10b981", radius: 0.15 },
    data: { city: "Amsterdam" },
  },
];

const ASIA_COUNTRIES = [
  "CHN", // China
  "IND", // India
  "JPN", // Japan
  "KOR", // South Korea
  "IDN", // Indonesia
  "PAK", // Pakistan
  "BGD", // Bangladesh
  "SAU", // Saudi Arabia
  "IRN", // Iran
];

// USA country ISO code - dotted-map requires 3-letter ISO codes
const USA_COUNTRIES = ["USA"];

// USA Region coordinates for focusing the map
const USA_REGION = {
  lat: { min: 24, max: 50 },
  lng: { min: -125, max: -66 },
};

const USA_PINS = [
  {
    lat: 37.7749,
    lng: -122.4194,
    svgOptions: { color: "#6366f1", radius: 0.3 },
    data: { city: "San Francisco" },
  },
  {
    lat: 34.0522,
    lng: -118.2437,
    svgOptions: { color: "#6366f1", radius: 0.3 },
    data: { city: "Los Angeles" },
  },
  {
    lat: 47.6062,
    lng: -122.3321,
    svgOptions: { color: "#6366f1", radius: 0.3 },
    data: { city: "Seattle" },
  },
  {
    lat: 40.7128,
    lng: -74.006,
    svgOptions: { color: "#f59e0b", radius: 0.3 },
    data: { city: "New York" },
  },
  {
    lat: 42.3601,
    lng: -71.0589,
    svgOptions: { color: "#f59e0b", radius: 0.3 },
    data: { city: "Boston" },
  },
  {
    lat: 25.7617,
    lng: -80.1918,
    svgOptions: { color: "#ec4899", radius: 0.3 },
    data: { city: "Miami" },
  },
  {
    lat: 30.2672,
    lng: -97.7431,
    svgOptions: { color: "#10b981", radius: 0.3 },
    data: { city: "Austin" },
  },
];

const MOSCOW_PIN = [
  {
    lat: 55.7558,
    lng: 37.6173,
    svgOptions: { color: "#f43f5e", radius: 0.2 },
    data: { city: "Moscow" },
  },
];

/**
 * PRECOMPUTED MAP EXAMPLE
 * 
 * The `precomputedMap` property allows you to pass a pre-calculated map object.
 * This is highly beneficial for:
 * 1. Performance: Skips the expensive dot-calculation algorithm on every render.
 * 2. Load Time: The map displays instantly without waiting for CPU-intensive processing.
 * 3. Consistency: Ensures the grid is exactly as you want it.
 * 
 * You can generate this data using `dottedMap.getMap()` and saving it as JSON.
 */
const PRECOMPUTED_EUROPE = {
  height: 100,
  width: 400,
  grid: "diagonal", // Benefit: Save the grid alignment
  color: 'red',
  points: [
    { x: 18, y: 8, lat: 52.52, lng: 13.405, svgOptions: { color: "#10b981", radius: 0.6 } }, // Highlighted Berlin
    { x: 15, y: 10, lat: 48.8566, lng: 2.3522 },
    { x: 14, y: 7, lat: 51.5074, lng: -0.1278 },
    { x: 19, y: 12, lat: 41.9028, lng: 12.4964, svgOptions: { color: "#f43f5e", radius: 0.3 } }, // Smaller Rome
    { x: 12, y: 13, lat: 40.4168, lng: -3.7038 },
    { x: 16, y: 7, lat: 52.3676, lng: 4.9041 },
  ],
};
</script>

<template>
  <div class="p-8 space-y-12 bg-gray-50 min-h-screen">
    

    <section>
      <h1 class="text-3xl font-bold mb-6">Dotted Map Examples</h1>

      <div class="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <!-- World Map - High Performance -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">World Map (Raw SVG)</h2>
          <p class="text-gray-600 mb-4">
            Using <code>useRawSvg</code> for maximum rendering performance.
            Ideal for static backgrounds or large maps.
          </p>
          <div
            class="border border-gray-200 rounded-xl p-6 bg-slate-900 shadow-sm"
          >
            <DottedWorldMap
              height="800px"
              :map-height="60"
              :dot-size="0.5"
              color="#94a3b8"
              grid="vertical"
            />
          </div>
        </div>

        <!-- Europe Map - Performance Focused -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">Europe with Pins</h2>
          <p class="text-gray-600 mb-4">
            Filtered to European countries with custom pins for major cities.
          </p>
          <div
            class="border border-gray-200 rounded-xl p-6 bg-slate-900 shadow-sm"
          >
            <DottedWorldMap
              :map-height="80"
              :dot-size="0.15"
              height="1000px"
              color="#334155"
              :countries="EUROPE_COUNTRIES"
              :pins="EUROPEAN_PINS"
              grid="diagonal"
              shape="hexagon"
              
            />
          </div>
        </div>

        <!-- USA Regional Focus -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">USA Regional Focus</h2>
          <p class="text-gray-600 mb-4">
            Using <code>region</code> prop to focus on North America with tech
            hub pins.
          </p>
          <div
            class="border border-gray-200 rounded-xl p-6 bg-slate-900 shadow-sm"
          >
            <DottedWorldMap
              :map-width="75"
              :dot-size="0.3"
              height="800px"
              color="#1e293b"
              :countries="USA_COUNTRIES"
              :region="USA_REGION"
              :pins="USA_PINS"
              
            />
          </div>
        </div>

        <!-- Stylized Hexagon Map -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">Stylized Hexagons</h2>
          <p class="text-gray-600 mb-4">
            Using <code>shape="hexagon"</code> and
            <code>grid="diagonal"</code> for a modern look.
          </p>
          <div
            class="border border-gray-200 rounded-xl p-6 bg-indigo-950 shadow-sm"
          >
            <DottedWorldMap
              :map-height="75"
              :dot-size="0.1"
              height="800px"
              color="#818cf8"
              shape="hexagon"
              grid="diagonal"
              :pins="MOSCOW_PIN"
              
            />
          </div>
        </div>

        <!-- Asia Map - High Performance -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">Asia (Raw SVG)</h2>
          <p class="text-gray-600 mb-4">
            Using <code>useRawSvg</code> for maximum rendering performance.
            Ideal for static backgrounds or large maps.
          </p>
          <div
            class="border border-gray-200 rounded-xl p-6 bg-slate-900 shadow-sm"
          >
            <DottedWorldMap
              height="800px"
              :map-height="60"
              :dot-size="0.5"
              color="#94a3b8"
              :countries="ASIA_COUNTRIES"
              grid="vertical"
              
            />
          </div>
        </div>

        <!-- Minimalist Background -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">Minimalist Background</h2>
          <p class="text-gray-600 mb-4">
            Low density map with <code>avoidOuterPins</code> and custom
            background.
          </p>
          <div class="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <DottedWorldMap
              :map-height="40"
              :dot-size="0.4"
              height="800px"
              color="#e2e8f0"
              background-color="#f8fafc"
              :avoid-outer-pins="true"
              
              @point-mouse-over="console.log(123)"
            />
          </div>
        </div>

        <!-- High Density Focus (France) -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">
            High Density Focus (France)
          </h2>
          <p class="text-gray-600 mb-4">
            Single country focus with high dot density.
          </p>
          <div
            class="border border-gray-200 rounded-xl p-6 bg-slate-900 shadow-sm"
          >
            <DottedWorldMap
              :map-height="60"
              :dot-size="0.5"
              height="800px"
              color="#e2e8f0"
              :countries="['FRA']"
              
            />
          </div>
        </div>

        <!-- High Density Focus (Germany) -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">
            High Density Focus (Germany)
          </h2>
          <p class="text-gray-600 mb-4">
            Single country focus with high dot density.
          </p>
          <div class="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <DottedWorldMap
              :map-height="60"
              :dot-size="0.5"
              height="800px"
              color="#e2e8f0"
              :countries="['DEU']"
              
            />
          </div>
        </div>

        <!-- Precomputed Map Example -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">Precomputed Map</h2>
          <p class="text-gray-600 mb-4">
            Using the <code>precomputedMap</code> prop to load a pre-calculated
            grid. This is the most performant way to render complex maps as it
            skips the dot-calculation phase entirely.
          </p>
          <div
            class="border border-gray-200 rounded-xl p-6 bg-slate-900 shadow-sm"
          >
            <DottedWorldMap
              height="800px"
              color="#38bdf8"
              :dot-size="0.2"
              grid="diagonal"
              :precomputed-map="PRECOMPUTED_EUROPE"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
