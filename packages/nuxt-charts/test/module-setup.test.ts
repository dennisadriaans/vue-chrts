import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";

const addImportsSources = vi.fn();

// Component/import registration needs a live Nuxt context; these tests only
// exercise config resolution, so stub the registration calls out.
vi.mock("@nuxt/kit", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@nuxt/kit")>();
  return {
    ...actual,
    addComponent: vi.fn(),
    addImports: vi.fn(),
    addImportsSources: (...args: unknown[]) => addImportsSources(...args),
  };
});

const module = (await import("../src/module")).default;
const { resolveImports } = await import("../src/core/imports");

const distDir = resolve(import.meta.dirname, "../dist");

type NuxtHook = (...args: never[]) => void | Promise<void>;
type AnyHook = (...args: unknown[]) => void | Promise<void>;

interface ViteConfigStub {
  optimizeDeps?: { include?: string[] };
}

/**
 * Minimal stand-in for the bits of the Nuxt instance `setup` touches.
 */
function createNuxtStub(transpile: string[] = []) {
  const hooks: Record<string, NuxtHook[]> = {};
  return {
    // The module declares `compatibility: { nuxt: ">=3" }`, so the stub has to
    // look like a supported Nuxt instance.
    _version: "4.4.8",
    version: "4.4.8",
    options: {
      alias: {} as Record<string, string>,
      build: { transpile },
    },
    hook(name: string, fn: NuxtHook) {
      (hooks[name] ??= []).push(fn);
    },
    async callHook(name: string, ...args: unknown[]) {
      for (const fn of hooks[name] ?? []) await (fn as AnyHook)(...args);
    },
  };
}

/**
 * `defineNuxtModule` returns a callable `(inlineOptions, nuxt)` that merges
 * defaults and runs setup, so invoke the module itself rather than a `.setup`
 * property (which the wrapper does not expose).
 */
async function runSetup(nuxt: ReturnType<typeof createNuxtStub>) {
  await (module as unknown as (o: object, n: unknown) => Promise<void>)(
    { autoImports: false },
    nuxt,
  );
}

describe("vue-chrts must not be transpiled (#129)", () => {
  it("strips a vue-chrts transpile entry added by another module or layer", async () => {
    const nuxt = createNuxtStub(["vue-chrts", "some-other-pkg"]);
    await runSetup(nuxt);
    await nuxt.callHook("modules:done");

    expect(nuxt.options.build.transpile).not.toContain("vue-chrts");
    expect(nuxt.options.build.transpile).toContain("some-other-pkg");
  });

  it("never lists vue-chrts in both transpile and optimizeDeps.include", async () => {
    const nuxt = createNuxtStub(["vue-chrts"]);
    await runSetup(nuxt);
    await nuxt.callHook("modules:done");

    const viteConfig: ViteConfigStub = {};
    await nuxt.callHook("vite:extendConfig", viteConfig, { isClient: true });

    // esbuild aborts with `The entry point "vue-chrts" cannot be marked as
    // external` when the same package appears in both lists.
    expect(viteConfig.optimizeDeps?.include).toContain("vue-chrts");
    expect(nuxt.options.build.transpile).not.toContain("vue-chrts");
  });

  it("leaves the server config untouched", async () => {
    const nuxt = createNuxtStub();
    await runSetup(nuxt);

    const viteConfig: ViteConfigStub = {};
    await nuxt.callHook("vite:extendConfig", viteConfig, { isClient: false });

    expect(viteConfig.optimizeDeps).toBeUndefined();
  });
});

describe("type auto-imports resolve at runtime (#146)", () => {
  it("imports types from a local shim, not the bare vue-chrts/types subpath", () => {
    addImportsSources.mockClear();
    resolveImports({ autoImports: true, sharedImports: true }, import.meta.url);

    const calls = addImportsSources.mock.calls.map(
      ([arg]) => arg as { from: string, type?: boolean, imports: string[] },
    );
    expect(calls.length).toBeGreaterThan(0);

    // `vue-chrts/types` is a types-only export condition, so Vite cannot
    // resolve it during SFC transforms:
    // `Failed to resolve import source "vue-chrts/types"`.
    expect(calls.map((c) => c.from)).not.toContain("vue-chrts/types");

    const typeCall = calls.find((c) => c.type === true);
    expect(typeCall).toBeDefined();
    expect(typeCall!.from).toMatch(/runtime[\\/]types$/);
    expect(typeCall!.imports).toContain("BulletLegendItemInterface");
    expect(typeCall!.imports).toContain("MapRegion");

    const shim = resolve(import.meta.dirname, "../src/runtime/types.ts");
    expect(existsSync(shim)).toBe(true);
  });

  it("vue-chrts/types has no runtime export condition", () => {
    // vue-chrts blocks "./package.json" in its own exports map, so read the
    // workspace manifest directly.
    const pkgPath = resolve(import.meta.dirname, "../../vue/package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    const typesExport = pkg.exports?.["./types"];

    expect(typesExport).toBeDefined();
    expect(typesExport.import).toBeUndefined();
    expect(typesExport.default).toBeUndefined();
    expect(typesExport.types).toBeDefined();
  });
});

describe("built module output", () => {
  it.runIf(existsSync(distDir))(
    "ships a resolvable runtime/types module",
    async () => {
      // The shim is type-only, so the emitted .js is empty — but it must exist
      // for Vite to resolve the auto-import.
      expect(existsSync(resolve(distDir, "runtime/types.js"))).toBe(true);
      expect(existsSync(resolve(distDir, "runtime/types.d.ts"))).toBe(true);
    },
  );
});
