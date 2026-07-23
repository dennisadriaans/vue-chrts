// @vitest-environment happy-dom
import { describe, expect, it, beforeAll, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import AreaChart from "../src/runtime/components/AreaChart.vue";
import DonutChart from "../src/runtime/components/DonutChart.vue";
import { resolveHoverRadius, resolveHoverVisible, themeToVars, axisTickVars } from "../src/runtime/utils/theme";
import type { ChartTheme } from "../src/runtime/types/shared";

const mounted: Array<{ unmount: () => void }> = [];

afterEach(() => {
  while (mounted.length) mounted.pop()!.unmount();
  document.body.innerHTML = "";
});

// vccs' ResponsiveContainer only renders children once it has a measured size;
// happy-dom has no layout, so hand it a fixed box (same stub as the other tests).
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
      this.cb([{ contentRect: { width: 600, height: 300 } } as ResizeObserverEntry], this as unknown as ResizeObserver);
    }
    unobserve() {}
    disconnect() {}
  };
});

const data = [
  { month: "Jan", desktop: 100, mobile: 60 },
  { month: "Feb", desktop: 140, mobile: 90 },
];
const categories = {
  desktop: { name: "Desktop", color: "#2662d9" },
  mobile: { name: "Mobile", color: "#e23670" },
};

describe("themeToVars", () => {
  it("returns no vars for an undefined theme", () => {
    expect(themeToVars(undefined)).toEqual({});
  });

  it("only emits vars for the fields that are set", () => {
    const theme: ChartTheme = {
      grid: { color: "#f00", dash: "6 4" },
      axis: { tickColor: "#0f0", tickSize: "0.9rem" },
      legend: { color: "#00f", gap: "1rem", inset: "1.25rem" },
      hover: { fill: "#abc", radius: 8, visible: false },
      tooltip: { bg: "#111", radius: "0.75rem" },
    };
    expect(themeToVars(theme)).toEqual({
      "--vc-grid-color": "#f00",
      "--vc-grid-dash": "6 4",
      "--vc-tick-color": "#0f0",
      "--vc-tick-size": "0.9rem",
      "--vc-legend-color": "#00f",
      "--vc-legend-gap": "1rem",
      "--vc-legend-inset": "1.25rem",
      "--vc-hover-fill": "#abc",
      "--vc-hover-radius": "8",
      "--vc-tooltip-bg": "#111",
      "--vc-tooltip-radius": "0.75rem",
    });
    // `visible` is not a token — it drives the cursor prop, not a CSS var.
    expect(themeToVars(theme)).not.toHaveProperty("--vc-hover-visible");
  });
});

describe("axisTickVars", () => {
  it("maps colour / size / weight to scoped CSS vars", () => {
    expect(
      axisTickVars("x", { fill: "#f00", fontSize: "11px", fontWeight: 600 }),
    ).toEqual({
      "--vc-x-tick-color": "#f00",
      "--vc-x-tick-size": "11px",
      "--vc-x-tick-weight": "600",
    });
  });

  it("does not emit a CSS var for text alignment (that flows via the tick prop)", () => {
    expect(axisTickVars("x", { textAnchor: "end" })).toEqual({});
  });

  it("returns no vars when tick attrs are absent", () => {
    expect(axisTickVars("y", undefined)).toEqual({});
  });
});

describe("resolveHoverVisible", () => {
  it("defaults to visible", () => {
    expect(resolveHoverVisible(undefined)).toBe(true);
    expect(resolveHoverVisible({})).toBe(true);
    expect(resolveHoverVisible({ hover: {} })).toBe(true);
  });

  it("is false only when explicitly disabled", () => {
    expect(resolveHoverVisible({ hover: { visible: false } })).toBe(false);
    expect(resolveHoverVisible({ hover: { visible: true } })).toBe(true);
  });
});

describe("resolveHoverRadius", () => {
  it("defaults to 6 to match --vc-hover-radius", () => {
    expect(resolveHoverRadius(undefined)).toBe(6);
    expect(resolveHoverRadius({})).toBe(6);
  });

  it("uses theme.hover.radius when set", () => {
    expect(resolveHoverRadius({ hover: { radius: 8 } })).toBe(8);
  });
});

async function mountChart(component: unknown, props: Record<string, unknown>) {
  const wrapper = mount(component as never, { props: props as never, attachTo: document.body });
  await flushPromises();
  await new Promise((r) => setTimeout(r, 0));
  await flushPromises();
  mounted.push(wrapper);
  return wrapper;
}

describe("chart theme root", () => {
  it("cartesian chart renders a .vue-chrts root", async () => {
    const w = await mountChart(AreaChart, { data, categories, height: 300 });
    expect(w.find(".vue-chrts").exists()).toBe(true);
  });

  it("writes the theme prop as inline --vc-* vars on the root", async () => {
    const w = await mountChart(AreaChart, {
      data,
      categories,
      height: 300,
      theme: { grid: { color: "rgb(1, 2, 3)" }, axis: { tickColor: "rgb(4, 5, 6)" } },
    });
    const root = w.find(".vue-chrts").element as HTMLElement;
    expect(root.style.getPropertyValue("--vc-grid-color")).toBe("rgb(1, 2, 3)");
    expect(root.style.getPropertyValue("--vc-tick-color")).toBe("rgb(4, 5, 6)");
  });

  it("polar chart (donut) also renders a themed .vue-chrts root", async () => {
    const w = await mountChart(DonutChart, {
      data: [10, 20],
      categories,
      height: 200,
      theme: { legend: { color: "rgb(7, 8, 9)" } },
    });
    const root = w.find(".vue-chrts").element as HTMLElement;
    expect(w.find(".vue-chrts").exists()).toBe(true);
    expect(root.style.getPropertyValue("--vc-legend-color")).toBe("rgb(7, 8, 9)");
  });
});
