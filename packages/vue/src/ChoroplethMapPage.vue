<script lang="ts" setup>
import { computed, ref } from "vue";
import { TopoJSONMap } from "../lib";
import { WorldMapTopoJSON } from "@unovis/ts/maps";
import { ChoroplethMapData } from "./data/ChoroplethMapData";
import TopBar from "./elements/TopBar.vue";
import Card from "./elements/Card.vue";

const hoveredArea = ref<string | null>(null);
const maxCount = Math.max(...ChoroplethMapData.map((d) => d.count));

const worldData = computed(() => ({
  areas: ChoroplethMapData.map((d) => ({
    id: d.id,
    count: d.count,
    name: d.name,
  })),
  points: [],
}));

const areaColor = (d: any) => {
  const isHovered =
    hoveredArea.value === d.id || hoveredArea.value === d.properties?.id;
  if (isHovered) return "#3b82f6"; // Highlight color

  if (!d.count) return "#f1f5f9"; // Slate-100
  const t = d.count / maxCount;

  // Custom color scale matching Google Analytics blue
  if (t > 0.8) return "#1e40af";
  if (t > 0.6) return "#2563eb";
  if (t > 0.4) return "#3b82f6";
  if (t > 0.2) return "#60a5fa";
  return "#dbeafe";
};

// Sort data for the list
const sortedData = [...ChoroplethMapData].sort((a, b) => b.count - a.count);
</script>

<template>
  <div class="min-h-screen bg-white">
    <TopBar title="Choropleth Map" />

    <div class="p-8 max-w-7xl mx-auto">
      <div
        class="flex flex-col md:flex-row justify-between items-start mb-6 border-b border-gray-100 pb-4"
      >
        <div>
          <h2
            class="text-xl font-medium text-gray-800 border-b-2 border-dashed border-gray-300 inline-block"
          >
            Event count
          </h2>
          <span class="text-xl font-medium text-gray-800 mx-2">by</span>
          <h2
            class="text-xl font-medium text-gray-800 border-b-2 border-dashed border-gray-300 inline-block"
          >
            Country
          </h2>
        </div>

        <div
          class="flex items-center gap-2 border border-blue-500 rounded-full px-3 py-1 text-blue-600 bg-blue-50/50"
        >
          <div
            class="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center"
          >
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          <span class="text-sm font-medium">94</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div class="lg:col-span-2 relative">
          <div>
            <TopoJSONMap
              :height="460"
              :data="worldData"
              :topo-json="WorldMapTopoJSON"
              map-feature-key="countries"
              :area-color="areaColor"
              :zoom-factor="1.2"
              @mouseenter="(d: any) => (hoveredArea = d.id)"
              @mouseleave="() => (hoveredArea = null)"
              :categories="{
                count: { name: 'Event count', color: '#3b82f6' },
              }"
            />
          </div>

          <!-- Zoom Controls Simulation -->
          <div
            class="absolute right-4 bottom-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col"
          >
            <button class="p-2 hover:bg-gray-50 border-b border-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
            <button class="p-2 hover:bg-gray-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 12H4"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div
            class="flex justify-between text-xs font-bold text-gray-400 mb-4 tracking-wider uppercase"
          >
            <span class="border-b-2 border-dashed border-gray-300 pb-1"
              >Country</span
            >
            <span class="border-b-2 border-dashed border-gray-300 pb-1"
              >Event Count</span
            >
          </div>

          <div class="space-y-2">
            <div v-for="item in sortedData" :key="item.id" class="relative">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-semibold text-gray-800">{{
                  item.name
                }}</span>
                <span class="text-sm text-gray-600">{{ item.count }}</span>
              </div>
              <div class="w-full bg-gray-100 h-[1px]"></div>
              <div
                class="absolute -bottom-[2px] left-0 h-[3px] bg-blue-600"
                :style="{ width: `${(item.count / maxCount) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
