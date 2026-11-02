import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";
import { tv as tailwindTv } from "tailwind-variants";
import { chartsConfig, configureCharts, type ChartsRuntimeConfig } from "../src/runtime/config";
import { mergeThemes, resolveChartTheme, useChartUi } from "../src/runtime/composables/useChartUi";
import ChartTooltip from "../src/runtime/components/internal/ChartTooltip.vue";
import ChartLegend from "../src/runtime/components/internal/ChartLegend.vue";
import { defaultSeriesColor, resolveThemeColor } from "../src/runtime/utils/categories";
import { themeToVars } from "../src/runtime/utils/theme";
import type { ChartComponentThemeName, ChartUi } from "../src/runtime/theme";

const standalone = { ...chartsConfig };

/** Configure charts the way the Nuxt module's plugin does with Nuxt UI installed. */
function __setNuxtUi(on: boolean, appConfig: Record<string, unknown> = {}) {
  if (!on) return configureCharts(standalone);
  configureCharts({
    nuxtUi: true,
    tv: tailwindTv as unknown as ChartsRuntimeConfig["tv"],
    useAppConfig: () => appConfig,
    themeColors: ["primary", "secondary", "success", "info", "warning", "error"],
  });
}

afterEach(() => __setNuxtUi(false));

/** Mount `child` under a chart context, the way every chart provides one. */
function withChart(
  child: () => ReturnType<typeof h>,
  props: { ui?: ChartUi; class?: unknown; tooltipRoundness?: "sm" | "md" | "lg" | "xl" } = {},
  name: ChartComponentThemeName = "areaChart",
) {
  const Host = defineComponent({
    setup() {
      const ui = useChartUi(name, props);
      return () => h("div", { class: ui.rootClass, "data-testid": "root" }, [child()]);
    },
  });
  return mount(Host);
}

const tooltip = () =>
  h(ChartTooltip, {
    active: true,
    label: "Jan",
    payload: [{ name: "Desktop", value: 12, color: "red" }],
  } as never);

describe("theme resolution (Nuxt UI app.config shape)", () => {
  it("layers ui.chart, nuxtCharts.chart and nuxtCharts.<component>, lowest first", () => {
    const theme = resolveChartTheme("areaChart", {
      ui: { chart: { slots: { tooltip: "from-uchart", base: "uchart-only", center: "uchart-only" } } },
      nuxtCharts: {
        chart: { slots: { tooltip: "from-all-charts" } },
        areaChart: { slots: { tooltip: "from-area" } },
        barChart: { slots: { tooltip: "from-bar" } },
      },
    });
    const slot = String(theme.slots!.tooltip);
    expect(slot.indexOf("bg-default")).toBeLessThan(slot.indexOf("from-uchart"));
    expect(slot.indexOf("from-uchart")).toBeLessThan(slot.indexOf("from-all-charts"));
    expect(slot.indexOf("from-all-charts")).toBeLessThan(slot.indexOf("from-area"));
    expect(slot).not.toContain("from-bar");
    // UChart-only slots never leak into nuxt-charts themes.
    expect(theme.slots!.base).toBeUndefined();
    expect(theme.slots!.center).toBeUndefined();
  });

  it("adds component slots on top of the shared chrome", () => {
    const theme = resolveChartTheme("metricChart", undefined);
    expect(theme.slots!.tooltip).toContain("bg-default");
    expect(theme.slots!.value).toContain("text-2xl");
  });

  it("merges variants per option and per slot, and keeps replacer functions", () => {
    const replacer = (d: string) => `${d} x`;
    const merged = mergeThemes(
      { slots: { root: "a" }, variants: { size: { sm: { root: "r1" } } }, defaultVariants: { size: "sm" } },
      { slots: { root: replacer }, variants: { size: { sm: { root: "r2" }, lg: "big" } }, defaultVariants: { size: "lg" } },
    );
    expect(merged.slots!.root).toBe(replacer);
    expect(merged.variants!.size).toEqual({ sm: { root: "r1 r2" }, lg: "big" });
    expect(merged.defaultVariants).toEqual({ size: "lg" });
  });
});

