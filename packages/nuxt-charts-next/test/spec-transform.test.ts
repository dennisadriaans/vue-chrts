import { describe, expect, it } from "vitest";
import {
  aggregateValues,
  bucketKey,
  floorToInterval,
  nextBucket,
  previousBucket,
  toTimestamp,
  transform,
} from "../src/runtime/spec/transform";
import { formatBucket, seriesLabel, specCategories, titleCase, validateSpec } from "../src/runtime/spec/resolve";
import { toCsv } from "../src/runtime/spec/csv";
import { COMPARE_KEY, VALUE_KEY, type ChartSpec } from "../src/runtime/spec/types";

interface Order {
  createdAt: string;
  amount: number;
  plan?: string;
}

/** Two orders in Jan, one in Feb, one in Mar — all 2026. */
const orders: Order[] = [
  { createdAt: "2026-01-05T10:00:00Z", amount: 100, plan: "pro" },
  { createdAt: "2026-01-20T10:00:00Z", amount: 50, plan: "free" },
  { createdAt: "2026-02-14T10:00:00Z", amount: 200, plan: "pro" },
  { createdAt: "2026-03-02T10:00:00Z", amount: 25, plan: "free" },
];

describe("toTimestamp", () => {
  it("accepts Date, epoch ms and ISO strings", () => {
    const expected = Date.UTC(2026, 0, 5);
    expect(toTimestamp(new Date(expected))).toBe(expected);
    expect(toTimestamp(expected)).toBe(expected);
    expect(toTimestamp("2026-01-05T00:00:00Z")).toBe(expected);
  });

  it("rejects non-dates without producing NaN", () => {
    for (const value of [null, undefined, "", "not a date", Number.NaN, {}]) {
      expect(toTimestamp(value)).toBeUndefined();
    }
  });
});

describe("bucketing", () => {
  it("floors to the first of the month in UTC", () => {
    expect(bucketKey(Date.parse("2026-03-29T23:30:00Z"), "month")).toBe("2026-03-01");
  });

  it("floors to UTC midnight for days", () => {
    expect(bucketKey(Date.parse("2026-03-29T23:30:00Z"), "day")).toBe("2026-03-29");
  });

  it("starts weeks on Monday, with Sunday closing the prior week", () => {
    // 2026-03-29 is a Sunday; its ISO week began Monday 2026-03-23.
    expect(bucketKey(Date.parse("2026-03-29T12:00:00Z"), "week")).toBe("2026-03-23");
    expect(bucketKey(Date.parse("2026-03-23T00:00:00Z"), "week")).toBe("2026-03-23");
  });

  it("steps months calendar-wise rather than by a fixed 30 days", () => {
    const jan = floorToInterval(Date.parse("2026-01-17T00:00:00Z"), "month");
    expect(new Date(nextBucket(jan, "month")).toISOString().slice(0, 10)).toBe("2026-02-01");
    // February is short; a fixed-length step would overshoot into March.
    const feb = floorToInterval(Date.parse("2026-02-10T00:00:00Z"), "month");
    expect(new Date(nextBucket(feb, "month")).toISOString().slice(0, 10)).toBe("2026-03-01");
  });
});

describe("aggregateValues", () => {
  it("computes each aggregate", () => {
    const values = [1, 2, 3, 10];
    expect(aggregateValues(values, "sum")).toBe(16);
    expect(aggregateValues(values, "average")).toBe(4);
    expect(aggregateValues(values, "min")).toBe(1);
    expect(aggregateValues(values, "max")).toBe(10);
    expect(aggregateValues(values, "count")).toBe(4);
  });

  it("counts rows even when there are no values, and returns 0 otherwise", () => {
    expect(aggregateValues([], "count")).toBe(0);
    expect(aggregateValues([], "sum")).toBe(0);
    expect(aggregateValues([], "average")).toBe(0);
  });
});

