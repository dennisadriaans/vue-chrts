import { describe, expect, it } from "vitest";
import { CurveType, DonutType, LegendPosition, Orientation } from "../src/runtime/enums";
import { curveTypeToVccs } from "../src/runtime/utils/curve";
import { legendPositionToLegendProps } from "../src/runtime/utils/legend";
import { categoriesToSeries, PRIMARY_Y_AXIS_ID } from "../src/runtime/utils/categories";
import { resolveAxisProps, resolveYAxes } from "../src/runtime/utils/axis";
import { toAxisDomain, toCssProperties } from "../src/runtime/utils/style";
import {
  markerToDot,
  normalizeMarkerConfig,
  toStrokeDasharray,
} from "../src/runtime/utils/marker";
import { gradientId } from "../src/runtime/utils/gradient";

describe("curveTypeToVccs", () => {
  it("maps every CurveType member to a non-empty vccs curve", () => {
    for (const value of Object.values(CurveType)) {
      const mapped = curveTypeToVccs(value);
      expect(mapped, `${value} should map`).toBeTruthy();
      expect(typeof mapped).toBe("string");
    }
  });

  it("defaults to monotone when unset", () => {
    expect(curveTypeToVccs(undefined)).toBe("monotone");
  });

  it("passes through direct equivalents", () => {
    expect(curveTypeToVccs(CurveType.Step)).toBe("step");
    expect(curveTypeToVccs(CurveType.MonotoneX)).toBe("monotoneX");
  });
});

describe("legendPositionToLegendProps", () => {
  it("maps every LegendPosition member to complete props", () => {
    for (const value of Object.values(LegendPosition)) {
      const props = legendPositionToLegendProps(value);
      expect(props.align).toBeTruthy();
      expect(props.verticalAlign).toBeTruthy();
      expect(props.layout).toBeTruthy();
    }
  });

  it("defaults to bottom-centre when unset", () => {
    expect(legendPositionToLegendProps(undefined)).toEqual({
      align: "center",
      verticalAlign: "bottom",
      layout: "horizontal",
    });
  });

  it("translates corners correctly", () => {
    expect(legendPositionToLegendProps(LegendPosition.TopRight)).toMatchObject({
      align: "right",
      verticalAlign: "top",
    });
  });
});

describe("categoriesToSeries", () => {
  it("preserves order and resolves name / colour", () => {
    const series = categoriesToSeries({
      desktop: { name: "Desktop", color: "#3b82f6" },
      mobile: { name: "Mobile", color: ["#22c55e", "#000"] },
    });
    expect(series).toEqual([
      { dataKey: "desktop", name: "Desktop", color: "#3b82f6", hidden: false, yAxisId: 0 },
      // array colour collapses to its first entry (v2 compatibility)
      { dataKey: "mobile", name: "Mobile", color: "#22c55e", hidden: false, yAxisId: 0 },
    ]);
  });

  it("reads the per-category y-axis id, defaulting to the primary axis", () => {
    const series = categoriesToSeries({
      temperature: { name: "Temp", yAxis: "temp" },
      humidity: { name: "Humidity" },
    });
    expect(series.map((s) => s.yAxisId)).toEqual(["temp", PRIMARY_Y_AXIS_ID]);
  });

  it("falls back to the key when name is missing", () => {
    const [s] = categoriesToSeries({ views: { name: "" } });
    expect(s).toBeDefined();
    expect(s?.name).toBe("");
    expect(s?.dataKey).toBe("views");
  });
});

