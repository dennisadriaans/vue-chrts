/**
 * `tv` stand-in used when `@nuxt/ui` is not installed.
 *
 * Without Nuxt UI there are no semantic utilities (`text-muted`, `bg-default`,
 * …) and Tailwind does not scan this package, so the theme's default classes
 * would generate nothing. They are dropped: chrome is styled by the shipped
 * `vc-*` stylesheet, and only the classes the caller passes through `ui` /
 * `class` are applied — which still lets a Tailwind host style a slot.
 */
type ClassInput = unknown;

export function cx(...values: ClassInput[]): string {
  const out: string[] = [];
  const walk = (value: ClassInput) => {
    if (!value) return;
    if (typeof value === "string") out.push(value);
    else if (Array.isArray(value)) value.forEach(walk);
    else if (typeof value === "object")
      for (const [key, on] of Object.entries(value as Record<string, unknown>)) if (on) out.push(key);
  };
  values.forEach(walk);
  return out.join(" ");
}

type SlotFn = (props?: { class?: ClassInput }) => string;

export function tv(_config: unknown) {
  return (_variants?: Record<string, unknown>) =>
    new Proxy({} as Record<string, SlotFn>, {
      get: () => (props?: { class?: ClassInput }) => cx(props?.class),
    });
}
