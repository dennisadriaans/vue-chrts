// @vitest-environment happy-dom
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import TopoJSONMap from "../src/runtime/components/TopoJSONMap.vue";
import type { MapGeometry } from "../src/runtime/types/maps";

const mounted: Array<{ unmount: () => void }> = [];

beforeAll(() => {
  globalThis.ResizeObserver = class {
    constructor(private cb: ResizeObserverCallback) {}
    observe() {
      this.cb([{ contentRect: { width: 600, height: 300 } } as ResizeObserverEntry], this as unknown as ResizeObserver);
    }
    unobserve() {}
    disconnect() {}
  };
});

afterEach(() => {
  while (mounted.length) mounted.pop()!.unmount();
});

const topology: MapGeometry = {
  type: "Topology",
  objects: {
    regions: {
      type: "GeometryCollection",
      geometries: [
        { type: "Polygon", id: "west", arcs: [[0]] },
        { type: "Polygon", id: "east", arcs: [[1]] },
      ],
    },
  },
  arcs: [
    [[-10, 45], [-10, 55], [0, 55], [0, 45], [-10, 45]],
    [[0, 45], [0, 55], [10, 55], [10, 45], [0, 45]],
  ],
};

describe("TopoJSONMap active area", () => {
  it("draws the active area last and applies area opacity", async () => {
    const wrapper = mount(TopoJSONMap, {
      props: {
        topoJson: topology,
        mapFeatureKey: "regions",
        activeArea: "west",
        areaOpacity: area => (area.id === "west" ? 1 : 0.35),
      },
    });
    mounted.push(wrapper);
    await flushPromises();

    const features = wrapper.findAll(".vc-map__feature");
    expect(features.map(feature => feature.attributes("aria-label"))).toEqual(["east", "west"]);
    expect(features.map(feature => feature.find("path").attributes("opacity"))).toEqual(["0.35", "1"]);
  });
});

describe("TopoJSONMap fit", () => {
  it("fits the projection to the geometry when fitView is omitted", async () => {
    const wrapper = mount(TopoJSONMap, {
      props: { topoJson: topology, mapFeatureKey: "regions", projection: "mercator", fitViewPadding: 0 },
    });
    mounted.push(wrapper);
    await flushPromises();

    const xs = wrapper.findAll(".vc-map__feature path").flatMap(path =>
      [...(path.attributes("d") ?? "").matchAll(/[ML](-?[\d.]+),/g)].map(match => Number(match[1])));
    expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(300);
  });
});
