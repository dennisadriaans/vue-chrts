import { describe, expect, it } from "vitest";
import { CurveType, DonutType, LegendPosition, Orientation } from "../src/runtime/enums";
import { curveTypeToVccs } from "../src/runtime/utils/curve";
import { legendPositionToLegendProps, resolveLegendWrapperStyle } from "../src/runtime/utils/legend";
import { categoriesToSeries } from "../src/runtime/utils/categories";
import {
  AXIS_SLOT,
  AXIS_TICK_MARGIN,
  resolveAxisProps,
  resolveXAxisHeight,
  resolveYAxisWidth,
  toTickProp,
} from "../src/runtime/utils/axis";
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

describe("resolveLegendWrapperStyle", () => {
  it("adds top padding for bottom legends so vccs reserves space below the plot", () => {
    expect(resolveLegendWrapperStyle(LegendPosition.BottomCenter)).toEqual({
      paddingTop: "var(--vc-legend-inset, 0.75rem)",
    });
  });

  it("adds bottom padding for top legends so vccs reserves space above the plot", () => {
    expect(resolveLegendWrapperStyle(LegendPosition.TopLeft)).toEqual({
      paddingBottom: "var(--vc-legend-inset, 0.75rem)",
    });
  });

  it("lets user legendStyle override the default inset padding", () => {
    expect(
      resolveLegendWrapperStyle(LegendPosition.BottomCenter, { paddingTop: "2rem" }),
    ).toEqual({ paddingTop: "2rem" });
  });
});

describe("categoriesToSeries", () => {
  it("preserves order and resolves name / colour", () => {
    const series = categoriesToSeries({
      desktop: { name: "Desktop", color: "#3b82f6" },
      mobile: { name: "Mobile", color: ["#22c55e", "#000"] },
    });
    expect(series).toEqual([
      { dataKey: "desktop", name: "Desktop", color: "#3b82f6", hidden: false },
      // array colour collapses to its first entry (v2 compatibility)
      { dataKey: "mobile", name: "Mobile", color: "#22c55e", hidden: false },
    ]);
  });

  it("falls back to the key when name is missing", () => {
    const [s] = categoriesToSeries({ views: { name: "" } });
    expect(s).toBeDefined();
    expect(s?.name).toBe("");
    expect(s?.dataKey).toBe("views");
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

describe("axis slot sizing", () => {
  it("uses a tighter band for numeric Y axes", () => {
    expect(resolveYAxisWidth({ hasTitle: false, isCategoryAxis: false })).toBe(
      AXIS_SLOT.numericYWidth,
    );
  });

  it("reserves more width for category Y axes", () => {
    expect(resolveYAxisWidth({ hasTitle: false, isCategoryAxis: true })).toBe(
      AXIS_SLOT.categoryYWidth,
    );
  });

  it("expands axis slots when a title is present", () => {
    expect(resolveXAxisHeight({ hasTitle: true })).toBe(AXIS_SLOT.titledXHeight);
    expect(resolveYAxisWidth({ hasTitle: true, isCategoryAxis: false })).toBe(
      AXIS_SLOT.titledYWidth,
    );
  });

});

describe("toTickProp", () => {
  it("defaults to true so vccs applies its native per-orientation anchors", () => {
    expect(toTickProp(undefined)).toBe(true);
    expect(toTickProp({ fill: "#f00", fontSize: "11px" })).toBe(true);
  });

  it("forwards only the text anchor when an alignment is configured", () => {
    expect(toTickProp({ fill: "#f00", textAnchor: "end" })).toEqual({ textAnchor: "end" });
  });
});

describe("axis tick margin", () => {
  it("gives labels breathing room beyond the cramped vccs default", () => {
    expect(AXIS_TICK_MARGIN.x).toBeGreaterThan(2);
    expect(AXIS_TICK_MARGIN.y).toBeGreaterThan(2);
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
