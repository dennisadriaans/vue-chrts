import { MarkerConfig } from "./types";

export function getDistributedIndices(length: number, numTicks: number) {
  // Handle edge cases
  if (numTicks <= 0) return [];

  // If numTicks >= length, return all indices
  if (numTicks >= length) {
    return Array.from({ length }, (_, i) => i);
  }

  // Special case: if numTicks is 1, return only the middle index
  if (numTicks === 1) {
    return [Math.floor((length - 1) / 2)];
  }

  // For 2 ticks, just return first and last
  if (numTicks === 2) {
    return [0, length - 1];
  }

  // For 3 or more ticks, we need to ensure perfectly even distribution
  const indices = [];

  // We'll manually calculate the indices to ensure perfect distribution
  for (let i = 0; i < numTicks; i++) {
    // This formula ensures perfect distribution of indices
    const index = Math.round((i * (length - 1)) / (numTicks - 1));
    indices.push(index);
  }

  // No need to filter duplicates as our formula ensures unique indices
  return indices;
}

export function getFirstPropertyValue(obj: unknown) {
  if (obj && Object.keys(obj).length > 0) {
    const firstKey = Object.keys(obj)[0];
    return obj[firstKey as keyof typeof obj];
  }
  return undefined;
}

export const markerShape = (
  type: string,
  size: number,
  strokeWidth: number,
  color: string,
  strokeColor: string
) => {
  switch (type) {
    case "circle":
      return `<circle cx="${size / 2}" cy="${size / 2}" r="${
        (size - strokeWidth) / 2
      }" stroke-width="${strokeWidth}" stroke="${strokeColor}" fill="${color}" />`;
    case "square":
      return `<rect x="${strokeWidth / 2}" y="${strokeWidth / 2}" width="${
        size - strokeWidth
      }" height="${
        size - strokeWidth
      }" stroke-width="${strokeWidth}" stroke="${strokeColor}" fill="${color}" />`;
    case "triangle":
      return `<polygon points="${size / 2},${strokeWidth / 2} ${
        size - strokeWidth / 2
      },${size - strokeWidth / 2} ${strokeWidth / 2},${
        size - strokeWidth / 2
      }" stroke-width="${strokeWidth}" stroke="${strokeColor}" fill="${color}" />`;
    case "diamond":
      return `<polygon points="${size / 2},${strokeWidth / 2} ${
        size - strokeWidth / 2
      },${size / 2} ${size / 2},${size - strokeWidth / 2} ${strokeWidth / 2},${
        size / 2
      }" stroke-width="${strokeWidth}" stroke="${strokeColor}" fill="${color}" />`;
    default:
      return "";
  }
};

export function createMarkers(markerConfig: Record<string, MarkerConfig>) {
  return Object.entries(markerConfig)
    .map(([key, cfg]) => {
      const type = cfg.type || "circle";
      const size = cfg.size || 10;
      const strokeWidth = cfg.strokeWidth || 2;
      const color = cfg.color || "#000";
      const strokeColor = cfg.strokeColor || cfg.color || "#000";
      return `<marker id="circle-marker-${key}" viewBox="0 0 ${size} ${size}" refX="${
        size / 2
      }" refY="${size / 2}" markerWidth="${size / 2}" markerHeight="${
        size / 2
      }">
        ${markerShape(type, size, strokeWidth, color, strokeColor)}
      </marker>`;
    })
    .join("\n");
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const flattenData = (data: any[], xAxis: string) => {
  const keys = Object.keys(data[0]).filter((key) => key !== xAxis);

  const states = Object.keys((data[0] as any)[keys[0]]);

  return data.map((entry: any) => {
    return {
      month: entry.month,
      ...keys
        .flatMap((key) =>
          states.map((state) => ({
            [`${key}${capitalize(state)}`]: entry[key][state],
          }))
        )
        .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
    };
  });
};

// A new key to store the user's preference to disable the message permanently.
const disableLoggingKey = 'nuxt-charts-disable-premium-message';
// The existing key to check if the message has been shown once.
const hasLoggedKey = 'nuxt-charts-premium-message-logged';

// Check if the user has explicitly disabled the message.
const isLoggingDisabled = localStorage.getItem(disableLoggingKey) === 'true';

// Check if the message has already been logged in this session/by user's action.
let hasLoggedMessage = localStorage.getItem(hasLoggedKey) === 'true';

export function logPremiumUpgradeMessage() {
  // 1. Check if the user has disabled logging OR if it has already been logged once.
  if (isLoggingDisabled || hasLoggedMessage) {
    return;
  }

  // If we reach here, log the message and update the 'hasLoggedMessage' flag.
  console.log(
    '%c✨ Thanks for using Nuxt Charts!\n\n' +
    'We are growing rapidly, to make sure we can continue building. Please consider upgrading to premium chart blocks or templates.\n\n' +
    '→ Checkout the Premium Blocks: https://nuxtcharts.com/blocks\n' +
    '→ Or buy me a coffee: https://buymeacoffee.com/dennisadriaans\n\n' +
    'Built with 💚 for the Nuxt community\n\n' + 
    '%cTo permanently disable this message, run the following in your console:\n' +
    `localStorage.setItem('${disableLoggingKey}', 'true');`,
    'color: inherit;',
    'color: #888; font-style: italic;'
  );

  // Set the flag so it doesn't log again on subsequent calls.
  hasLoggedMessage = true;
  // Note: You might also want to set the local storage item here if you want it
  // to persist across page loads/sessions even if the user hasn't explicitly disabled it.
  // localStorage.setItem(hasLoggedKey, 'true');
}