describe("transform", () => {
  it("buckets and sums by month, chronologically", () => {
    const result = transform(orders, {
      type: "line",
      dimensions: { x: "createdAt", y: "amount" },
      transform: { interval: "month", aggregate: "sum" },
    });
    expect(result.data).toEqual([
      { x: "2026-01-01", [VALUE_KEY]: 150 },
      { x: "2026-02-01", [VALUE_KEY]: 200 },
      { x: "2026-03-01", [VALUE_KEY]: 25 },
    ]);
    expect(result.series).toEqual([VALUE_KEY]);
    expect(result.total).toBe(375);
  });

  it("counts rows without needing a y field", () => {
    const result = transform(orders, {
      type: "bar",
      dimensions: { x: "createdAt" },
      transform: { interval: "month", aggregate: "count" },
    });
    expect(result.data.map((d) => d[VALUE_KEY])).toEqual([2, 1, 1]);
  });

  it("counts rows whose y value is missing, but excludes them from a sum", () => {
    const rows = [
      { createdAt: "2026-01-05T00:00:00Z", amount: 10 },
      { createdAt: "2026-01-06T00:00:00Z", amount: null as unknown as number },
    ];
    const base = { x: "createdAt", y: "amount" };
    const counted = transform(rows, {
      type: "bar",
      dimensions: base,
      transform: { interval: "month", aggregate: "count" },
    });
    const summed = transform(rows, {
      type: "bar",
      dimensions: base,
      transform: { interval: "month", aggregate: "sum" },
    });
    expect(counted.data[0]![VALUE_KEY]).toBe(2);
    expect(summed.data[0]![VALUE_KEY]).toBe(10);
  });

  it("splits into one series per distinct value of the series field", () => {
    const result = transform(orders, {
      type: "bar",
      dimensions: { x: "createdAt", y: "amount", series: "plan" },
      transform: { interval: "month" },
    });
    expect(result.series.sort()).toEqual(["free", "pro"]);
    const january = result.data.find((d) => d.x === "2026-01-01")!;
    expect(january.pro).toBe(100);
    expect(january.free).toBe(50);
  });

  it("groups on exact equality when no interval is given", () => {
    const result = transform(orders, {
      type: "bar",
      dimensions: { x: "plan", y: "amount" },
      transform: { sort: "desc" },
    });
    expect(result.data).toEqual([
      { x: "pro", [VALUE_KEY]: 300 },
      { x: "free", [VALUE_KEY]: 75 },
    ]);
  });

  it("keeps only the top N buckets when limited", () => {
    const result = transform(orders, {
      type: "bar",
      dimensions: { x: "plan", y: "amount" },
      transform: { sort: "desc", limit: 1 },
    });
    expect(result.data.map((d) => d.x)).toEqual(["pro"]);
  });

  it("fills empty buckets with zero across the range", () => {
    const result = transform(
      [{ createdAt: "2026-01-05T00:00:00Z", amount: 10 }],
      {
        type: "line",
        dimensions: { x: "createdAt", y: "amount" },
        transform: { interval: "month" },
        range: { from: "2026-01-01", to: "2026-03-31" },
      },
    );
    expect(result.data.map((d) => d[VALUE_KEY])).toEqual([10, 0, 0]);
  });

  it("leaves gaps as holes when fillGaps is off", () => {
    const result = transform(
      [{ createdAt: "2026-01-05T00:00:00Z", amount: 10 }],
      {
        type: "line",
        dimensions: { x: "createdAt", y: "amount" },
        transform: { interval: "month", fillGaps: false },
        range: { from: "2026-01-01", to: "2026-03-31" },
      },
    );
    expect(result.data.map((d) => d[VALUE_KEY])).toEqual([10]);
  });

  it("restricts rows to the range before aggregating", () => {
    const result = transform(orders, {
      type: "line",
      dimensions: { x: "createdAt", y: "amount" },
      transform: { interval: "month" },
      range: { from: "2026-02-01", to: "2026-02-28" },
    });
    expect(result.total).toBe(200);
  });
});

