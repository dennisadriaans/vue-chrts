export function getOklchFromCssVariable(cssVariableName: string) {
  if (typeof window === "undefined") return null;

  const root = getComputedStyle(document.documentElement);
  const cssValue = root.getPropertyValue(cssVariableName).trim();

  if (!cssValue) return null;


  const match = cssValue.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!match) return null;

  const l = parseFloat(match[1]) * 100; // Scale L to 0-100 for oklch2web
  const c = parseFloat(match[2]);
  const h = parseFloat(match[3]);

  return { l, c, h };
}

export function getColorValue(colorStr: string, oklch2web: any) {
  const DEFAULT_COLOR = "#3b82f6";
  if (colorStr?.includes("#")) return colorStr;

  const oklchValues = getOklchFromCssVariable(colorStr);
  if (!oklchValues) return DEFAULT_COLOR;

  return oklch2web(oklchValues.l, oklchValues.c, oklchValues.h);
}

export function convertCategories(categories: any, oklch2web: any) {
  return Object.keys(categories).reduce(
    (accumulator: any, key: string) => {
      const category = categories[key];
      accumulator[key] = {
        ...category,
        color: getColorValue(category.color, oklch2web),
      };
      return accumulator;
    },
    {}
  )
}