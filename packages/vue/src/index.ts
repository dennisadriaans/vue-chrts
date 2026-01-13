import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import "./assets/main.css";

import App from "./App.vue";

const app = createApp(App);

const router = createRouter({
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("./Homepage.vue"),
    },
    {
      path: "/area-charts",
      name: "AreaCharts",
      component: () => import("./AreaChartPage.vue"),
    },
    {
      path: "/line-charts",
      name: "LineCharts",
      component: () => import("./LineChartPage.vue"),
    },
    {
      path: "/bar-charts",
      name: "BarCharts",
      component: () => import("./BarChartPage.vue"),
    },
    {
      path: "/dual-charts",
      name: "DualCharts",
      component: () => import("./DualChartPage.vue"),
    },
    {
      path: "/bubble-charts",
      name: "BubbleCharts",
      component: () => import("./BubbleChartPage.vue"),
    },
    {
      path: "/donut-charts",
      name: "DonutCharts",
      component: () => import("./DonutChartPage.vue"),
    },
    {
      path: "/sankey-charts",
      name: "SankeyCharts",
      component: () => import("./SankeyChartPage.vue"),
    },
    {
      path: "/timeline",
      name: "Timeline",
      component: () => import("./TimelinePage.vue"),
    },
    {
      path: "/dagre-graph",
      name: "DagreGraph",
      component: () => import("./DagreGraphPage.vue"),
    },
    {
      path: "/status-tracker",
      name: "StatusTracker",
      component: () => import("./StatusTrackerPage.vue"),
    },
  ],
  history: createWebHistory(),
});

app.use(router);

app.mount("#app");

export default {};
