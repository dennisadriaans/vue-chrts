
import { createApp } from 'vue'
import { createRouter, createWebHistory } from "vue-router";

import './assets/main.css'

import App from './App.vue'

const app = createApp(App)

const router = createRouter({
    routes: [
        {
          path: '/',
          name: 'Home',
          component: () => import('./Homepage.vue') 
        },
        {
          path: '/admin',
          name: 'AdminTemplate',
          component: () => import('./AdminTemplate.vue') 
        },
        {
          path: '/dashboard',
          name: 'DashboardTemplate',
          component: () => import('./DashboardTemplate.vue') 
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
        // {
        //   path: '/overview',
        //   name: 'Overview',
        //   component: () => import('./components/Overview.vue') // Replace with your OverviewPage component path
        // }
      ],
    history: createWebHistory(),
  });

app.use(router);

app.mount('#app')

export default {

}