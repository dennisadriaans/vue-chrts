// @vitest-environment happy-dom
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import BubbleChart from "../src/runtime/components/BubbleChart.vue";

const mounted: Array<{ unmount: () => void }> = [];

beforeAll(() => {
  Element.prototype.getBoundingClientRect = function () {
    return { width: 600, height: 300, top: 0, left: 0, right: 600, bottom: 300, x: 0, y: 0, toJSON() {} } as DOMRect;
  };
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
  document.body.innerHTML = "";
});

const props = {
  data: [
    { x: 1, y: 2, group: "a" },
    { x: 2, y: 3, group: "a" },
  ],
  categories: { a: { name: "A", color: "#2563eb" } },
  xAccessor: "x",
  yAccessor: "y",
  categoryKey: "group",
  height: 300,
  hideLegend: true,
  hideTooltip: true,
};

async function mountChart(extra: Record<string, unknown> = {}) {
  const wrapper = mount(BubbleChart as never, { props: { ...props, ...extra } as never, attachTo: document.body });
  mounted.push(wrapper);
  await flushPromises();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await flushPromises();
  return wrapper;
}

describe("BubbleChart states and grid controls", () => {
  it("renders the shared loading state instead of the chart", async () => {
    const wrapper = await mountChart({ loading: true });
    expect(wrapper.find(".vc-skeleton").exists()).toBe(true);
    expect(wrapper.find(".v-charts-scatter").exists()).toBe(false);
  });

  it("can disable one grid direction independently", async () => {
    await mountChart({ xGridLine: false, yGridLine: true });
    expect(document.querySelector(".v-charts-cartesian-grid-horizontal")).not.toBeNull();
    expect(document.querySelector(".v-charts-cartesian-grid-vertical")).toBeNull();
  });
});
