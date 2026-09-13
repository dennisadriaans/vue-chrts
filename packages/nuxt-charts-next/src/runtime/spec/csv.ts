/**
 * CSV serialization for aggregated chart data.
 *
 * Kept in the data layer rather than the component so a server route can emit
 * the same file the download button produces.
 */
import type { SpecDatum } from "./types";

/**
 * Escape one CSV field per RFC 4180.
 *
 * A leading `=`, `+`, `-` or `@` is prefixed with a quote as well: spreadsheet
 * software treats those as formulas, which turns an exported label into
 * executable content when the file is opened.
 */
function escapeField(value: unknown): string {
  if (value === null || value === undefined) return "";
  let text = String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/**
 * Render aggregated data as a CSV document.
 *
 * `headers` maps each series key to its display label, so the export carries
 * the same column names the legend shows rather than internal keys.
 */
export function toCsv(
  data: readonly SpecDatum[],
  series: readonly string[],
  headers: Record<string, string> = {},
  xHeader = "x",
): string {
  const columns = [xHeader, ...series.map((key) => headers[key] ?? key)];
  const rows = data.map((datum) =>
    [datum.x, ...series.map((key) => datum[key])].map(escapeField).join(","),
  );
  return [columns.map(escapeField).join(","), ...rows].join("\n");
}
