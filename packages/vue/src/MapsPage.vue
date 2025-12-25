<script lang="ts" setup>
import { TopoJSONMap, DottedWorldMap } from "../lib";
import { WorldMapTopoJSON } from "@unovis/ts/maps";
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

const netherlandsTopo = netherlandsRaw as any;
const netherlands = {
  type: "Topology",
  bbox: (netherlandsTopo as any).bbox as [number, number, number, number],
  arcs: netherlandsTopo.arcs,
  objects: {
    netherlands: {
      type: "GeometryCollection",
      geometries: netherlandsTopo.objects.netherlands.geometries.map((g: any) => {
        const props = (g as any).properties as Partial<NetherlandsProvince> | undefined;
        return {
          ...(g as any),
          id: props?.ISO_1 ?? props?.HASC_1 ?? props?.GID_1,
          properties: {
            ...(props as any),
            name: props?.NL_NAME_1 && props.NL_NAME_1 !== "NA"
              ? props.NL_NAME_1
              : props?.NAME_1,
          },
        };
      }) as any,
    },
  },
} as const;
</script>

<template>
  <div class="p-8 space-y-8">
    <section>
      <h2 class="text-2xl font-bold mb-4">Dotted Maps</h2>
      <p class="text-gray-600 mb-4">
        Generated using <code>dotted-map</code> and rendered with Unovis
        <code>VisScatter</code>.
      </p>

      <!-- <div>
        <h2 class="text-2xl font-bold mb-4">TopoJSON Map</h2>
        <TopoJSONMap :data="WorldMapTopoJSON" map-feature-key="countries" />
      </div> -->

      <div>
        <h2 class="text-2xl font-bold mb-4">TopoJSON Map</h2>
        <TopoJSONMap :data="netherlands" map-feature-key="netherlands" />
      </div>

      <div>
        <h3 class="text-lg font-semibold mb-2">World</h3>
        <DottedWorldMap
          height="600px"
          :dot-size="1.5"
          color="#ffffff"
          :map-height="100"
        />
      </div>
    </section>
  </div>
</template>
