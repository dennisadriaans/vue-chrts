import { computed, ComputedRef } from "vue";

export interface StackedGroupedConfig<T> {
  data: T[];
  categories: Record<string, { color?: string | Array<string> }>;
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

export function useStackedGrouped<T extends {}>(config: StackedGroupedConfig<T>): ComputedRef<StackedGroupedResult<T>> {
  return computed(() => {
    if (!config.stackAndGrouped) {
      return {
        states: [],
        groupedByState: {},
        colors: {},
        bars: {},
        colorFunctions: {},
        positions: {},
        chartData: config.data,
      };
    }

    const states = extractStates(config.categories);
    const groupedByState = groupCategoriesByState(config.categories, states);
    const colors = generateColors(groupedByState, config.categories);
    const bars = generateBars(groupedByState);
    const colorFunctions = generateColorFunctions(colors);
    const positions = calculatePositions(states, config.spacing);

    const chartData = flattenData(config.data, config.xAxis as string);

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

function flattenData<T>(data: T[], xAxis: keyof T): any[] {
  const keys = Object.keys(data[0] as {}).filter((key) => key !== xAxis);
  const states = Object.keys((data[0] as any)[keys[0]]);

  return data.map((entry: any) => {
    const flattened: any = { [xAxis]: entry[xAxis] };
    keys.forEach((key) => {
      states.forEach((state) => {
        flattened[`${key}${state}`] = entry[key][state];
      });
    });
    return flattened;
  });
}

function extractStates(
  categories:  Record<string, { color?: string | Array<string> }>
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
  categories:  Record<string, { color?: string | Array<string> }>,
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
  categories:  Record<string, { color?: string | Array<string> }>
): Record<string, string[]> {
  const colorsByState: Record<string, string[]> = {};

  Object.entries(groupedByState).forEach(([state, keys]) => {
    colorsByState[state] = keys.map((key) => {
      const color = categories[key]?.color;
      if (Array.isArray(color)) {
        return color[0] ?? "#ccc";
      }
      return color ?? "#ccc";
    });
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
