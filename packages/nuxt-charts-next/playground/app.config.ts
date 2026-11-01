export default defineAppConfig({
  ui: {
    colors: {
      primary: "emerald",
      neutral: "neutral",
    },
    // Nuxt UI's own UChart theme. nuxt-charts inherits these slots, so this
    // one override styles the tooltips of both chart families.
    chart: {
      slots: {
        tooltip: "rounded-md",
      },
    },
  },
  // nuxt-charts themes, same shape as `ui.*`: `chart` applies to every chart,
  // per-component keys (`areaChart`, `metricChart`, …) layer on top.
  nuxtCharts: {
    chart: {
      slots: {
        legend: "gap-x-4",
      },
    },
  },
});
