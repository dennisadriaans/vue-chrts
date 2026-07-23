import { nextTick, ref, useTemplateRef, watch, type Ref } from "vue";
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
 */
export function useHoverTooltip<T = any>() {
  const slotWrapperRef = useTemplateRef<HTMLDivElement>("slotWrapper");
  const tooltipRef = useTemplateRef<InstanceType<typeof VisTooltip>>("tooltip");
  const hoverValues: Ref<T | undefined> = ref();

  watch(hoverValues, async (d) => {
    if (!d) return;
    await nextTick();
    tooltipRef.value?.component?.render(slotWrapperRef.value?.innerHTML ?? "");
  });

  return { slotWrapperRef, tooltipRef, hoverValues };
}
