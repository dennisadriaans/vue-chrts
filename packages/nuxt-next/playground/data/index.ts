/** Shared sample data for the playground pages. */

export interface MonthRow {
  month: string;
  desktop: number;
  mobile: number;
}

export const monthly: MonthRow[] = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 173, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 264, mobile: 140 },
];

export interface BubbleRow {
  x: number;
  y: number;
  size: number;
  group: string;
}

export const bubbles: BubbleRow[] = [
  { x: 10, y: 30, size: 200, group: "A" },
  { x: 30, y: 80, size: 120, group: "A" },
  { x: 45, y: 50, size: 260, group: "B" },
  { x: 60, y: 20, size: 90, group: "B" },
  { x: 75, y: 65, size: 180, group: "C" },
  { x: 90, y: 40, size: 140, group: "C" },
];
