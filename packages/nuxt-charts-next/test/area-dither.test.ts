// @vitest-environment happy-dom
import { describe, expect, it, beforeAll, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import AreaChart from "../src/runtime/components/AreaChart.vue";
import { buildDitherPattern, DITHER_VARIANTS } from "../src/runtime/utils/dither";

const mounted: Array<{ unmount: () => void }> = [];

afterEach(() => {
  while (mounted.length) mounted.pop()!.unmount();
  document.body.innerHTML = "";
});

/** See area-gradient.test.ts: happy-dom has no layout, so hand the container a size. */
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
  { month: "Jan", desktop: 100, mobile: 60 },
  { month: "Feb", desktop: 140, mobile: 90 },
  { month: "Mar", desktop: 120, mobile: 70 },
];
const categories = {
  desktop: { name: "Desktop", color: "#2662d9" },
  mobile: { name: "Mobile", color: "#e23670" },
};

async function mountChart(props: Record<string, unknown> = {}) {
  const wrapper = mount(AreaChart, {
    props: { data, categories, height: 300, ...props },
    attachTo: document.body,
  });
  await flushPromises();
  await new Promise((r) => setTimeout(r, 0));
  await flushPromises();
  mounted.push(wrapper);
  return wrapper;
}

describe("buildDitherPattern", () => {
  it("keeps every dot inside the tile for all variants", () => {
    for (const variant of DITHER_VARIANTS) {
      const { dots } = buildDitherPattern(variant);
      expect(dots.length).toBeGreaterThan(0);
      for (const dot of dots) {
        expect(dot.r).toBeGreaterThan(0);
        expect(dot.cx).toBeGreaterThanOrEqual(0);
        expect(dot.cx).toBeLessThanOrEqual(1);
        expect(dot.cy).toBeGreaterThanOrEqual(0);
        expect(dot.cy).toBeLessThanOrEqual(1);
      }
    }
  });

  it("is deterministic, so SSR and client markup agree", () => {
    for (const variant of DITHER_VARIANTS) {
      expect(buildDitherPattern(variant)).toEqual(buildDitherPattern(variant));
    }
  });

  it("ramps density by row for the fade variant", () => {
    const { dots } = buildDitherPattern("fade");
    const top = dots.filter((d) => d.cy < 0.5);
    const bottom = dots.filter((d) => d.cy > 0.5);
    const avg = (list: typeof dots) => list.reduce((sum, d) => sum + d.r, 0) / list.length;
    // The fade thins toward the baseline, so upper dots are larger on average.
    expect(avg(top)).toBeGreaterThan(avg(bottom));
  });
});

describe("AreaChart dither fill", () => {
  it("renders no pattern by default", async () => {
    await mountChart();
    expect(document.querySelectorAll("pattern").length).toBe(0);
  });

  it("renders a per-series pattern when dither is enabled", async () => {
    await mountChart({ dither: true });
    const patterns = [...document.querySelectorAll("pattern")];
    expect(patterns).toHaveLength(2);
    expect(patterns.some((p) => p.id.endsWith("-desktop"))).toBe(true);
    expect(patterns.some((p) => p.id.endsWith("-mobile"))).toBe(true);
    expect(patterns[0]?.querySelectorAll("circle").length).toBeGreaterThan(0);
  });

  it("replaces the gradient rather than stacking with it", async () => {
    await mountChart({ dither: true });
    expect(document.querySelectorAll("linearGradient").length).toBe(0);
  });

  it("accepts each named variant", async () => {
    for (const variant of DITHER_VARIANTS) {
      const wrapper = await mountChart({ dither: variant });
      expect(document.querySelectorAll("pattern").length).toBe(2);
      wrapper.unmount();
      document.body.innerHTML = "";
    }
  });

  it("honours a custom tile size", async () => {
    await mountChart({ dither: true, ditherTile: 16 });
    expect(document.querySelector("pattern")?.getAttribute("width")).toBe("16");
  });

  it("emits no pattern when the area is hidden", async () => {
    await mountChart({ dither: true, hideArea: true });
    expect(document.querySelectorAll("pattern").length).toBe(0);
  });

  it("colours the dots per series", async () => {
    await mountChart({ dither: true });
    const desktop = document.getElementById(
      [...document.querySelectorAll("pattern")].find((p) => p.id.endsWith("-desktop"))!.id,
    );
    expect(desktop?.querySelector("circle")?.getAttribute("fill")).toBe("#2662d9");
  });
});
