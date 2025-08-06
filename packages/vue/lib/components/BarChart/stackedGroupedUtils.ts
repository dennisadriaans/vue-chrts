import { computed, ComputedRef } from "vue";
import { flattenData } from "../../utils";

export interface StackedGroupedConfig<T> {
  data: T[];
  categories: Record<string, { color?: string }>;
  stackAndGrouped: boolean;
  xAxis?: keyof T;
  spacing?: number;
}

export interface StackedGroupedResult<T> {
  states: string[];
  groupedByState: Record<string, string[]>;
  colors: Record<string, string[]>;
  bars: Record<string, ((d: any) => any)[]>;
  colorFunctions: Record<string, (d: unknown, i: number) => string>;
  positions: Record<string, number>;
  chartData: T[] | any[];
}

export function useStackedGrouped<T extends {}>(
  config: StackedGroupedConfig<T>
): ComputedRef<StackedGroupedResult<T>> {
  return computed(() => {
    const states = extractStates(config.categories);
    const groupedByState = groupCategoriesByState(config.categories, states);
    const colors = generateColors(groupedByState, config.categories);
    const bars = generateBars(groupedByState);
    const colorFunctions = generateColorFunctions(colors);
    const positions = calculatePositions(states, config.spacing);

    console.log(config, 'config')
    const chartData = config.stackAndGrouped
      ? flattenData(config.data, config.xAxis as string)
      : config.data;

    return {
      states,
      groupedByState,
      colors,
      bars,
      colorFunctions,
      positions,
      chartData,
    };
  });
}

function extractStates(
  categories: Record<string, { color?: string }>
): string[] {
  const states = new Set<string>();
  const categoryKeys = Object.keys(categories);

  categoryKeys.forEach((key) => {
    const match = key.match(/([A-Z][a-z]+)$/);
    if (match) {
      states.add(match[1]);
    }
  });

  return Array.from(states);
}

function groupCategoriesByState(
  categories: Record<string, { color?: string }>,
  states: string[]
): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};

  states.forEach((state) => {
    grouped[state] = Object.keys(categories).filter((key) =>
      key.endsWith(state)
    );
  });

  return grouped;
}

function generateColors(
  groupedByState: Record<string, string[]>,
  categories: Record<string, { color?: string }>
): Record<string, string[]> {
  const colorsByState: Record<string, string[]> = {};

  Object.entries(groupedByState).forEach(([state, keys]) => {
    colorsByState[state] = keys.map((key) => categories[key]?.color ?? "#ccc");
  });

  return colorsByState;
}

function generateBars(
  groupedByState: Record<string, string[]>
): Record<string, ((d: any) => any)[]> {
  const bars: Record<string, ((d: any) => any)[]> = {};

  Object.entries(groupedByState).forEach(([state, keys]) => {
    bars[state] = keys.map((key) => {
      const baseName = key.replace(state, "").toLowerCase();
      return (d: any) => d[baseName + state];
    });
  });

  return bars;
}

function generateColorFunctions(
  colors: Record<string, string[]>
): Record<string, (d: unknown, i: number) => string> {
  const colorFunctions: Record<string, (d: unknown, i: number) => string> = {};

  Object.entries(colors).forEach(([state, stateColors]) => {
    colorFunctions[state] = (_d: unknown, i: number) =>
      stateColors[i] ?? "#ccc";
  });

  return colorFunctions;
}

function calculatePositions(states: string[], spacing = 0.4): Record<string, number> {
  const numStates = states.length;
  const positions: Record<string, number> = {};

  states.forEach((state, index) => {
    const offset = (index - (numStates - 1) / 2) * spacing;
    positions[state] = offset;
  });

  return positions;
}
