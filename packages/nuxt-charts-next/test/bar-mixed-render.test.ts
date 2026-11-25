// @vitest-environment happy-dom
import { describe, expect, it, beforeAll, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import type { VueWrapper } from "@vue/test-utils";
import BarChart from "../src/runtime/components/BarChart.vue";
import { CurveType } from "../src/runtime/enums";

const mounted: Array<{ unmount: () => void }> = [];

afterEach(() => {
  while (mounted.length) mounted.pop()!.unmount();
  document.body.innerHTML = "";
});

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
  { month: "Jan", revenue: 12000, conversion: 2.1 },
  { month: "Feb", revenue: 18000, conversion: 3.4 },
  { month: "Mar", revenue: 15000, conversion: 2.8 },
];

async function mountBar(categories: Record<string, unknown>, extraProps: Record<string, unknown> = {}) {
  const wrapper = mount(BarChart as never, {
    props: {
      data,
      categories,
      yAxis: ["revenue", "conversion"],
      yAxes: { pct: { orientation: "right" } },
      xAxis: "month",
      height: 300,
      hideLegend: true,
      ...extraProps,
    },
    attachTo: document.body,
  } as never) as VueWrapper;
  await flushPromises();
  await new Promise((r) => setTimeout(r, 0));
  await flushPromises();
  mounted.push(wrapper);
  return wrapper;
}

describe("BarChart mixed bar + line series", () => {
  it("draws a `type: 'line'` category as a line over the bars", async () => {
    await mountBar({
      revenue: { name: "Revenue", color: "#2662d9" },
      conversion: { name: "Conversion", color: "#e23670", yAxis: "pct", type: "line" },
    });
    expect(document.querySelectorAll(".v-charts-bar-rectangle").length).toBe(data.length);
    expect(document.querySelectorAll(".v-charts-line-curve").length).toBe(1);
    expect(document.querySelectorAll(".v-charts-yAxis").length).toBe(2);
  });

  const lineCurve = () => document.querySelector(".v-charts-line-curve")!;
  const mixed = {
    revenue: { name: "Revenue", color: "#2662d9" },
    conversion: { name: "Conversion", color: "#e23670", yAxis: "pct", type: "line" },
  };

  it("keeps a solid 2px monotone line by default", async () => {
    await mountBar(mixed, { duration: 0 });
    expect(lineCurve().getAttribute("stroke-width")).toBe("2");
    expect(lineCurve().getAttribute("stroke-dasharray")).toBeNull();
    expect(lineCurve().getAttribute("d")).toContain("C");
  });

  it("applies `dashArray` to its own line only", async () => {
    await mountBar(
      {
        ...mixed,
        conversion_prev: { name: "Previous", color: "#e23670", yAxis: "pct", type: "line", dashArray: "4 4" },
      },
      {
        duration: 0,
        yAxis: ["revenue", "conversion", "conversion_prev"],
        data: data.map((row) => ({ ...row, conversion_prev: row.conversion - 0.5 })),
      },
    );
    const dashes = [...document.querySelectorAll(".v-charts-line-curve")].map((el) =>
      el.getAttribute("stroke-dasharray"),
    );
    expect(dashes).toEqual([null, "4 4"]);
  });

  it("applies `curveType` and `lineWidth` to line series", async () => {
    await mountBar(mixed, { duration: 0, curveType: CurveType.Linear, lineWidth: 4 });
    expect(lineCurve().getAttribute("stroke-width")).toBe("4");
    expect(lineCurve().getAttribute("d")).not.toContain("C");
  });

  it("draws every series as a bar by default", async () => {
    await mountBar({
      revenue: { name: "Revenue", color: "#2662d9" },
      conversion: { name: "Conversion", color: "#e23670", yAxis: "pct" },
    });
    expect(document.querySelectorAll(".v-charts-bar-rectangle").length).toBe(data.length * 2);
    expect(document.querySelectorAll(".v-charts-line-curve").length).toBe(0);
  });

  it("keeps a `type: 'line'` category as a bar on horizontal charts", async () => {
    await mountBar(
      {
        revenue: { name: "Revenue", color: "#2662d9" },
        conversion: { name: "Conversion", color: "#e23670", type: "line" },
      },
      { orientation: "horizontal", yAxes: undefined },
    );
    expect(document.querySelectorAll(".v-charts-bar-rectangle").length).toBe(data.length * 2);
    expect(document.querySelectorAll(".v-charts-line-curve").length).toBe(0);
  });
});
