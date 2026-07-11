// @vitest-environment happy-dom
import { describe, expect, it, beforeAll, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import DonutChart from "../src/runtime/components/DonutChart.vue";
import { DonutType } from "../src/runtime/enums";

const mounted: Array<{ unmount: () => void }> = [];

afterEach(() => {
  while (mounted.length) mounted.pop()!.unmount();
  document.body.innerHTML = "";
});

/**
 * vccs' ResponsiveContainer only renders once it has measured a non-zero box.
 * happy-dom has no layout, so hand every element a fixed 300×300 size (a square
 * so the pie's maxRadius is unambiguous).
 */
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

const data = [45, 30, 25];
const categories = {
  a: { name: "Product", color: "#2662d9" },
  b: { name: "Services", color: "#e23670" },
  c: { name: "Support", color: "#22c55e" },
};

async function mountDonut(props: Record<string, unknown> = {}) {
  const wrapper = mount(DonutChart, {
    props: { data, categories, height: 300, ...props },
    attachTo: document.body,
  });
  await flushPromises();
  await new Promise((r) => setTimeout(r, 0));
  await flushPromises();
  mounted.push(wrapper);
  return wrapper;
}

/** A rendered sector has a non-trivial `d` attribute; a collapsed one does not. */
function sectorPaths() {
  return [...document.querySelectorAll(".donut-chart svg path")].filter(
    (p) => (p.getAttribute("d") || "").length > 10,
  );
}

describe("DonutChart radius", () => {
  it("auto-fits and renders visible sectors when radius is 0 (v2-style call sites)", async () => {
    await mountDonut({ radius: 0, arcWidth: 40, type: DonutType.Full });
    // One sector per data entry — the regression was zero sectors (invisible ring).
    expect(sectorPaths().length).toBe(3);
  });

  it("auto-fits when radius is omitted entirely", async () => {
    await mountDonut({ arcWidth: 40, type: DonutType.Full });
    expect(sectorPaths().length).toBe(3);
  });

  it("still honours an explicit pixel radius", async () => {
    await mountDonut({ radius: 120, arcWidth: 40, type: DonutType.Full });
    expect(sectorPaths().length).toBe(3);
  });

  it("renders the half-donut gauge with radius 0", async () => {
    await mountDonut({ radius: 0, arcWidth: 30, type: DonutType.Half });
    expect(sectorPaths().length).toBe(3);
  });
});
