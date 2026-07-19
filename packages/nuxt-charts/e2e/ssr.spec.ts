import { test, expect } from "@playwright/test";

const pages = ["/", "/traffic", "/dual-test"];

test("server renders every playground page", async ({ request }) => {
  for (const path of pages) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    const html = await res.text();
    expect(html, path).toContain('id="__nuxt"');
    expect(html, path).toContain('data-ssr="true"');
    expect(html, path).not.toContain("__nuxt_error");
  }
});

for (const path of pages) {
  test(`hydrates and renders charts on ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto(path);
    // Charts mount client-side; an svg appearing proves vue-chrts and its
    // unovis/d3 dependency graph loaded and hydrated in the browser.
    await expect(page.locator("#__nuxt svg").first()).toBeVisible({
      timeout: 30_000,
    });
    expect(errors, path).toEqual([]);
  });
}
