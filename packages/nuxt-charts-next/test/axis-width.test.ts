import { describe, expect, it } from "vitest";
import { AXIS_SLOT, estimateTickLabelWidth, niceTickValues, resolveYAxisWidth } from "../src/runtime/utils/axis";

/** The stacked MRR series that overflowed the fixed 40px slot. */
const MRR_ROWS = [
  { pro: 24100, team: 31200, enterprise: 12400 },
  { pro: 26800, team: 33900, enterprise: 14100 },
  { pro: 28300, team: 36400, enterprise: 15800 },
  { pro: 31500, team: 38100, enterprise: 18200 },
  { pro: 34200, team: 41800, enterprise: 19600 },
  { pro: 37900, team: 45300, enterprise: 22400 },
];

describe("niceTickValues", () => {
  it("covers the domain with round steps", () => {
    expect(niceTickValues(0, 100)).toEqual([0, 20, 40, 60, 80, 100]);
  });

  it("returns a single tick for a degenerate domain", () => {
    expect(niceTickValues(5, 5)).toEqual([5]);
  });

  it("ignores a non-finite domain", () => {
    expect(niceTickValues(0, Number.NaN)).toEqual([]);
  });

  it("does not drift over many steps", () => {
    const ticks = niceTickValues(0, 1);
    expect(ticks[ticks.length - 1]).toBeCloseTo(1, 10);
  });
});

describe("resolveYAxisWidth", () => {
  it("keeps the default slot with no sample labels", () => {
    expect(resolveYAxisWidth({ hasTitle: false, isCategoryAxis: false })).toBe(
      AXIS_SLOT.numericYWidth,
    );
  });

  it("keeps the default slot for short labels", () => {
    expect(
      resolveYAxisWidth({
        hasTitle: false,
        isCategoryAxis: false,
        sampleLabels: ["0", "25", "50"],
        tickMargin: 8,
      }),
    ).toBe(AXIS_SLOT.numericYWidth);
  });

  it("widens the slot so a long stacked total is not clipped", () => {
    const max = Math.max(...MRR_ROWS.map((r) => r.pro + r.team + r.enterprise));
    const labels = niceTickValues(0, max).map((t) => t.toLocaleString("en-US"));

    const width = resolveYAxisWidth({
      hasTitle: false,
      isCategoryAxis: false,
      sampleLabels: labels,
      tickMargin: 8,
    });

    const widest = Math.max(...labels.map((l) => estimateTickLabelWidth(l)));
    expect(width).toBeGreaterThan(AXIS_SLOT.numericYWidth);
    expect(width).toBeGreaterThanOrEqual(widest + 8);
  });

  it("caps the slot so a very long label cannot eat the plot", () => {
    expect(
      resolveYAxisWidth({
        hasTitle: false,
        isCategoryAxis: false,
        sampleLabels: ["1,000,000,000,000,000"],
        tickMargin: 8,
      }),
    ).toBeLessThanOrEqual(96);
  });

  it("still prefers the titled and category slots", () => {
    expect(
      resolveYAxisWidth({ hasTitle: true, isCategoryAxis: false, sampleLabels: ["100,000"] }),
    ).toBe(AXIS_SLOT.titledYWidth);
    expect(
      resolveYAxisWidth({ hasTitle: false, isCategoryAxis: true, sampleLabels: ["100,000"] }),
    ).toBe(AXIS_SLOT.categoryYWidth);
  });
});
