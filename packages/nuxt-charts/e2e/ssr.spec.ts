import { test, expect } from "@playwright/test";

// Every component the module registers, one route each, so a failure names
// the chart type that broke.
const charts = [
  "area",
  "line",
  "bar",
  "donut",
  "bubble",
  "gantt",
  "dagre",
  "dual",
  "sankey",
  "topojson",
  "dotted-map",
] as const;

const chartPaths = charts.map((name) => `/coverage/${name}`);
const allPaths = ["/", "/traffic", "/dual-test", ...chartPaths];

test("server renders every page", async ({ request }) => {
  for (const path of allPaths) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    const html = await res.text();
    expect(html, path).toContain('id="__nuxt"');
    expect(html, path).toContain('data-ssr="true"');
    expect(html, path).not.toContain("__nuxt_error");
  }
});

for (const path of chartPaths) {
  test(`renders and hydrates ${path}`, async ({ page }) => {
    const problems: string[] = [];
    page.on("console", (msg) => {
      const text = msg.text();
      // Vue prop/type warnings are logged as warnings, not errors, but they
      // mean the chart is being driven with the wrong contract.
      if (msg.type() === "error" || text.includes("[Vue warn]")) {
        problems.push(`${msg.type()}: ${text}`);
      }
    });
    page.on("pageerror", (err) => problems.push(`pageerror: ${err.message}`));

    await page.goto(path);

    // Charts are client-mode components: an svg proves vue-chrts plus its
    // unovis/d3 dependency graph resolved, imported and mounted in the browser.
    const host = page.locator('[data-testid="chart-host"]');
    await expect(host.locator("svg").first()).toBeVisible({ timeout: 30_000 });

    // A mounted-but-empty chart still yields an svg, so require actual marks.
    const marks = await host
      .locator("svg path, svg circle, svg rect")
      .count();
    expect(marks, `${path} rendered no marks`).toBeGreaterThan(0);

    expect(problems, path).toEqual([]);
  });
}
