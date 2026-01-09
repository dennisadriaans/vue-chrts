<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { DottedMap, type DottedMapPin, type DottedMapRegion } from "../lib";

type ThemePreset = {
  id: string;
  label: string;
  backgroundColor: string;
  mapColor: string;
  pinColor: string;
};

type MapVariant = {
  id: string;
  label: string;
  mapHeight?: number;
  mapWidth?: number;
  dotSize?: number;
  grid?: "vertical" | "diagonal";
  shape?: "circle" | "hexagon";
  strokeWidth?: number;
  strokeOpacity?: number;
  countries?: string[];
  region?: DottedMapRegion;
  pins?: DottedMapPin[];
};

// European country ISO codes - same as DottedMapPage.vue
const EUROPE_COUNTRIES: string[] = [
  "FRA",
  "DEU",
  "BEL",
  "NLD",
  "LUX",
  "CHE",
  "AUT",
  "CZE",
  "POL",
  "SVK",
  "HUN",
  "SVN",
  "ITA",
  "ESP",
  "PRT",
  "GBR",
  "IRL",
  "DNK",
  "SWE",
  "FIN",
  "ISL",
  "EST",
  "LVA",
  "LTU",
  "HRV",
  "SRB",
  "BIH",
  "MNE",
  "MKD",
  "UKR",
  "BLR",
];

const ASIA_COUNTRIES: string[] = [
  "CHN",
  "IND",
  "JPN",
  "KOR",
  "IDN",
  "PAK",
  "BGD",
  "SAU",
  "IRN",
];

const USA_COUNTRIES: string[] = ["USA"];

const USA_REGION: DottedMapRegion = {
  lat: { min: 24, max: 50 },
  lng: { min: -125, max: -66 },
};

const BASE_PINS = {
  europe: [
    { lat: 48.8566, lng: 2.3522, svgOptions: { radius: 0.15 }, data: { city: "Paris" } },
    { lat: 52.52, lng: 13.405, svgOptions: { radius: 0.15 }, data: { city: "Berlin" } },
    { lat: 51.5074, lng: -0.1278, svgOptions: { radius: 0.15 }, data: { city: "London" } },
    { lat: 41.9028, lng: 12.4964, svgOptions: { radius: 0.15 }, data: { city: "Rome" } },
    { lat: 40.4168, lng: -3.7038, svgOptions: { radius: 0.15 }, data: { city: "Madrid" } },
    { lat: 52.3676, lng: 4.9041, svgOptions: { radius: 0.15 }, data: { city: "Amsterdam" } },
  ] satisfies DottedMapPin[],
  amsterdam: [
    {
      lat: 52.3676,
      lng: 4.9041,
      svgOptions: {
        radius: 0.32,
        strokeWidth: 1,
        strokeOpacity: 0.5,
      },
      data: { city: "Amsterdam" },
    },
  ] satisfies DottedMapPin[],
  usa: [
    { lat: 37.7749, lng: -122.4194, svgOptions: { radius: 0.3 }, data: { city: "San Francisco" } },
    { lat: 34.0522, lng: -118.2437, svgOptions: { radius: 0.3 }, data: { city: "Los Angeles" } },
    { lat: 47.6062, lng: -122.3321, svgOptions: { radius: 0.3 }, data: { city: "Seattle" } },
    { lat: 40.7128, lng: -74.006, svgOptions: { radius: 0.3 }, data: { city: "New York" } },
    { lat: 42.3601, lng: -71.0589, svgOptions: { radius: 0.3 }, data: { city: "Boston" } },
    { lat: 25.7617, lng: -80.1918, svgOptions: { radius: 0.3 }, data: { city: "Miami" } },
    { lat: 30.2672, lng: -97.7431, svgOptions: { radius: 0.3 }, data: { city: "Austin" } },
  ] satisfies DottedMapPin[],
  moscow: [{ lat: 55.7558, lng: 37.6173, svgOptions: { radius: 0.2 }, data: { city: "Moscow" } }] satisfies DottedMapPin[],
  world: [
    { lat: 40.7128, lng: -74.006, svgOptions: { radius: 0.22 }, data: { city: "New York" } },
    { lat: 51.5074, lng: -0.1278, svgOptions: { radius: 0.22 }, data: { city: "London" } },
    { lat: 35.6762, lng: 139.6503, svgOptions: { radius: 0.22 }, data: { city: "Tokyo" } },
    { lat: -33.8688, lng: 151.2093, svgOptions: { radius: 0.22 }, data: { city: "Sydney" } },
  ] satisfies DottedMapPin[],
  asia: [
    { lat: 35.6762, lng: 139.6503, svgOptions: { radius: 0.22 }, data: { city: "Tokyo" } },
    { lat: 1.3521, lng: 103.8198, svgOptions: { radius: 0.22 }, data: { city: "Singapore" } },
    { lat: 28.6139, lng: 77.209, svgOptions: { radius: 0.22 }, data: { city: "New Delhi" } },
  ] satisfies DottedMapPin[],
  france: [
    { lat: 48.8566, lng: 2.3522, svgOptions: { radius: 0.24 }, data: { city: "Paris" } },
    { lat: 43.2965, lng: 5.3698, svgOptions: { radius: 0.24 }, data: { city: "Marseille" } },
  ] satisfies DottedMapPin[],
  germany: [
    { lat: 52.52, lng: 13.405, svgOptions: { radius: 0.24 }, data: { city: "Berlin" } },
    { lat: 48.1351, lng: 11.582, svgOptions: { radius: 0.24 }, data: { city: "Munich" } },
  ] satisfies DottedMapPin[],
} as const;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function hexToRgb(hex: string) {
  const normalized = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number) {
  const to = (v: number) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function rgbToHsl(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
        break;
      case gn:
        h = ((bn - rn) / d + 2) * 60;
        break;
      default:
        h = ((rn - gn) / d + 4) * 60;
        break;
    }
  }

  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = ((h % 360) + 360) % 360 / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (hp >= 0 && hp < 1) [r1, g1, b1] = [c, x, 0];
  else if (hp >= 1 && hp < 2) [r1, g1, b1] = [x, c, 0];
  else if (hp >= 2 && hp < 3) [r1, g1, b1] = [0, c, x];
  else if (hp >= 3 && hp < 4) [r1, g1, b1] = [0, x, c];
  else if (hp >= 4 && hp < 5) [r1, g1, b1] = [x, 0, c];
  else if (hp >= 5 && hp < 6) [r1, g1, b1] = [c, 0, x];

  const m = l - c / 2;
  return {
    r: (r1 + m) * 255,
    g: (g1 + m) * 255,
    b: (b1 + m) * 255,
  };
}

