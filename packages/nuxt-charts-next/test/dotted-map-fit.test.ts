// @vitest-environment happy-dom
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import DottedMap from "../src/runtime/components/DottedMap.vue";
import type { MapGeometry } from "../src/runtime/types/maps";

const mounted: Array<{ unmount: () => void }> = [];

beforeAll(() => {
  globalThis.ResizeObserver = class {
    constructor(private cb: ResizeObserverCallback) {}
    observe() {
      this.cb([{ contentRect: { width: 400, height: 200 } } as ResizeObserverEntry], this as unknown as ResizeObserver);
    }
    unobserve() {}
    disconnect() {}
  };
});

afterEach(() => {
  while (mounted.length) mounted.pop()!.unmount();
});

const geoJson: MapGeometry = {
  type: "FeatureCollection",
  features: [{
    type: "Feature", id: "box", properties: {},
    geometry: { type: "Polygon", coordinates: [[[-10, -10], [-10, 10], [10, 10], [10, -10], [-10, -10]]] },
  }],
};

describe("DottedMap fit", () => {
  it("fits the geometry to the viewport when fitView is omitted", async () => {
    const wrapper = mount(DottedMap, { props: { geoJson, projection: "equirectangular", mapHeight: 20 } });
    mounted.push(wrapper);
    await flushPromises();

    const xs = wrapper.findAll(".vc-map__dot circle").map(dot => Number(dot.attributes("cx")));
    expect(xs.length).toBeGreaterThan(0);
    expect(Math.min(...xs)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...xs)).toBeLessThanOrEqual(400);
    expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(150);
  });
});