describe("compare", () => {
  const spec: ChartSpec = {
    type: "line",
    dimensions: { x: "createdAt", y: "amount" },
    transform: { interval: "month" },
    range: { from: "2026-03-01", to: "2026-04-30" },
    compare: "previous-period",
  };

  const rows: Order[] = [
    // Previous period (Jan–Feb).
    { createdAt: "2026-01-10T00:00:00Z", amount: 100 },
    { createdAt: "2026-02-10T00:00:00Z", amount: 100 },
    // Current period (Mar–Apr).
    { createdAt: "2026-03-10T00:00:00Z", amount: 150 },
    { createdAt: "2026-04-10T00:00:00Z", amount: 75 },
  ];

  it("aligns the shifted window onto the current buckets", () => {
    const result = transform(rows, spec);
    expect(result.data).toEqual([
      { x: "2026-03-01", [VALUE_KEY]: 150, [COMPARE_KEY]: 100 },
      { x: "2026-04-01", [VALUE_KEY]: 75, [COMPARE_KEY]: 100 },
    ]);
    expect(result.total).toBe(225);
    expect(result.compareTotal).toBe(200);
    expect(result.change).toBeCloseTo(0.125);
  });

  it("pairs each bucket with the same bucket one year earlier", () => {
    const yearly: ChartSpec = {
      type: "line",
      dimensions: { x: "createdAt", y: "amount" },
      transform: { interval: "month" },
      range: { from: "2026-03-01", to: "2026-04-30" },
      compare: "previous-year",
    };
    const result = transform(
      [
        { createdAt: "2025-03-10T00:00:00Z", amount: 40 },
        { createdAt: "2025-04-10T00:00:00Z", amount: 60 },
        { createdAt: "2026-03-10T00:00:00Z", amount: 150 },
      ],
      yearly,
    );
    expect(result.data).toEqual([
      { x: "2026-03-01", [VALUE_KEY]: 150, [COMPARE_KEY]: 40 },
      { x: "2026-04-01", [VALUE_KEY]: 0, [COMPARE_KEY]: 60 },
    ]);
  });

  it("aligns bucket-wise when the window length is not a whole number of buckets", () => {
    // A Mar 1 - Apr 30 window is 61 days. Shifting by 61 days lands on Dec 30,
    // which floors to a December bucket and would offset every pair by one;
    // the baseline must still be Jan/Feb.
    const result = transform(
      [
        { createdAt: "2025-12-20T00:00:00Z", amount: 999 },
        { createdAt: "2026-01-10T00:00:00Z", amount: 10 },
        { createdAt: "2026-02-10T00:00:00Z", amount: 20 },
        { createdAt: "2026-03-10T00:00:00Z", amount: 30 },
      ],
      spec,
    );
    expect(result.data).toEqual([
      { x: "2026-03-01", [VALUE_KEY]: 30, [COMPARE_KEY]: 10 },
      { x: "2026-04-01", [VALUE_KEY]: 0, [COMPARE_KEY]: 20 },
    ]);
    // The December row sits outside the shifted window and must not leak in.
    expect(result.compareTotal).toBe(30);
  });

  it("steps buckets backwards calendar-wise", () => {
    const mar = Date.parse("2026-03-01");
    expect(new Date(previousBucket(mar, "month")).toISOString().slice(0, 10)).toBe("2026-02-01");
    expect(new Date(previousBucket(mar, "week")).toISOString().slice(0, 10)).toBe("2026-02-22");
    expect(new Date(previousBucket(mar, "day")).toISOString().slice(0, 10)).toBe("2026-02-28");
  });

  it("reports no change rather than Infinity when the baseline is zero", () => {
    const result = transform(
      [{ createdAt: "2026-03-10T00:00:00Z", amount: 150 }],
      spec,
    );
    expect(result.compareTotal).toBe(0);
    expect(result.change).toBeUndefined();
  });

  it("yields to an explicit series split", () => {
    const result = transform(orders, {
      ...spec,
      dimensions: { x: "createdAt", y: "amount", series: "plan" },
    });
    expect(result.series).not.toContain(COMPARE_KEY);
  });
});

