<script setup lang="ts">
/**
 * Gallery of every style variant, laid out so each family can be compared
 * side by side. One chart per variant, same data throughout — the only thing
 * that changes between cards in a row is the variant itself.
 */
import { monthly, type MonthRow } from "../data";
import {
  AREA_FILL_VARIANTS,
  DOT_VARIANTS,
  LEGEND_INDICATOR_VARIANTS,
  PATTERNED_BAR_VARIANTS,
  STROKE_VARIANTS,
} from "../../src/runtime/utils/variants";
import { BACKGROUND_VARIANTS } from "../../src/runtime/utils/background";

const single: Record<string, BulletLegendItemInterface> = {
  desktop: { name: "Desktop", color: "#2662d9" },
};
const pair: Record<string, BulletLegendItemInterface> = {
  desktop: { name: "Desktop", color: "#2662d9" },
  mobile: { name: "Mobile", color: "#e23670" },
};
const yAxisSingle: (keyof MonthRow)[] = ["desktop"];
const yAxisPair: (keyof MonthRow)[] = ["desktop", "mobile"];

const browsers: Record<string, BulletLegendItemInterface> = {
  chrome: { name: "Chrome", color: "#2662d9" },
  safari: { name: "Safari", color: "#e23670" },
  firefox: { name: "Firefox", color: "#2eb88a" },
  edge: { name: "Edge", color: "#e88c30" },
};
const browserShare = [275, 200, 187, 173];

/** Bar variants, including the two that were already shipped. */
const barVariants = ["solid", "cubes", ...PATTERNED_BAR_VARIANTS] as const;
</script>

