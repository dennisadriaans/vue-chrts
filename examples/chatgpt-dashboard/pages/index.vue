<script setup lang="ts">
type Period = '7d' | '30d' | '90d'
const period = ref<Period>('30d')
const periods: Period[] = ['7d', '30d', '90d']
const periodLength = computed(() => ({ '7d': 7, '30d': 30, '90d': 90 })[period.value])
const daily = Array.from({ length: 90 }, (_, index) => {
  const seasonal = Math.sin(index / 4.5) * 95
  const visitors = Math.round(550 + index * 7.4 + seasonal + Math.cos(index * 1.7) * 35)
  const sales = Math.round(visitors * (0.055 + Math.sin(index / 9) * 0.009))
  return {
    day: 'Day ' + String(index + 1),
    visitors,
    orders: sales,
    revenue: sales * (65 + index % 9),
    organic: Math.round(visitors * 0.48),
    social: Math.round(visitors * 0.32),
    direct: Math.round(visitors * 0.20)
  }
})
const records = computed(() => daily.slice(-periodLength.value))
const sum = (field: 'visitors' | 'orders' | 'revenue') => records.value.reduce((total, row) => total + row[field], 0)
const visitors = computed(() => sum('visitors'))
const orders = computed(() => sum('orders'))
const revenue = computed(() => sum('revenue'))
const conversion = computed(() => orders.value / visitors.value * 100)
const revenueFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const countFormat = new Intl.NumberFormat('en-US')
const trafficCategories = {
  organic: { name: 'Organic', color: '#4f46e5' },
  social: { name: 'Social', color: '#06b6d4' },
  direct: { name: 'Direct', color: '#f59e0b' }
}
const salesCategories = {
  revenue: { name: 'Revenue', color: '#4f46e5' }
}
const ordersCategories = {
  orders: { name: 'Orders', color: '#0ea5e9' }
}
const sources = computed(() => [
  { name: 'Organic search', visits: records.value.reduce((n, d) => n + d.organic, 0) },
  { name: 'Social media', visits: records.value.reduce((n, d) => n + d.social, 0) },
  { name: 'Direct', visits: records.value.reduce((n, d) => n + d.direct, 0) }
])
const maxSource = computed(() => Math.max(...sources.value.map(item => item.visits)))
</script>

<template>
  <div class="dashboard">
    <header class="topbar">
      <div class="brand"><span class="brand-mark">N</span><span>Nuxt Charts <span class="muted">/ Analytics</span></span></div>
      <div class="header-right"><span class="demo-pill">● Demo data</span><a href="https://nuxtcharts.com" target="_blank" rel="noopener noreferrer">nuxtcharts.com ↗</a></div>
    </header>
    <main>
      <div class="heading">
        <div><div class="eyebrow">OVERVIEW</div><h1>Analytics dashboard</h1><p class="muted">A live, interactive Nuxt Charts v3 showcase with deterministic mock data.</p></div>
        <div class="periods" role="group" aria-label="Date range">
          <button v-for="option in periods" :key="option" :class="{ active: option === period }" :aria-pressed="option === period" @click="period = option">{{ option }}</button>
        </div>
      </div>
      <section class="metrics" aria-label="Key metrics">
        <div class="panel metric"><div class="metric-label">Revenue <span>↗</span></div><strong>{{ revenueFormat.format(revenue) }}</strong><small>Selected period</small></div>
        <div class="panel metric"><div class="metric-label">Visitors <span>↗</span></div><strong>{{ countFormat.format(visitors) }}</strong><small>Unique sessions (mock)</small></div>
        <div class="panel metric"><div class="metric-label">Orders <span>↗</span></div><strong>{{ countFormat.format(orders) }}</strong><small>Completed checkouts</small></div>
        <div class="panel metric"><div class="metric-label">Conversion rate <span>↗</span></div><strong>{{ conversion.toFixed(2) }}%</strong><small>Orders / visitors</small></div>
      </section>
      <section class="charts">
        <div class="panel wide">
          <div class="panel-header"><div><h2>Revenue over time</h2><p>Revenue across the selected period</p></div><span class="legend"><i class="indigo" /> Revenue</span></div>
          <ClientOnly><AreaChart :data="records" :categories="salesCategories" :height="292" x-axis="day" :y-axis="['revenue']" variant="gradient" /></ClientOnly>
        </div>
        <div class="panel narrow">
          <div class="panel-header"><div><h2>Acquisition</h2><p>Visitors by source</p></div></div>
          <ClientOnly><BarChart :data="records" :categories="trafficCategories" :height="292" x-axis="day" :y-axis="['organic', 'social', 'direct']" stacked /></ClientOnly>
        </div>
        <div class="panel half">
          <div class="panel-header"><div><h2>Orders</h2><p>Daily completed orders</p></div></div>
          <ClientOnly><LineChart :data="records" :categories="ordersCategories" :height="260" x-axis="day" :y-axis="['orders']" /></ClientOnly>
        </div>
        <div class="panel half">
          <div class="panel-header"><div><h2>Top channels</h2><p>Share of total visitors</p></div></div>
          <div class="channel" v-for="(source, index) in sources" :key="source.name">
            <div class="channel-row"><span>{{ source.name }}</span><strong>{{ countFormat.format(source.visits) }}</strong></div>
            <div class="track"><div :class="'fill fill-'+index" :style="{ width: (source.visits / maxSource * 100) + '%' }" /></div>
          </div>
        </div>
      </section>
      <footer>Built with Nuxt 4 and <strong>nuxt-charts-next</strong> from vue-chrts · All numbers are mock data.</footer>
    </main>
  </div>
