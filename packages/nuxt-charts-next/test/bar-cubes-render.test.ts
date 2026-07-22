// @vitest-environment happy-dom
import { describe, expect, it, beforeAll, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import BarChart from "../src/runtime/components/BarChart.vue";

const mounted: Array<{ unmount: () => void }> = [];

afterEach(() => {
  while (mounted.length) mounted.pop()!.unmount();
  document.body.innerHTML = "";
});

beforeAll(() => {
  Element.prototype.getBoundingClientRect = function () {
    return { width: 600, height: 300, top: 0, left: 0, right: 600, bottom: 300, x: 0, y: 0, toJSON() {} } as DOMRect;
  };
  globalThis.ResizeObserver = class {
    private cb: ResizeObserverCallback;
    constructor(cb: ResizeObserverCallback) {
      this.cb = cb;
    }
    observe() {
      this.cb(
        [{ contentRect: { width: 600, height: 300 } } as ResizeObserverEntry],
        this as unknown as ResizeObserver,
      );
    }
    unobserve() {}
    disconnect() {}
  };
});

const data = [
  { month: "Jan", desktop: 100 },
  { month: "Feb", desktop: 140 },
  { month: "Mar", desktop: 120 },
];
const categories = {
  desktop: { name: "Desktop", color: "#2662d9" },
};

async function mountBar(props: Record<string, unknown> = {}) {
  const wrapper = mount(BarChart, {
    props: {
      data,
      categories,
      yAxis: ["desktop"],
      xAxis: "month",
      height: 300,
      hideLegend: true,
      ...props,
    },
    attachTo: document.body,
  });
  await flushPromises();
  await new Promise((r) => setTimeout(r, 0));
  await flushPromises();
  mounted.push(wrapper);
  return wrapper;
}

describe("BarChart variant=cubes render", () => {
  it("draws cube columns when mounted with variant=cubes", async () => {
    await mountBar({ variant: "cubes", yGridLine: false });
    expect(document.querySelectorAll(".vc-cube-bar").length).toBeGreaterThan(0);
    expect(document.querySelectorAll(".vc-cube-bar rect").length).toBeGreaterThan(data.length);
  });

  it("picks up cubes after switching from solid (homepage carousel path)", async () => {
    const wrapper = await mountBar({ variant: "solid" });
    expect(document.querySelectorAll(".vc-cube-bar").length).toBe(0);

    await wrapper.setProps({ variant: "cubes", yGridLine: false });
    await flushPromises();
    await new Promise((r) => setTimeout(r, 0));
    await flushPromises();

    expect(document.querySelectorAll(".vc-cube-bar").length).toBeGreaterThan(0);
  });

  it("renders stacked multi-series cube layers", async () => {
    await mountBar({
      variant: "cubes",
      stacked: true,
      yAxis: ["desktop", "mobile"],
      categories: {
        desktop: { name: "Desktop", color: "#2662d9" },
        mobile: { name: "Mobile", color: "#e23670" },
      },
      data: [
        { month: "Jan", desktop: 100, mobile: 60 },
        { month: "Feb", desktop: 140, mobile: 90 },
        { month: "Mar", desktop: 120, mobile: 70 },
      ],
      yGridLine: false,
    });
    expect(document.querySelectorAll(".vc-cube-bar").length).toBe(6);
  });

  it("renders grouped multi-series cube columns", async () => {
    await mountBar({
      variant: "cubes",
      stacked: false,
      yAxis: ["desktop", "mobile"],
      categories: {
        desktop: { name: "Desktop", color: "#2662d9" },
        mobile: { name: "Mobile", color: "#e23670" },
      },
      data: [
        { month: "Jan", desktop: 100, mobile: 60 },
        { month: "Feb", desktop: 140, mobile: 90 },
        { month: "Mar", desktop: 120, mobile: 70 },
      ],
      yGridLine: false,
    });
    expect(document.querySelectorAll(".vc-cube-bar").length).toBe(6);
  });
});
