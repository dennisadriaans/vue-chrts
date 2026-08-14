import {
  cloneVNode,
  computed,
  defineComponent,
  Fragment,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  type PropType,
  type VNode,
} from "vue";

type Size = number | string;

const isPercent = (value: unknown): value is string =>
  typeof value === "string" && value.endsWith("%");

const toCssSize = (value: Size | undefined) =>
  value == null ? undefined : typeof value === "number" ? `${value}px` : value;

function flatten(vnodes: VNode[]): VNode[] {
  const result: VNode[] = [];
  for (const vnode of vnodes) {
    if (vnode.type === Fragment && Array.isArray(vnode.children))
      result.push(...flatten(vnode.children as VNode[]));
    else result.push(vnode);
  }
  return result;
}

/**
 * Drop-in replacement for `vccs`' `ResponsiveContainer`.
 *
 * Upstream renders children through `resolveDynamicComponent(() => renderChildren())`,
 * which produces a new component type every render and so unmounts + remounts the
 * whole chart subtree. Charts that dispatch on `mouseenter` (radial bar, radar) then
 * loop forever — remount recreates the `<path>` under the cursor, which refires
 * `mouseenter` — and freeze the tab. Rendering the cloned children directly keeps
 * the subtree stable.
 */
export default defineComponent({
  name: "ChartContainer",
  inheritAttrs: false,
  props: {
    width: { type: [Number, String] as PropType<Size>, default: "100%" },
    height: { type: [Number, String] as PropType<Size>, default: "100%" },
    aspect: { type: Number, default: undefined },
    minWidth: { type: [Number, String] as PropType<Size>, default: 0 },
    minHeight: { type: [Number, String] as PropType<Size>, default: undefined },
    maxHeight: { type: [Number, String] as PropType<Size>, default: undefined },
    id: { type: String, default: undefined },
    onResize: { type: Function as PropType<(width: number, height: number) => void>, default: undefined },
  },
  setup(props, { slots }) {
    const containerRef = ref<HTMLElement>();
    const sizes = ref({ width: -1, height: -1 });

    const calculatedWidth = computed(() =>
      isPercent(props.width) ? sizes.value.width : Number(props.width),
    );

    const calculatedHeight = computed(() => {
      if (props.aspect && props.aspect > 0 && (props.height == null || props.height === "auto"))
        return calculatedWidth.value / props.aspect;
      return isPercent(props.height) ? sizes.value.height : Number(props.height);
    });

    const finalWidth = computed(() => {
      if (props.aspect && props.aspect > 0 && (props.width == null || props.width === "auto"))
        return calculatedHeight.value * props.aspect;
      return calculatedWidth.value;
    });

    const isReady = computed(() => sizes.value.width >= 0 && sizes.value.height >= 0);

    const containerStyle = computed(() => ({
      width: toCssSize(props.width),
      height: toCssSize(props.height),
      minWidth: toCssSize(props.minWidth),
      minHeight: toCssSize(props.minHeight),
      maxHeight: toCssSize(props.maxHeight),
    }));

    function setSize(width: number, height: number) {
      const next = { width: Math.round(width), height: Math.round(height) };
      if (next.width === sizes.value.width && next.height === sizes.value.height) return;
      sizes.value = next;
      props.onResize?.(next.width, next.height);
    }

    let observer: ResizeObserver | null = null;

    onMounted(() => {
      const el = containerRef.value;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setSize(rect.width, rect.height);
      observer = new ResizeObserver((entries) => {
        const { width, height } = entries[0]!.contentRect;
        setSize(width, height);
      });
      observer.observe(el);
    });

    onBeforeUnmount(() => {
      observer?.disconnect();
      observer = null;
    });

    function renderChildren() {
      if (!isReady.value) return [];
      const raw = slots.default?.();
      if (!raw) return [];
      return flatten(raw).map((child, index) =>
        cloneVNode(child, {
          width: finalWidth.value,
          height: calculatedHeight.value,
          key: child.key || `chart-container-child-${index}`,
          style: {
            maxWidth: `${sizes.value.width}px`,
            maxHeight: `${sizes.value.height}px`,
            width: "100%",
            height: "100%",
            ...(child.props?.style as object),
          },
        }),
      );
    }

    return () =>
      h(
        "div",
        {
          id: props.id,
          ref: containerRef,
          class: "vcharts-responsive-container",
          style: containerStyle.value,
        },
        renderChildren(),
      );
  },
});
