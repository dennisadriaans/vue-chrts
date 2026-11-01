/**
 * `StatusTrackerChart` slots, layered on top of the shared chart theme.
 * Keep every class a complete literal string (Tailwind scans this file).
 */
export default {
  slots: {
    root: "text-highlighted",
    header: "flex items-baseline justify-between gap-4 mb-3",
    title: "m-0 text-sm font-semibold text-highlighted",
    summary: "m-0 text-sm text-muted tabular-nums",
    track: "flex w-full overflow-hidden",
    bar: "block h-full flex-none min-w-px transition-opacity duration-150 hover:opacity-80 data-[empty=true]:hover:opacity-100 data-[rounded=start]:rounded-s data-[rounded=end]:rounded-e data-[rounded=both]:rounded",
    labels: "flex justify-between gap-4 mt-2 text-(length:--vc-legend-size) text-muted",
    statusLegend:
      "m-0 mt-(--vc-legend-inset) p-0 list-none flex flex-wrap gap-x-4 gap-y-2 text-(length:--vc-legend-size) text-muted",
    statusLegendItem: "inline-flex items-center gap-1.5",
    statusLegendIndicator: "size-(--vc-legend-dot-size) shrink-0 rounded-full",
  },
};
