// Headless render check: loads each chart page in real Chrome, waits for the
// client-only chart to hydrate, and reports how many <svg> / chart paths
// rendered. Used to verify the vccs adapters actually mount in the browser.
import { execFile } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.env.BASE_URL ?? "http://localhost:3007";
const pages = ["/area", "/bar", "/line", "/donut", "/bubble"];

function renderPage(path) {
  return new Promise((resolve) => {
    const profile = mkdtempSync(join(tmpdir(), "chrome-"));
    const url = `${base}${path}`;
    const out = join(profile, "out.html");
    execFile(
      "google-chrome",
      [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        `--user-data-dir=${profile}`,
        "--virtual-time-budget=8000",
        `--dump-dom`,
        url,
      ],
      { timeout: 30000, maxBuffer: 64 * 1024 * 1024 },
      (err, stdout) => {
        let html = stdout ?? "";
        try {
          html ||= readFileSync(out, "utf8");
        } catch {
          // dump-dom writes to stdout; ignore missing file fallback
        }
        rmSync(profile, { recursive: true, force: true });
        // Ignore the Nuxt DevTools overlay SVG: count only vcharts/recharts
        // chart surfaces and their data shapes.
        const isError = /Internal Server Error|500 -|does not provide an export/.test(html);
        const chartSurfaces = (html.match(/class="[^"]*(?:vcharts|recharts)[^"]*"/g) ?? []).length;
        const shapes = (html.match(/<(path|rect|circle|line)\b/g) ?? []).length;
        // A real chart paints many shapes; the DevTools overlay paints exactly one rect.
        const ok = !err && !isError && shapes > 3;
        resolve({ path, ok, chartSurfaces, shapes, isError, err: err?.message });
      },
    );
  });
}

const results = [];
for (const p of pages) results.push(await renderPage(p));

let allOk = true;
for (const r of results) {
  const status = r.ok ? "PASS" : "FAIL";
  if (!r.ok) allOk = false;
  console.log(
    `${status} ${r.path.padEnd(8)} chartSurfaces=${r.chartSurfaces} shapes=${r.shapes}` +
      `${r.isError ? " [500]" : ""}${r.err ? ` err=${r.err}` : ""}`,
  );
}
process.exit(allOk ? 0 : 1);
