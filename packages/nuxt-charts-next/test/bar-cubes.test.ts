import { describe, expect, it } from "vitest";
import {
  layoutCubeColumn,
  valueToCubeCount,
  DEFAULT_CUBE_GAP,
  DEFAULT_CUBE_SIZE,
} from "../src/runtime/utils/cubes";

describe("valueToCubeCount", () => {
  it("returns 0 for empty or zero inputs", () => {
    expect(valueToCubeCount(0, 100, 10)).toBe(0);
    expect(valueToCubeCount(50, 0, 10)).toBe(0);
    expect(valueToCubeCount(50, 100, 0)).toBe(0);
    expect(valueToCubeCount(-10, 100, 10)).toBe(0);
  });

  it("rounds proportionally and clamps to rows", () => {
    expect(valueToCubeCount(28, 100, 10)).toBe(3);
    expect(valueToCubeCount(100, 100, 10)).toBe(10);
    expect(valueToCubeCount(200, 100, 10)).toBe(10);
    expect(valueToCubeCount(5, 100, 10)).toBe(1);
  });
});

describe("layoutCubeColumn", () => {
  const column = { x: 40, y: 10, width: 48, height: 200 };

  it("returns empty when the band has no size", () => {
    expect(layoutCubeColumn({ column: { ...column, width: 0 }, valueHeight: 40 })).toEqual([]);
    expect(layoutCubeColumn({ column: { ...column, height: 0 }, valueHeight: 40 })).toEqual([]);
  });

  it("builds bottom-aligned squares clamped to preferred size", () => {
    const cubes = layoutCubeColumn({
      column,
      valueHeight: 40,
      gap: DEFAULT_CUBE_GAP,
      preferredSize: DEFAULT_CUBE_SIZE,
    });

    expect(cubes.length).toBeGreaterThan(1);
    expect(cubes.every((c) => c.size === DEFAULT_CUBE_SIZE)).toBe(true);

    const filled = cubes.filter((c) => c.filled);
    const empty = cubes.filter((c) => !c.filled);
    expect(filled.length).toBe(valueToCubeCount(40, 200, cubes.length));
    expect(empty.length).toBe(cubes.length - filled.length);

    const xs = new Set(cubes.map((c) => c.x));
    expect(xs.size).toBe(1);
    expect([...xs][0]).toBeCloseTo(40 + (48 - DEFAULT_CUBE_SIZE) / 2);

    const bottom = Math.max(...cubes.map((c) => c.y + c.size));
    expect(bottom).toBeCloseTo(column.y + column.height);
  });

  it("uses the full band width when narrower than preferred size", () => {
    const narrow = { x: 0, y: 0, width: 6, height: 100 };
    const cubes = layoutCubeColumn({
      column: narrow,
      valueHeight: 50,
      preferredSize: DEFAULT_CUBE_SIZE,
    });
    expect(cubes.every((c) => c.size === 6)).toBe(true);
    expect(cubes[0]!.x).toBe(0);
  });

  it("keeps vertical gaps uniform", () => {
    const cubes = layoutCubeColumn({
      column,
      valueHeight: 80,
      gap: 3,
      preferredSize: 8,
    });
    const sorted = [...cubes].sort((a, b) => a.y - b.y);
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1]!;
      const curr = sorted[i]!;
      expect(curr.y - (prev.y + prev.size)).toBe(3);
    }
  });

  it("maps stacked segments to contiguous cube ranges", () => {
    const rows = layoutCubeColumn({
      column,
      valueHeight: 100,
      preferredSize: DEFAULT_CUBE_SIZE,
    }).length;

    const bottom = layoutCubeColumn({
      column,
      valueHeight: 100,
      segmentY: 110,
      includeEmpty: true,
      preferredSize: DEFAULT_CUBE_SIZE,
    });
    const top = layoutCubeColumn({
      column,
      valueHeight: 50,
      segmentY: 60,
      includeEmpty: false,
      preferredSize: DEFAULT_CUBE_SIZE,
    });

    expect(bottom.length).toBe(rows);
    expect(top.every((c) => c.filled)).toBe(true);
    expect(top.length).toBeGreaterThan(0);

    const bottomFilled = bottom.filter((c) => c.filled);
    const topYs = new Set(top.map((c) => c.y));
    expect(bottomFilled.every((c) => !topYs.has(c.y))).toBe(true);
  });

  it("omits empty cubes when includeEmpty is false", () => {
    const cubes = layoutCubeColumn({
      column,
      valueHeight: 40,
      includeEmpty: false,
      preferredSize: DEFAULT_CUBE_SIZE,
    });
    expect(cubes.length).toBeGreaterThan(0);
    expect(cubes.every((c) => c.filled)).toBe(true);
  });
});
