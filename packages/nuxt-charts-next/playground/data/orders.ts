/**
 * Raw, un-aggregated sample rows for the `<DataChart>` playground.
 *
 * Deliberately shaped like application data rather than chart data: one row
 * per order, with a timestamp and an amount, several orders per day, and no
 * pre-computed buckets or totals. That is what the spec/transform layer exists
 * to handle — the other playground pages hand their charts data that has
 * already been aggregated by hand.
 */

export interface Order {
  id: string;
  createdAt: string;
  amount: number;
  plan: "free" | "pro" | "enterprise";
  region: "eu" | "us" | "apac";
  status: "paid" | "refunded";
}

/**
 * Deterministic pseudo-random source.
 *
 * A seeded generator rather than `Math.random()` so the playground renders the
 * same numbers on every reload — a chart whose shape changes on refresh makes
 * it impossible to tell a real transform bug from noise.
 */
function mulberry32(seed: number): () => number {
  return () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PLANS = ["free", "pro", "enterprise"] as const;
const REGIONS = ["eu", "us", "apac"] as const;

/** Typical order value per plan, in euros. */
const PLAN_VALUE = { free: 0, pro: 49, enterprise: 399 } as const;

/**
 * Two years of orders ending 2026-09-13, so a `previous-year` comparison has
 * a real baseline to plot against.
 */
function generate(): Order[] {
  const random = mulberry32(20260913);
  const orders: Order[] = [];
  const end = Date.UTC(2026, 8, 13);
  const days = 730;

  for (let dayOffset = days; dayOffset >= 0; dayOffset -= 1) {
    const dayStart = end - dayOffset * 86_400_000;
    const date = new Date(dayStart);

    // A mild upward trend plus a weekly dip, so the chart has a shape worth
    // comparing rather than flat noise.
    const trend = 1 + (days - dayOffset) / days;
    const weekend = date.getUTCDay() === 0 || date.getUTCDay() === 6 ? 0.45 : 1;
    const count = Math.round((2 + random() * 6) * trend * weekend);

    for (let i = 0; i < count; i += 1) {
      const plan = PLANS[Math.floor(random() * PLANS.length)]!;
      const base = PLAN_VALUE[plan];
      orders.push({
        id: `${date.toISOString().slice(0, 10)}-${i}`,
        // Spread orders through the day so day-bucketing is doing real work.
        createdAt: new Date(dayStart + Math.floor(random() * 86_400_000)).toISOString(),
        amount: base === 0 ? 0 : Math.round(base * (0.8 + random() * 0.6)),
        plan,
        region: REGIONS[Math.floor(random() * REGIONS.length)]!,
        status: random() > 0.96 ? "refunded" : "paid",
      });
    }
  }

  return orders;
}

export const orders: Order[] = generate();