describe("spec is serializable", () => {
  it("survives a JSON round trip and renders identically", () => {
    const spec: ChartSpec = {
      type: "line",
      dimensions: { x: "createdAt", y: "amount" },
      transform: { interval: "month", aggregate: "sum" },
      range: { from: "2026-01-01", to: "2026-03-31" },
      compare: "previous-period",
    };
    const revived = JSON.parse(JSON.stringify(spec)) as ChartSpec;
    expect(revived).toEqual(spec);
    expect(transform(orders, revived)).toEqual(transform(orders, spec));
  });
});

describe("validateSpec", () => {
  const base: ChartSpec = { type: "line", dimensions: { x: "createdAt", y: "amount" } };

  it("accepts a complete spec", () => {
    expect(validateSpec(base)).toBeUndefined();
  });

  it("requires an x dimension", () => {
    expect(validateSpec({ ...base, dimensions: { x: "" } })).toMatch(/dimensions\.x/);
  });

  it("requires y for every aggregate except count", () => {
    const withoutY: ChartSpec = { type: "line", dimensions: { x: "createdAt" } };
    expect(validateSpec(withoutY)).toMatch(/dimensions\.y/);
    expect(
      validateSpec({ ...withoutY, transform: { aggregate: "count" } }),
    ).toBeUndefined();
  });

  it("requires a range and an interval to compare", () => {
    expect(validateSpec({ ...base, compare: "previous-period" })).toMatch(/range/);
    expect(
      validateSpec({ ...base, compare: "previous-period", range: { from: "2026-01-01", to: "2026-03-31" } }),
    ).toMatch(/interval/);
  });
});

describe("labels", () => {
  it("titlecases field names", () => {
    expect(titleCase("createdAt")).toBe("Created At");
    expect(titleCase("total_revenue")).toBe("Total revenue");
  });

  it("names the synthetic series and passes split values through", () => {
    const spec: ChartSpec = {
      type: "line",
      dimensions: { x: "createdAt", y: "amount" },
      compare: "previous-year",
    };
    expect(seriesLabel(VALUE_KEY, spec)).toBe("Amount");
    expect(seriesLabel(COMPARE_KEY, spec)).toBe("Previous year");
    expect(seriesLabel("pro", spec)).toBe("pro");
    expect(seriesLabel(VALUE_KEY, { ...spec, label: "Revenue" })).toBe("Revenue");
  });

  it("builds categories without pinning colours, so series tokens apply", () => {
    const spec: ChartSpec = { type: "line", dimensions: { x: "createdAt", y: "amount" } };
    const categories = specCategories([VALUE_KEY, COMPARE_KEY], spec);
    expect(Object.keys(categories)).toEqual([VALUE_KEY, COMPARE_KEY]);
    expect(categories[VALUE_KEY]!.color).toBeUndefined();
  });

  it("formats bucket labels in UTC so they do not drift by timezone", () => {
    expect(formatBucket("2026-03-01", "month", "en-US")).toBe("Mar 26");
    expect(formatBucket("2026-03-09", "day", "en-US")).toBe("Mar 9");
    expect(formatBucket("pro", undefined)).toBe("pro");
  });
});

describe("toCsv", () => {
  it("writes a header row from the display labels", () => {
    const csv = toCsv(
      [{ x: "2026-01-01", value: 150 }],
      ["value"],
      { value: "Revenue" },
      "Month",
    );
    expect(csv).toBe("Month,Revenue\n2026-01-01,150");
  });

  it("quotes fields containing commas, quotes or newlines", () => {
    const csv = toCsv([{ x: 'a,b "c"', value: 1 }], ["value"]);
    expect(csv.split("\n")[1]).toBe('"a,b ""c""",1');
  });

  it("defuses leading characters spreadsheets would treat as a formula", () => {
    const csv = toCsv([{ x: "=SUM(A1)", value: 1 }], ["value"]);
    expect(csv.split("\n")[1]).toBe("'=SUM(A1),1");
  });

  it("leaves a missing value as an empty cell", () => {
    const csv = toCsv([{ x: "a", value: undefined }], ["value"]);
    expect(csv.split("\n")[1]).toBe("a,");
  });
});
