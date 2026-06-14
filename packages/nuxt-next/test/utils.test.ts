import { describe, expect, it } from "vitest";
import { CurveType, DonutType, LegendPosition, Orientation } from "../src/runtime/enums";
import { curveTypeToVccs } from "../src/runtime/utils/curve";
import { legendPositionToLegendProps } from "../src/runtime/utils/legend";
import { categoriesToSeries } from "../src/runtime/utils/categories";
import { toAxisDomain, toCssProperties } from "../src/runtime/utils/style";

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

describe("enums are stable string unions", () => {
  it("exposes expected members", () => {
    expect(Orientation.Horizontal).toBe("horizontal");
    expect(DonutType.Half).toBe("half");
  });
});
