// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { Window } from "happy-dom";
import { CHART_CASES } from "./fixtures/charts";
import { AreaChart } from "../src/runtime/components";

async function render(component: unknown, props: Record<string, unknown>) {
  const html = await renderToString(createSSRApp({ render: () => h(component as never, props) }));
  const { document } = new Window();
  document.body.innerHTML = html;
  return { html, document };
}

describe("server rendering", () => {
  for (const [name, { component, props, mark }] of Object.entries(CHART_CASES)) {
    it(`${name} ships its marks in the server HTML`, async () => {
      const { document } = await render(component, props);
      expect(document.querySelectorAll(mark).length).toBeGreaterThan(0);
    });
  }

  it("draws at 640px by default and at `initialWidth` when set", async () => {
    const { props } = CHART_CASES.AreaChart!;
    const byDefault = await render(AreaChart, props);
    expect(byDefault.document.querySelector("svg.vcharts-surface")?.getAttribute("width")).toBe("640");

    const sized = await render(AreaChart, { ...props, initialWidth: 320 });
    expect(sized.document.querySelector("svg.vcharts-surface")?.getAttribute("width")).toBe("320");
  });

  it("lays the plot out around its axes and legend in one response", async () => {
    const { document } = await render(AreaChart, CHART_CASES.AreaChart!.props);
    expect(document.querySelectorAll(".v-charts-yAxis .v-charts-cartesian-axis-tick").length).toBeGreaterThan(1);

    const labels = [...document.querySelectorAll("foreignObject .vc-legend__label")].map((el) => el.textContent);
    expect(labels).toEqual(["Desktop", "Mobile"]);

    // 640 wide, minus the y-axis and the margins: the series is not drawn edge to edge.
    const plotWidth = Number(document.querySelector("path.v-charts-area-area")?.getAttribute("width"));
    expect(plotWidth).toBeGreaterThan(0);
    expect(plotWidth).toBeLessThan(600);
  });

  it("leaves the legend out when it is hidden", async () => {
    const { document } = await render(AreaChart, { ...CHART_CASES.AreaChart!.props, hideLegend: true });
    expect(document.querySelector("foreignObject")).toBeNull();
  });

  it("draws the finished series rather than the first animation frame", async () => {
    const { props } = CHART_CASES.AreaChart!;
    const still = await render(AreaChart, props);
    const animated = await render(AreaChart, { ...props, duration: 800 });
    const curve = (doc: typeof still.document) => doc.querySelector("path.v-charts-area-curve")?.getAttribute("d");
    expect(curve(animated.document)).toBe(curve(still.document));
  });
});
