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
