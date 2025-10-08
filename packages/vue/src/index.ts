import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import "./assets/main.css";

import App from "./App.vue";

const app = createApp(App);

const router = createRouter({
    routes: [
        {
          path: '/',
          name: 'Home',
          component: () => import('./Homepage.vue') 
        },
        {
          path: '/area-charts',
          name: 'AreaCharts',
          component: () => import('./AreaChartPage.vue') 
        },
        {
          path: '/line-charts',
          name: 'LineCharts',
          component: () => import('./LineChartPage.vue') 
        },
        {
          path: '/bar-charts',
          name: 'BarCharts',
          component: () => import('./BarChartPage.vue') 
        },
        {
          path: '/bubble-charts',
          name: 'BubbleCharts',
          component: () => import('./BubbleChartPage.vue') 
        },
        {
          path: '/donut-charts',
          name: 'DonutCharts',
          component: () => import('./DonutChartPage.vue') 
        },
        {
          path: '/maps',
          name: 'Maps',
          component: () => import('./MapsPage.vue') 
        }
      ],
    history: createWebHistory(),
  });

app.use(router);

app.mount("#app");

export default {};