<template>
  <main class="page">
    <NuxtLink to="/">← back</NuxtLink>
    <h1>Style variants</h1>
    <p class="lede">
      Every built-in treatment, one card per variant. The data is identical
      across each row — only the variant changes.
    </p>

    <section>
      <h2>Bar fills</h2>
      <div class="grid">
        <figure v-for="variant in barVariants" :key="variant">
          <figcaption>variant="{{ variant }}"</figcaption>
          <BarChart
            :data="monthly"
            :categories="single"
            :y-axis="yAxisSingle"
            x-axis="month"
            :height="200"
            :radius="4"
            :variant="variant"
            hide-legend
          />
        </figure>
      </div>
    </section>

    <section>
      <h2>Bar extras</h2>
      <div class="grid">
        <figure>
          <figcaption>glow</figcaption>
          <BarChart
            :data="monthly"
            :categories="single"
            :y-axis="yAxisSingle"
            x-axis="month"
            :height="200"
            :radius="4"
            glow
            hide-legend
          />
        </figure>
        <figure>
          <figcaption>bufferBar — last period is a projection</figcaption>
          <BarChart
            :data="monthly"
            :categories="single"
            :y-axis="yAxisSingle"
            x-axis="month"
            :height="200"
            :radius="4"
            buffer-bar
            hide-legend
          />
        </figure>
        <figure>
          <figcaption>hoverHighlight — hover a column</figcaption>
          <BarChart
            :data="monthly"
            :categories="single"
            :y-axis="yAxisSingle"
            x-axis="month"
            :height="200"
            :radius="4"
            hover-highlight
            hide-legend
          />
        </figure>
        <figure>
          <figcaption>maxHighlight — the peak stands out</figcaption>
          <BarChart
            :data="monthly"
            :categories="single"
            :y-axis="yAxisSingle"
            x-axis="month"
            :height="200"
            :radius="4"
            max-highlight
            hide-legend
          />
        </figure>
      </div>
    </section>

    <section>
      <h2>Stacking</h2>
      <div class="grid">
        <figure>
          <figcaption>stacked</figcaption>
          <BarChart
            :data="monthly"
            :categories="pair"
            :y-axis="yAxisPair"
            x-axis="month"
            :height="200"
            :radius="4"
            stacked
          />
        </figure>
        <figure>
          <figcaption>stacked + percent — the mix, not the totals</figcaption>
          <BarChart
            :data="monthly"
            :categories="pair"
            :y-axis="yAxisPair"
            x-axis="month"
            :height="200"
            :radius="4"
            stacked
            percent
          />
        </figure>
        <figure>
          <figcaption>area, stacked + percent</figcaption>
          <AreaChart
            :data="monthly"
            :categories="pair"
            x-axis="month"
            :height="200"
            stacked
            percent
          />
        </figure>
      </div>
    </section>

    <section>
      <h2>Loading</h2>
      <div class="grid">
        <figure>
          <figcaption>bar chart</figcaption>
          <BarChart
            :data="monthly"
            :categories="single"
            :y-axis="yAxisSingle"
            x-axis="month"
            :height="200"
            loading
          />
        </figure>
        <figure>
          <figcaption>line / area chart</figcaption>
          <AreaChart
            :data="monthly"
            :categories="single"
            x-axis="month"
            :height="200"
            loading
          />
        </figure>
        <figure>
          <figcaption>donut, loadingLabel=""</figcaption>
          <DonutChart
            :data="browserShare"
            :categories="browsers"
            :height="200"
            loading
            loading-label=""
          />
        </figure>
      </div>
    </section>

    <section>
      <h2>Area fills</h2>
      <div class="grid">
        <figure v-for="variant in AREA_FILL_VARIANTS" :key="variant">
          <figcaption>variant="{{ variant }}"</figcaption>
          <AreaChart
            :data="monthly"
            :categories="single"
            x-axis="month"
            :height="200"
            :variant="variant"
            hide-legend
          />
        </figure>
        <figure>
          <figcaption>custom gradientStops</figcaption>
          <AreaChart
            :data="monthly"
            :categories="single"
            x-axis="month"
            :height="200"
            :gradient-stops="[
              { offset: '0%', stopOpacity: 0.9 },
              { offset: '45%', stopOpacity: 0.35 },
              { offset: '100%', stopOpacity: 0 },
            ]"
            hide-legend
          />
        </figure>
      </div>
    </section>

    <section>
      <h2>Strokes</h2>
      <div class="grid">
        <figure>
          <figcaption>strokeGradient — gradient follows the line</figcaption>
          <LineChart
            :data="monthly"
            :categories="single"
            x-axis="month"
            :height="200"
            :line-width="4"
            :stroke-gradient="[
              { offset: '0%', color: '#2563eb' },
              { offset: '50%', color: '#a855f7' },
              { offset: '100%', color: '#f43f5e' },
            ]"
            hide-legend
          />
        </figure>
        <figure v-for="variant in STROKE_VARIANTS" :key="variant">
          <figcaption>strokeVariant="{{ variant }}"</figcaption>
          <LineChart
            :data="monthly"
            :categories="pair"
            x-axis="month"
            :height="200"
            :stroke-variant="variant"
            hide-legend
          />
        </figure>
        <figure>
          <figcaption>glow</figcaption>
          <LineChart
            :data="monthly"
            :categories="pair"
            x-axis="month"
            :height="200"
            glow
            hide-legend
          />
        </figure>
      </div>
    </section>

    <section>
      <h2>Point markers</h2>
      <div class="grid">
        <figure v-for="variant in DOT_VARIANTS" :key="variant">
          <figcaption>dotVariant="{{ variant }}"</figcaption>
          <LineChart
            :data="monthly"
            :categories="single"
            x-axis="month"
            :height="200"
            :dot-variant="variant"
            hide-legend
          />
        </figure>
      </div>
    </section>

    <section>
      <h2>Background textures</h2>
      <div class="grid">
        <figure v-for="variant in BACKGROUND_VARIANTS" :key="variant">
          <figcaption>backgroundPattern="{{ variant }}"</figcaption>
          <LineChart
            :data="monthly"
            :categories="single"
            x-axis="month"
            :height="200"
            :background-pattern="variant"
            :y-grid-line="false"
            :x-grid-line="false"
            hide-legend
          />
        </figure>
      </div>
    </section>

    <section>
      <h2>Legend indicators</h2>
      <div class="grid">
        <figure v-for="variant in LEGEND_INDICATOR_VARIANTS" :key="variant">
          <figcaption>legendVariant="{{ variant }}"</figcaption>
          <AreaChart
            :data="monthly"
            :categories="pair"
            x-axis="month"
            :height="200"
            :legend-variant="variant"
          />
        </figure>
      </div>
    </section>

    <section>
      <h2>Tooltips — hover to compare</h2>
      <div class="grid">
        <figure>
          <figcaption>default</figcaption>
          <AreaChart
            :data="monthly"
            :categories="pair"
            x-axis="month"
            :height="200"
            hide-legend
          />
        </figure>
        <figure>
          <figcaption>frosted-glass, xl roundness</figcaption>
          <AreaChart
            :data="monthly"
            :categories="pair"
            x-axis="month"
            :height="200"
            tooltip-variant="frosted-glass"
            tooltip-roundness="xl"
            hide-legend
          />
        </figure>
      </div>
    </section>

    <section>
      <h2>Radar</h2>
      <div class="grid">
        <figure>
          <figcaption>variant="filled" (default)</figcaption>
          <RadarChart :data="monthly" :categories="pair" data-key="month" :height="260" />
        </figure>
        <figure>
          <figcaption>variant="lines"</figcaption>
          <RadarChart
            :data="monthly"
            :categories="pair"
            data-key="month"
            :height="260"
            variant="lines"
          />
        </figure>
        <figure>
          <figcaption>gridType="circle" with dots</figcaption>
          <RadarChart
            :data="monthly"
            :categories="pair"
            data-key="month"
            :height="260"
            grid-type="circle"
            dot-variant="border"
          />
        </figure>
        <figure>
          <figcaption>variant="gradient" — inside to outside</figcaption>
          <RadarChart
            :data="monthly"
            :categories="pair"
            data-key="month"
            :height="260"
            variant="gradient"
          />
        </figure>
        <figure>
          <figcaption>variant="gradient-reverse" — outside to inside</figcaption>
          <RadarChart
            :data="monthly"
            :categories="pair"
            data-key="month"
            :height="260"
            variant="gradient-reverse"
          />
        </figure>
      </div>
    </section>

    <section>
      <h2>Donut and radial bar</h2>
      <div class="grid">
        <figure>
          <figcaption>donut, flat (default)</figcaption>
          <DonutChart :data="browserShare" :categories="browsers" :height="240" />
        </figure>
        <figure>
          <figcaption>donut, variant="gradient"</figcaption>
          <DonutChart
            :data="browserShare"
            :categories="browsers"
            :height="240"
            variant="gradient"
          />
        </figure>
        <figure>
          <figcaption>donut, glow</figcaption>
          <DonutChart :data="browserShare" :categories="browsers" :height="240" glow />
        </figure>
        <figure>
          <figcaption>radial bar, variant="full" (default)</figcaption>
          <RadialBarChart :data="browserShare" :categories="browsers" :height="240" />
        </figure>
        <figure>
          <figcaption>radial bar, variant="semi"</figcaption>
          <RadialBarChart
            :data="browserShare"
            :categories="browsers"
            :height="240"
            variant="semi"
          />
        </figure>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page {
  font-family: sans-serif;
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.lede {
  color: #666;
  max-width: 55ch;
}

section {
  margin-block: 2.5rem;
}

h2 {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.4rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

figure {
  margin: 0;
}

figcaption {
  font-size: 0.75rem;
  font-family: ui-monospace, monospace;
  color: #666;
  margin-bottom: 0.4rem;
}
</style>
