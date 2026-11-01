/**
 * Types for the `#nuxt-charts` alias inside this package (typecheck only).
 * Consumer apps get the same declaration from the module's type template.
 */
declare module "#nuxt-charts" {
  export const tv: (config: unknown) => (variants?: Record<string, unknown>) => Record<string, (props?: { class?: unknown }) => string>;
  export function useAppConfig(): Record<string, unknown>;
  export const nuxtUi: boolean;
  export const themeColors: string[];
}
