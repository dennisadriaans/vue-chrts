<script lang="ts" setup>
import { TopoJSONMap } from "../lib";
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
  <div>
    <TopoJSONMap :data="WorldMapTopoJSON" map-feature-key="countries" />
  </div>
</template>
