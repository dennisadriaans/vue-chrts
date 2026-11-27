// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { Window } from "happy-dom";
import { AreaChart, BarChart, DonutChart, LineChart } from "../src/runtime/components";
import { categoriesToSeries, normalizeCategories } from "../src/runtime/utils/categories";

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
];

async function render(component: unknown, props: Record<string, unknown>) {
  const html = await renderToString(createSSRApp({ render: () => h(component as never, props) }));
  const { document } = new Window();
  document.body.innerHTML = html;
  return document;
}

const texts = (document: Awaited<ReturnType<typeof render>>, selector: string) =>
  [...document.querySelectorAll(selector)].map((el) => el.textContent);

describe("UChart-compatible props", () => {
  it("normalises the array form of `categories`", () => {
    expect(normalizeCategories(["desktop", { key: "mobile", label: "Mobile", color: "#f00" }])).toEqual({
      desktop: { name: "desktop" },
      mobile: { name: "Mobile", color: "#f00" },
    });
    const record = { desktop: { name: "Desktop" } };
    expect(normalizeCategories(record)).toBe(record);
    expect(categoriesToSeries([{ key: "mobile", label: "Mobile", color: "#f00" }])[0]).toMatchObject({
      dataKey: "mobile",
      name: "Mobile",
      color: "#f00",
    });
  });

  for (const [name, component] of Object.entries({ AreaChart, LineChart, BarChart })) {
    it(`${name} takes \`index\` and array \`categories\` in place of \`xAxis\` and a record`, async () => {
      const document = await render(component, {
        data,
        index: "month",
        categories: [{ key: "desktop", label: "Desktop" }, "mobile"],
        height: 300,
      });
      expect(texts(document, "foreignObject .vc-legend__label")).toEqual(["Desktop", "mobile"]);
      expect(texts(document, ".v-charts-xAxis .v-charts-cartesian-axis-tick-value")).toEqual(["Jan", "Feb", "Mar"]);
      expect(document.querySelector(".vue-chrts")?.hasAttribute("index")).toBe(false);
    });
  }

  it("DonutChart reads the label from `index` and the value from the first category", async () => {
    const document = await render(DonutChart, {
      data: [
        { browser: "Chrome", visitors: 275 },
        { browser: "Safari", visitors: 200 },
      ],
      index: "browser",
      categories: ["visitors"],
      height: 240,
    });
    expect(document.querySelectorAll("path.v-charts-sector")).toHaveLength(2);
    expect(texts(document, "foreignObject .vc-legend__label")).toEqual(["Chrome", "Safari"]);
  });
});
