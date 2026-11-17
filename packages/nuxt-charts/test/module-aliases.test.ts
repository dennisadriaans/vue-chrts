import { describe, expect, it, vi } from "vitest";

// Bun resolves `<pkg>/package.json` even when a package's exports map hides it.
vi.mock("node:module", () => ({
  createRequire: () => ({
    resolve: (id: string) => `/fake/node_modules/${id}`,
  }),
}));

vi.mock("@nuxt/kit", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@nuxt/kit")>();
  return {
    ...actual,
    addComponent: vi.fn(),
    addImports: vi.fn(),
    addImportsSources: vi.fn(),
  };
});

const module = (await import("../src/module")).default;

type AnyHook = (...args: unknown[]) => void | Promise<void>;

function createNuxtStub() {
  const hooks: Record<string, AnyHook[]> = {};
  return {
    _version: "4.4.8",
    version: "4.4.8",
    options: {
      alias: {} as Record<string, string>,
      build: { transpile: [] as string[] },
    },
    hook(name: string, fn: AnyHook) {
      (hooks[name] ??= []).push(fn);
    },
    async callHook(name: string, ...args: unknown[]) {
      for (const fn of hooks[name] ?? []) await fn(...args);
    },
  };
}

describe("aliases when every package.json resolves (#173)", () => {
  it("does not alias vue-chrts or @unovis/vue to a directory", async () => {
    const nuxt = createNuxtStub();
    await (module as unknown as (o: object, n: unknown) => Promise<void>)(
      { autoImports: false },
      nuxt,
    );
    await nuxt.callHook("modules:done");

    expect(nuxt.options.alias["@unovis/ts"]).toBe("/fake/node_modules/@unovis/ts");
    expect(nuxt.options.alias).not.toHaveProperty("vue-chrts");
    expect(nuxt.options.alias).not.toHaveProperty("@unovis/vue");

    const viteConfig: { optimizeDeps?: { include?: string[] } } = {};
    await nuxt.callHook("vite:extendConfig", viteConfig, { isClient: true });
    expect(viteConfig.optimizeDeps?.include).toEqual(["vue-chrts", "@unovis/ts"]);
  });
});
