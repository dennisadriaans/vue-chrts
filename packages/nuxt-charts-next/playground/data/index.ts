/** Shared sample data for the playground pages. */

export interface MonthRow {
  month: string;
  desktop: number;
  mobile: number;
}

export const monthly: MonthRow[] = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

export interface DailyRow {
  date: string;
  desktop: number;
  mobile: number;
}

export const dailyVisitors: DailyRow[] = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
];

export const browserData = [275, 200, 187, 173, 90];

export const browserCategories: Record<string, { name: string; color: string }> = {
  chrome: { name: "Chrome", color: "#2662d9" },
  safari: { name: "Safari", color: "#e23670" },
  firefox: { name: "Firefox", color: "#e88c30" },
  edge: { name: "Edge", color: "#af57db" },
  other: { name: "Other", color: "#2eb88a" },
};

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

export interface RadarRow {
  metric: string;
  productA: number;
  productB: number;
}

export const radar: RadarRow[] = [
  { metric: "Speed", productA: 120, productB: 90 },
  { metric: "Reliability", productA: 98, productB: 130 },
  { metric: "Comfort", productA: 86, productB: 130 },
  { metric: "Safety", productA: 99, productB: 100 },
  { metric: "Efficiency", productA: 85, productB: 90 },
  { metric: "Price", productA: 65, productB: 85 },
];

export interface StatusRow {
  status: "operational" | "degraded" | "outage" | "maintenance";
  label: string;
  value: number;
}

const statusCycle: StatusRow["status"][] = [
  "operational",
  "operational",
  "operational",
  "degraded",
  "operational",
  "maintenance",
  "operational",
  "outage",
  "operational",
  "operational",
];

export const statusHistory: StatusRow[] = Array.from({ length: 90 }, (_, index) => {
  const status = statusCycle[(index + Math.floor(index / 17)) % statusCycle.length];

  return {
    status,
    label: `Day ${index + 1} - ${status}`,
    value: status === "operational" ? 100 : status === "degraded" ? 86 : status === "maintenance" ? 95 : 42,
  };
});

export const statusCategories: Record<string, { name: string; color: string }> = {
  operational: { name: "Operational", color: "#16a34a" },
  degraded: { name: "Degraded", color: "#f59e0b" },
  outage: { name: "Outage", color: "#dc2626" },
  maintenance: { name: "Maintenance", color: "#2563eb" },
};

export interface Candle {
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/** Seeded pseudo-random OHLC walk, so the playground candles are stable. */
export const candles: Candle[] = (() => {
  let price = 148;
  let seed = 19;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const start = new Date("2026-03-18T12:00:00Z");

  return Array.from({ length: 40 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    const open = price;
    const close = Math.max(20, open + (random() - 0.47) * 7);
    const high = Math.max(open, close) + random() * 3.8;
    const low = Math.min(open, close) - random() * 3.8;
    price = close;

    return {
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.round(450000 + random() * 1550000),
    };
  });
})();

export interface ClimateRow {
  time: string;
  indoor: number;
  outdoor: number;
  setpoint: number;
  humidity: number;
}

/** Three temperatures (°C) alongside a percentage — the multi-axis case. */
export const climate: ClimateRow[] = [
  { time: "00:00", indoor: 21.4, outdoor: 8.1, setpoint: 21, humidity: 58 },
  { time: "04:00", indoor: 20.8, outdoor: 6.4, setpoint: 21, humidity: 63 },
  { time: "08:00", indoor: 21.9, outdoor: 11.2, setpoint: 22, humidity: 55 },
  { time: "12:00", indoor: 23.6, outdoor: 17.8, setpoint: 22, humidity: 47 },
  { time: "16:00", indoor: 24.1, outdoor: 19.3, setpoint: 22, humidity: 44 },
  { time: "20:00", indoor: 22.7, outdoor: 13.5, setpoint: 21, humidity: 51 },
];
