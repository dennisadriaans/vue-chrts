// @vitest-environment happy-dom
import { describe, expect, it, beforeAll, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import AreaChart from "../src/runtime/components/AreaChart.vue";

const mounted: Array<{ unmount: () => void }> = [];

afterEach(() => {
  // Each test attaches to document.body and queries the global DOM, so tear
  // down mounts and clear the body to keep gradient counts test-isolated.
  while (mounted.length) mounted.pop()!.unmount();
  document.body.innerHTML = "";
});

/**
 * vccs' ResponsiveContainer only renders its children once it has measured a
 * non-zero size via ResizeObserver. happy-dom has no layout, so we stub both
 * ResizeObserver and getBoundingClientRect to hand the container a fixed size.
 */
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
  { month: "Jan", desktop: 100, mobile: 60 },
  { month: "Feb", desktop: 140, mobile: 90 },
  { month: "Mar", desktop: 120, mobile: 70 },
];
const categories = {
  desktop: { name: "Desktop", color: "#2662d9" },
  mobile: { name: "Mobile", color: "#e23670" },
};

async function mountChart(props: Record<string, unknown> = {}) {
  const wrapper = mount(AreaChart, {
    props: { data, categories, height: 300, ...props },
    attachTo: document.body,
  });
  await flushPromises();
  await new Promise((r) => setTimeout(r, 0));
  await flushPromises();
  mounted.push(wrapper);
  return wrapper;
}

describe("AreaChart gradient fill", () => {
  it("renders a per-series gradient by default", async () => {
    await mountChart();
    const grads = [...document.querySelectorAll("linearGradient")];
    expect(grads).toHaveLength(2);
    expect(grads.some((gradient) => gradient.id.endsWith("-desktop"))).toBe(true);
    expect(grads.some((gradient) => gradient.id.endsWith("-mobile"))).toBe(true);
    // The default fade runs from a visible top to a transparent bottom.
    const stops = [...(grads[0]?.querySelectorAll("stop") ?? [])];
    expect(stops.length).toBe(2);
    expect(stops[0]?.getAttribute("stop-opacity")).toBe("0.6");
    expect(stops[1]?.getAttribute("stop-opacity")).toBe("0");
  });

  it("honours custom gradientStops", async () => {
    await mountChart({
      gradientStops: [
        { offset: "0%", stopOpacity: 0.9 },
        { offset: "100%", stopOpacity: 0.1 },
      ],
    });
    const stops = [...document.querySelectorAll("linearGradient stop")];
    expect(stops.length).toBe(4); // two series × two stops
    expect(stops[0]?.getAttribute("stop-opacity")).toBe("0.9");
    expect(stops[1]?.getAttribute("stop-opacity")).toBe("0.1");
  });

  it("uses a flat fill when gradient is disabled", async () => {
    await mountChart({ gradient: false });
    expect(document.querySelectorAll("linearGradient").length).toBe(0);
  });

  it("emits no gradient when the area is hidden", async () => {
    await mountChart({ hideArea: true });
    expect(document.querySelectorAll("linearGradient").length).toBe(0);
  });

  it("keeps a stable gradient count across parent re-renders", async () => {
    const wrapper = await mountChart();
    const before = document.querySelectorAll("linearGradient").length;
    await wrapper.setProps({ height: 301 });
    await flushPromises();
    const after = document.querySelectorAll("linearGradient").length;
    expect(after).toBe(before);
    expect(after).toBe(2);
  });

  it("uses unique gradient ids across chart instances", async () => {
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h("div", [
            h(AreaChart, { data, categories, height: 300 }),
            h(AreaChart, { data, categories, height: 300 }),
          ]),
      }),
      { attachTo: document.body },
    );
    mounted.push(wrapper);
    await flushPromises();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await flushPromises();
    const ids = [...document.querySelectorAll("linearGradient")].map((gradient) => gradient.id);
    expect(ids).toHaveLength(4);
    expect(new Set(ids).size).toBe(4);
  });
});
