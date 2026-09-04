export type FormatValue = number | bigint;

export function formatNumber(value: FormatValue, locale?: Intl.LocalesArgument, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCurrency(value: FormatValue, currency: string, locale?: Intl.LocalesArgument): string {
  return formatNumber(value, locale, { style: "currency", currency });
}

export function formatPercent(value: number, locale?: Intl.LocalesArgument): string {
  return formatNumber(value, locale, { style: "percent" });
}

export function formatDate(value: string | number | Date, locale?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(value));
}
