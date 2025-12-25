<script lang="ts" setup>
import { TopoJSONMap, DottedWorldMap } from "../lib";
import { WorldMapTopoJSON } from "@unovis/ts/maps";

import type { Topology, GeometryCollection } from "topojson-specification";
import netherlandsRaw from "./data/netherlands.topo.json";

type NetherlandsProvince = {
  GID_1: string;
  GID_0: string;
  COUNTRY: string;
  NAME_1: string;
  VARNAME_1: string;
  NL_NAME_1: string;
  TYPE_1: string;
  ENGTYPE_1: string;
  CC_1: string;
  HASC_1: string;
  ISO_1: string;
};

const netherlands: Topology<{
  netherlands: GeometryCollection<NetherlandsProvince>;
}> = {
  type: "Topology",
  arcs: netherlandsRaw.arcs,
  objects: {
    netherlands: {
      type: "GeometryCollection",
      geometries: netherlandsRaw.objects.netherlands.geometries.map((g) => ({
        type: "MultiPolygon",
        arcs: g.arcs,
        properties: g.properties
      })),
    },
  },
};

console.log(WorldMapTopoJSON, 'WorldMapTopoJSON')
</script>

<template>
  <div class="p-8 space-y-8">
    <!-- <section>
      <h2 class="text-2xl font-bold mb-4">TopoJSON Map</h2>
      <TopoJSONMap :data="WorldMapTopoJSON" map-feature-key="countries" />
    </section> -->

    <section>
      <h2 class="text-2xl font-bold mb-4">Dotted World Map</h2>
      <p class="text-gray-600 mb-4">A dotted world map generated using <code>dotted-map</code> and rendered with Unovis <code>VisScatter</code>.</p>
      <DottedWorldMap 
        height="500px" 
        :dot-size="2" 
        color="#3b82f6" 
        :map-height="100"
      />
    </section>
  </div>
</template>
