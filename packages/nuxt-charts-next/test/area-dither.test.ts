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
    // Per series: the dot tile plus the plot-sized pattern the fill references.
    expect(patterns).toHaveLength(4);
    expect(patterns.some((p) => p.id === "nc-dither-v-0-desktop")).toBe(true);
    expect(patterns.some((p) => p.id === "nc-dither-v-0-mobile")).toBe(true);
    const dots = document.getElementById("nc-dither-v-0-desktop-dots")!;
    expect(dots.querySelectorAll("circle").length).toBeGreaterThan(0);
  });

  it("composes the vertical gradient wash under the dither pattern", async () => {
    await mountChart({ dither: true });
    // Per series: the dot tile plus the plot-sized pattern the fill references.
    expect(document.querySelectorAll("pattern").length).toBe(4);

    // The referenced fill is the combo pattern, which paints wash then dots.
    const combo = document.getElementById("nc-dither-v-0-desktop")!;
    const fills = [...combo.querySelectorAll("rect")].map((r) => r.getAttribute("fill"));
    expect(fills).toEqual([
      "url(#nc-dither-v-0-desktop-wash)",
      "url(#nc-dither-v-0-desktop-dots)",
    ]);

    // The wash is a series-coloured vertical fade, so the area still ramps to
    // transparent at the domain line the way a plain gradient fill does.
    const wash = document.getElementById("nc-dither-v-0-desktop-wash")!;
    const stops = [...wash.querySelectorAll("stop")];
    expect(stops[0]?.getAttribute("stop-color")).toBe("#2662d9");
    expect(Number(stops.at(-1)?.getAttribute("stop-opacity"))).toBe(0);
  });

  it("skips the wash when gradient is disabled", async () => {
    await mountChart({ dither: true, gradient: false });
    expect(document.querySelectorAll("linearGradient").length).toBe(0);
    // Dot tile plus the alias the fill references — no wash rects.
    expect(document.querySelectorAll("pattern rect").length).toBe(0);
  });

  it("scales the wash with ditherWash", async () => {
    await mountChart({ dither: true, ditherWash: 0.5 });
    const stops = [...document.getElementById("nc-dither-v-0-desktop-wash")!.querySelectorAll("stop")];
    // Default top stop is 0.6, halved.
    expect(Number(stops[0]?.getAttribute("stop-opacity"))).toBeCloseTo(0.3);
  });

  it("drops the wash entirely when ditherWash is 0", async () => {
    await mountChart({ dither: true, ditherWash: 0 });
    expect(document.querySelectorAll("linearGradient").length).toBe(0);
    expect(document.querySelectorAll("pattern rect").length).toBe(0);
  });

  it("honours custom gradientStops on the dither fade mask", async () => {
    await mountChart({
      dither: true,
      gradientStops: [
        { offset: "0%", stopOpacity: 1 },
        { offset: "50%", stopOpacity: 0.5 },
        { offset: "100%", stopOpacity: 0 },
      ],
    });
    // One wash gradient per series, plus the shared dot-fade ramp.
    expect(document.querySelectorAll("linearGradient").length).toBe(3);
    const stops = [
      ...document.getElementById("nc-dither-v-0-desktop-wash")!.querySelectorAll("stop"),
    ];
    expect(stops).toHaveLength(3);
    expect(stops[0]?.getAttribute("stop-opacity")).toBe("1");
  });

  it("accepts each named variant", async () => {
    for (const variant of DITHER_VARIANTS) {
      const wrapper = await mountChart({ dither: variant });
      expect(document.querySelectorAll("pattern").length).toBe(4);
      wrapper.unmount();
      document.body.innerHTML = "";
    }
  });

  it("honours a custom tile size", async () => {
    await mountChart({ dither: true, ditherTile: 16 });
    expect(
      document.getElementById("nc-dither-v-0-desktop-dots")?.getAttribute("width"),
    ).toBe("16");
  });

  it("emits no pattern when the area is hidden", async () => {
    await mountChart({ dither: true, hideArea: true });
    expect(document.querySelectorAll("pattern").length).toBe(0);
  });

  it("colours the dots per series", async () => {
    await mountChart({ dither: true });
    const dots = document.getElementById("nc-dither-v-0-desktop-dots");
    expect(dots?.querySelector("circle")?.getAttribute("fill")).toBe("#2662d9");
  });
});