describe("Nuxt UI mode", () => {
  it("renders the UChart tooltip classes and lets the ui prop win via tailwind-merge", () => {
    __setNuxtUi(true);
    const wrapper = withChart(tooltip, { ui: { tooltip: "rounded-lg bg-elevated" } });
    const el = wrapper.get('[data-slot="tooltip"]');
    const classes = el.classes();
    expect(classes).toContain("vc-tooltip");
    expect(classes).toContain("ring-default");
    expect(classes).toContain("rounded-lg");
    expect(classes).toContain("bg-elevated");
    expect(classes).not.toContain("rounded-sm");
    expect(classes).not.toContain("bg-default");
    expect(wrapper.get('[data-slot="tooltipValue"]').classes()).toContain("tabular-nums");
  });

  it("maps tooltipRoundness onto Tailwind radius utilities", () => {
    __setNuxtUi(true);
    const wrapper = withChart(tooltip, { tooltipRoundness: "xl" });
    const classes = wrapper.get('[data-slot="tooltip"]').classes();
    expect(classes).toContain("rounded-xl");
    expect(classes).not.toContain("rounded-sm");
  });

  it("applies app.config overrides to every chart", () => {
    __setNuxtUi(true, { nuxtCharts: { chart: { slots: { legendLabel: "text-toned" } } } });
    const wrapper = withChart(() => h(ChartLegend, { payload: [{ value: "A", color: "red" }] }));
    const label = wrapper.get('[data-slot="legendLabel"]').classes();
    expect(label).toContain("text-toned");
    expect(label).not.toContain("text-muted");
  });

  it("merges ui.root and class onto the root, class last", () => {
    __setNuxtUi(true);
    const wrapper = withChart(() => h("span"), { ui: { root: "text-default" }, class: "text-toned" });
    const root = wrapper.get('[data-testid="root"]').classes();
    expect(root).toContain("text-toned");
    expect(root).not.toContain("text-default");
    expect(root).not.toContain("text-muted");
    expect(root).toContain("relative");
  });

  it("passes a parent chart's ui to nested charts, except root", () => {
    __setNuxtUi(true);
    const Inner = defineComponent({
      setup() {
        const ui = useChartUi("areaChart", {});
        return () => h("div", { class: ui.rootClass, "data-testid": "inner" }, [tooltip()]);
      },
    });
    const wrapper = withChart(() => h(Inner), { ui: { root: "p-6", tooltip: "shadow-lg" } }, "metricChart");
    expect(wrapper.get('[data-slot="tooltip"]').classes()).toContain("shadow-lg");
    expect(wrapper.get('[data-testid="inner"]').classes()).not.toContain("p-6");
  });
});

describe("standalone mode (no Nuxt UI)", () => {
  it("keeps only the vc-* hooks plus caller classes", () => {
    const wrapper = withChart(tooltip, { ui: { tooltip: "my-tooltip" } });
    const classes = wrapper.get('[data-slot="tooltip"]').classes();
    expect(classes).toEqual(expect.arrayContaining(["vc-tooltip", "my-tooltip"]));
    expect(classes).not.toContain("bg-default");
  });

  it("still honours the legacy theme prop for chrome", () => {
    const Host = defineComponent({
      setup() {
        useChartUi("areaChart", { theme: { tooltip: { bg: "pink", radius: "2px" } } });
        return () => tooltip();
      },
    });
    const style = mount(Host).get('[data-slot="tooltip"]').attributes("style");
    expect(style).toContain("background-color: pink");
    expect(style).toContain("border-radius: 2px");
  });
});

describe("Nuxt UI palette", () => {
  it("uses the six --ui-chart tokens, then repeats them mixed toward the surface", () => {
    expect(defaultSeriesColor(0)).toBe("var(--vc-series-0)");
    expect(defaultSeriesColor(5)).toBe("var(--vc-series-5)");
    expect(defaultSeriesColor(6)).toBe(
      "var(--vc-series-6, color-mix(in oklab, var(--vc-series-0) 65%, var(--vc-surface-bg)))",
    );
    expect(defaultSeriesColor(13)).toContain("var(--vc-series-1) 42%");
  });

  it("resolves theme colour names to Nuxt UI tokens, or standalone tokens without it", () => {
    expect(resolveThemeColor("primary")).toBe("var(--vc-series-0)");
    expect(resolveThemeColor("error")).toBe("var(--vc-candle-down)");
    expect(resolveThemeColor("tertiary")).toBe("tertiary");
    __setNuxtUi(true);
    expect(resolveThemeColor("primary")).toBe("var(--ui-primary)");
    expect(resolveThemeColor("neutral")).toBe("var(--ui-bg-inverted)");
    expect(resolveThemeColor("#ff0000")).toBe("#ff0000");
    expect(resolveThemeColor("tertiary")).toBe("tertiary");
  });

  it("writes a colors prop as palette tokens, repeating a short palette", () => {
    __setNuxtUi(true);
    const vars = themeToVars(undefined, ["primary", "#123456"]) as Record<string, string>;
    expect(vars["--vc-series-0"]).toBe("var(--ui-primary)");
    expect(vars["--vc-series-1"]).toBe("#123456");
    expect(vars["--vc-series-2"]).toBe("color-mix(in oklab, var(--ui-primary) 65%, var(--vc-surface-bg))");
    expect(vars["--vc-series-5"]).toBe("color-mix(in oklab, #123456 42%, var(--vc-surface-bg))");
    expect(vars["--vc-series-6"]).toBeUndefined();
  });

  it("prefers the colors prop over theme.colors", () => {
    const vars = themeToVars({ colors: ["red"] }, ["blue"]) as Record<string, string>;
    expect(vars["--vc-series-0"]).toBe("blue");
  });
});
