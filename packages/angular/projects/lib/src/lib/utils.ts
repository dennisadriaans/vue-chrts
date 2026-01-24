import { MarkerConfig } from './types';

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

  return indices;
}

export function getFirstPropertyValue(obj: any) {
  if (obj && Object.keys(obj).length > 0) {
    const firstKey = Object.keys(obj)[0];
    return obj[firstKey];
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
    case 'circle':
      return `<circle cx="${size / 2}" cy="${size / 2}" r="${
        (size - strokeWidth) / 2
      }" stroke-width="${strokeWidth}" stroke="${strokeColor}" fill="${color}" />`;
    case 'square':
      return `<rect x="${strokeWidth / 2}" y="${strokeWidth / 2}" width="${
        size - strokeWidth
      }" height="${
        size - strokeWidth
      }" stroke-width="${strokeWidth}" stroke="${strokeColor}" fill="${color}" />`;
    case 'triangle':
      return `<polygon points="${size / 2},${strokeWidth / 2} ${
        size - strokeWidth / 2
      },${size - strokeWidth / 2} ${strokeWidth / 2},${
        size - strokeWidth / 2
      }" stroke-width="${strokeWidth}" stroke="${strokeColor}" fill="${color}" />`;
    case 'diamond':
      return `<polygon points="${size / 2},${strokeWidth / 2} ${
        size - strokeWidth / 2
      },${size / 2} ${size / 2},${size - strokeWidth / 2} ${strokeWidth / 2},${
        size / 2
      }" stroke-width="${strokeWidth}" stroke="${strokeColor}" fill="${color}" />`;
    default:
      return '';
  }
};

export function createMarkers(markerConfig: MarkerConfig) {
  const makeMarker = (id: string, cfg: any) => {
    const type = cfg.type || 'circle';
    const size = cfg.size || 10;
    const strokeWidth = cfg.strokeWidth || 2;
    const color = cfg.color || '#000';
    const strokeColor = cfg.strokeColor || cfg.color || '#000';
    return `<marker id="${id}" viewBox="0 0 ${size} ${size}" refX="${size / 2}" refY="${
      size / 2
    }" markerWidth="${size / 2}" markerHeight="${size / 2}" orient="auto">
      ${markerShape(type, size, strokeWidth, color, strokeColor)}
    </marker>`;
  };

  return Object.entries(markerConfig.config)
    .map(([key, cfg]) => {
      const legacyId = `${markerConfig.id}-${key}`;
      return makeMarker(legacyId, cfg);
    })
    .join('\n');
}

export function logPremiumUpgradeMessage() {
  // Logic for premium upgrade message
}
