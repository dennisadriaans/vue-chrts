// @vitest-environment happy-dom
import { describe, expect, it, vi } from "vitest";
import { h } from "vue";
import { mount } from "@vue/test-utils";
import CartesianFrame from "../src/runtime/components/internal/CartesianFrame.vue";
import { AXIS_SLOT } from "../src/runtime/utils/axis";

vi.mock("vccs", () => {
  const toDataAttrs = (attrs: Record<string, unknown>) => {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(attrs)) {
      if (typeof v === "function" || v === undefined) continue;
      out[`data-p-${k}`] = typeof v === "object" ? JSON.stringify(v) : String(v);
    }
    return out;
  };
  const stub = (name: string) => ({
    name,
    inheritAttrs: false,
    setup(_: unknown, { attrs, slots }: { attrs: Record<string, unknown>; slots: Record<string, () => unknown> }) {
      return () => h("div", { "data-stub": name, ...toDataAttrs(attrs) }, slots.default?.() as never);
    },
  });
  return {
    CartesianGrid: stub("CartesianGrid"),
    Legend: stub("Legend"),
    ReferenceLine: stub("ReferenceLine"),
    Tooltip: stub("Tooltip"),
    XAxis: stub("XAxis"),
    YAxis: stub("YAxis"),
  };
});

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

function allWidths(props: Record<string, unknown>): number[] {
  const wrapper = mount(CartesianFrame, {
    props: { container, height: 300, ...props } as never,
  });
  return wrapper.findAll('[data-stub="YAxis"]').map((a) => Number(a.attributes("data-p-width")));
}

function widthOf(props: Record<string, unknown>): number {
  const wrapper = mount(CartesianFrame, {
    props: { container, height: 300, ...props } as never,
  });
  const axis = wrapper.find('[data-stub="YAxis"]');
  return Number(axis.attributes("data-p-width"));
}

const SMALL = [
  { month: "Jan", a: 10, b: 20 },
  { month: "Feb", a: 30, b: 40 },
];

const LARGE = [
  { month: "Apr", pro: 24100, team: 31200, enterprise: 12400 },
  { month: "Sep", pro: 37900, team: 45300, enterprise: 22400 },
];

const CATEGORIES_LARGE = {
  pro: { name: "Pro" },
  team: { name: "Team" },
  enterprise: { name: "Enterprise" },
};

describe("y-axis width sizing", () => {
  it("leaves small-value charts at the original slot", () => {
    expect(widthOf({ data: SMALL, categories: { a: { name: "A" }, b: { name: "B" } }, xAxisKey: "month" }))
      .toBe(AXIS_SLOT.numericYWidth);
  });

  it("widens for stacked totals that overflow the original slot", () => {
    const stacked = widthOf({
      data: LARGE, categories: CATEGORIES_LARGE, xAxisKey: "month", valueStacked: true,
    });
    expect(stacked).toBeGreaterThan(AXIS_SLOT.numericYWidth);
  });

  it("sizes an unstacked chart from the largest series, not the sum", () => {
    const unstacked = widthOf({ data: LARGE, categories: CATEGORIES_LARGE, xAxisKey: "month" });
    const stacked = widthOf({
      data: LARGE, categories: CATEGORIES_LARGE, xAxisKey: "month", valueStacked: true,
    });
    expect(unstacked).toBeLessThan(stacked);
  });

  it("keeps a percent axis at the original slot", () => {
    expect(widthOf({
      data: LARGE, categories: CATEGORIES_LARGE, xAxisKey: "month",
      valueStacked: true, percentAxis: true,
    })).toBe(AXIS_SLOT.numericYWidth);
  });

  it("accounts for a formatter that lengthens labels", () => {
    const plain = widthOf({ data: SMALL, categories: { a: { name: "A" } }, xAxisKey: "month" });
    const formatted = widthOf({
      data: SMALL, categories: { a: { name: "A" } }, xAxisKey: "month",
      yFormatter: (v: unknown) => `$${Number(v).toFixed(2)} USD`,
    });
    expect(formatted).toBeGreaterThan(plain);
  });

  it("respects an explicit yDomain over the data extent", () => {
    const wide = widthOf({
      data: SMALL, categories: { a: { name: "A" } }, xAxisKey: "month",
      yDomain: [0, 5_000_000],
    });
    expect(wide).toBeGreaterThan(AXIS_SLOT.numericYWidth);
  });

  it("still gives a titled axis its own slot", () => {
    expect(widthOf({
      data: LARGE, categories: CATEGORIES_LARGE, xAxisKey: "month",
      valueStacked: true, yLabel: "Revenue",
    })).toBe(AXIS_SLOT.titledYWidth);
  });

  it("never exceeds the cap, even for absurd values", () => {
    expect(widthOf({
      data: [{ month: "Jan", a: 9e14 }], categories: { a: { name: "A" } }, xAxisKey: "month",
    })).toBeLessThanOrEqual(96);
  });

  it("tolerates null and non-numeric values in the data", () => {
    expect(() => widthOf({
      data: [{ month: "Jan", a: null }, { month: "Feb", a: "x" }, { month: "Mar", a: 5 }],
      categories: { a: { name: "A" } }, xAxisKey: "month",
    })).not.toThrow();
  });

  it("handles an empty dataset", () => {
    expect(widthOf({ data: [], categories: { a: { name: "A" } }, xAxisKey: "month" }))
      .toBe(AXIS_SLOT.numericYWidth);
  });

  it("handles negative values", () => {
    expect(widthOf({
      data: [{ month: "Jan", a: -250000 }, { month: "Feb", a: 100 }],
      categories: { a: { name: "A" } }, xAxisKey: "month",
    })).toBeGreaterThan(AXIS_SLOT.numericYWidth);
  });

  it("keeps a horizontal-orientation category axis on the category slot", () => {
    expect(widthOf({
      data: LARGE, categories: CATEGORIES_LARGE, xAxisKey: "month", orientation: "horizontal",
    })).toBe(AXIS_SLOT.categoryYWidth);
  });
  it("sizes each y-axis from only its own series", () => {
    const widths = allWidths({
      data: [
        { month: "Jan", small: 5, huge: 900_000 },
        { month: "Feb", small: 9, huge: 1_200_000 },
      ],
      categories: { small: { name: "Small" }, huge: { name: "Huge", yAxis: "right" } },
      xAxisKey: "month",
      yAxes: { right: { orientation: "right" } },
    });

    expect(widths).toHaveLength(2);
    // The small-scale axis keeps the default slot; only the large one widens.
    expect(widths[0]).toBe(AXIS_SLOT.numericYWidth);
    expect(widths[1]).toBeGreaterThan(AXIS_SLOT.numericYWidth);
  });
});
