// @ts-nocheck
export function getOklchFromCssVariable(cssVariableName) {
  if (typeof window === "undefined") return null;

  const root = getComputedStyle(document.documentElement);
  const cssValue = root.getPropertyValue(cssVariableName).trim();

  if (!cssValue) return null;


  const match = cssValue.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!match) return null;

  const l = parseFloat(match[1]) * 100; // Scale L to 0-100 for oklch2web
  const c = parseFloat(match[2]);
  const h = parseFloat(match[3]);
  const a = parseFloat(match[4]);

  return { l, c, h, a };
}

export function getColorValue(colorStr, oklch2web) {
  const DEFAULT_COLOR = "#3b82f6";
  if (colorStr?.includes("#")) return colorStr;

  const oklchValues = getOklchFromCssVariable(colorStr);
  if (!oklchValues) return DEFAULT_COLOR;

  return oklch2web(oklchValues.l, oklchValues.c, oklchValues.h);
}

export function convertCategories(categories, oklch2web) {
  return Object.keys(categories).reduce(
    (accumulator, key) => {
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

// src/Color/lab_lch.ts
var normalizeHue = (hue) => (hue = hue % 360) < 0 ? hue + 360 : hue;
function lab2lch(lab) {
  const { l, a, b } = lab;
  const c = Math.sqrt(a * a + b * b);
  let h = 0;
  if (c) h = normalizeHue(Math.atan2(b, a) * 180 / Math.PI);
  return { l, c, h };
}
function lch2lab(lch) {
  const { l, c, h } = lch;
  const res = {
    l,
    a: c ? c * Math.cos(h / 180 * Math.PI) : 0,
    b: c ? c * Math.sin(h / 180 * Math.PI) : 0
  };
  return res;
}

// src/Color/lrgb_oklab.ts
function lrgb2oklab(lrgb) {
  const { r, g, b } = lrgb;
  const L = Math.cbrt(
    0.41222147079999993 * r + 0.5363325363 * g + 0.0514459929 * b
  );
  const M = Math.cbrt(
    0.2119034981999999 * r + 0.6806995450999999 * g + 0.1073969566 * b
  );
  const S = Math.cbrt(
    0.08830246189999998 * r + 0.2817188376 * g + 0.6299787005000002 * b
  );
  return {
    l: 0.2104542553 * L + 0.793617785 * M - 0.0040720468 * S,
    a: 1.9779984951 * L - 2.428592205 * M + 0.4505937099 * S,
    b: 0.0259040371 * L + 0.7827717662 * M - 0.808675766 * S
  };
}
function oklab2lrgb(oklab) {
  const { l, a, b } = oklab;
  const L = Math.pow(
    l * 0.9999999984505198 + 0.39633779217376786 * a + 0.2158037580607588 * b,
    3
  );
  const M = Math.pow(
    l * 1.0000000088817609 - 0.10556134232365635 * a - 0.06385417477170591 * b,
    3
  );
  const S = Math.pow(
    l * 1.0000000546724108 - 0.08948418209496575 * a - 1.2914855378640917 * b,
    3
  );
  const res = {
    r: 4.076741661347994 * L - 3.307711590408193 * M + 0.230969928729428 * S,
    g: -1.2684380040921763 * L + 2.6097574006633715 * M - 0.3413193963102197 * S,
    b: -0.004196086541837188 * L - 0.7034186144594493 * M + 1.7076147009309444 * S
  };
  return res;
}

// src/Color/rgb_lrgb.ts
function rgb2lrgb(rgb) {
  const fn = (c) => {
    const abs = Math.abs(c);
    if (abs <= 0.04045) {
      return c / 12.92;
    }
    return (Math.sign(c) || 1) * Math.pow((abs + 0.055) / 1.055, 2.4);
  };
  return { r: fn(rgb.r / 255), g: fn(rgb.g / 255), b: fn(rgb.b / 255) };
}
function lrgb2rgb(lrgb) {
  const fn = (c) => {
    const abs = Math.abs(c);
    if (abs > 31308e-7) {
      return (Math.sign(c) || 1) * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055);
    }
    return c * 12.92;
  };
  return { r: fn(lrgb.r) * 255, g: fn(lrgb.g) * 255, b: fn(lrgb.b) * 255 };
}

// src/Color/culori.ts
function convertRgbToOkLch(rgb) {
  return lab2lch(lrgb2oklab(rgb2lrgb(rgb)));
}
function convertOklchToRgb(oklch) {
  return lrgb2rgb(oklab2lrgb(lch2lab(oklch)));
}
function safeOklchToRgb(oklch) {
  let rgb = convertOklchToRgb(oklch);
  const unSafeC = (c) => {
    return [c.r, c.g, c.b].some((c2) => c2 < 0 || c2 > 255);
  };
  if (unSafeC(rgb) && !unSafeC(convertOklchToRgb({ ...oklch, c: 0 }))) {
    let start = 0;
    let end = oklch.c;
    let goodC = 0;
    const resolution = 0.4 / Math.pow(2, 13);
    while (end - start > resolution) {
      const mid = start + (end - start) * 0.5;
      const tmp = convertOklchToRgb({ ...oklch, c: mid });
      if (unSafeC(tmp)) {
        end = mid;
      } else {
        goodC = mid;
        start = mid;
      }
    }
    rgb = convertOklchToRgb({ ...oklch, c: goodC });
  }
  return rgb;
}

// src/Color/Color.ts
function hexToRgb(hex) {
  const hexes = /^#?([\da-f]+)$/i.exec(hex.toLowerCase());
  let hexString = "00aeec";
  if (hexes && hexes[1]) {
    const tar = hexes[1];
    if (tar.length >= 3 && tar.length < 6) {
      const tmp = tar.slice(0, 3);
      hexString = `${tmp[0]}${tmp[0]}${tmp[1]}${tmp[1]}${tmp[2]}${tmp[2]}`;
    }
    if (tar.length >= 6) {
      hexString = tar.slice(0, 6);
    }
  }
  const result = /([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hexString);
  return result ? {
    r: Number.parseInt(result[1], 16),
    g: Number.parseInt(result[2], 16),
    b: Number.parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}
function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
function normalizeRGB(rgb) {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    const tmp = Math.round(c);
    return Math.min(Math.max(tmp, 0), 255);
  });
  return {
    r,
    g,
    b
  };
}
function oklch2web(l, c, h, a) {
  const rgb = safeOklchToRgb({ l: l / 100, c, h });
  const { r, g, b } = normalizeRGB(rgb);
  if (a) {
    return `rgba(${r},${g},${b},${a})`;
  }
  return rgbToHex(r, g, b);
}
function extractHue(color) {
  let rgb;
  if (typeof color === "string") {
    rgb = hexToRgb(color);
  } else {
    rgb = color;
  }
  return convertRgbToOkLch(rgb).h;
}

export { extractHue, oklch2web };