function adjustLightness(hex: string, delta: number) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const nextL = clamp(hsl.l + delta, 0, 1);
  const out = hslToRgb(hsl.h, hsl.s, nextL);
  return rgbToHex(out.r, out.g, out.b);
}

const THEME_PRESETS: ThemePreset[] = [
  {
    id: "glass-light",
    label: "Glass Light",
    backgroundColor: "#f8fafc",
    mapColor: "#cbd5e1",
    pinColor: "#0f172a",
  },
  {
    id: "midnight",
    label: "Midnight",
    backgroundColor: "#0b1220",
    mapColor: "#94a3b8",
    pinColor: "#38bdf8",
  },
  {
    id: "graphite",
    label: "Graphite",
    backgroundColor: "#0f172a",
    mapColor: "#334155",
    pinColor: "#22c55e",
  },
  {
    id: "paper",
    label: "Paper",
    backgroundColor: "#ffffff",
    mapColor: "#e2e8f0",
    pinColor: "#0f172a",
  },
];

const MAP_VARIANTS: MapVariant[] = [
  // Matches the maps shown on DottedMapPage.vue
  {
    id: "amsterdam-minimal",
    label: "Minimalist (Amsterdam Pin)",
    mapHeight: 40,
    dotSize: 0.4,
    pins: [...BASE_PINS.amsterdam],
  },
  {
    id: "world-vertical",
    label: "World (Vertical Grid)",
    mapHeight: 60,
    dotSize: 0.5,
    grid: "vertical",
    pins: [...BASE_PINS.world],
  },
  {
    id: "europe-diagonal-hex",
    label: "Europe (Diagonal Hex)",
    mapHeight: 80,
    dotSize: 0.15,
    countries: EUROPE_COUNTRIES,
    grid: "diagonal",
    shape: "hexagon",
    pins: [...BASE_PINS.europe],
  },
  {
    id: "usa-region",
    label: "USA (Regional Focus)",
    mapWidth: 75,
    dotSize: 0.3,
    countries: USA_COUNTRIES,
    region: USA_REGION,
    pins: [...BASE_PINS.usa],
  },
  {
    id: "stylized-hex",
    label: "Stylized (Hexagons)",
    mapHeight: 75,
    dotSize: 0.1,
    grid: "diagonal",
    shape: "hexagon",
    pins: [...BASE_PINS.moscow],
  },
  {
    id: "asia-vertical",
    label: "Asia (Vertical Grid)",
    mapHeight: 60,
    dotSize: 0.5,
    countries: ASIA_COUNTRIES,
    grid: "vertical",
    pins: [...BASE_PINS.asia],
  },
  {
    id: "world-minimal",
    label: "World (Minimal Light)",
    mapHeight: 40,
    dotSize: 0.4,
    pins: [...BASE_PINS.world],
  },

  // Modern variants (extra, but still within the same “type of map” selector)
  {
    id: "world-diagonal-hex",
    label: "World (Diagonal Hex, Modern)",
    mapHeight: 70,
    dotSize: 0.18,
    grid: "diagonal",
    shape: "hexagon",
    pins: [...BASE_PINS.world],
  },
  {
    id: "europe-vertical-circle",
    label: "Europe (Vertical Circles, Modern)",
    mapHeight: 75,
    dotSize: 0.18,
    countries: EUROPE_COUNTRIES,
    grid: "vertical",
    shape: "circle",
    pins: [...BASE_PINS.europe],
  },
  {
    id: "usa-hex-diagonal",
    label: "USA (Hex Diagonal, Modern)",
    mapWidth: 80,
    dotSize: 0.2,
    countries: USA_COUNTRIES,
    region: USA_REGION,
    grid: "diagonal",
    shape: "hexagon",
    pins: [...BASE_PINS.usa],
  },
];

