import { computed, nextTick, ref, toRaw, useTemplateRef, watch, type Ref, type WritableComputedRef } from "vue";
import { VisTooltip } from "@unovis/vue";

/**
 * Shared hover-tooltip plumbing for the "hidden slot -> Unovis tooltip"
 * pattern used across chart components.
 *
 * Unovis's `triggers`/`template` callbacks must return the tooltip's HTML
 * synchronously (Unovis calls them directly from its own mousemove handler),
 * but the hidden `<Tooltip>`/slot only re-renders on Vue's next tick after
 * `hoverValues` changes — so a synchronous read of the hidden wrapper's
 * innerHTML is always one hover behind. Once Vue actually flushes the update,
 * this re-renders the tooltip imperatively with the now-current content.
 *
 * Requires the calling component's template to mark its hidden wrapper div
 * with `ref="slotWrapper"` and its `<VisTooltip>` with `ref="tooltip"`.
 *
 * @param dataSource Optional getter for the component's own reactive data
 * array. Unovis's tooltip content is purely mousemove-driven — trigger
 * callbacks only ever re-run on an actual mousemove event — so if the
 * underlying data changes reactively while the mouse sits still over a bar
 * or point, nothing re-evaluates what's shown. When provided, call
 * `setHoveredIndex(i)` (or `setHoveredRow(data, row)`, see below) from the
 * calling component's tooltip triggers with the row's index in that same
 * array. `hoverValues` is then a writable computed that re-derives from
 * `dataSource()[hoveredIndex]` on every read — falling back to whatever was
 * last set directly — so it (and so the tooltip) stays live as the array
 * changes, with no DOM lookups, no render-timing guesswork, and no extra
 * watcher: reading a computed already re-evaluates it against its current
 * dependencies, which is all "stay live" means here. Only meaningful for
 * components that bind rows directly from a flat array by index (e.g.
 * bar/point charts); skip it for components whose tooltip datum isn't a
 * plain index into `dataSource()` (e.g. Sankey nodes, Timeline row labels,
 * stacked+grouped's derived data).
 */
export function useHoverTooltip<T = any>(dataSource?: () => T[]) {
  const slotWrapperRef = useTemplateRef<HTMLDivElement>("slotWrapper");
  const tooltipRef = useTemplateRef<InstanceType<typeof VisTooltip>>("tooltip");

  const hoveredIndex: Ref<number | null> = ref(null);
  const rawHoverValue: Ref<T | undefined> = ref();

  const hoverValues: WritableComputedRef<T | undefined> = computed({
    get() {
      if (dataSource && hoveredIndex.value != null) {
        const row = dataSource()[hoveredIndex.value];
        if (row) return row;
      }
      return rawHoverValue.value;
    },
    set(value) {
      rawHoverValue.value = value;
    },
  });

  function setHoveredIndex(index: number) {
    hoveredIndex.value = index;
  }

  // Convenience for the common `props.data.indexOf(d)` case. Uses `toRaw()`
  // on both sides rather than a plain `indexOf`/`===`, because the datum
  // Unovis ends up binding to the DOM isn't always reference-identical to
  // the entry in `data` — e.g. when `data` comes from a parent's `computed`,
  // Vue can hand Unovis a reactive-proxied wrapper around the same
  // underlying row object instead of the row itself. `toRaw()` unwraps both
  // to the same underlying object regardless.
  function setHoveredRow(data: T[], row: T) {
    setHoveredIndex(data.findIndex((r) => toRaw(r) === toRaw(row)));
  }

  watch(hoverValues, async (d) => {
    if (!d) return;
    await nextTick();
    tooltipRef.value?.component?.render(slotWrapperRef.value?.innerHTML ?? "");
  });

  return { slotWrapperRef, tooltipRef, hoverValues, setHoveredIndex, setHoveredRow };
}
