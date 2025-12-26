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
]

const EUROPEAN_PINS = [
  { lat: 48.8566, lng: 2.3522, svgOptions: { color: "#ef4444", radius: 0.15 }, data: { city: "Paris" } },
  { lat: 52.5200, lng: 13.4050, svgOptions: { color: "#ef4444", radius: 0.15 }, data: { city: "Berlin" } },
  { lat: 51.5074, lng: -0.1278, svgOptions: { color: "#ef4444", radius: 0.15 }, data: { city: "London" } },
  { lat: 41.9028, lng: 12.4964, svgOptions: { color: "#ef4444", radius: 0.15 }, data: { city: "Rome" } },
  { lat: 40.4168, lng: -3.7038, svgOptions: { color: "#ef4444", radius: 0.15 }, data: { city: "Madrid" } },
  { lat: 52.3676, lng: 4.9041, svgOptions: { color: "#10b981", radius: 0.15 }, data: { city: "Amsterdam" } },
];

const usaRegion = {
  lat: { min: 24, max: 50 },
  lng: { min: -125, max: -66 }
};

const techHubs = [
  { lat: 37.7749, lng: -122.4194, svgOptions: { color: "#6366f1", radius: 1.5 }, data: { city: "San Francisco" } },
  { lat: 34.0522, lng: -118.2437, svgOptions: { color: "#6366f1", radius: 1.2 }, data: { city: "Los Angeles" } },
  { lat: 47.6062, lng: -122.3321, svgOptions: { color: "#6366f1", radius: 1.2 }, data: { city: "Seattle" } },
  { lat: 40.7128, lng: -74.0060, svgOptions: { color: "#f59e0b", radius: 1.5 }, data: { city: "New York" } },
  { lat: 42.3601, lng: -71.0589, svgOptions: { color: "#f59e0b", radius: 1.2 }, data: { city: "Boston" } },
  { lat: 25.7617, lng: -80.1918, svgOptions: { color: "#ec4899", radius: 1.2 }, data: { city: "Miami" } },
  { lat: 30.2672, lng: -97.7431, svgOptions: { color: "#10b981", radius: 1.2 }, data: { city: "Austin" } },
];
</script>

<template>
  <div class="p-8 space-y-12 bg-gray-50 min-h-screen">
    <section>
      <h1 class="text-3xl font-bold mb-6">Dotted Map Examples</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- World Map - High Performance -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">World Map (Raw SVG)</h2>
          <p class="text-gray-600 mb-4">
            Using <code>useRawSvg</code> for maximum rendering performance. Ideal for static backgrounds or large maps.
          </p>
          <div class="border border-gray-200 rounded-xl p-6 bg-slate-900 shadow-sm">
            <DottedWorldMap
              height="400px"
              :map-height="60"
              :dot-size="0.5"
              color="#94a3b8"
              grid="vertical"
              :use-raw-svg="true"
            />
          </div>
        </div>

        <!-- Europe Map - Performance Focused -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">Europe with Pins</h2>
          <p class="text-gray-600 mb-4">
            Filtered to European countries with custom pins for major cities.
          </p>
          <div class="border border-gray-200 rounded-xl p-6 bg-slate-900 shadow-sm">
            <DottedWorldMap
              :map-height="80"
              :dot-size="0.15"
              height="400px"
              color="#334155"
              :countries="EUROPE_COUNTRIES"
              :pins="EUROPEAN_PINS"
              grid="diagonal"
              shape="hexagon" 
              :use-raw-svg="true"
            />
          </div>
        </div>

        <!-- USA Regional Focus -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">USA Regional Focus</h2>
          <p class="text-gray-600 mb-4">
            Using <code>region</code> prop to focus on North America with tech hub pins.
          </p>
          <div class="border border-gray-200 rounded-xl p-6 bg-slate-900 shadow-sm">
            <DottedWorldMap
              :map-width="100"
              :dot-size="0.5"
              height="400px"
              color="#1e293b"
              :region="usaRegion"
              :pins="techHubs"
              :use-raw-svg="true"
            />
          </div>
        </div>

        <!-- Stylized Hexagon Map -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">Stylized Hexagons</h2>
          <p class="text-gray-600 mb-4">
            Using <code>shape="hexagon"</code> and <code>grid="diagonal"</code> for a modern look.
          </p>
          <div class="border border-gray-200 rounded-xl p-6 bg-indigo-950 shadow-sm">
            <DottedWorldMap
              :map-height="75"
              :dot-size="0.1"
              height="400px"
              color="#818cf8"
              shape="hexagon"
              grid="diagonal"
              :use-raw-svg="true"
            />
          </div>
        </div>

         <!-- Asia Map - High Performance -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">Asia (Raw SVG)</h2>
          <p class="text-gray-600 mb-4">
            Using <code>useRawSvg</code> for maximum rendering performance. Ideal for static backgrounds or large maps.
          </p>
          <div class="border border-gray-200 rounded-xl p-6 bg-slate-900 shadow-sm">
            <DottedWorldMap
              height="400px"
              :map-height="60"
              :dot-size="0.5"
              color="#94a3b8"
              :countries="ASIA_COUNTRIES"
              grid="vertical"
              :use-raw-svg="true"
            />
          </div>
        </div>

        <!-- Minimalist Background -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">Minimalist Background</h2>
          <p class="text-gray-600 mb-4">
            Low density map with <code>avoidOuterPins</code> and custom background.
          </p>
          <div class="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <DottedWorldMap
              :map-height="40"
              :dot-size="0.4"
              height="400px"
              color="#e2e8f0"
              background-color="#f8fafc"
              :avoid-outer-pins="true"
              :use-raw-svg="true"
            />
          </div>
        </div>

        <!-- High Density Focus (France) -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">High Density Focus (France)</h2>
          <p class="text-gray-600 mb-4">
            Single country focus with high dot density.
          </p>
          <div class="border border-gray-200 rounded-xl p-6 bg-slate-900 shadow-sm">
            <DottedWorldMap
              :map-height="100"
              :dot-size="0.5"
              height="400px"
              color="#38bdf8"
              :countries="['FRA']"
              :use-raw-svg="true"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
