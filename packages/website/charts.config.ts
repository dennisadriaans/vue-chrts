/* Nuxt Charts */
export const chartConfig = {
  theme: 'dark',
  animations: true,
  defaults: {
    area: {
      fillOpacity: 0.4,
      strokeWidth: 2,
      colors: ['#42b883', '#35495e']
    }
  },
  dataSource: {
    endpoint: '/api/analytics/v1',
    refreshInterval: 5000
  }
}
