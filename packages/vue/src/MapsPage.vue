<script setup lang="ts">
// https://github.com/cartomap/nl

import { VisSingleContainer, VisTopoJSONMap } from "@unovis/vue";

import netherlands from "../lib/data/netherlands.topo.json";
import usa from "../lib/data/usa.topo.json";

import { MapData } from "@unovis/ts";

console.log(netherlands, "Netherlands");
console.log(usa, "USA");

const props = defineProps<{ data: MapData }>();
</script>

<template>
  <div class="bg-white p-48">
    <VisSingleContainer :height="800">
      <VisTopoJSONMap :topojson="netherlands" mapFeatureName="netherlands" />
    </VisSingleContainer>

    <VisSingleContainer :height="800">
      <VisTopoJSONMap :topojson="usa" mapFeatureName="usa" />
    </VisSingleContainer>
  </div>
</template>
