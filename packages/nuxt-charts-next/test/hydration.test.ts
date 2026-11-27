// @vitest-environment happy-dom
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { createSSRApp, defineComponent, h, nextTick, useId, type App } from "vue";
import { renderToString } from "vue/server-renderer";
import { CHART_CASES } from "./fixtures/charts";

const WIDTH = 640;
const HEIGHT = 300;

beforeAll(() => {
  Element.prototype.getBoundingClientRect = function () {
    return { width: WIDTH, height: HEIGHT, top: 0, left: 0, right: WIDTH, bottom: HEIGHT, x: 0, y: 0, toJSON() {} } as DOMRect;
  };
  globalThis.ResizeObserver = class {
    constructor(private cb: ResizeObserverCallback) {}
    observe() {
      this.cb([{ contentRect: { width: WIDTH, height: HEIGHT } } as ResizeObserverEntry], this as unknown as ResizeObserver);
    }
    unobserve() {}
    disconnect() {}
  };
});

const apps: App[] = [];
afterEach(() => {
  while (apps.length) apps.pop()!.unmount();
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

/** Rendered after the chart: its id only matches if the chart used as many ids on both sides. */
const IdProbe = defineComponent({
  setup() {
    const id = useId();
    return () => h("span", { id, "data-probe": "" });
  },
});

const createApp = (component: unknown, props: Record<string, unknown>) =>
  createSSRApp({ render: () => h("div", [h(component as never, props), h(IdProbe)]) });

/** Render as the server would: no `window` while the component tree sets up. */
async function renderOnServer(component: unknown, props: Record<string, unknown>) {
  vi.stubGlobal("window", undefined);
  const context: { teleports?: Record<string, string> } = {};
  try {
    const html = await renderToString(createApp(component, props), context);
    return { html, teleports: context.teleports?.body ?? "" };
  } finally {
    vi.unstubAllGlobals();
  }
}

async function settle() {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
}

describe("hydration", () => {
  for (const [name, { component, props, mark }] of Object.entries(CHART_CASES)) {
    it(`${name} hydrates without a mismatch and keeps the server markup until measured`, async () => {
      const { html, teleports } = await renderOnServer(component, props);
      // Teleported markup goes where a server framework puts it: first in <body>.
      document.body.innerHTML = teleports;
      const host = document.createElement("div");
      host.innerHTML = html;
      document.body.appendChild(host);

      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      const serverId = host.querySelector("[data-probe]")!.id;
      const app = createApp(component, props);
      apps.push(app);
      app.mount(host);
      expect(host.querySelector("[data-probe]")!.id).toBe(serverId);

      expect(host.querySelectorAll(mark).length).toBeGreaterThan(0);
      await settle();
      expect(host.querySelector('[style="width:100%;height:100%"]')).toBeNull();
      const messages = [...warn.mock.calls, ...error.mock.calls].map((call) => String(call[0]));
      expect(messages.filter((message) => /hydration/i.test(message))).toEqual([]);
    });
  }
});
