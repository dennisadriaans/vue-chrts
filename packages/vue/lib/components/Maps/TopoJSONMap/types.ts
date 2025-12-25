export type Topology<TObjects extends Record<string, any> = Record<string, any>> = {
  type: "Topology";
  objects: TObjects;
  arcs: unknown;
  bbox?: unknown;
  transform?: unknown;
};

export type MapsData<T extends Record<string, any>> = {
  mapFeatureKey: keyof T;
  data: Topology<T>;
};