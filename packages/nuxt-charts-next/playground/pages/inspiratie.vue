<script setup lang="ts">
interface TrendRow {
  label: string;
  current: number;
  previous?: number;
}

interface BarRow {
  label: string;
  value: number;
}

const revenueData: TrendRow[] = [
  { label: "02", current: 100, previous: 44 },
  { label: "04", current: 90, previous: 54 },
  { label: "06", current: 104, previous: 70 },
  { label: "08", current: 126, previous: 96 },
  { label: "10", current: 132, previous: 72 },
  { label: "12", current: 108, previous: 76 },
  { label: "14", current: 130, previous: 52 },
  { label: "16", current: 188, previous: 128 },
  { label: "18", current: 208, previous: 154 },
  { label: "20", current: 178, previous: 126 },
  { label: "22", current: 166, previous: 136 },
  { label: "24", current: 178, previous: 120 },
  { label: "26", current: 150, previous: 84 },
  { label: "28", current: 206, previous: 142 },
  { label: "30", current: 248, previous: 196 },
];

const analyticsData: TrendRow[] = [
  { label: "1", current: 26 },
  { label: "2", current: 27 },
  { label: "3", current: 42 },
  { label: "4", current: 38 },
  { label: "5", current: 56 },
  { label: "6", current: 72 },
  { label: "7", current: 60 },
  { label: "8", current: 43 },
  { label: "9", current: 52 },
  { label: "10", current: 83 },
];

const bounceData: TrendRow[] = [
  { label: "1", current: 26 },
  { label: "2", current: 30 },
  { label: "3", current: 24 },
  { label: "4", current: 31 },
  { label: "5", current: 25 },
  { label: "6", current: 34 },
  { label: "7", current: 38 },
  { label: "8", current: 52 },
  { label: "9", current: 35 },
  { label: "10", current: 27 },
  { label: "11", current: 31 },
  { label: "12", current: 26 },
];

const conversionData: TrendRow[] = [
  { label: "1", current: 28 },
  { label: "2", current: 38 },
  { label: "3", current: 52 },
  { label: "4", current: 43 },
  { label: "5", current: 62 },
  { label: "6", current: 70 },
  { label: "7", current: 58 },
  { label: "8", current: 48 },
  { label: "9", current: 76 },
  { label: "10", current: 84 },
  { label: "11", current: 62 },
  { label: "12", current: 52 },
  { label: "13", current: 60 },
  { label: "14", current: 78 },
  { label: "15", current: 92 },
];

const activeUserBars: BarRow[] = [
  { label: "1", value: 48 },
  { label: "2", value: 58 },
  { label: "3", value: 66 },
  { label: "4", value: 68 },
  { label: "5", value: 52 },
  { label: "6", value: 76 },
  { label: "7", value: 92 },
  { label: "8", value: 69 },
];

const salesTrendBars: BarRow[] = [
  { label: "Mon", value: 8200 },
  { label: "Tue", value: 13000 },
  { label: "Wed", value: 11000 },
  { label: "Thu", value: 14000 },
  { label: "Fri", value: 12800 },
  { label: "Sat", value: 9500 },
  { label: "Sun", value: 11800 },
];

const limeSeries: Record<string, BulletLegendItemInterface> = {
  current: { name: "This Month", color: "#c3ef00" },
};

const revenueSeries: Record<string, BulletLegendItemInterface> = {
  current: { name: "This Month", color: "#c3ef00" },
  previous: { name: "Last Month", color: "#171717" },
};

const activeBarsSeries: Record<string, BulletLegendItemInterface> = {
  value: { name: "Active users", color: "#c9f31d" },
};

const salesBarsSeries: Record<string, BulletLegendItemInterface> = {
  value: { name: "Sales", color: "#c9f31d" },
};

const yAxisValue: (keyof BarRow)[] = ["value"];

const allocation = [
  { label: "Marketing", value: "40%", color: "bg-[#c9f31d]" },
  { label: "Product", value: "25%", color: "bg-[#deded7]" },
  { label: "Sales", value: "20%", color: "bg-[#8e918c]" },
  { label: "Operations", value: "10%", color: "bg-[#242424]" },
  { label: "Other", value: "5%", color: "bg-[#d3d3cd]" },
];

const traffic = [
  { label: "Direct", value: "38%", color: "bg-[#c9f31d]" },
  { label: "Organic Search", value: "28%", color: "bg-[#deded7]" },
  { label: "Referral", value: "18%", color: "bg-[#8e918c]" },
  { label: "Social Media", value: "10%", color: "bg-[#242424]" },
  { label: "Email", value: "6%", color: "bg-[#d3d3cd]" },
];

