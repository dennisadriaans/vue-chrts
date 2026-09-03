// @vitest-environment happy-dom
import { describe, expect, it, beforeAll, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import type { VueWrapper } from "@vue/test-utils";
import { Area, Line } from "vccs";
import ChartDot from "../src/runtime/components/internal/ChartDot";
import ChartTooltip from "../src/runtime/components/internal/ChartTooltip.vue";
import AreaChart from "../src/runtime/components/AreaChart.vue";
import BarChart from "../src/runtime/components/BarChart.vue";
import LineChart from "../src/runtime/components/LineChart.vue";
import DonutChart from "../src/runtime/components/DonutChart.vue";
import RadarChart from "../src/runtime/components/RadarChart.vue";
import RadialBarChart from "../src/runtime/components/RadialBarChart.vue";
import { BACKGROUND_PATTERNS, BACKGROUND_VARIANTS } from "../src/runtime/utils/background";
import {
  AREA_FILL_VARIANTS,
  DOT_VARIANTS,
  LEGEND_INDICATOR_VARIANTS,
  PATTERNED_BAR_VARIANTS,
  strokeDasharrayFor,
  variantId,
} from "../src/runtime/utils/variants";

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

/**
 * The generic SFCs collapse `T` to `never` when mounted without an explicit
 * type argument, so the key-dependent props stop type-checking. Cast through
 * `never` the way the existing render tests do.
 */
async function mountChart(
  component: unknown,
  props: Record<string, unknown>,
): Promise<VueWrapper> {
  const wrapper = mount(component as never, {
    props: { height: 300, ...props },
    attachTo: document.body,
  } as never) as VueWrapper;
  await flushPromises();
  await new Promise((r) => setTimeout(r, 0));
  await flushPromises();
  mounted.push(wrapper);
  return wrapper;
}

const mountArea = (props: Record<string, unknown> = {}) =>
  mountChart(AreaChart, { data, categories, ...props });

const mountBar = (props: Record<string, unknown> = {}) =>
  mountChart(BarChart, {
    data,
    categories,
    yAxis: ["desktop"],
    xAxis: "month",
    hideLegend: true,
    ...props,
  });

const mountLine = (props: Record<string, unknown> = {}) =>
  mountChart(LineChart, { data, categories, ...props });

/**
 * Every `url(#id)` the rendered SVG references must resolve to an element that
 * actually exists. A typo in an id is otherwise invisible in a unit test and
 * shows up only as a series that renders as nothing at all.
 */
function danglingReferences(): string[] {
  const missing: string[] = [];
  for (const el of document.querySelectorAll("*")) {
    for (const attr of el.attributes) {
      const match = /^url\(#([^)]+)\)$/.exec(attr.value.trim());
      if (match && !document.getElementById(match[1]!)) {
        missing.push(`${el.tagName}.${attr.name} -> #${match[1]}`);
      }
    }
  }
  return missing;
}

/**
 * Series-level props / attrs as they reach the `vccs` primitive.
 *
 * happy-dom has no layout, so `vccs` never paints the area and line curves —
 * the existing gradient tests assert on `<defs>` for the same reason. Reading
 * what the primitive was handed tests the wiring that actually matters, and
 * does so whether the value arrives as a prop or as an attribute fallthrough.
 */
function seriesProps(wrapper: VueWrapper, primitive: typeof Area | typeof Line) {
  return wrapper.findAllComponents(primitive).map((series) => ({
    ...series.props(),
    ...series.vm.$attrs,
  })) as Array<Record<string, unknown>>;
}

describe("BarChart style variants", () => {
  it("paints flat colour for the default variant", async () => {
    await mountBar();
    expect(document.querySelectorAll("pattern")).toHaveLength(0);
    expect(danglingReferences()).toEqual([]);
  });

  it.each(PATTERNED_BAR_VARIANTS)("emits a resolvable pattern for %s", async (variant) => {
    await mountBar({ variant });

    const expectedId = variantId(variant, "desktop", "v-0");
    expect(document.getElementById(expectedId)?.tagName.toLowerCase()).toBe("pattern");

    // The bar must actually reference the pattern, not just define it.
    const fills = [
      ...document.querySelectorAll(".v-charts-bar-rectangle path, .v-charts-bar-rectangle rect"),
    ].map((el) => el.getAttribute("fill"));
    expect(fills).toContain(`url(#${expectedId})`);
    expect(danglingReferences()).toEqual([]);
  });

  it("colours each series' pattern from its own category colour", async () => {
    await mountBar({ variant: "hatched", yAxis: ["desktop", "mobile"] });

    const desktop = document.getElementById(variantId("hatched", "desktop", "v-0"))!;
    const mobile = document.getElementById(variantId("hatched", "mobile", "v-0"))!;
    expect(desktop.querySelector("rect")?.getAttribute("fill")).toBe("#2662d9");
    expect(mobile.querySelector("rect")?.getAttribute("fill")).toBe("#e23670");
  });

  it("splits a duotone bar at its own midpoint, not on a tiling grid", async () => {
    await mountBar({ variant: "duotone" });

    // objectBoundingBox units are what keep the split at the bar's midpoint —
    // a userSpaceOnUse pattern would tile and read as stripes on a wide bar.
    const pattern = document.getElementById(variantId("duotone", "desktop", "v-0"))!;
    expect(pattern.getAttribute("patternUnits")).toBe("objectBoundingBox");

    const stops = [...document.getElementById(variantId("duotone-split", "desktop", "v-0"))!
      .querySelectorAll("stop")];
    expect(stops.map((s) => s.getAttribute("stop-opacity"))).toEqual(["0.4", "1"]);
  });

  it("mirrors the split for duotone-reverse", async () => {
    await mountBar({ variant: "duotone-reverse" });
    const stops = [...document.getElementById(variantId("duotone-reverse-split", "desktop", "v-0"))!
      .querySelectorAll("stop")];
    expect(stops.map((s) => s.getAttribute("stop-opacity"))).toEqual(["1", "0.4"]);
  });

  it("floats a solid cap strip above a stripped bar", async () => {
    await mountBar({ variant: "stripped" });
    const caps = [...document.querySelectorAll(".vc-variant-bar > rect")];
    expect(caps).toHaveLength(data.length);
    // The cap carries the flat series colour so the value stays readable even
    // though the body under it is only 20% opaque.
    expect(caps[0]?.getAttribute("fill")).toBe("#2662d9");
  });

  it("emits a resolvable glow filter", async () => {
    await mountBar({ glow: true });
    const id = variantId("glow", "desktop", "v-0");
    expect(document.getElementById(id)?.tagName.toLowerCase()).toBe("filter");
    expect(danglingReferences()).toEqual([]);
  });

  it("hatches only the final bar when bufferBar is set", async () => {
    await mountBar({ bufferBar: true });
    const bufferFill = `url(#${variantId("buffer", "desktop", "v-0")})`;
    const bodies = [...document.querySelectorAll(".vc-variant-bar > path, .vc-variant-bar > rect")]
      .map((el) => el.getAttribute("fill"));
    expect(bodies.filter((fill) => fill === bufferFill)).toHaveLength(1);
    expect(danglingReferences()).toEqual([]);
  });

  it("leaves every bar opaque until the pointer enters one", async () => {
    await mountBar({ hoverHighlight: true });
    const groups = [...document.querySelectorAll(".v-charts-bar-rectangle [opacity]")];
    expect(groups.every((el) => el.getAttribute("opacity") === "1")).toBe(true);
  });

  it("keeps the cube variant working alongside the new ones", async () => {
    await mountBar({ variant: "cubes" });
    expect(document.querySelectorAll(".vc-cube-bar").length).toBeGreaterThan(0);
    expect(document.querySelectorAll("pattern")).toHaveLength(0);
  });
});

describe("AreaChart fill variants", () => {
  it.each(AREA_FILL_VARIANTS)("emits a resolvable pattern for %s", async (variant) => {
    const wrapper = await mountArea({ variant });

    const expectedId = variantId(`area-${variant}`, "desktop", "v-0");
    expect(document.getElementById(expectedId)?.tagName.toLowerCase()).toBe("pattern");
    // The area must actually reference the pattern, not just define it.
    expect(seriesProps(wrapper, Area)[0]?.fill).toBe(`url(#${expectedId})`);
    expect(danglingReferences()).toEqual([]);
  });

  it("keeps the v2 gradient fade as the default fill", async () => {
    const wrapper = await mountArea();
    expect(document.querySelectorAll("pattern")).toHaveLength(0);
    expect(seriesProps(wrapper, Area)[0]?.fill).toMatch(/^url\(#nc-grad-/);
  });

  it("yields to dither, which is a texture of its own", async () => {
    const wrapper = await mountArea({ variant: "hatched", dither: true });
    expect(document.getElementById(variantId("area-hatched", "desktop", "v-0"))).toBeNull();
    expect(seriesProps(wrapper, Area)[0]?.fill).toMatch(/^url\(#nc-dither-/);
  });

  it("colours each series' pattern from its own category colour", async () => {
    await mountArea({ variant: "dotted" });
    const desktop = document.getElementById(variantId("area-dotted", "desktop", "v-0"))!;
    expect(desktop.querySelector("rect")?.getAttribute("fill")).toBe("#2662d9");
  });

  it("emits a resolvable glow filter without forcing a fill variant", async () => {
    const wrapper = await mountArea({ glow: true });
    const id = variantId("glow", "desktop", "v-0");
    expect(document.getElementById(id)?.tagName.toLowerCase()).toBe("filter");
    expect(seriesProps(wrapper, Area)[0]?.filter).toBe(`url(#${id})`);
    // Glow alone must not switch the fill away from the v2 gradient.
    expect(document.querySelectorAll("pattern")).toHaveLength(0);
    expect(danglingReferences()).toEqual([]);
  });
});

describe("stroke variants", () => {
  it("leaves the outline solid by default", async () => {
    const wrapper = await mountLine();
    expect(seriesProps(wrapper, Line)[0]?.["stroke-dasharray"]).toBeUndefined();
    expect(wrapper.element.className).not.toContain("vc-dash-animated");
  });

  it("dashes the outline for the dashed variant", async () => {
    const wrapper = await mountLine({ strokeVariant: "dashed" });
    expect(seriesProps(wrapper, Line)[0]?.["stroke-dasharray"]).toBe("3 3");
    // A static dash must not also start the animation.
    expect(wrapper.element.className).not.toContain("vc-dash-animated");
  });

  it("marks the root for CSS to march the dashes", async () => {
    const wrapper = await mountLine({ strokeVariant: "animated-dashed" });
    expect(wrapper.element.className).toContain("vc-dash-animated");
    expect(seriesProps(wrapper, Line)[0]?.["stroke-dasharray"]).toBe("3 3");
  });

  it("lets an explicit lineDashArray win over the variant default", async () => {
    const wrapper = await mountLine({ strokeVariant: "dashed", lineDashArray: "8 2" });
    expect(seriesProps(wrapper, Line)[0]?.["stroke-dasharray"]).toBe("8 2");
  });

  it("applies the same treatment to an area outline", async () => {
    const wrapper = await mountArea({ strokeVariant: "animated-dashed" });
    expect(wrapper.element.className).toContain("vc-dash-animated");
    expect(seriesProps(wrapper, Area)[0]?.["stroke-dasharray"]).toBe("3 3");
  });

  it("maps each variant to its dash pattern", () => {
    expect(strokeDasharrayFor("solid")).toBeUndefined();
    expect(strokeDasharrayFor(undefined)).toBeUndefined();
    expect(strokeDasharrayFor("dashed")).toBe("3 3");
    expect(strokeDasharrayFor("animated-dashed")).toBe("3 3");
  });
});

describe("dot variants", () => {
  /**
   * Mount the marker on its own. The chart-level tests below cover the wiring;
   * the marker's own geometry is asserted here because `vccs` never paints the
   * curve (and so never calls the dot slot) without real layout.
   */
  function mountDot(props: Record<string, unknown> = {}) {
    const wrapper = mount(ChartDot, {
      props: { cx: 10, cy: 20, color: "#2662d9", ...props },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    return wrapper;
  }

  it("asks vccs for no markers by default", async () => {
    const wrapper = await mountLine();
    expect(seriesProps(wrapper, Line)[0]?.dot).toBe(false);
  });

  it.each(DOT_VARIANTS)("turns markers on for %s", async (dotVariant) => {
    const wrapper = await mountLine({ dotVariant });
    // Truthy `dot` is what makes vccs call the slot that renders ChartDot.
    expect(seriesProps(wrapper, Line)[0]?.dot).toBe(true);
  });

  it.each(DOT_VARIANTS)("draws at least one circle for %s", (variant) => {
    const wrapper = mountDot({ variant });
    expect(wrapper.findAll("circle").length).toBeGreaterThan(0);
  });

  it("draws nothing for a point clipped out of the plot", () => {
    // vccs calls the dot slot for every point, including ones off-plot, which
    // arrive with no coordinates.
    const wrapper = mountDot({ cx: undefined, cy: undefined });
    expect(wrapper.find("circle").exists()).toBe(false);
  });

  it("rings a bordered dot in the surface colour so it reads over a fill", () => {
    const circles = mountDot({ variant: "border" }).findAll("circle");
    expect(circles[0]?.attributes("fill")).toBe("var(--vc-surface-bg)");
    expect(circles[1]?.attributes("fill")).toBe("#2662d9");
    // The ring must sit outside the core, or it would not be visible at all.
    expect(Number(circles[0]?.attributes("r"))).toBeGreaterThan(
      Number(circles[1]?.attributes("r")),
    );
  });

  it("inverts the ring for colored-border", () => {
    const circles = mountDot({ variant: "colored-border" }).findAll("circle");
    expect(circles[0]?.attributes("fill")).toBe("#2662d9");
    expect(circles[1]?.attributes("fill")).toBe("var(--vc-surface-bg)");
    expect(Number(circles[0]?.attributes("r"))).toBeGreaterThan(
      Number(circles[1]?.attributes("r")),
    );
  });

  it("animates the ping ring without a JS frame loop", () => {
    const animations = mountDot({ variant: "ping" }).findAll("animate");
    expect(animations.map((a) => a.attributes("attributename"))).toEqual(["r", "fill-opacity"]);
    expect(animations[0]?.attributes("repeatcount")).toBe("indefinite");
  });

  it("scales markers with size", () => {
    expect(mountDot({ size: 6 }).find("circle").attributes("r")).toBe("6");
  });
});

describe("chart background patterns", () => {
  it("paints nothing by default", async () => {
    await mountArea();
    expect(document.querySelector(".vc-chart-background")).toBeNull();
  });

  it.each(BACKGROUND_VARIANTS)("renders the %s texture behind the plot", async (variant) => {
    await mountArea({ backgroundPattern: variant });

    const layer = document.querySelector(".vc-chart-background")!;
    expect(layer).not.toBeNull();
    const pattern = layer.querySelector("pattern")!;
    expect(pattern.children.length).toBe(BACKGROUND_PATTERNS[variant].shapes.length);
    expect(danglingReferences()).toEqual([]);
  });

  it("draws the texture before the chart content, so the grid sits on top", async () => {
    await mountBar({ backgroundPattern: "dots" });
    const background = document.querySelector(".vc-chart-background")!;
    // vccs has no z-index layer, so document order is the stacking order: the
    // texture has to precede every layer that draws data or axes.
    const layers = [...background.parentElement!.children];
    const backgroundIndex = layers.indexOf(background);
    const firstContentIndex = layers.findIndex((el) =>
      el.getAttribute("class")?.includes("v-charts-"),
    );
    expect(backgroundIndex).toBeGreaterThanOrEqual(0);
    expect(backgroundIndex).toBeLessThan(firstContentIndex);
  });

  it("fades the texture out toward the edges", async () => {
    await mountArea({ backgroundPattern: "grid" });
    const rect = document.querySelector(".vc-chart-background > rect")!;
    const maskId = /url\(#([^)]+)\)/.exec(rect.getAttribute("mask")!)![1]!;
    // The mask is a blurred inset rect: without the blur the texture would end
    // on a hard line rather than dissolving.
    const maskRect = document.getElementById(maskId)!.querySelector("rect")!;
    expect(maskRect.getAttribute("filter")).toMatch(/^url\(#/);
  });

  it("takes its colour from a token, so it follows the theme", async () => {
    await mountArea({ backgroundPattern: "dots" });
    const layer = document.querySelector(".vc-chart-background") as HTMLElement;
    expect(layer.style.color).toContain("--vc-bg-pattern-color");
    expect(layer.querySelector("circle")?.getAttribute("fill")).toBe("currentColor");
  });
});

describe("legend indicator variants", () => {
  it("defaults to the rounded square", async () => {
    await mountArea();
    expect(document.querySelector(".vc-legend__dot")?.className).toContain(
      "vc-legend__dot--rounded-square",
    );
  });

  it.each(LEGEND_INDICATOR_VARIANTS)("applies the %s class", async (legendVariant) => {
    await mountArea({ legendVariant });
    const dot = document.querySelector(".vc-legend__dot")!;
    expect(dot.className).toContain(`vc-legend__dot--${legendVariant}`);
    // The swatch still carries the series colour whatever shape it takes.
    expect((dot as HTMLElement).style.background).not.toBe("");
  });

  /** Background colour of each legend swatch, in payload order. */
  const swatchColors = () =>
    [...document.querySelectorAll(".vc-legend__dot")].map((el) => (el as HTMLElement).style.background);

  it.each(PATTERNED_BAR_VARIANTS)(
    "keeps flat swatch colours when bars paint from the %s pattern",
    async (variant) => {
      await mountBar({ variant, yAxis: ["desktop", "mobile"], hideLegend: false });
      // A patterned bar reports its `fill` as the legend colour, and a
      // `url(#…)` paint reference cannot paint a CSS background — the swatch
      // would silently render as nothing.
      expect(swatchColors()).toEqual(["#2662d9", "#e23670"]);
    },
  );

  it("keeps flat swatch colours on a gradient donut", async () => {
    await mountChart(DonutChart, {
      data: [60, 40],
      categories: {
        chrome: { name: "Chrome", color: "#2662d9" },
        safari: { name: "Safari", color: "#e23670" },
      },
      variant: "gradient",
    });
    expect(swatchColors()).toEqual(["#2662d9", "#e23670"]);
  });
});

describe("polar chart variants", () => {
  const donutCategories = {
    chrome: { name: "Chrome", color: "#2662d9" },
    safari: { name: "Safari", color: "#e23670" },
  };

  it("paints donut segments flat by default", async () => {
    await mountChart(DonutChart, { data: [60, 40], categories: donutCategories });
    expect(document.querySelectorAll("linearGradient")).toHaveLength(0);
  });

  it("ramps each donut segment from its own colour for the gradient variant", async () => {
    await mountChart(DonutChart, {
      data: [60, 40],
      categories: donutCategories,
      variant: "gradient",
    });

    const first = document.getElementById(variantId("segment-gradient", "0", "v-0"))!;
    const stops = [...first.querySelectorAll("stop")];
    expect(stops.map((s) => s.getAttribute("stop-color"))).toEqual(["#2662d9", "#2662d9"]);
    expect(stops.map((s) => s.getAttribute("stop-opacity"))).toEqual(["1", "0.45"]);
    expect(danglingReferences()).toEqual([]);
  });

  it("emits a resolvable glow filter per donut segment", async () => {
    await mountChart(DonutChart, { data: [60, 40], categories: donutCategories, glow: true });
    expect(document.getElementById(variantId("glow", "0", "v-0"))?.tagName.toLowerCase())
      .toBe("filter");
    expect(danglingReferences()).toEqual([]);
  });

  /** Fill opacity of each rendered radar polygon. */
  const radarFillOpacities = () =>
    [...document.querySelectorAll(".v-charts-radar-polygon path")].map((el) =>
      el.getAttribute("fill-opacity"),
    );

  it("keeps the radar filled by default", async () => {
    await mountChart(RadarChart, { data, categories, dataKey: "month" });
    expect(radarFillOpacities()).toEqual(["0.6", "0.6"]);
  });

  it("drops the radar fill for the lines variant", async () => {
    await mountChart(RadarChart, { data, categories, dataKey: "month", variant: "lines" });
    expect(radarFillOpacities()).toEqual(["0", "0"]);
  });

  it("honours an explicit fillOpacity on a filled radar", async () => {
    await mountChart(RadarChart, {
      data,
      categories,
      dataKey: "month",
      fillOpacity: 0.25,
    });
    expect(radarFillOpacities()).toEqual(["0.25", "0.25"]);
  });

  it("switches the polar grid to concentric circles", async () => {
    await mountChart(RadarChart, { data, categories, dataKey: "month", gridType: "circle" });
    expect(document.querySelector(".v-charts-polar-grid-concentric-circle")).not.toBeNull();
    expect(document.querySelector(".v-charts-polar-grid-concentric-polygon")).toBeNull();
  });

  /**
   * Arc geometry of the rendered radial bars. A full turn and a semicircle
   * differ in how far each sector sweeps, which the path data shows directly.
   */
  const sectorPaths = () =>
    [...document.querySelectorAll(".v-charts-sector")].map((el) => el.getAttribute("d") ?? "");

  it("sweeps a full turn for the radial bar default", async () => {
    await mountChart(RadialBarChart, { data: [60, 40], categories: donutCategories });
    const paths = sectorPaths();
    expect(paths.length).toBeGreaterThan(0);
    // A full turn needs the large-arc flag on at least one sector; a
    // semicircle's sectors never exceed 180°.
    expect(paths.some((d) => /A[^A]*,1,1,/.test(d) || /1,1,1/.test(d))).toBe(true);
  });

  it("renders the semi variant over a different sweep than the full one", async () => {
    await mountChart(RadialBarChart, { data: [60, 40], categories: donutCategories });
    const full = sectorPaths();
    while (mounted.length) mounted.pop()!.unmount();
    document.body.innerHTML = "";

    await mountChart(RadialBarChart, {
      data: [60, 40],
      categories: donutCategories,
      variant: "semi",
    });
    const semi = sectorPaths();

    expect(semi.length).toBe(full.length);
    expect(semi).not.toEqual(full);
  });

  it("lets an explicit angle override the semi shorthand", async () => {
    await mountChart(RadialBarChart, {
      data: [60, 40],
      categories: donutCategories,
      variant: "semi",
      startAngle: 90,
      endAngle: -270,
    });
    const semiWithFullAngles = sectorPaths();
    while (mounted.length) mounted.pop()!.unmount();
    document.body.innerHTML = "";

    await mountChart(RadialBarChart, { data: [60, 40], categories: donutCategories });
    expect(semiWithFullAngles).toEqual(sectorPaths());
  });
});

describe("tooltip variants", () => {
  /**
   * The tooltip only mounts on hover, which happy-dom's fake layout cannot
   * drive, so mount the surface directly with an active payload.
   */
  function mountTooltip(props: Record<string, unknown> = {}) {
    const wrapper = mount(ChartTooltip, {
      props: {
        active: true,
        label: "Jan",
        payload: [{ dataKey: "desktop", name: "Desktop", value: 100, color: "#2662d9" }],
        ...props,
      },
      attachTo: document.body,
    } as never);
    mounted.push(wrapper);
    return wrapper;
  }

  it("renders a plain surface by default", () => {
    const surface = mountTooltip().find(".vc-tooltip");
    expect(surface.exists()).toBe(true);
    expect(surface.classes()).not.toContain("vc-tooltip--frosted-glass");
  });

  it("applies the frosted-glass and roundness classes together", () => {
    const classes = mountTooltip({ variant: "frosted-glass", roundness: "xl" })
      .find(".vc-tooltip")
      .classes();
    expect(classes).toContain("vc-tooltip--frosted-glass");
    expect(classes).toContain("vc-tooltip--xl");
  });

  it.each(["sm", "md", "lg", "xl"])("applies the %s roundness class", (roundness) => {
    expect(mountTooltip({ roundness }).find(".vc-tooltip").classes()).toContain(
      `vc-tooltip--${roundness}`,
    );
  });

  it("still renders the label and each series row", () => {
    const wrapper = mountTooltip({ variant: "frosted-glass" });
    expect(wrapper.find(".vc-tooltip__label").text()).toBe("Jan");
    expect(wrapper.findAll(".vc-tooltip__item")).toHaveLength(1);
    expect(wrapper.find(".vc-tooltip__value").text()).toBe("100");
  });
});
