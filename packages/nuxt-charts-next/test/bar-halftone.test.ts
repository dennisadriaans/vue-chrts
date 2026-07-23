// @vitest-environment happy-dom
import { describe, expect, it, beforeAll, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import BarChart from "../src/runtime/components/BarChart.vue";
import { halftoneCoverage } from "../src/runtime/components/internal/HalftoneDefs";
import { halftoneCellsFor } from "../src/runtime/utils/dither";

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
  { month: "Jan", revenue: 10 },
  { month: "Feb", revenue: 30 },
  { month: "Mar", revenue: 20 },
];
const categories = { revenue: { name: "Revenue", color: "#7c6cf0" } };

async function mountChart(props: Record<string, unknown> = {}) {
  const wrapper = mount(BarChart, {
    // `hideLegend` + no grid: happy-dom has no layout, and the legend steals
    // all the plot height, which collapses every bar to zero and skips #shape.
    //
    // Cast for the same reason as bar-cubes-render.test.ts: BarChart is a
    // generic component, and vue-tsc cannot infer `T` through a spread.
    props: {
      data,
      categories,
      yAxis: ["revenue"],
      xAxis: "month",
      height: 300,
      hideLegend: true,
      yGridLine: false,
      ...props,
    } as never,
    attachTo: document.body,
  });
  await flushPromises();
  await new Promise((r) => setTimeout(r, 0));
  await flushPromises();
  mounted.push(wrapper);
  return wrapper;
}

describe("halftoneCoverage", () => {
  it("spans from → to across the level range", () => {
    expect(halftoneCoverage(0, 12, 0, 1, 1)).toBeCloseTo(0);
    expect(halftoneCoverage(11, 12, 0, 1, 1)).toBeCloseTo(1);
  });

  it("honours a clamped range at both ends", () => {
    expect(halftoneCoverage(0, 10, 0.2, 0.8, 1)).toBeCloseTo(0.2);
    expect(halftoneCoverage(9, 10, 0.2, 0.8, 1)).toBeCloseTo(0.8);
  });

  it("holds the sparse end longer as bias rises", () => {
    const linear = halftoneCoverage(5, 11, 0, 1, 1);
    const biased = halftoneCoverage(5, 11, 0, 1, 2);
    expect(biased).toBeLessThan(linear);
  });

  it("never leaves the from..to range for any level", () => {
    for (let i = 0; i < 12; i++) {
      const c = halftoneCoverage(i, 12, 0.15, 0.9, 1.4);
      expect(c).toBeGreaterThanOrEqual(0.15 - 1e-9);
      expect(c).toBeLessThanOrEqual(0.9 + 1e-9);
    }
  });
});

describe("halftoneCellsFor", () => {
  it("returns an evenly spread subset that grows with coverage", () => {
    expect(halftoneCellsFor(0)).toHaveLength(0);
    expect(halftoneCellsFor(1)).toHaveLength(64);
    expect(halftoneCellsFor(0.5)).toHaveLength(32);
    // Monotonic in coverage.
    expect(halftoneCellsFor(0.25).length).toBeLessThan(halftoneCellsFor(0.75).length);
  });

  it("clamps out-of-range coverage instead of overflowing the lattice", () => {
    expect(halftoneCellsFor(-1)).toHaveLength(0);
    expect(halftoneCellsFor(5)).toHaveLength(64);
  });
});

describe("BarChart halftone variant", () => {
  it("emits no lattice for the default solid variant", async () => {
    await mountChart();
    expect(document.querySelectorAll('pattern[id^="nc-ht-"]').length).toBe(0);
  });

  it("emits one lattice level set per series", async () => {
    await mountChart({ variant: "halftone" });
    const levels = document.querySelectorAll('pattern[id^="nc-ht-"]');
    // HALFTONE_STEPS levels for the single series.
    expect(levels.length).toBe(14);
  });

  it("paints the lattice in the series colour", async () => {
    await mountChart({ variant: "halftone" });
    // A mid level has cells; they carry the series colour, not white.
    const mid = [...document.querySelectorAll('pattern[id^="nc-ht-"]')].find(
      p => p.querySelectorAll("rect").length > 0,
    )!;
    expect(mid.querySelector("rect")!.getAttribute("fill")).toBe("#7c6cf0");
  });

  it("ramps coverage across the levels, sparse to solid", async () => {
    await mountChart({ variant: "halftone" });
    const counts = [...document.querySelectorAll('pattern[id^="nc-ht-"]')].map(
      p => p.querySelectorAll("rect").length,
    );
    expect(counts[0]).toBe(0);
    expect(counts.at(-1)).toBe(64);
    for (let i = 1; i < counts.length; i++) {
      expect(counts[i]!).toBeGreaterThanOrEqual(counts[i - 1]!);
    }
  });

  it("honours a clamped coverage range", async () => {
    await mountChart({ variant: "halftone", halftoneFrom: 0.25, halftoneTo: 0.75 });
    const counts = [...document.querySelectorAll('pattern[id^="nc-ht-"]')].map(
      p => p.querySelectorAll("rect").length,
    );
    // Never empty, never fully solid.
    expect(counts[0]).toBeGreaterThan(0);
    expect(counts.at(-1)).toBeLessThan(64);
  });

  it("scales the cell size with halftoneCell", async () => {
    await mountChart({ variant: "halftone", halftoneCell: 4 });
    const tile = document.querySelector('pattern[id^="nc-ht-"]')!;
    // 8-cell lattice.
    expect(tile.getAttribute("width")).toBe("32");
  });

  it("slices each column into strips, sparsest at the top", async () => {
    await mountChart({ variant: "halftone" });
    const strips = [...document.querySelectorAll('rect[fill^="url(#nc-ht-"]')];
    // One strip per level, per bar.
    expect(strips).toHaveLength(14 * data.length);

    // The first bar's strips run from the sparse level down to the solid one,
    // so the column reads dense on the baseline and dissolves upward.
    const levels = strips
      .slice(0, 14)
      .map(r => Number(r.getAttribute("fill")!.match(/l(\d+)\)/)![1]));
    expect(levels).toEqual([...levels].sort((a, b) => b - a));
    expect(levels[0]).toBe(13);
    expect(levels.at(-1)).toBe(0);
  });

  it("draws a solid cap at the top of each column", async () => {
    await mountChart({ variant: "halftone" });
    const caps = document.querySelectorAll('g > rect[fill="#7c6cf0"]');
    expect(caps).toHaveLength(data.length);
  });
});