const trafficData = [38, 28, 18, 10, 6];
const trafficCategories: Record<string, BulletLegendItemInterface> = {
  direct: { name: "Direct", color: "#c9f31d" },
  organic: { name: "Organic Search", color: "#deded7" },
  referral: { name: "Referral", color: "#8e918c" },
  social: { name: "Social Media", color: "#242424" },
  email: { name: "Email", color: "#d3d3cd" },
};

const allocationData = [40, 25, 20, 10, 5];
const allocationCategories: Record<string, BulletLegendItemInterface> = {
  marketing: { name: "Marketing", color: "#c9f31d" },
  product: { name: "Product", color: "#deded7" },
  sales: { name: "Sales", color: "#8e918c" },
  operations: { name: "Operations", color: "#242424" },
  other: { name: "Other", color: "#d3d3cd" },
};

const moneyFormatter = (value: number) => `$${Math.round(value)}K`;
</script>

<template>
  <main class="grid min-h-screen place-items-center overflow-hidden bg-white font-[Inter,ui-sans-serif,system-ui,sans-serif] text-[#292c38]">
    <div class="relative h-[min(1254px,100vmin)] w-[min(1254px,100vmin)]">
      <div class="relative h-[1254px] w-[1254px] origin-top-left overflow-hidden bg-white [transform:scale(calc(min(1254px,100vmin)/1254px))]">
      <InspirationComponentsPanel class="absolute left-[24px] top-[28px] h-[582px] w-[590px] !min-h-0 !p-0">
        <InspirationComponentsKpiCard title="Total Revenue" value="$248,750" change="+12.5%" sublabel="vs last month" icon="pulse" dark class="absolute left-[40px] top-[76px] h-[178px] w-[160px]" />
        <InspirationComponentsKpiCard title="New Customers" value="1,428" change="+8.2%" sublabel="vs last month" icon="target" class="absolute left-[212px] top-[76px] h-[178px] w-[160px]" />
        <InspirationComponentsKpiCard title="Orders" value="6,734" change="+14.3%" sublabel="vs last month" icon="basket" class="absolute left-[384px] top-[76px] h-[178px] w-[160px]" />

        <InspirationComponentsCard class="absolute left-[40px] top-[265px] h-[238px] w-[500px] px-5 py-4">
          <div class="flex items-start justify-between">
            <h2 class="text-[13px] font-semibold">Revenue Overview</h2>
            <button class="rounded-[8px] border border-[#ecece8] px-3 py-2 text-[12px] font-semibold text-[#353844] shadow-sm">
              This Month <span class="ml-4 text-[#6f727b]">v</span>
            </button>
          </div>
          <div class="relative mt-4 h-[158px]">
            <div class="absolute inset-x-0 top-2 border-t border-dashed border-[#e4e4df]" />
            <div class="absolute inset-x-0 top-[52px] border-t border-dashed border-[#e4e4df]" />
            <div class="absolute inset-x-0 top-[102px] border-t border-dashed border-[#e4e4df]" />
            <div class="absolute left-0 top-0 space-y-[26px] text-[11px] text-[#767984]">
              <p>$300K</p>
              <p>$200K</p>
              <p>$100K</p>
              <p>$0</p>
            </div>
            <div class="absolute left-10 top-1 h-[136px] w-[420px]">
              <LineChart
                :data="revenueData"
                :categories="revenueSeries"
                :height="136"
                x-axis-key="label"
                :curve-type="CurveType.Natural"
                :hide-legend="true"
                :hide-tooltip="true"
                :hide-x-axis="true"
                :hide-y-axis="true"
                :x-grid-line="false"
                :y-grid-line="false"
                :y-domain="[0, 300]"
                :line-width="2.5"
                :duration="0"
              />
            </div>
            <div class="absolute right-16 top-1 rounded-[8px] bg-white px-3 py-2 shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
              <p class="text-[12px] font-extrabold">$248,750</p>
              <p class="text-[12px] font-bold text-[#bdf000]">+12.5%</p>
            </div>
            <div class="absolute bottom-0 left-16 right-2 flex justify-between text-[11px] text-[#858892]">
              <span v-for="day in ['02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30']" :key="day">{{ day }}</span>
            </div>
          </div>
          <div class="mt-1 flex justify-center gap-9 text-[11px] text-[#777a83]">
            <span class="inline-flex items-center gap-2"><i class="h-1 w-3 rounded-full bg-[#c3ef00]" />This Month</span>
            <span class="inline-flex items-center gap-2"><i class="h-1 w-3 rounded-full bg-[#171717]" />Last Month</span>
          </div>
        </InspirationComponentsCard>
      </InspirationComponentsPanel>

      <InspirationComponentsPanel class="absolute left-[638px] top-[28px] h-[582px] w-[590px] !min-h-0 !p-0">
        <InspirationComponentsCard class="absolute left-[89px] top-[79px] h-[194px] w-[410px] px-5 py-5">
          <div class="flex items-center justify-between">
            <h2 class="text-[13px] font-semibold">Analytics</h2>
            <span class="text-lg leading-none">...</span>
          </div>
          <p class="mt-7 text-[13px] text-[#737782]">Sessions</p>
          <p class="mt-2 text-[31px] font-extrabold leading-none">92,560</p>
          <p class="mt-4 text-[13px] font-bold">+15.7%</p>
          <p class="mt-1 text-[13px] text-[#838690]">vs last 7 days</p>
          <div class="absolute bottom-7 right-6 h-[98px] w-[214px]">
            <AreaChart
              :data="analyticsData"
              :categories="limeSeries"
              :height="98"
              x-axis-key="label"
              :curve-type="CurveType.Natural"
              :hide-legend="true"
              :hide-tooltip="true"
              :hide-x-axis="true"
              :hide-y-axis="true"
              :x-grid-line="false"
              :y-grid-line="false"
              :line-width="2"
              :duration="0"
            />
          </div>
        </InspirationComponentsCard>
        <InspirationComponentsIconBadge icon="bars" floating class="absolute left-[477px] top-[227px] size-[54px] rounded-[15px]" />

        <InspirationComponentsCard class="absolute left-[37px] top-[280px] h-[222px] w-[323px] px-5 py-6">
          <h2 class="text-[13px] font-semibold">Traffic Source</h2>
          <div class="mt-7 grid grid-cols-[128px_1fr] items-center gap-5">
            <div class="size-[116px]">
              <DonutChart
                :data="trafficData"
                :categories="trafficCategories"
                :radius="58"
                :arc-width="30"
                :height="116"
                :pad-angle="1"
                :hide-legend="true"
                :hide-tooltip="true"
                :duration="0"
              />
            </div>
            <div class="space-y-[13px]">
              <div v-for="item in traffic" :key="item.label" class="grid grid-cols-[1fr_auto] items-center gap-4 text-[12px]">
                <span class="flex items-center gap-3"><i :class="['size-2.5 rounded-full', item.color]" />{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
              </div>
            </div>
          </div>
        </InspirationComponentsCard>

        <InspirationComponentsCard dark class="absolute left-[377px] top-[287px] h-[212px] w-[176px] px-6 py-7">
          <h2 class="text-[13px] font-semibold text-white/90">Bounce Rate</h2>
          <p class="mt-4 text-[29px] font-extrabold">32.4%</p>
          <p class="mt-4 text-[13px] font-bold text-[#c9f31d]">&darr; 6.3%</p>
          <p class="mt-1 text-[13px] text-white/70">vs last 7 days</p>
          <div class="mt-6 h-[34px]">
            <LineChart
              :data="bounceData"
              :categories="limeSeries"
              :height="34"
              x-axis-key="label"
              :curve-type="CurveType.Natural"
              :hide-legend="true"
              :hide-tooltip="true"
              :hide-x-axis="true"
              :hide-y-axis="true"
              :x-grid-line="false"
              :y-grid-line="false"
              :line-width="2"
              :duration="0"
            />
          </div>
        </InspirationComponentsCard>
      </InspirationComponentsPanel>

      <InspirationComponentsPanel class="absolute left-[24px] top-[633px] h-[582px] w-[590px] !min-h-0 !p-0">
        <InspirationComponentsBudgetProgressCard class="absolute left-[40px] top-[49px] h-[172px] w-[296px]" />

        <InspirationComponentsCard class="absolute left-[358px] top-[78px] h-[145px] w-[180px] px-6 py-7">
          <h2 class="text-[13px] font-semibold">Remaining Budget</h2>
          <p class="mt-6 text-[24px] font-extrabold">$27,350</p>
          <p class="mt-4 text-[13px] text-[#70747f]">27% of total</p>
          <InspirationComponentsIconBadge icon="wallet" class="absolute bottom-6 right-5 size-14 rounded-[17px]" />
        </InspirationComponentsCard>

        <InspirationComponentsCard class="absolute left-[42px] top-[234px] h-[250px] w-[496px] px-7 py-5">
          <h2 class="text-[13px] font-semibold">Budget Allocation</h2>
          <div class="mt-8 grid grid-cols-[188px_1fr] items-center gap-10">
            <div class="size-[158px]">
              <DonutChart
                :data="allocationData"
                :categories="allocationCategories"
                :radius="79"
                :arc-width="38"
                :height="158"
                :pad-angle="1"
                :hide-legend="true"
                :hide-tooltip="true"
                :duration="0"
              />
            </div>
            <div class="space-y-[15px]">
              <div v-for="item in allocation" :key="item.label" class="grid grid-cols-[1fr_auto] items-center gap-6 text-[13px]">
                <span class="flex items-center gap-4"><i :class="['size-3 rounded-full', item.color]" />{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
              </div>
            </div>
          </div>
        </InspirationComponentsCard>

        <InspirationComponentsCard class="absolute left-[197px] top-[450px] grid h-[76px] w-[314px] grid-cols-[64px_1fr_auto] items-center gap-4 px-4 py-3">
          <InspirationComponentsIconBadge icon="trend" class="size-[54px] rounded-[14px]" />
          <div>
            <p class="text-[11px] text-[#777a83]">Cost per Acquisition</p>
            <p class="mt-2 text-[17px] font-extrabold">$18.75</p>
          </div>
          <div class="border-l border-[#e6e6e1] pl-6">
            <p class="text-[14px] font-extrabold text-[#9cd800]">&darr; 8.6%</p>
            <p class="mt-2 text-[11px] text-[#777a83]">vs last month</p>
          </div>
        </InspirationComponentsCard>
      </InspirationComponentsPanel>

      <InspirationComponentsPanel class="absolute left-[638px] top-[633px] h-[582px] w-[590px] !min-h-0 !p-0">
        <InspirationComponentsCard class="absolute left-[34px] top-[56px] h-[190px] w-[199px] px-5 py-6">
          <div class="flex items-start justify-between">
            <h2 class="text-[13px] font-semibold">Active Users</h2>
            <InspirationComponentsIconBadge icon="users" class="-mt-2 size-9 bg-transparent text-[#c3ef00]" />
          </div>
          <p class="mt-4 text-[25px] font-extrabold">23,984</p>
          <p class="mt-4 text-[12px] font-bold text-[#17b647]">+11.3%</p>
          <p class="text-[12px] text-[#858893]">vs last 7 days</p>
          <div class="mt-2 h-16">
            <BarChart
              :data="activeUserBars"
              :categories="activeBarsSeries"
              :y-axis="yAxisValue"
              x-axis="label"
              :height="64"
              :radius="3"
              :hide-legend="true"
              :hide-tooltip="true"
              :hide-x-axis="true"
              :hide-y-axis="true"
              :x-grid-line="false"
              :y-grid-line="false"
              :duration="0"
            />
          </div>
        </InspirationComponentsCard>

        <InspirationComponentsCard class="absolute left-[244px] top-[56px] h-[190px] w-[306px] px-6 py-6">
          <div class="flex items-start justify-between">
            <h2 class="text-[13px] font-semibold">Sales Trend</h2>
            <button class="rounded-[7px] border border-[#ecece8] px-3 py-1.5 text-[11px] font-medium text-[#8a8d95]">
              This Week v
            </button>
          </div>
          <div class="mt-3 h-[126px]">
            <BarChart
              :data="salesTrendBars"
              :categories="salesBarsSeries"
              :y-axis="yAxisValue"
              x-axis="label"
              :height="126"
              :radius="3"
              :hide-legend="true"
              :hide-tooltip="true"
              :x-grid-line="false"
              :y-grid-line="false"
              :x-domain-line="false"
              :y-domain-line="false"
              :x-tick-line="false"
              :y-tick-line="false"
              :y-formatter="moneyFormatter"
              :y-explicit-ticks="[5000, 10000, 15000]"
              :y-domain="[0, 15000]"
              :duration="0"
            />
          </div>
        </InspirationComponentsCard>

        <InspirationComponentsCard class="absolute left-[34px] top-[258px] h-[116px] w-[516px] px-5 py-6">
          <div class="grid grid-cols-[178px_1fr] items-center gap-7">
            <div>
              <h2 class="text-[13px] font-semibold">Conversion Rate</h2>
              <p class="mt-4 text-[25px] font-extrabold">4.65%</p>
              <p class="mt-3 text-[13px] font-bold text-[#17b647]">+0.9% <span class="ml-3 font-normal text-[#838690]">vs last 7 days</span></p>
            </div>
            <div class="relative h-16 border-l border-dashed border-[#d8d8d3] pl-5">
              <div class="absolute left-5 right-0 top-9 border-t border-dashed border-[#d8d8d3]" />
              <LineChart
                :data="conversionData"
                :categories="limeSeries"
                :height="64"
                x-axis-key="label"
                :curve-type="CurveType.Natural"
                :hide-legend="true"
                :hide-tooltip="true"
                :hide-x-axis="true"
                :hide-y-axis="true"
                :x-grid-line="false"
                :y-grid-line="false"
                :line-width="2"
                :duration="0"
              />
            </div>
          </div>
        </InspirationComponentsCard>

        <InspirationComponentsProductTile class="absolute left-[34px] top-[386px] h-[144px] w-[224px]" />

        <InspirationComponentsTimeRangeControl class="absolute left-[272px] top-[386px] h-[144px] w-[260px]" />
      </InspirationComponentsPanel>
      </div>
    </div>
  </main>
</template>