describe("resolveYAxes", () => {
  const primary = {
    label: "Primary",
    domain: undefined,
    tickCount: undefined,
    tickFormatter: undefined,
    tickLine: false,
    hide: false,
    ticks: undefined,
    interval: undefined,
    tick: undefined,
  };

  it("renders only the primary axis when no series opts into another", () => {
    const axes = resolveYAxes({
      series: categoriesToSeries({ desktop: { name: "Desktop" } }),
      yAxes: undefined,
      minMaxTicksOnly: undefined,
      primary,
    });
    expect(axes).toHaveLength(1);
    expect(axes[0]).toMatchObject({ id: PRIMARY_Y_AXIS_ID, orientation: "left", label: "Primary" });
  });

  it("gives series on the same id one shared axis and splits the others", () => {
    const axes = resolveYAxes({
      series: categoriesToSeries({
        t1: { name: "T1", yAxis: "temp" },
        t2: { name: "T2", yAxis: "temp" },
        pct: { name: "Pct", yAxis: "pct" },
      }),
      yAxes: {
        temp: { orientation: "left", label: "°C" },
        pct: { orientation: "right", label: "%" },
      },
      minMaxTicksOnly: undefined,
      primary,
    });
    expect(axes.map((a) => a.id)).toEqual([PRIMARY_Y_AXIS_ID, "temp", "pct"]);
    expect(axes.map((a) => a.orientation)).toEqual(["left", "left", "right"]);
    expect(axes.map((a) => a.label)).toEqual(["Primary", "°C", "%"]);
  });

  it("creates an axis for an id referenced only by a series", () => {
    const axes = resolveYAxes({
      series: categoriesToSeries({ pct: { name: "Pct", yAxis: "pct" } }),
      yAxes: undefined,
      minMaxTicksOnly: undefined,
      primary,
    });
    expect(axes.map((a) => a.id)).toEqual([PRIMARY_Y_AXIS_ID, "pct"]);
  });

  it("matches a numeric yAxes key to a numeric series id", () => {
    const axes = resolveYAxes({
      series: categoriesToSeries({ pct: { name: "Pct", yAxis: 1 } }),
      yAxes: { 1: { orientation: "right" } },
      minMaxTicksOnly: undefined,
      primary,
    });
    expect(axes).toHaveLength(2);
    expect(axes[1]).toMatchObject({ orientation: "right" });
    // vccs binds series to axes with `===`, so the id must match the series'
    // id by type as well as value — `"1"` would silently orphan the series.
    expect(axes[1]?.id).toBe(1);
    const [series] = categoriesToSeries({ pct: { name: "Pct", yAxis: 1 } });
    expect(axes.some((a) => a.id === series?.yAxisId)).toBe(true);
  });

  it("treats a stringified numeric id as the same axis as its numeric form", () => {
    const axes = resolveYAxes({
      series: categoriesToSeries({
        a: { name: "A", yAxis: 1 },
        b: { name: "B", yAxis: "1" },
      }),
      yAxes: { 1: { orientation: "right", label: "Shared" } },
      minMaxTicksOnly: undefined,
      primary,
    });
    expect(axes.map((a) => a.id)).toEqual([PRIMARY_Y_AXIS_ID, 1]);
    expect(axes[1]).toMatchObject({ orientation: "right", label: "Shared" });
  });

  it("binds a series declaring yAxis '0' to the primary axis", () => {
    const series = categoriesToSeries({ views: { name: "Views", yAxis: "0" } });
    expect(series[0]?.yAxisId).toBe(PRIMARY_Y_AXIS_ID);

    const axes = resolveYAxes({ series, yAxes: undefined, minMaxTicksOnly: undefined, primary });
    expect(axes.map((a) => a.id)).toEqual([PRIMARY_Y_AXIS_ID]);
  });

  it("inherits unset options from the primary axis", () => {
    const [, secondary] = resolveYAxes({
      series: categoriesToSeries({ pct: { name: "Pct", yAxis: "pct" } }),
      yAxes: { pct: { orientation: "right" } },
      minMaxTicksOnly: undefined,
      primary: { ...primary, tickCount: 5, tickLine: true },
    });
    expect(secondary).toMatchObject({ tickCount: 5, tickLine: true, orientation: "right" });
  });
});

describe("toAxisDomain", () => {
  it("returns undefined unless both bounds are defined", () => {
    expect(toAxisDomain(undefined)).toBeUndefined();
    expect(toAxisDomain([undefined, 10])).toBeUndefined();
    expect(toAxisDomain([0, undefined])).toBeUndefined();
    expect(toAxisDomain([0, 100])).toEqual([0, 100]);
  });
});

