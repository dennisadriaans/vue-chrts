// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const runtime = join(__dirname, "../src/runtime");
const read = (path: string) => readFileSync(path, "utf8");

function vueFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return vueFiles(path);
    return entry.name.endsWith(".vue") ? [path] : [];
  });
}

/** Hooks for user CSS; they carry no styling of their own. */
const UNSTYLED_HOOKS = new Set(["vc-cube-bar", "vc-metric__delta-arrow", "vc-sankey", "vc-variant-bar"]);

describe("standalone styling", () => {
  it("ships a rule for every chrome class, so charts look finished without Tailwind or Nuxt UI", () => {
    const files = vueFiles(join(runtime, "components"));
    const sources = files.map(read);
    const css = [
      read(join(runtime, "assets/components.css")),
      read(join(runtime, "assets/theme.css")),
      ...sources.map((source) => source.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] ?? ""),
    ].join("\n");

    const used = new Set(sources.flatMap((source) => source.match(/(?<=class="|class="[^"]* )vc-[\w-]+/g) ?? []));
    expect(used.size).toBeGreaterThan(20);

    const missing = [...used].filter(
      (name) => !UNSTYLED_HOOKS.has(name) && !new RegExp(`\\.${name}(?![\\w-])`).test(css),
    );
    expect(missing).toEqual([]);
  });
});
