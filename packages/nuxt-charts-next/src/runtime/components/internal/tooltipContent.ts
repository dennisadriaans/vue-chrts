import { h } from "vue";
import type { TooltipContentProps } from "vccs";
import ChartTooltip from "./ChartTooltip.vue";
import type { TooltipRoundness, TooltipVariant } from "../../utils/variants";

/**
 * Build the `vccs` `<Tooltip>` `content` render function for a chart.
 *
 * The polar charts pass `ChartTooltip` to `content` directly, which leaves no
 * seam to hand it the chart's own styling props. Wrapping it in a render
 * function does — and keeps the wrapper in one place instead of repeating it
 * in every polar adapter.
 */
export function tooltipContentFor(
  variant: TooltipVariant | undefined,
  roundness: TooltipRoundness | undefined,
  titleFormatter?: (data: unknown) => string | number,
) {
  return (tooltipProps: TooltipContentProps) => {
    const row = tooltipProps.payload?.[0]?.payload;
    const label = titleFormatter && row != null ? titleFormatter(row) : tooltipProps.label;
    return h(ChartTooltip, { ...tooltipProps, label, variant, roundness });
  };
}