describe("toCssProperties", () => {
  it("drops raw strings, passes objects through", () => {
    expect(toCssProperties(undefined)).toBeUndefined();
    expect(toCssProperties("color: red")).toBeUndefined();
    expect(toCssProperties({ color: "red" })).toEqual({ color: "red" });
  });
});

describe("resolveAxisProps", () => {
  it("is inert when nothing is set", () => {
    expect(resolveAxisProps(undefined, undefined, undefined)).toEqual({
      ticks: undefined,
      interval: undefined,
      tick: undefined,
    });
  });

  it("maps explicit ticks and coerces Dates to timestamps", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    expect(resolveAxisProps([1, "two", date], undefined, undefined).ticks).toEqual([
      1,
      "two",
      date.getTime(),
    ]);
  });

  it("prefers AxisConfig.tickValues over the standalone ticks prop", () => {
    expect(resolveAxisProps([1, 2], { tickValues: [9, 10] }, undefined).ticks).toEqual([9, 10]);
  });

  it("maps minMaxTicksOnly (top-level or config) to preserveStartEnd", () => {
    expect(resolveAxisProps(undefined, undefined, true).interval).toBe("preserveStartEnd");
    expect(resolveAxisProps(undefined, { minMaxTicksOnly: true }, undefined).interval).toBe(
      "preserveStartEnd",
    );
  });

  it("builds tick SVG attributes from AxisConfig text props", () => {
    expect(
      resolveAxisProps(
        undefined,
        { tickTextColor: "#f00", tickTextFontSize: "12px", tickTextAlign: "right" },
        undefined,
      ).tick,
    ).toEqual({ fill: "#f00", fontSize: "12px", textAnchor: "end" });
  });
});

describe("normalizeMarkerConfig", () => {
  it("returns {} when unset", () => {
    expect(normalizeMarkerConfig(undefined)).toEqual({});
  });

  it("passes the flat record form through", () => {
    const flat = { desktop: { type: "circle" as const, size: 6 } };
    expect(normalizeMarkerConfig(flat)).toBe(flat);
  });

  it("unwraps the legacy { id, config } form", () => {
    const config = { desktop: { size: 4 } };
    expect(normalizeMarkerConfig({ id: "m", config })).toBe(config);
  });
});

describe("markerToDot", () => {
  it("returns false when there is no marker", () => {
    expect(markerToDot(undefined, "#000")).toBe(false);
  });

  it("derives radius from size and falls back to the series colour", () => {
    expect(markerToDot({ size: 6, strokeWidth: 2 }, "#3b82f6")).toEqual({
      r: 3,
      fill: "#3b82f6",
      stroke: "#3b82f6",
      strokeWidth: 2,
    });
  });

  it("prefers explicit marker colours", () => {
    expect(markerToDot({ color: "#f00", strokeColor: "#0f0" }, "#000")).toMatchObject({
      fill: "#f00",
      stroke: "#0f0",
    });
  });
});

describe("toStrokeDasharray", () => {
  it("is undefined when unset", () => {
    expect(toStrokeDasharray(undefined)).toBeUndefined();
  });

  it("passes a ready string through", () => {
    expect(toStrokeDasharray("6 4")).toBe("6 4");
  });

  it("joins the first pattern of the v2 number[][] form", () => {
    expect(toStrokeDasharray([[6, 4], [1, 1]])).toBe("6 4");
  });
});

describe("gradientId", () => {
  it("is deterministic and sanitised", () => {
    expect(gradientId("desktop")).toBe("nc-grad-desktop");
    expect(gradientId("a.b c")).toBe("nc-grad-a-b-c");
  });
});

describe("enums are stable string unions", () => {
  it("exposes expected members", () => {
    expect(Orientation.Horizontal).toBe("horizontal");
    expect(DonutType.Half).toBe("half");
  });
});
