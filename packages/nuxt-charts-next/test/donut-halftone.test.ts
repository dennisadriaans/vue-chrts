// @vitest-environment happy-dom
import { describe, expect, it, beforeAll, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import DonutChart from "../src/runtime/components/DonutChart.vue";
import { halftoneRadialId } from "../src/runtime/components/internal/HalftoneRadialDefs";

const mounted: Array<{ unmount: () => void }> = [];

afterEach(() => {
  while (mounted.length) mounted.pop()!.unmount();
  document.body.innerHTML = "";
});

/** happy-dom has no layout, so hand the container a size. */
beforeAll(() => {
  Element.prototype.getBoundingClientRect = function () {
    return { width: 400, height: 400, top: 0, left: 0, right: 400, bottom: 400, x: 0, y: 0, toJSON() {} } as DOMRect;
  };
  globalThis.ResizeObserver = class {
    private cb: ResizeObserverCallback;
    constructor(cb: ResizeObserverCallback) {
      this.cb = cb;
    }
    observe() {
      this.cb(
        [{ contentRect: { width: 400, height: 400 } } as ResizeObserverEntry],
        this as unknown as ResizeObserver,
      );
    }
    unobserve() {}
    disconnect() {}
  };
});

const data = [30, 20, 50];
const categories = {
  a: { name: "A", color: "#3b82f6" },
  b: { name: "B", color: "#22c55e" },
  c: { name: "C", color: "#a855f7" },
};

async function mountChart(props: Record<string, unknown> = {}) {
  const wrapper = mount(DonutChart, {
    props: { data, categories, height: 400, ...props } as never,
    attachTo: document.body,
  });
  await flushPromises();
  await new Promise((r) => setTimeout(r, 0));
  await flushPromises();
  mounted.push(wrapper);
  return wrapper;
}

describe("DonutChart radial halftone", () => {
  it("keeps flat fills by default", async () => {
    await mountChart();
    expect(document.querySelectorAll('pattern[id^="nc-htr-"]').length).toBe(0);
    expect(document.querySelectorAll('path[fill^="url(#nc-htr-"]').length).toBe(0);
  });

  it("points every sector at its own radial paint", async () => {
    await mountChart({ dither: "halftone" });
    const sectors = [...document.querySelectorAll('path[fill^="url(#nc-htr-"]')];
    expect(sectors).toHaveLength(data.length);
    // Each segment gets a distinct paint, so colours never bleed between them.
    const ids = sectors.map(p => p.getAttribute("fill"));
    expect(new Set(ids).size).toBe(data.length);
  });

  it("builds concentric annuli across the ring", async () => {
    await mountChart({ dither: "halftone" });
    const paint = document.getElementById(halftoneRadialId("v-0", 0))
      ?? document.querySelector('pattern[id^="nc-htr-"][id$="-s0"]')!;
    const rings = [...paint.querySelectorAll("circle")];
    expect(rings.length).toBeGreaterThan(1);

    // Radii step outward, so coverage tracks distance from the hole.
    const radii = rings.map(c => Number(c.getAttribute("r")));
    expect(radii).toEqual([...radii].sort((a, b) => a - b));
  });

  it("ramps coverage from the inner edge to the outer", async () => {
    await mountChart({ dither: "halftone" });
    const levels = [...document.querySelectorAll('pattern[id*="-s0-l"]')];
    const counts = levels.map(p => p.querySelectorAll("rect").length);
    expect(counts[0]).toBe(0);
    expect(counts.at(-1)).toBe(64);
    for (let i = 1; i < counts.length; i++) {
      expect(counts[i]!).toBeGreaterThanOrEqual(counts[i - 1]!);
    }
  });

  it("paints each segment's lattice in its own colour", async () => {
    await mountChart({ dither: "halftone" });
    const dense = document.querySelector('pattern[id*="-s1-l9"]')!;
    expect(dense.querySelector("rect")!.getAttribute("fill")).toBe("#22c55e");
  });

  it("honours a clamped coverage range", async () => {
    await mountChart({ dither: "halftone", ditherFrom: 0.3, ditherTo: 0.8 });
    const counts = [...document.querySelectorAll('pattern[id*="-s0-l"]')].map(
      p => p.querySelectorAll("rect").length,
    );
    expect(counts[0]).toBeGreaterThan(0);
    expect(counts.at(-1)).toBeLessThan(64);
  });

  it("scales the lattice with ditherCell", async () => {
    await mountChart({ dither: "halftone", ditherCell: 4 });
    const tile = document.querySelector('pattern[id*="-s0-l0"]')!;
    // 8-cell lattice.
    expect(tile.getAttribute("width")).toBe("32");
  });

  it("falls back to flat fills without a height to measure", async () => {
    // No `height` → no pixel radii, so the radial geometry cannot be placed.
    await mountChart({ dither: "halftone", height: undefined });
    expect(document.querySelectorAll('path[fill^="url(#nc-htr-"]').length).toBe(0);
  });
});
