import { Topology } from "topojson-specification";

export type MapsData<T extends Record<string, any>> = {
  mapFeatureKey: keyof T;
  data: Topology<T>;
};