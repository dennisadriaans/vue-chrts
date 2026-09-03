// @vitest-environment happy-dom
import { describe, expect, it, beforeAll, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import FunnelChart from "../src/runtime/components/FunnelChart.vue";

const mounted: Array<{ unmount: () => void }> = [];

afterEach(() => {
  while (mounted.length) mounted.pop()!.unmount();
  document.body.innerHTML = "";
});

beforeAll(() => {
  Element.prototype.getBoundingClientRect = function () {
    return {
      width: 600,
      height: 220,
      top: 0,
      left: 0,
      right: 600,
      bottom: 220,
      x: 0,
      y: 0,
      toJSON() {},
    } as DOMRect;
  };
  globalThis.ResizeObserver = class {
    private cb: ResizeObserverCallback;
    constructor(cb: ResizeObserverCallback) {
      this.cb = cb;
    }
    observe() {
      this.cb(
        [{ contentRect: { width: 600, height: 220 } } as ResizeObserverEntry],
        this as unknown as ResizeObserver,
      );
    }
    unobserve() {}
    disconnect() {}
  };
});

async function mountFunnel(props: Record<string, unknown> = {}) {
  const wrapper = mount(FunnelChart as never, {
    props: {
      data: [8200, 4100, 1900, 640],
      categories: {
        visits: { name: "Visits", color: "#2662d9" },
        signups: { name: "Signups", color: "#e23670" },
        trials: { name: "Trials", color: "#e88c30" },
        paid: { name: "Paid", color: "#10b981" },
      },
      variant: "layered",
      height: 220,
      hideLegend: true,
      ...props,
    },
    attachTo: document.body,
  } as never);
  await flushPromises();
  await new Promise((r) => setTimeout(r, 0));
  await flushPromises();
  mounted.push(wrapper);
  return wrapper;
}

async function mountClassicFunnel(props: Record<string, unknown> = {}) {
  return mountFunnel({ variant: "default", ...props });
}

const LABEL_SELECTOR =
  ".vc-funnel-layered-shape__value, .vc-funnel-layered-shape__badge-text, .vc-funnel-layered-shape__name";

describe("FunnelChart variant=layered labels", () => {
  it("renders value, badge, and stage-name labels", async () => {
    await mountFunnel();
    expect(document.querySelectorAll(".vc-funnel-layered-shape").length).toBe(4);
    expect(document.querySelectorAll(".vc-funnel-layered-shape__value").length).toBe(4);
    expect(document.querySelectorAll(".vc-funnel-layered-shape__badge-text").length).toBeGreaterThan(0);
    expect(document.querySelectorAll(".vc-funnel-layered-shape__name").length).toBe(4);
  });

  it("does not inherit vccs Funnel's default #fff stroke onto labels", async () => {
    await mountFunnel();
    const shapes = [...document.querySelectorAll(".vc-funnel-layered-shape")];
    expect(shapes.length).toBe(4);
    for (const shape of shapes) {
      expect(shape.getAttribute("stroke")).not.toBe("#fff");
    }
    const labels = [...document.querySelectorAll(LABEL_SELECTOR)];
    expect(labels.length).toBeGreaterThan(0);
    for (const label of labels) {
      expect(label.getAttribute("stroke")).toBe("none");
    }
  });

  it("applies funnel weight tokens as SVG font-weight", async () => {
    await mountFunnel();
    expect(
      document.querySelector(".vc-funnel-layered-shape__value")?.getAttribute("font-weight"),
    ).toBe("var(--vc-funnel-value-weight)");
    expect(
      document.querySelector(".vc-funnel-layered-shape__badge-text")?.getAttribute("font-weight"),
    ).toBe("var(--vc-funnel-badge-weight)");
    expect(
      document.querySelector(".vc-funnel-layered-shape__name")?.getAttribute("font-weight"),
    ).toBe("var(--vc-funnel-label-weight)");
  });
});

describe("FunnelChart variant=default presentation", () => {
  it("renders the polished custom shape for every stage", async () => {
    await mountClassicFunnel();
    expect(document.querySelectorAll(".vc-funnel-classic-shape").length).toBe(4);
    expect(document.querySelectorAll(".vc-funnel-classic-shape__body").length).toBe(4);
    expect(document.querySelectorAll(".vc-funnel-classic-shape__value").length).toBeGreaterThan(0);
  });

  it("keeps custom shapes when the last stage is rectangular", async () => {
    await mountClassicFunnel({ lastShapeType: "rectangle" });
    expect(document.querySelectorAll(".vc-funnel-classic-shape").length).toBe(4);
  });

  it("honours showValueLabel", async () => {
    await mountClassicFunnel({ showValueLabel: false });
    expect(document.querySelectorAll(".vc-funnel-classic-shape__value").length).toBe(0);
  });

  it("shows the hovered stage value and matching colour", async () => {
    const wrapper = await mountClassicFunnel();
    await wrapper.find(".vc-funnel-classic-shape").trigger("mouseenter", {
      clientX: 120,
      clientY: 80,
    });
    await flushPromises();

    const tooltip = wrapper.find(".vc-funnel-layered__tooltip");
    expect(tooltip.text()).toContain("Visits");
    expect(tooltip.text()).toContain("8,200");
    expect(tooltip.find(".vc-funnel-layered__dot").attributes("style")).toContain("#2662d9");
  });

  it("uses valueFormatter for shape labels and tooltips", async () => {
    const wrapper = await mountClassicFunnel({
      valueFormatter: (value: number) => `$${value}`,
    });
    expect(wrapper.find(".vc-funnel-classic-shape__value").text()).toBe("$8200");

    await wrapper.find(".vc-funnel-classic-shape").trigger("mouseenter", {
      clientX: 120,
      clientY: 80,
    });
    expect(wrapper.find(".vc-funnel-layered__tooltip").text()).toContain("$8200");
  });
});
