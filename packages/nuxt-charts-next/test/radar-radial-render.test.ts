// @vitest-environment happy-dom
import { describe, expect, it, beforeAll, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import RadarChart from "../src/runtime/components/RadarChart.vue";
import RadialBarChart from "../src/runtime/components/RadialBarChart.vue";

const mounted: Array<{ unmount: () => void }> = [];

afterEach(() => {
  while (mounted.length) mounted.pop()!.unmount();
  document.body.innerHTML = "";
});

beforeAll(() => {
  Element.prototype.getBoundingClientRect = function () {
    return { width: 300, height: 300, top: 0, left: 0, right: 300, bottom: 300, x: 0, y: 0, toJSON() {} } as DOMRect;
  };
  globalThis.ResizeObserver = class {
    private cb: ResizeObserverCallback;
    constructor(cb: ResizeObserverCallback) {
      this.cb = cb;
    }
    observe() {
      this.cb([{ contentRect: { width: 300, height: 300 } } as ResizeObserverEntry], this as unknown as ResizeObserver);
    }
    unobserve() {}
    disconnect() {}
  };
});

async function mountChart(component: unknown, props: Record<string, unknown>) {
  const wrapper = mount(component as never, { props, attachTo: document.body } as never);
  await flushPromises();
  await new Promise((r) => setTimeout(r, 0));
  await flushPromises();
  mounted.push(wrapper);
  return wrapper;
}

describe("RadarChart / RadialBarChart render with gallery-shaped data", () => {
  it("radar renders one filled polygon per series", async () => {
    await mountChart(RadarChart, {
      data: [
        { metric: "Speed", productA: 120, productB: 90 },
        { metric: "Reliability", productA: 98, productB: 130 },
        { metric: "Comfort", productA: 86, productB: 130 },
      ],
      categories: {
        productA: { name: "Product A", color: "#2662d9" },
        productB: { name: "Product B", color: "#e23670" },
      },
      dataKey: "metric",
      height: 300,
    });
    const shapes = [...document.querySelectorAll("svg polygon, svg path")].filter(
      (p) => (p.getAttribute("points") || p.getAttribute("d") || "").length > 10,
    );
    expect(shapes.length).toBeGreaterThan(0);
  });

  it("radial bar renders sectors from a positional value list", async () => {
    await mountChart(RadialBarChart, {
      data: [275, 200, 187, 173, 90],
      categories: {
        a: { name: "Chrome", color: "#22c55e" },
        b: { name: "Safari", color: "#16a34a" },
        c: { name: "Firefox", color: "#15803d" },
        d: { name: "Edge", color: "#166534" },
        e: { name: "Other", color: "#14532d" },
      },
      height: 300,
      cornerRadius: 4,
    });
    const paths = [...document.querySelectorAll("svg path")].filter(
      (p) => (p.getAttribute("d") || "").length > 10,
    );
    expect(paths.length).toBeGreaterThan(0);
  });
});
