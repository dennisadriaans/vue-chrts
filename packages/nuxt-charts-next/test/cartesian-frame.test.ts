// @vitest-environment happy-dom
import { describe, expect, it, vi } from "vitest";
import { h } from "vue";
import { mount } from "@vue/test-utils";
import CartesianFrame from "../src/runtime/components/internal/CartesianFrame.vue";
import { categoriesToSeries, PRIMARY_Y_AXIS_ID } from "../src/runtime/utils/categories";
import { Orientation } from "../src/runtime/enums";

/**
 * `vccs` renders through a sizing container that reports 0x0 under happy-dom, so
 * the real chart children never mount. These tests care about *which props the
 * wrapper hands to `<YAxis>`*, not about `vccs`' rendering, so every `vccs`
 * component is stubbed with a plain element that keeps its props inspectable.
 */
vi.mock("vccs", () => {
  const stub = (name: string) => ({
    name,
    inheritAttrs: false,
    setup(_: unknown, { attrs, slots }: { attrs: Record<string, unknown>; slots: Record<string, () => unknown> }) {
      return () => h("div", { "data-stub": name, ...toDataAttrs(attrs) }, slots.default?.() as never);
    },
  });
  const toDataAttrs = (attrs: Record<string, unknown>) => {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(attrs)) {
      if (typeof v === "function" || v === undefined) continue;
      // Attrs arrive kebab-cased from the template (`y-axis-id`).
      out[`data-p-${k}`] = typeof v === "object" ? JSON.stringify(v) : String(v);
    }
    return out;
  };
  return {
    CartesianGrid: stub("CartesianGrid"),
    Legend: stub("Legend"),
    ReferenceLine: stub("ReferenceLine"),
    Tooltip: stub("Tooltip"),
    XAxis: stub("XAxis"),
    YAxis: stub("YAxis"),
  };
});

// Our own sizing container also measures 0x0 here and only renders children
// after the mount tick, so stub it the same way.
vi.mock("../src/runtime/components/internal/ChartContainer", () => ({
  default: {
    name: "ChartContainer",
    setup: (_: unknown, { slots }: { slots: Record<string, (() => unknown) | undefined> }) =>
      () => h("div", { "data-stub": "ChartContainer" }, slots.default?.() as never),
  },
}));

const container = {
  name: "ChartContainer",
  setup: (_: unknown, { slots }: { slots: Record<string, (() => unknown) | undefined> }) =>
    () => h("div", slots.default?.() as never),
};

function mountFrame(props: Record<string, unknown>) {
  return mount(CartesianFrame, {
    props: { container, data: [{ x: "a", desktop: 1 }], height: 300, ...props } as never,
  });
}

/** All `<YAxis>` stubs, in render order. */
function yAxes(wrapper: ReturnType<typeof mountFrame>) {
  return wrapper.findAll('[data-stub="YAxis"]');
}

describe("CartesianFrame y-axes", () => {
  it("renders exactly one y-axis for a chart declaring no yAxes", () => {
    const axes = yAxes(mountFrame({ categories: { desktop: { name: "Desktop" } } }));
    expect(axes).toHaveLength(1);
    expect(axes[0]?.attributes("data-p-y-axis-id")).toBe(String(PRIMARY_Y_AXIS_ID));
    expect(axes[0]?.attributes("data-p-orientation")).toBe("left");
  });

  it("keeps the single-axis props identical when a category targets yAxis '0'", () => {
    // Backwards compatibility: the string form must collapse onto the primary
    // axis rather than adding a second one. See `normalizeAxisId`.
    const base = yAxes(mountFrame({ categories: { desktop: { name: "Desktop" } } }));
    const withId = yAxes(mountFrame({ categories: { desktop: { name: "Desktop", yAxis: "0" } } }));
    expect(withId).toHaveLength(1);
    expect(withId[0]?.attributes()).toEqual(base[0]?.attributes());
  });

  it("renders one axis per distinct id, on the declared side", () => {
    const axes = yAxes(
      mountFrame({
        categories: {
          indoor: { name: "Indoor", yAxis: "temp" },
          outdoor: { name: "Outdoor", yAxis: "temp" },
          humidity: { name: "Humidity", yAxis: "pct" },
        },
        yAxes: { temp: { orientation: "left", label: "°C" }, pct: { orientation: "right", label: "%" } },
      }),
    );
    // Primary (unreferenced but always present) + temp + pct.
    expect(axes.map((a) => a.attributes("data-p-y-axis-id"))).toEqual(["0", "temp", "pct"]);
    expect(axes.map((a) => a.attributes("data-p-orientation"))).toEqual(["left", "left", "right"]);
  });

  it("collapses mixed numeric and string spellings of one id onto a single axis", () => {
    const axes = yAxes(
      mountFrame({
        categories: { a: { name: "A", yAxis: 1 }, b: { name: "B", yAxis: "1" } },
        yAxes: { 1: { orientation: "right" } },
      }),
    );
    expect(axes.map((a) => a.attributes("data-p-y-axis-id"))).toEqual(["0", "1"]);
  });

  it("renders no value y-axis for horizontal bars beyond the swapped category axis", () => {
    const axes = yAxes(
      mountFrame({
        categories: { desktop: { name: "Desktop", yAxis: "other" } },
        yAxes: { other: { orientation: "right" } },
        orientation: Orientation.Horizontal,
        xAxisKey: "x",
      }),
    );
    // The swapped category axis only — multi-axis does not apply to this layout.
    expect(axes).toHaveLength(1);
    expect(axes[0]?.attributes("data-p-y-axis-id")).toBeUndefined();
  });

  it("gives each series an axis id that matches a rendered axis by value and type", () => {
    // vccs binds a mark to its axis with `===`, so a series id that only *looks*
    // like a rendered axis id (`"1"` vs `1`) silently drops the series. The axes
    // above are re-normalised on their way out, so this has to be asserted on
    // the series side to catch a regression in `categoriesToSeries`.
    const series = categoriesToSeries({
      a: { name: "A", yAxis: "0" },
      b: { name: "B", yAxis: 1 },
      c: { name: "C", yAxis: "1" },
    });
    expect(series.map((s) => s.yAxisId)).toEqual([PRIMARY_Y_AXIS_ID, 1, 1]);
    for (const s of series) expect(typeof s.yAxisId).toBe("number");

    const axes = yAxes(
      mountFrame({
        categories: { a: { name: "A", yAxis: "0" }, b: { name: "B", yAxis: 1 }, c: { name: "C", yAxis: "1" } },
        yAxes: { 1: { orientation: "right" } },
      }),
    );
    const axisIds = axes.map((a) => a.attributes("data-p-y-axis-id"));
    for (const s of series) expect(axisIds).toContain(String(s.yAxisId));
  });

  it("renders no y-axis when hideYAxis is set", () => {
    expect(yAxes(mountFrame({ categories: { desktop: { name: "Desktop" } }, hideYAxis: true }))).toHaveLength(0);
  });
});
