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
      this.cb([{ contentRect: { width: 400, height: 400 } } as ResizeObserverEntry], this as unknown as ResizeObserver);
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
    geometry: { type: "Polygon", coordinates: [[[-10, -10], [10, -10], [10, 10], [-10, 10], [-10, -10]]] },
  }],
};

function featurePath(wrapper: ReturnType<typeof mount>) {
  return wrapper.find(".vc-map__feature path").attributes("d");
}

describe("TopoJSONMap globe", () => {
  it("fits the sphere and follows the rotate prop", async () => {
    const wrapper = mount(TopoJSONMap, { props: { geoJson, projection: "orthographic", showSphere: true } });
    mounted.push(wrapper);
    await flushPromises();

    const sphere = wrapper.find(".vc-map__svg > g > path").attributes("d");
    const front = featurePath(wrapper);
    await wrapper.setProps({ rotate: [-40, 0] });
    expect(featurePath(wrapper)).not.toBe(front);
    expect(wrapper.find(".vc-map__svg > g > path").attributes("d")).toBe(sphere);
  });

  it("turns on drag and emits the new rotation", async () => {
    const wrapper = mount(TopoJSONMap, { props: { geoJson, projection: "orthographic" } });
    mounted.push(wrapper);
    await flushPromises();

    const svg = wrapper.find(".vc-map__svg");
    Object.assign(svg.element, { setPointerCapture() {} });
    const pointer = (type: string, clientX: number) =>
      svg.element.dispatchEvent(new PointerEvent(type, { button: 0, pointerId: 1, clientX, clientY: 100 }));
    pointer("pointerdown", 100);
    pointer("pointermove", 140);
    pointer("pointerup", 140);
    await flushPromises();

    const [[rotation]] = wrapper.emitted("rotate") as [[[number, number, number]]];
    expect(rotation[0]).toBeGreaterThan(0);
    expect(rotation[1]).toBe(0);
  });
});
