<script setup lang="ts">
import { computed, ref } from "vue";
import { browserData, browserCategories } from "../data";

const total = computed(() => browserData.reduce((s, v) => s + v, 0));

const periods = {
  "7 days": [52, 24, 14, 10],
  "30 days": [45, 29, 17, 9],
  "90 days": [38, 32, 19, 11],
} as const;
type Period = keyof typeof periods;

const selectedPeriod = ref<Period>("30 days");
const monochromeData = computed(() => [...periods[selectedPeriod.value]]);
const monochromeCategories = {
  direct: { name: "Direct", color: "#172554" },
  search: { name: "Search", color: "#1d4ed8" },
  social: { name: "Social", color: "#60a5fa" },
  referral: { name: "Referral", color: "#bfdbfe" },
};

const reliabilityScore = 842;
const reliabilityData = [450, 200, 170, 180];
const reliabilityCategories = {
  atRisk: { name: "At risk", color: "#e11d48" },
  fair: { name: "Fair", color: "#f59e0b" },
  good: { name: "Good", color: "#84cc16" },
  excellent: { name: "Excellent", color: "#059669" },
};
</script>

<template>
  <main class="donut-page">
    <NuxtLink to="/">← back</NuxtLink>
    <h1>Donut / Pie charts</h1>

    <section class="examples-grid">
      <article class="chart-card">
        <header class="card-header">
          <div>
            <p class="eyebrow">Traffic sources</p>
            <h2>Interactive Monochrome</h2>
          </div>
          <div class="period-switcher" aria-label="Select reporting period">
            <button
              v-for="(_, period) in periods"
              :key="period"
              type="button"
              :class="{ active: selectedPeriod === period }"
              :aria-pressed="selectedPeriod === period"
              @click="selectedPeriod = period"
            >
              {{ period }}
            </button>
          </div>
        </header>
        <DonutChart
          :data="monochromeData"
          :categories="monochromeCategories"
          :height="300"
          :arc-width="54"
          :pad-angle="4"
          :corner-radius="10"
          hide-legend
        >
          <div class="center-copy">
            <strong>{{ monochromeData[0] }}%</strong>
            <span>Direct</span>
          </div>
        </DonutChart>
        <div class="compact-legend">
          <span v-for="(category, key, index) in monochromeCategories" :key="key">
            <i :style="{ background: category.color }" />
            {{ category.name }} {{ monochromeData[index] }}%
          </span>
        </div>
      </article>

      <article class="chart-card reliability-card">
        <header>
          <p class="eyebrow">Operations</p>
          <h2>Delivery Reliability</h2>
        </header>
        <DonutChart
          :data="reliabilityData"
          :categories="reliabilityCategories"
          :height="260"
          :arc-width="30"
          :start-angle="-30"
          :end-angle="210"
          :pad-angle="4"
          :corner-radius="10"
          hide-legend
          hide-tooltip
        >
          <div class="score-copy">
            <span>Score</span>
            <strong>{{ reliabilityScore }}</strong>
            <small>of 1,000</small>
          </div>
        </DonutChart>
        <div class="reliability-summary">
          <strong>Reliability is excellent</strong>
          <span>Updated today</span>
        </div>
        <div class="threshold-labels" aria-hidden="true">
          <span>0</span><span>450</span><span>650</span><span>820</span><span>1,000</span>
        </div>
        <div class="threshold-bar" aria-label="Reliability thresholds">
          <i v-for="(category, key, index) in reliabilityCategories" :key="key" :style="{ background: category.color, flexGrow: reliabilityData[index] }" />
        </div>
      </article>
    </section>

    <h2>Pie Chart</h2>
    <DonutChart
      :data="browserData"
      :categories="browserCategories"
      :radius="120"
      :arc-width="120"
      :height="280"
    />

    <h2>Donut Chart</h2>
    <DonutChart
      :data="browserData"
      :categories="browserCategories"
      :radius="120"
      :arc-width="40"
      :height="280"
    />

    <h2>Donut Chart - with total</h2>
    <div style="position: relative; display: inline-block; width: 100%">
      <DonutChart
        :data="browserData"
        :categories="browserCategories"
        :radius="120"
        :arc-width="40"
        :height="280"
        :hide-legend="true"
      />
      <div
style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -60%);
        text-align: center;
        pointer-events: none;
      ">
        <div style="font-size: 1.75rem; font-weight: 700; line-height: 1">{{ total.toLocaleString() }}</div>
        <div style="font-size: 0.75rem; color: #6b7280">Visitors</div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.donut-page { font-family: Inter, ui-sans-serif, system-ui, sans-serif; max-width: 920px; margin: 2rem auto; padding: 0 1rem 4rem; color: #172033; }
.examples-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.25rem; margin: 1.5rem 0 3rem; }
.chart-card { min-width: 0; padding: 1.35rem; border: 1px solid #e5e7eb; border-radius: 1.25rem; background: #fff; box-shadow: 0 12px 35px rgb(15 23 42 / 7%); }
.card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.chart-card h2 { margin: .2rem 0 0; font-size: 1.15rem; }
.eyebrow { margin: 0; color: #64748b; font-size: .7rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
.period-switcher { display: flex; gap: .15rem; padding: .2rem; border-radius: .65rem; background: #f1f5f9; }
.period-switcher button { border: 0; border-radius: .48rem; padding: .35rem .48rem; color: #64748b; background: transparent; cursor: pointer; font: inherit; font-size: .7rem; }
.period-switcher button.active { color: #172554; background: #fff; box-shadow: 0 1px 3px rgb(15 23 42 / 12%); }
.center-copy, .score-copy { display: grid; justify-items: center; line-height: 1; }
.center-copy strong { font-size: 2rem; }
.center-copy span, .score-copy span, .score-copy small { margin-top: .4rem; color: #64748b; font-size: .72rem; font-weight: 600; }
.compact-legend { display: flex; flex-wrap: wrap; justify-content: center; gap: .55rem 1rem; color: #475569; font-size: .72rem; }
.compact-legend span { display: inline-flex; align-items: center; gap: .35rem; }
.compact-legend i { width: .5rem; height: .5rem; border-radius: 999px; }
.reliability-card { background: #fafafa; }
.score-copy strong { font-size: 2.5rem; letter-spacing: -.05em; }
.reliability-summary { display: grid; justify-items: center; gap: .25rem; margin-top: -2.5rem; font-size: .78rem; }
.reliability-summary span { color: #94a3b8; font-size: .68rem; }
.threshold-labels { display: flex; justify-content: space-between; margin-top: 1.5rem; color: #94a3b8; font-size: .62rem; }
.threshold-bar { display: flex; gap: .25rem; margin-top: .35rem; }
.threshold-bar i { flex-basis: 0; height: .45rem; border-radius: 999px; }
@media (max-width: 520px) { .card-header { display: grid; } .examples-grid { grid-template-columns: 1fr; } }
</style>
