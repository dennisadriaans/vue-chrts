<script lang="ts" setup>
import { computed, ref } from "vue";
import Card from "../elements/Card.vue";

import { TopoJSONMap } from "../../lib";
import { WorldMapTopoJSON } from "@unovis/ts/maps";

const hoveredArea = ref<string | null>(null);

const areas = computed(() =>
  hoveredArea.value === "US" ? [{ id: "US", color: "#ef4444" }] : []
);

const worldData = computed(() => ({
  areas: areas.value,
  points: [],
}));
</script>

<template>
  <div class="space-y-4">
    <div class="max-w-7xl mx-auto flex gap-6 justify-between items-center py-6">
      <Card class="space-y-1">
        <h2 class="font-normal text-gray-400">Important Stat</h2>
        <p class="text-3xl font-bold">$21,981</p>
      </Card>
      <div>
        <h2 class="font-normal">Important Stat</h2>
        <p class="text-3xl font-bold">$21,981</p>
      </div>
      <div>
        <h2 class="font-normal">Important Stat</h2>
        <p class="text-3xl font-bold">$21,981</p>
      </div>
      <div>
        <h2 class="font-normal">Important Stat</h2>
        <p class="text-3xl font-bold">$21,981</p>
      </div>
    </div>
    <div class="max-w-7xl mx-auto flex gap-6">
      <div class="w-1/2">
        <div class="space-y-2">
          <div class="space-y-1">
            <div>Subtopic</div>
            <div class="w-full h-1 bg-primary"></div>
          </div>
          <div class="space-y-1">
            <div>Subtopic</div>
            <div class="w-full h-1 bg-primary"></div>
          </div>
          <div class="space-y-1">
            <div>Subtopic</div>
            <div class="w-full h-1 bg-primary"></div>
          </div>
          <div class="space-y-1">
            <div>Subtopic</div>
            <div class="w-full h-1 bg-primary"></div>
          </div>
          <div class="space-y-1">
            <div>Subtopic</div>
            <div class="w-full h-1 bg-primary"></div>
          </div>
        </div>
      </div>
      <div class="w-1/2">
        <section class="space-y-4">
          <div>
            <h2 class="text-2xl font-bold mb-2">France Regions</h2>
            <p>Map of France showing all administrative regions.</p>
          </div>
          <TopoJSONMap
            class="w-full relative"
            :data="worldData"
            :topojson="WorldMapTopoJSON"
            map-feature-key="countries"
            @mouseenter="(d: any) => (hoveredArea = d.id)"
            @mouseleave="() => (hoveredArea = null)"
          />
        </section>
      </div>
    </div>
  </div>
</template>
