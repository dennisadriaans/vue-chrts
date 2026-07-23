// @vitest-environment happy-dom
import { describe, expect, it, beforeAll, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import AreaChart from "../src/runtime/components/AreaChart.vue";
import {
  buildDitherPattern,
  buildHalftonePattern,
  DITHER_VARIANTS,
} from "../src/runtime/utils/dither";

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

describe("buildHalftonePattern", () => {
  const CELLS = 64; // 8x8 lattice

  it("sweeps the full coverage range, densest at the top when going down", () => {
    const { bands } = buildHalftonePattern(3, { direction: "down" });
    expect(bands[0]!.cells.length).toBe(CELLS);
    expect(bands.at(-1)!.cells).toHaveLength(0);
  });

  it("flips which end is solid for direction up", () => {
    const { bands } = buildHalftonePattern(3, { direction: "up" });
    expect(bands[0]!.cells).toHaveLength(0);
    expect(bands.at(-1)!.cells.length).toBe(CELLS);
  });

  it("passes through an even checkerboard at the midpoint", () => {
    const { bands } = buildHalftonePattern();
    const mid = bands[Math.floor(bands.length / 2)]!;
    expect(mid.coverage).toBeCloseTo(0.5, 1);
    // An ordered dither spreads the on-cells evenly rather than clumping them,
    // so each lattice row carries roughly the same share at 50%.
    const perRow = new Map<number, number>();
    for (const [, row] of mid.cells) perRow.set(row, (perRow.get(row) ?? 0) + 1);
    for (const count of perRow.values()) expect(count).toBe(4);
  });

  it("decreases monotonically down the shape", () => {
    const { bands } = buildHalftonePattern();
    for (let i = 1; i < bands.length; i++) {
      expect(bands[i]!.cells.length).toBeLessThanOrEqual(bands[i - 1]!.cells.length);
    }
  });

  it("covers the shape contiguously end to end", () => {
    const { bands } = buildHalftonePattern();
    expect(bands[0]!.y0).toBeCloseTo(0);
    for (let i = 1; i < bands.length; i++) {
      expect(bands[i]!.y0).toBeCloseTo(bands[i - 1]!.y1);
    }
    expect(bands.at(-1)!.y1).toBeCloseTo(1);
  });

  it("clamps the ramp to the from/to range", () => {
    const { bands } = buildHalftonePattern(3, { from: 0.25, to: 0.75 });
    for (const band of bands) {
      expect(band.coverage).toBeGreaterThanOrEqual(0.25 - 1e-9);
      expect(band.coverage).toBeLessThanOrEqual(0.75 + 1e-9);
    }
    // Never fully solid nor fully empty inside a clamped range.
    expect(bands[0]!.cells.length).toBeLessThan(CELLS);
    expect(bands.at(-1)!.cells.length).toBeGreaterThan(0);
  });

  it("keeps every cell on the lattice", () => {
    for (const band of buildHalftonePattern().bands) {
      for (const [col, row] of band.cells) {
        expect(col).toBeGreaterThanOrEqual(0);
        expect(col).toBeLessThan(8);
        expect(row).toBeGreaterThanOrEqual(0);
        expect(row).toBeLessThan(8);
      }
    }
  });

  it("is deterministic, so SSR and client markup agree", () => {
    expect(buildHalftonePattern()).toEqual(buildHalftonePattern());
  });
});

describe("AreaChart halftone fill", () => {
  it("paints flat colour through the coverage mask", async () => {
    await mountChart({ dither: "halftone" });
    const combo = document.getElementById("nc-dither-v-0-desktop")!;
    const rect = combo.querySelector("rect")!;
    // Flat colour: the mask alone carries the gradient, so there is no wash.
    expect(rect.getAttribute("fill")).toBe("#2662d9");
    expect(rect.getAttribute("mask")).toBe("url(#nc-dither-v-0-desktop-halftone)");
    expect(document.getElementById("nc-dither-v-0-desktop-wash")).toBeNull();
    expect(document.getElementById("nc-dither-v-0-desktop-dots")).toBeNull();
  });

  it("emits additive cells — no black knock-out rects", async () => {
    await mountChart({ dither: "halftone" });
    const band = document.getElementById("nc-dither-v-0-desktop-halftone-b0")!;
    const fills = [...band.querySelectorAll("rect")].map(r => r.getAttribute("fill"));
    expect(fills.length).toBeGreaterThan(0);
    expect(new Set(fills)).toEqual(new Set(["#fff"]));
  });

  it("derives the cell size from ditherTile", async () => {
    await mountChart({ dither: "halftone", ditherTile: 16 });
    const band = document.getElementById("nc-dither-v-0-desktop-halftone-b0")!;
    expect(band.getAttribute("width")).toBe("16");
    // One cell is an eighth of the lattice edge.
    expect(band.querySelector("rect")!.getAttribute("width")).toBe("2");
  });

  it("honours ditherDirection", async () => {
    await mountChart({ dither: "halftone", ditherDirection: "up" });
    // Going up, the top band is the sparse end, so it paints nothing.
    const top = document.getElementById("nc-dither-v-0-desktop-halftone-b0")!;
    expect(top.querySelectorAll("rect")).toHaveLength(0);
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
      // Every variant must paint *some* pattern the fill can reference; the
      // count differs because halftone emits one pattern per ramp band.
      expect(document.querySelectorAll("pattern").length).toBeGreaterThan(0);
      expect(document.getElementById("nc-dither-v-0-desktop")).not.toBeNull();
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