const selectedMapId = ref<MapVariant["id"]>(MAP_VARIANTS[0].id);
const selectedThemeId = ref<string>(THEME_PRESETS[1].id);

const backgroundColor = ref<string>(THEME_PRESETS[1].backgroundColor);
const mapColor = ref<string>(THEME_PRESETS[1].mapColor);
const pinColor = ref<string>(THEME_PRESETS[1].pinColor);

watch(
  selectedThemeId,
  (id) => {
    const preset = THEME_PRESETS.find((t) => t.id === id);
    if (!preset) return;
    backgroundColor.value = preset.backgroundColor;
    mapColor.value = preset.mapColor;
    pinColor.value = preset.pinColor;
  },
  { immediate: true }
);

function markCustomTheme() {
  if (selectedThemeId.value !== "custom") selectedThemeId.value = "custom";
}

const themeOptions = computed(() => {
  return [{ id: "custom", label: "Custom" }, ...THEME_PRESETS.map((t) => ({ id: t.id, label: t.label }))];
});

const selectedMap = computed(() => {
  return MAP_VARIANTS.find((m) => m.id === selectedMapId.value) ?? MAP_VARIANTS[0];
});

const themedPins = computed<DottedMapPin[] | undefined>(() => {
  const pins = selectedMap.value.pins;
  if (!pins || pins.length === 0) return pins;

  // Subtle, design-focused variation around the base pin color.
  // Keeps it clean (no rainbow), but avoids a flat “single-color” look.
  const deltas = [-0.08, -0.04, 0, 0.04, 0.08];
  const pinStrokeOpacity = 0.35;
  const pinStrokeWidth = 1;
  const strokeColor = adjustLightness(pinColor.value, -0.12);

  return pins.map((p, i) => ({
    ...p,
    svgOptions: {
      ...p.svgOptions,
      color: adjustLightness(pinColor.value, deltas[i % deltas.length]),
      strokeColor,
      strokeWidth: p.svgOptions?.strokeWidth ?? pinStrokeWidth,
      strokeOpacity: p.svgOptions?.strokeOpacity ?? pinStrokeOpacity,
    },
  }));
});

function randomOf<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomize() {
  selectedMapId.value = randomOf(MAP_VARIANTS).id;
  const preset = randomOf(THEME_PRESETS);
  selectedThemeId.value = preset.id;
}
</script>

<template>
  <div class="h-screen w-screen flex flex-col" :style="{ backgroundColor: backgroundColor }">
    <div class="shrink-0 border-b border-black/5 bg-white/70 backdrop-blur dark:bg-black/40">
      <div class="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="flex items-center justify-between gap-3">
          <div class="font-semibold text-slate-900 whitespace-nowrap">Fullscreen Maps</div>
          <button
            class="inline-flex items-center rounded-lg border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
            type="button"
            @click="randomize"
          >
            Randomize
          </button>
        </div>

        <div class="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-center">
          <label class="flex items-center gap-2">
            <span class="text-sm text-slate-600 w-24">Map</span>
            <select
              v-model="selectedMapId"
              class="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm"
            >
              <option v-for="m in MAP_VARIANTS" :key="m.id" :value="m.id">{{ m.label }}</option>
            </select>
          </label>

          <label class="flex items-center gap-2">
            <span class="text-sm text-slate-600 w-24">Theme</span>
            <select
              v-model="selectedThemeId"
              class="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm"
            >
              <option v-for="t in themeOptions" :key="t.id" :value="t.id">{{ t.label }}</option>
            </select>
          </label>

          <div class="flex items-center gap-3">
            <label class="flex items-center gap-2">
              <span class="text-sm text-slate-600">BG</span>
              <input v-model="backgroundColor" type="color" class="h-8 w-10" @input="markCustomTheme" />
            </label>
            <label class="flex items-center gap-2">
              <span class="text-sm text-slate-600">Map</span>
              <input v-model="mapColor" type="color" class="h-8 w-10" @input="markCustomTheme" />
            </label>
            <label class="flex items-center gap-2">
              <span class="text-sm text-slate-600">Pins</span>
              <input v-model="pinColor" type="color" class="h-8 w-10" @input="markCustomTheme" />
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full mt-24 max-h-[960px] max-w-screen-2xl mx-auto">
      <DottedMap
        height="100%"
        max-height="100%"
        :map-height="selectedMap.mapHeight"
        :map-width="selectedMap.mapWidth"
        :dot-size="selectedMap.dotSize"
        :grid="selectedMap.grid"
        :shape="selectedMap.shape"
        :countries="selectedMap.countries"
        :region="selectedMap.region"
        :pins="themedPins"
        :color="mapColor"
        :background-color="backgroundColor"
        @point-click="(event, point) => console.log('Point clicked:', event, point)"
      />
    </div>
  </div>
</template>