</template>

<style>
:root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#18181b;background:#fafafa;font-synthesis:none}
*{box-sizing:border-box}body{margin:0}.topbar{height:64px;border-bottom:1px solid #e7e7e9;background:white;display:flex;align-items:center;justify-content:space-between;padding:0 max(24px,calc((100vw - 1220px)/2));font-size:13px}.brand{display:flex;align-items:center;gap:11px;font-weight:700}.brand-mark{background:#18181b;color:white;border-radius:9px;width:30px;height:30px;display:grid;place-items:center;font-size:15px}.header-right{display:flex;align-items:center;gap:22px}.header-right a{color:#52525b;text-decoration:none}.muted{color:#71717a}.demo-pill{font-size:12px;background:#f4f4f5;border:1px solid #e4e4e7;border-radius:99px;padding:5px 10px;color:#3f3f46}main{max-width:1268px;margin:auto;padding:40px 24px}.heading{display:flex;justify-content:space-between;align-items:end;gap:24px;margin-bottom:28px}.eyebrow{font-size:11px;color:#71717a;font-weight:700;letter-spacing:.09em}h1{font-size:30px;letter-spacing:-.045em;margin:8px 0}p{font-size:13px}.periods{border:1px solid #e4e4e7;border-radius:9px;padding:4px;background:white;display:flex;gap:4px}.periods button{background:transparent;color:#71717a;border:0;border-radius:6px;padding:8px 13px;cursor:pointer;font-weight:600}.periods button.active{background:#18181b;color:white}.metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-bottom:16px}.panel{background:#fff;border:1px solid #e4e4e7;border-radius:12px;padding:22px;min-width:0}.metric-label{font-size:13px;color:#71717a;display:flex;justify-content:space-between}.metric-label span{color:#16a34a}.metric strong{display:block;font-size:29px;letter-spacing:-.045em;margin:14px 0 7px}.metric small{color:#a1a1aa}.charts{display:grid;grid-template-columns:1.3fr 1fr;gap:16px}.wide,.narrow,.half{min-width:0}.panel-header{display:flex;justify-content:space-between;align-items:start;margin-bottom:21px}.panel-header h2{font-size:15px;margin:0 0 5px;letter-spacing:-.02em}.panel-header p{margin:0;color:#a1a1aa}.legend{font-size:12px;color:#71717a}.legend i{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:4px}.indigo{background:#4f46e5}.channel{margin:23px 0}.channel-row{display:flex;justify-content:space-between;font-size:13px;margin-bottom:10px}.channel-row strong{font-weight:600}.track{height:8px;border-radius:99px;background:#f4f4f5;overflow:hidden}.fill{height:100%;border-radius:99px}.fill-0{background:#4f46e5}.fill-1{background:#06b6d4}.fill-2{background:#f59e0b}footer{text-align:center;color:#a1a1aa;font-size:12px;padding:30px}footer strong{color:#52525b}@media(max-width:850px){.metrics{grid-template-columns:repeat(2,1fr)}.charts{grid-template-columns:1fr}}@media(max-width:550px){.topbar{padding:0 16px}.header-right a{display:none}main{padding:24px 16px}.heading{align-items:start;flex-direction:column}.metrics{gap:10px}.panel{padding:15px}.metric strong{font-size:24px}}
</style>
