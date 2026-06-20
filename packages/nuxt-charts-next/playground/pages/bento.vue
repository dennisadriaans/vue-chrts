<script setup lang="ts">
interface BentoMonth {
  month: string;
  revenue: number;
  spend: number;
  visits: number;
  cards: number;
  price: number;
  volume: number;
}

interface BubbleDatum {
  x: number;
  y: number;
  size: number;
  group: string;
}

interface RadarDatum {
  metric: string;
  actual: number;
  target: number;
}

interface RoadmapItem {
  label: string;
  value: string;
  left: number;
  width: number;
  tone: "sage" | "lime" | "pale";
}

interface MissingDataVis {
  title: string;
  evidence: string;
  currentWorkaround: string;
  priority: "High" | "Medium";
}

const bentoMonths: BentoMonth[] = [
  { month: "Jan", revenue: 42, spend: 31, visits: 72, cards: 18, price: 40, volume: 72 },
  { month: "Feb", revenue: 56, spend: 38, visits: 88, cards: 27, price: 36, volume: 46 },
  { month: "Mar", revenue: 48, spend: 35, visits: 81, cards: 24, price: 50, volume: 88 },
  { month: "Apr", revenue: 68, spend: 49, visits: 96, cards: 36, price: 54, volume: 58 },
  { month: "May", revenue: 84, spend: 58, visits: 124, cards: 45, price: 49, volume: 64 },
  { month: "Jun", revenue: 72, spend: 52, visits: 110, cards: 42, price: 62, volume: 96 },
  { month: "Jul", revenue: 94, spend: 63, visits: 138, cards: 58, price: 70, volume: 78 },
  { month: "Aug", revenue: 88, spend: 59, visits: 132, cards: 55, price: 58, volume: 90 },
  { month: "Sep", revenue: 106, spend: 71, visits: 149, cards: 64, price: 66, volume: 104 },
  { month: "Oct", revenue: 118, spend: 77, visits: 164, cards: 71, price: 82, volume: 86 },
  { month: "Nov", revenue: 104, spend: 69, visits: 152, cards: 66, price: 79, volume: 74 },
  { month: "Dec", revenue: 132, spend: 82, visits: 181, cards: 82, price: 96, volume: 112 },
];

const revenueCategories: Record<string, BulletLegendItemInterface> = {
  revenue: { name: "Revenue", color: "#dfff3f" },
  spend: { name: "Spend", color: "#ffffff" },
};

const purpleCategories: Record<string, BulletLegendItemInterface> = {
  revenue: { name: "Income", color: "#8f55ff" },
  spend: { name: "Expense", color: "#d7f75b" },
};

const redPriceCategories: Record<string, BulletLegendItemInterface> = {
  volume: { name: "Volume", color: "#791f1f" },
  price: { name: "BTC", color: "#ff9e2f" },
  spend: { name: "ETH", color: "#fff1ef" },
};

const redLineCategories: Record<string, BulletLegendItemInterface> = {
  price: { name: "BTC", color: "#ff9e2f" },
  spend: { name: "ETH", color: "#fff1ef" },
};

const monochromeCategories: Record<string, BulletLegendItemInterface> = {
  revenue: { name: "Paid", color: "#f4f4ef" },
  spend: { name: "Open", color: "#323232" },
};

const giftFunnelCategories: Record<string, BulletLegendItemInterface> = {
  pick: { name: "Pick", color: "#ff8b5e" },
  customize: { name: "Customize", color: "#bd9df4" },
  schedule: { name: "Schedule", color: "#ff6ea7" },
  delivered: { name: "Delivered", color: "#bfe36f" },
};

const radarCategories: Record<string, BulletLegendItemInterface> = {
  actual: { name: "Live", color: "#dfff3f" },
  target: { name: "Target", color: "#ffffff" },
};

const radialCategories: Record<string, BulletLegendItemInterface> = {
  progress: { name: "Progress", color: "#dfff3f" },
  time: { name: "Time", color: "#98a195" },
  quality: { name: "Quality", color: "#111111" },
};

const donorCategories: Record<string, BulletLegendItemInterface> = {
  direct: { name: "Direct", color: "#ffdf6e" },
  teams: { name: "Teams", color: "#b9e875" },
  inbox: { name: "Inbox", color: "#b7d5e2" },
  wallet: { name: "Wallet", color: "#151515" },
};

const bubbleCategories: Record<string, BulletLegendItemInterface> = {
  card: { name: "Cards", color: "#bd9df4" },
  cash: { name: "Cash", color: "#bfe36f" },
  social: { name: "Social", color: "#ff6ea7" },
};

const attendanceCategories: Record<string, BulletLegendItemInterface> = {
  sick: { name: "Sick Leave", color: "#f5d76a" },
  off: { name: "Day Off", color: "#6fd7f5" },
  ontime: { name: "On time", color: "#7557f6" },
};

const systemCategories: Record<string, BulletLegendItemInterface> = {
  paid: { name: "Paid", color: "#f5f5f1" },
  queued: { name: "Queued", color: "#454545" },
  risk: { name: "Risk", color: "#db3030" },
  idle: { name: "Idle", color: "#161616" },
};

const revenueYAxis: (keyof BentoMonth)[] = ["revenue"];
const priceVolumeYAxis: (keyof BentoMonth)[] = ["volume"];
const monochromeYAxis: (keyof BentoMonth)[] = ["revenue", "spend"];

const giftFunnelData = [100, 72, 54, 39];
const donorData = [38, 27, 21, 14];
const radialData = [72, 64, 91];

const radarData: RadarDatum[] = [
  { metric: "Accuracy", actual: 84, target: 92 },
  { metric: "Speed", actual: 96, target: 88 },
  { metric: "Recall", actual: 72, target: 85 },
  { metric: "Coverage", actual: 90, target: 86 },
  { metric: "Tone", actual: 78, target: 82 },
];

const bubbleData: BubbleDatum[] = [
  { x: 14, y: 46, size: 210, group: "card" },
  { x: 28, y: 76, size: 130, group: "cash" },
  { x: 42, y: 54, size: 260, group: "social" },
  { x: 58, y: 32, size: 120, group: "card" },
  { x: 72, y: 66, size: 190, group: "cash" },
  { x: 88, y: 44, size: 150, group: "social" },
];

const roadmapItems: RoadmapItem[] = [
  { label: "Intro", value: "100%", left: 0, width: 36, tone: "sage" },
  { label: "Audit", value: "59%", left: 32, width: 28, tone: "pale" },
  { label: "Research", value: "75%", left: 0, width: 70, tone: "lime" },
];

const attendancePattern = [
  "ontime",
  "ontime",
  "off",
  "ontime",
  "sick",
  "ontime",
  "ontime",
  "ontime",
  "off",
  "ontime",
] as const;

const attendanceHistory = Array.from({ length: 30 }, (_, index) => {
  const status = attendancePattern[index % attendancePattern.length];
  return {
    status,
    label: `Day ${index + 1}`,
    value: status === "ontime" ? 100 : status === "off" ? 72 : 48,
  };
});

const systemPattern = [
  "paid",
  "paid",
  "queued",
  "paid",
  "risk",
  "idle",
  "paid",
  "queued",
  "paid",
  "paid",
  "risk",
  "paid",
] as const;

const systemHistory = Array.from({ length: 42 }, (_, index) => {
  const status = systemPattern[(index + Math.floor(index / 9)) % systemPattern.length];
  return {
    status,
    label: `Invoice ${index + 1}`,
    value: status === "paid" ? 100 : status === "queued" ? 74 : status === "risk" ? 36 : 12,
  };
});

const sourceNotes = [
  {
    file: "image.png",
    title: "Frosted workflow card",
    note: "Soft white glass, avatar strip, purple processing chip, segmented tabs, tiny KPI and micro status rail.",
  },
  {
    file: "image copy.png",
    title: "Givingli pastel bento",
    note: "Cream canvas, serif headers, high-radius pastel blocks, tilted product mockups, cropped phone and gift cards.",
  },
  {
    file: "image copy 2.png",
    title: "OxeliaMetrix SaaS",
    note: "Sage stage, neon-lime hero card, pill controls, calendar chips, roadmap bars and black sparkline card.",
  },
  {
    file: "image copy 3.png",
    title: "Loud dark analytics",
    note: "Purple-lime gradient, black dashboard shell, dense cards, violet chart accents, heatmap and transactions.",
  },
  {
    file: "image copy 4.png",
    title: "Paytech trading case",
    note: "Burgundy gradient case-study panels, red/black screens, combo bars and lines, forms, risk strip and wallet cards.",
  },
  {
    file: "image copy 5.png",
    title: "Midday monochrome ops",
    note: "Hairline bordered black UI, tiny metadata, invoice ledger, calendars, checklists and restrained bar marks.",
  },
];

const missingDataVis: MissingDataVis[] = [
  {
    title: "Combo chart",
    evidence: "The Paytech and Loud references pair thin vertical bars with two line series in one plot.",
    currentWorkaround: "Layered BarChart and LineChart manually in the bento mockups.",
    priority: "High",
  },
  {
    title: "Calendar and date-range heatmap",
    evidence: "Meeting chips, month pickers and invoice calendars appear in three of the sources.",
    currentWorkaround: "CSS grid calendar cells with hand-authored active states.",
    priority: "High",
  },
  {
    title: "Gantt or roadmap timeline",
    evidence: "The Oxelia roadmap uses labeled horizontal task bars, milestones, avatars and day columns.",
    currentWorkaround: "Absolute CSS bars inside a grid, not a reusable data-vis primitive.",
    priority: "High",
  },
  {
    title: "Matrix heatmap",
    evidence: "The Loud activity-by-time panel is a true two-axis heatmap with intensity legend.",
    currentWorkaround: "Static tile grid because the package has no heatmap component yet.",
    priority: "High",
  },
  {
    title: "Segmented KPI strip",
    evidence: "Processing, payment score and risk-score panels need compact categorical rails.",
    currentWorkaround: "StatusTrackerChart covers uptime-style strips, but not score scales with ticks and labels.",
    priority: "Medium",
  },
  {
    title: "Sparkline primitive",
    evidence: "Several references use tiny line charts embedded inside cards, tables and transaction tiles.",
    currentWorkaround: "LineChart works when space permits, while DashboardSparkline is dashboard-specific.",
    priority: "Medium",
  },
];
</script>

<template>
  <main class="bento-page">
    <section class="intro">
      <div class="intro-nav">
        <div class="brand-mark">
          <span />
          vue-chrts bento lab
        </div>
        <NuxtLink to="/" class="back-link">Back to charts</NuxtLink>
      </div>

      <div class="intro-grid">
        <div class="intro-copy">
          <p class="eyebrow">Source analysis -> Nuxt chart package stress test</p>
          <h1>Endless bento grids rebuilt from the six source directions.</h1>
          <p>
            Every section below recreates a different visual system and embeds the new
            `packages/nuxt-next/src` chart adapters where they fit.
          </p>
        </div>

        <div class="source-audit">
          <article v-for="source in sourceNotes" :key="source.file" class="audit-row">
            <span>{{ source.file }}</span>
            <strong>{{ source.title }}</strong>
            <p>{{ source.note }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="study study-frost">
      <div class="study-copy">
        <span>01 / image.png</span>
        <h2>Frosted processing micro-flow</h2>
        <p>Glassmorphic white cards, a purple state chip, tiny tabbed KPI surface and a categorical rail.</p>
      </div>

      <div class="frost-stage">
        <div class="employee-strip">
          <span class="avatar avatar-photo">SC</span>
          <div>
            <strong>Simon Cyrene</strong>
            <small>simoncy@mail.com</small>
          </div>
          <em>Freelance</em>
        </div>

        <div class="processing-chip">
          <span />
          Processing
        </div>

        <div class="connector" />

        <article class="attendance-card">
          <div class="card-dots">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div class="tabs">
            <button>Attendance</button>
            <button>Tasks</button>
            <button>Order</button>
          </div>
          <div class="attendance-metric">
            <strong>90%</strong>
            <span>+20% since last month</span>
          </div>
          <StatusTrackerChart
            :data="attendanceHistory"
            :categories="attendanceCategories"
            :visible-bars="30"
            :height="10"
            :bar-width="7"
            :bar-gap="2"
            hide-header
            hide-legend
            hide-tooltip
          />
          <div class="attendance-legend">
            <span><i class="dot sick" />Sick Leave</span>
            <span><i class="dot off" />Day Off</span>
            <span><i class="dot ontime" />On time</span>
          </div>
        </article>
      </div>
    </section>

    <section class="study study-givingli">
      <div class="givingli-top">
        <div class="givingli-logo">
          <span>G</span>
          Givingli
        </div>
        <button>Start Gifting</button>
      </div>

      <div class="givingli-grid">
        <article class="pastel-card customization">
          <h2>Customization</h2>
          <div class="tilted-stack">
            <div class="photo-card">
              <span />
              <strong>Happy Birthday</strong>
              <small>Make it personal</small>
            </div>
            <div class="sticker-card">CAKE</div>
          </div>
          <div class="tool-palette">
            <span>Templates</span>
            <span>Text</span>
            <span>Stickers</span>
            <span>Video</span>
            <span>Photo</span>
            <span>Paint</span>
          </div>
          <p>Use a pre-designed template or personalize with video, stickers, fonts, and more.</p>
          <BubbleChart
            class="mini-bubble"
            :data="bubbleData"
            :categories="bubbleCategories"
            x-accessor="x"
            y-accessor="y"
            size-accessor="size"
            category-key="group"
            :size-range="[18, 42]"
            :height="100"
            hide-x-axis
            hide-y-axis
            hide-legend
            hide-tooltip
            :x-grid-line="false"
            :y-grid-line="false"
            :duration="0"
          />
        </article>

        <article class="pastel-card scheduling">
          <div>
            <h2>Scheduling</h2>
            <p>Schedule all your cards and gifts now and we will send them later.</p>
          </div>
          <div class="calendar-sheet">
            <small>When should we deliver this card?</small>
            <strong>September 20</strong>
            <span>5:00 AM</span>
            <button>Set Date</button>
          </div>
        </article>

        <article class="pastel-card wallet">
          <div class="cash-card">
            <small>Givingli Cash</small>
            <strong>$132.00</strong>
            <span>Reload</span>
          </div>
          <h2>Wallet</h2>
          <p>Access all your gifts and save up your Givingli Cash.</p>
          <DonutChart
            :data="donorData"
            :categories="donorCategories"
            :radius="52"
            :arc-width="16"
            :height="116"
            hide-legend
            hide-tooltip
            :duration="0"
          />
        </article>

        <article class="pastel-card inbox">
          <h2>Inbox</h2>
          <p>Track your gifts, group chats, and sent cards.</p>
          <div class="message-list">
            <span v-for="name in ['Bea, Janrick, Ari', 'Kyle Putriano', 'Damian Martin']" :key="name">
              <i>{{ name.slice(0, 2) }}</i>
              <strong>{{ name }}</strong>
              <small>Happy birthday - Apr 25</small>
            </span>
          </div>
        </article>

        <article class="pastel-card send-gifts">
          <h2>Send Gifts</h2>
          <p>Send as a group with friends or individually.</p>
          <div class="gift-cards">
            <span>Bath Works</span>
            <span>Sephora</span>
            <span>Target</span>
            <span>Nike</span>
            <span>Amazon</span>
            <span>Starbucks</span>
          </div>
          <FunnelChart
            :data="giftFunnelData"
            :categories="giftFunnelCategories"
            :height="150"
            last-shape-type="rectangle"
            hide-legend
            hide-tooltip
            :duration="0"
          />
        </article>

        <article class="pastel-card reminders">
          <h2>Reminders</h2>
          <p>Never miss a birthday or special occasion again.</p>
          <div class="phone-crop">
            <div class="phone-bar" />
            <span>Birthday Reminder</span>
            <small>It is Alex's birthday today.</small>
          </div>
        </article>
      </div>
    </section>

    <section class="study study-oxelia">
      <div class="oxelia-grid">
        <article class="lime-project">
          <header>
            <span class="avatar">AH</span>
            <div>
              <strong>Alesha Hyocinth</strong>
              <small>Project Manager</small>
            </div>
          </header>
          <h2>OxeliaMetrix</h2>
          <p>Industry: SaaS</p>
          <div class="progress-line"><span /></div>
          <div class="select-report">
            <span>Select a report</span>
            <strong>34%</strong>
          </div>
          <RadialBarChart
            class="project-radial"
            :data="radialData"
            :categories="radialCategories"
            :height="130"
            :corner-radius="9"
            hide-legend
            hide-tooltip
            :duration="0"
          />
        </article>

        <article class="meetings-card">
          <div class="meeting-head">
            <h2>Upcoming<br>Meetings</h2>
            <button>September</button>
          </div>
          <p>3 calls - Thu, 11</p>
          <div class="date-pills">
            <span v-for="day in ['8 Mon', '9 Tue', '10 Wed', '11 Thu', '12 Fri', '13 Sat']" :key="day" :class="{ active: day.startsWith('11') }">
              {{ day }}
            </span>
          </div>
          <StatusTrackerChart
            :data="attendanceHistory.slice(0, 18)"
            :categories="attendanceCategories"
            :height="8"
            :bar-width="18"
            :bar-gap="10"
            :visible-bars="6"
            hide-header
            hide-legend
            hide-tooltip
          />
        </article>

        <article class="roadmap-card">
          <div class="roadmap-head">
            <h2>Project<br>Roadmap</h2>
            <button>+ Add task</button>
          </div>
          <div class="roadmap-chart">
            <div class="roadmap-grid" />
            <div
              v-for="item in roadmapItems"
              :key="item.label"
              class="roadmap-bar"
              :class="item.tone"
              :style="{ left: `${item.left}%`, width: `${item.width}%` }"
            >
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </div>
            <div class="milestone" />
          </div>
          <div class="roadmap-days">
            <span>Mon 12</span>
            <span>Tue 13</span>
            <span>Wed 14</span>
            <strong>Thu 15</strong>
            <span>Fri 16</span>
          </div>
        </article>

        <div class="oxelia-side">
          <article class="date-card"><strong>19</strong><span>Tue,<br>January</span></article>
          <article class="efficiency-card">
            <h3>Efficiency</h3>
            <small>January</small>
            <em>+40%</em>
            <LineChart
              :data="bentoMonths"
              :categories="revenueCategories"
              :height="108"
              :curve-type="CurveType.Natural"
              hide-x-axis
              hide-y-axis
              hide-legend
              hide-tooltip
              :x-grid-line="false"
              :y-grid-line="false"
              :duration="0"
            />
          </article>
        </div>

        <article class="time-card">
          <span>Clock</span>
          <p>Total project time</p>
          <strong>645 h</strong>
        </article>

        <article class="assistant-card">
          <span>AI<br>Smart<br>Assistant</span>
          <RadarChart
            :data="radarData"
            :categories="radarCategories"
            data-key="metric"
            :height="150"
            :fill-opacity="0.36"
            hide-radius-axis
            hide-legend
            hide-tooltip
            :duration="0"
          />
        </article>
      </div>
    </section>

    <section class="study study-loud">
      <div class="loud-shell">
        <nav class="loud-nav">
          <strong><span />Loud</strong>
          <div>
            <button>Dashboard</button>
            <button class="active">Analytics</button>
            <button>Transactions</button>
            <button>Reports</button>
            <button>Settings</button>
          </div>
          <em>AG</em>
        </nav>

        <div class="loud-hero">
          <div>
            <h2>Welcome back, <span>Angela</span></h2>
            <small>Total revenue</small>
            <strong>$16,957.00</strong>
            <p>Available to spend: <b>$16,957.00</b></p>
            <button>Transfer</button>
            <button>Request</button>
          </div>
          <div class="combo-panel">
            <BarChart
              :data="bentoMonths"
              :categories="purpleCategories"
              :y-axis="revenueYAxis"
              x-axis="month"
              :height="150"
              :radius="4"
              hide-x-axis
              hide-y-axis
              hide-legend
              hide-tooltip
              :x-grid-line="false"
              :y-grid-line="false"
              :duration="0"
            />
            <LineChart
              class="combo-line"
              :data="bentoMonths"
              :categories="purpleCategories"
              :height="150"
              :curve-type="CurveType.Natural"
              :line-width="2"
              hide-x-axis
              hide-y-axis
              hide-legend
              hide-tooltip
              :x-grid-line="false"
              :y-grid-line="false"
              :duration="0"
            />
          </div>
        </div>

        <div class="loud-cards">
          <article class="dark-card analytics-card">
            <h3>Analytics</h3>
            <AreaChart
              :data="bentoMonths"
              :categories="purpleCategories"
              :height="170"
              :curve-type="CurveType.Natural"
              hide-x-axis
              hide-y-axis
              hide-legend
              hide-tooltip
              :x-grid-line="false"
              :y-grid-line="false"
              :duration="0"
            />
          </article>
          <article class="dark-card heatmap-card">
            <h3>Activity by time</h3>
            <div class="heatmap">
              <span v-for="index in 42" :key="index" :class="`heat-${index % 5}`" />
            </div>
            <small>Less <i /> <i /> <i /> <i /> More</small>
          </article>
          <article class="dark-card transactions-card">
            <h3>Recent transactions</h3>
            <div v-for="row in ['Internet', 'Isabella Garcia', 'Sophora', 'Netflix', 'Violet Ocean']" :key="row" class="transaction-row">
              <span>{{ row }}</span>
              <em>{{ row.length % 2 ? 'Transfer' : 'Multimedia' }}</em>
              <strong>-${{ (row.length * 420).toLocaleString() }}</strong>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="study study-paytech">
      <div class="paytech-row top">
        <div class="paytech-copy">
          <small>Desktop</small>
          <h2>Simple sign-up flow with clear steps and instant validation.</h2>
        </div>
        <article class="red-screen">
          <strong>Paytech</strong>
          <BarChart
            :data="bentoMonths"
            :categories="redPriceCategories"
            :y-axis="priceVolumeYAxis"
            x-axis="month"
            :height="250"
            :radius="0"
            hide-x-axis
            hide-y-axis
            hide-legend
            hide-tooltip
            :x-grid-line="false"
            :y-grid-line="false"
            :duration="0"
          />
          <LineChart
            class="red-line"
            :data="bentoMonths"
            :categories="redLineCategories"
            :height="250"
            :curve-type="CurveType.Natural"
            :line-width="2"
            hide-x-axis
            hide-y-axis
            hide-legend
            hide-tooltip
            :x-grid-line="false"
            :y-grid-line="false"
            :duration="0"
          />
          <h3>Trade, Swap, and Manage Digital Assets Without Extra Steps</h3>
        </article>
        <article class="signup-screen">
          <h3>Sing Up Account</h3>
          <p>Enter your personal date to create your account</p>
          <div class="field-grid">
            <label>Felix</label>
            <label>Brown</label>
          </div>
          <label class="invalid">felixbrown276@gmail.com</label>
          <label>+1 271 250 0701</label>
          <label>Your password</label>
          <button>Buy BTC</button>
        </article>
      </div>

      <div class="paytech-row middle">
        <article class="swap-screen">
          <h3>Swap or Bridge</h3>
          <div class="swap-box"><span>ETH</span><strong>3,253.12</strong></div>
          <div class="swap-box"><span>BTC</span><strong>92,059.72</strong></div>
          <button>Buy BTC</button>
        </article>
        <article class="risk-screen">
          <h3>Portfolio<br>Risk Score</h3>
          <StatusTrackerChart
            :data="systemHistory.slice(0, 26)"
            :categories="systemCategories"
            :visible-bars="26"
            :height="16"
            :bar-width="5"
            :bar-gap="1"
            hide-header
            hide-legend
            hide-tooltip
          />
          <div class="risk-grid">
            <span v-for="asset in ['MATIC', 'USDT', 'SOL', 'BTC', 'ETH', 'LTC']" :key="asset">{{ asset }}<b>+{{ asset.length * 8.17 }}</b></span>
          </div>
        </article>
        <div class="paytech-copy side">
          <h2>A consistent desktop experience: from sign-up to your first trade.</h2>
        </div>
      </div>

      <div class="paytech-row bottom">
        <div class="paytech-copy">
          <h2>Visualized price movements for confident trading decisions.</h2>
        </div>
        <article class="wallet-screen">
          <strong>Wallet Value</strong>
          <h3>$26,029.74</h3>
          <div class="mini-stats">
            <span>Realized PL<br><b>+$128,429.00</b></span>
            <span>Unrealized PL<br><b>-$35,021.10</b></span>
            <span>Net Change<br><b>+$4,821.00</b></span>
          </div>
          <BarChart
            :data="bentoMonths"
            :categories="redPriceCategories"
            :y-axis="priceVolumeYAxis"
            x-axis="month"
            :height="220"
            :radius="0"
            hide-x-axis
            hide-y-axis
            hide-legend
            hide-tooltip
            :x-grid-line="false"
            :y-grid-line="false"
            :duration="0"
          />
        </article>
      </div>
    </section>

    <section class="study study-midday">
      <div class="midday-grid">
        <article class="mid-card profit">
          <small>Profit</small>
          <p>Your average profit during 6 months is <b>$1,450.50</b></p>
          <BarChart
            :data="bentoMonths.slice(0, 6)"
            :categories="monochromeCategories"
            :y-axis="monochromeYAxis"
            x-axis="month"
            :height="96"
            :radius="0"
            hide-x-axis
            hide-y-axis
            hide-legend
            hide-tooltip
            :x-grid-line="false"
            :y-grid-line="false"
            :duration="0"
          />
        </article>

        <article class="mid-card invoice">
          <header>
            <strong>Lost island AB</strong>
            <span>Unpaid</span>
          </header>
          <h2>$23,750.00</h2>
          <p>VAT $2,356.00</p>
          <dl>
            <dt>Due date</dt><dd>Mar 19, 2024</dd>
            <dt>Issue date</dt><dd>Mar 19, 2024</dd>
            <dt>Invoice no.</dt><dd>INV-001</dd>
          </dl>
          <label>https://go.midday.ai/54h</label>
        </article>

        <article class="mid-card month-summary">
          <div class="search-row">Search or filter <button>+</button></div>
          <div class="week-row"><span>Mon 29</span><span>Tue 30</span><strong>Wed 1</strong></div>
          <h2>244h</h2>
          <p>EUR25,500 this month</p>
          <div class="prompt-box">
            <span>I want to send an invoice</span>
            <span>I want to create an invoice tag</span>
            <span>I want to find a transaction</span>
            <span>I want to create a budget</span>
          </div>
        </article>

        <article class="mid-card assistant-note">
          <strong>Assistant is adding vat number</strong>
          <span>2/6</span>
          <small>Thinking</small>
        </article>

        <article class="mid-card score">
          <h3>Good</h3>
          <p>Payment score</p>
          <div class="score-ticks"><span v-for="index in 10" :key="index" :class="{ dim: index < 3 }" /></div>
        </article>

        <article class="mid-card calendar-card">
          <header><button>&lt;</button><strong>July 2023</strong><button>&gt;</button></header>
          <div class="calendar-grid">
            <span v-for="day in 35" :key="day" :class="{ selected: day === 18, active: [14, 16, 17, 19, 20, 21, 22].includes(day) }">{{ day }}</span>
          </div>
        </article>

        <article class="mid-card activity">
          <h3>Activity</h3>
          <p v-for="event in ['Created', 'Sent', 'Viewed', 'Reminder sent', 'Paid']" :key="event">
            <span />{{ event }}<time>Apr {{ event.length + 12 }}, 14:22</time>
          </p>
          <label>Item name</label>
        </article>

        <article class="mid-card checklist">
          <small>2 of 6 selected</small>
          <label v-for="item in ['Revenue', 'Burnrate & runway', 'Expenses', 'Invoices', 'Bank balance', 'VAT']" :key="item" :class="{ checked: ['Bank balance', 'VAT'].includes(item) }">
            <span />{{ item }}
          </label>
          <nav>
            <button>Revenue</button>
            <button>Misc</button>
            <button>Transaction</button>
          </nav>
        </article>

        <article class="mid-card inbox-form">
          <h3>Inbox <span /></h3>
          <p>Receive notifications about new items in your inbox.</p>
          <label>Acme inc</label>
          <label>john.doe@acme.com</label>
          <label>Search</label>
          <strong>Total account balance is $24,356 in two different currencies</strong>
        </article>

        <article class="mid-card missing-components">
          <header>
            <small>Package gaps found while rebuilding sources</small>
            <strong>Missing data-vis components to create later</strong>
          </header>
          <div v-for="item in missingDataVis" :key="item.title" class="missing-row">
            <span>{{ item.priority }}</span>
            <div>
              <strong>{{ item.title }}</strong>
              <p>{{ item.evidence }}</p>
              <small>{{ item.currentWorkaround }}</small>
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.bento-page {
  min-height: 100vh;
  background: #f6f2eb;
  color: #171717;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.intro,
.study {
  width: 100%;
}

.intro {
  padding: 34px max(28px, calc((100vw - 1180px) / 2)) 72px;
  background:
    radial-gradient(circle at 8% 12%, rgba(223, 255, 63, 0.42), transparent 25%),
    radial-gradient(circle at 88% 18%, rgba(144, 85, 255, 0.28), transparent 31%),
    #fbf7ef;
}

.intro-nav,
.givingli-top,
.loud-nav,
.roadmap-head,
.meeting-head,
.paytech-row,
.mid-card header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-mark,
.givingli-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 750;
}

.brand-mark span,
.givingli-logo span {
  width: 22px;
  height: 22px;
  border: 2px solid currentColor;
  border-radius: 50%;
}

.back-link,
.givingli-top button {
  border: 0;
  border-radius: 999px;
  background: #181818;
  color: #fff;
  padding: 13px 24px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 760;
}

.intro-grid {
  display: grid;
  grid-template-columns: minmax(300px, 0.92fr) minmax(520px, 1.08fr);
  gap: 34px;
  margin-top: 86px;
  align-items: end;
}

.intro-copy h1 {
  max-width: 760px;
  margin: 0;
  font-size: clamp(48px, 8vw, 104px);
  line-height: 0.88;
  letter-spacing: 0;
}

.intro-copy p {
  max-width: 600px;
  color: #5e5a53;
  font-size: 17px;
  line-height: 1.55;
}

.eyebrow,
.study-copy span,
.mid-card small {
  color: #79746c;
  font-size: 12px;
  font-weight: 760;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.source-audit {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.audit-row {
  min-height: 162px;
  border: 1px solid rgba(22, 22, 22, 0.1);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.72);
  padding: 18px;
  box-shadow: 0 18px 50px rgba(45, 35, 20, 0.07);
}

.audit-row span {
  color: #7d786e;
  font-size: 12px;
}

.audit-row strong {
  display: block;
  margin-top: 22px;
  font-size: 18px;
}

.audit-row p {
  margin: 8px 0 0;
  color: #625e56;
  font-size: 13px;
  line-height: 1.45;
}

.study {
  padding: 72px max(22px, calc((100vw - 1180px) / 2));
}

.study-copy {
  margin-bottom: 28px;
}

.study-copy h2 {
  max-width: 680px;
  margin: 8px 0 0;
  font-size: clamp(36px, 5vw, 68px);
  line-height: 0.94;
}

.study-copy p {
  max-width: 560px;
  color: #68645d;
  line-height: 1.5;
}

.study-frost {
  display: grid;
  grid-template-columns: 0.78fr 1.22fr;
  gap: 42px;
  align-items: center;
  background: #f8f7fb;
}

.frost-stage {
  position: relative;
  min-height: 478px;
  border-radius: 38px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.5)),
    radial-gradient(circle at 50% 42%, rgba(117, 87, 246, 0.12), transparent 34%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 26px 90px rgba(51, 45, 82, 0.08);
}

.employee-strip,
.attendance-card,
.processing-chip {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.employee-strip {
  top: 56px;
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  width: min(520px, calc(100% - 64px));
  border: 1px solid rgba(95, 88, 118, 0.13);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  padding: 12px 14px;
  box-shadow: 0 18px 42px rgba(90, 79, 129, 0.12);
}

.avatar {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fff, #dfff3f);
  color: #151515;
  font-size: 13px;
  font-weight: 800;
}

.avatar-photo {
  background:
    radial-gradient(circle at 50% 32%, #ffd6c8 0 18%, transparent 19%),
    radial-gradient(circle at 52% 56%, #363138 0 33%, transparent 34%),
    linear-gradient(135deg, #a3b9bb, #eee7da);
  color: transparent;
}

.employee-strip strong,
.employee-strip small,
.employee-strip em {
  display: block;
}

.employee-strip small {
  color: #9a96a3;
  font-size: 12px;
}

.employee-strip em {
  border: 1px solid #eadb95;
  border-radius: 8px;
  color: #d6ab33;
  padding: 6px 10px;
  font-size: 12px;
  font-style: normal;
  font-weight: 760;
}

.processing-chip {
  top: 156px;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  border-radius: 12px;
  background: #7557f6;
  color: #fff;
  padding: 15px 30px;
  font-weight: 800;
  box-shadow: 0 10px 18px rgba(94, 67, 218, 0.36);
}

.processing-chip span {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.45);
  border-top-color: #fff;
  border-radius: 50%;
}

.connector {
  position: absolute;
  top: 207px;
  left: 50%;
  width: 2px;
  height: 28px;
  background: #7557f6;
}

.connector::after {
  position: absolute;
  bottom: -4px;
  left: -4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #7557f6;
  content: "";
}

.attendance-card {
  top: 238px;
  width: min(430px, calc(100% - 96px));
  border: 1px solid rgba(95, 88, 118, 0.12);
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.86);
  padding: 19px 22px 20px;
  box-shadow: 0 20px 45px rgba(90, 79, 129, 0.1);
}

.card-dots {
  position: absolute;
  inset: 8px;
  pointer-events: none;
}

.card-dots span {
  position: absolute;
  width: 6px;
  height: 6px;
  border: 1px solid #dedbe9;
  border-radius: 50%;
}

.card-dots span:nth-child(1) { left: 0; top: 0; }
.card-dots span:nth-child(2) { right: 0; top: 0; }
.card-dots span:nth-child(3) { right: 0; bottom: 0; }
.card-dots span:nth-child(4) { left: 0; bottom: 0; }

.tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-radius: 6px;
  background: #f6f4f8;
  padding: 3px;
}

.tabs button,
.loud-nav button,
.date-pills span,
.paytech-row button,
.mid-card button {
  border: 0;
  font: inherit;
}

.tabs button {
  border-radius: 5px;
  background: transparent;
  padding: 8px 12px;
  color: #8b8794;
  font-size: 12px;
  font-weight: 780;
}

.tabs button:first-child {
  background: #fff;
  color: #28242d;
  box-shadow: 0 4px 12px rgba(70, 62, 92, 0.08);
}

.attendance-metric {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 17px 0 12px;
}

.attendance-metric strong {
  font-size: 35px;
  line-height: 1;
}

.attendance-metric span {
  color: #7bcdb5;
  font-size: 13px;
  font-weight: 750;
}

.attendance-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 13px;
  color: #8f8b98;
  font-size: 12px;
  font-weight: 700;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 6px;
  border-radius: 50%;
}

.dot.sick { background: #f5d76a; }
.dot.off { background: #6fd7f5; }
.dot.ontime { background: #7557f6; }

.study-givingli {
  background: #fbf7ec;
}

.givingli-top {
  margin-bottom: 58px;
}

.givingli-grid {
  display: grid;
  grid-template-columns: 1.34fr 1fr 1fr;
  grid-auto-rows: 215px;
  gap: 24px;
  max-width: 930px;
  margin: 0 auto;
}

.pastel-card {
  position: relative;
  overflow: hidden;
  border-radius: 32px;
  padding: 28px;
}

.pastel-card h2 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 31px;
  line-height: 1;
  color: #1b2632;
}

.pastel-card p {
  margin: 14px 0 0;
  max-width: 260px;
  color: #2b333c;
  font-size: 15px;
  line-height: 1.25;
}

.customization {
  grid-row: span 2;
  background: #bea2ec;
}

.scheduling {
  grid-column: span 2;
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  background: #f75b91;
}

.wallet { background: #cbe38c; }
.inbox { background: #ffdf72; }
.send-gifts {
  grid-column: span 2;
  background: #ff9b68;
}
.reminders { background: #b7d5e2; }

.tilted-stack {
  position: relative;
  height: 170px;
  margin-top: 24px;
}

.photo-card,
.sticker-card {
  position: absolute;
  border-radius: 4px;
  box-shadow: 0 20px 28px rgba(52, 37, 92, 0.18);
}

.photo-card {
  left: 30px;
  top: 8px;
  width: 122px;
  height: 168px;
  transform: rotate(-14deg);
  background: #fff;
  padding: 12px;
}

.photo-card span {
  display: block;
  height: 76px;
  border-radius: 4px;
  background: linear-gradient(160deg, #1c2a35, #9db3b3 60%, #f0e9df);
}

.photo-card strong,
.photo-card small {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}

.sticker-card {
  left: 132px;
  top: 18px;
  display: grid;
  place-items: center;
  width: 126px;
  height: 146px;
  transform: rotate(1deg);
  background: #4f91df;
  color: #ffe064;
  font-size: 25px;
  font-weight: 900;
}

.tool-palette {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 9px;
  margin: 0 -46px 20px 0;
  border-radius: 14px;
  background: #fff;
  padding: 16px 18px;
  box-shadow: 0 16px 34px rgba(62, 45, 98, 0.18);
}

.tool-palette span {
  color: #857b88;
  font-size: 10px;
  text-align: center;
}

.mini-bubble {
  position: absolute;
  right: 8px;
  bottom: 12px;
  width: 160px;
  opacity: 0.6;
}

.calendar-sheet {
  align-self: center;
  justify-self: center;
  width: 186px;
  border-radius: 14px;
  background: #fff;
  padding: 18px 20px;
  transform: rotate(8deg);
  box-shadow: 0 18px 32px rgba(85, 36, 59, 0.18);
}

.calendar-sheet small,
.calendar-sheet strong,
.calendar-sheet span,
.calendar-sheet button {
  display: block;
}

.calendar-sheet strong {
  margin-top: 18px;
  font-size: 17px;
}

.calendar-sheet span {
  margin-top: 4px;
  font-weight: 800;
}

.calendar-sheet button {
  width: 100%;
  margin-top: 18px;
  border: 0;
  border-radius: 999px;
  background: #191919;
  color: #fff;
  padding: 9px;
}

.cash-card {
  width: 210px;
  border-radius: 16px;
  background: #202020;
  color: #fff;
  padding: 18px;
  transform: rotate(-7deg) translateY(-12px);
  box-shadow: 0 18px 24px rgba(63, 79, 43, 0.18);
}

.cash-card strong {
  display: block;
  margin-top: 12px;
  font-size: 27px;
}

.cash-card span {
  float: right;
  margin-top: -23px;
  border-radius: 999px;
  background: #3b3b3b;
  padding: 4px 8px;
  font-size: 10px;
  text-transform: uppercase;
}

.wallet :deep(.recharts-responsive-container) {
  position: absolute;
  right: 8px;
  bottom: 0;
}

.message-list {
  position: absolute;
  right: -8px;
  bottom: 25px;
  width: 214px;
  border-radius: 10px;
  background: #fff;
  padding: 10px;
  box-shadow: 0 12px 24px rgba(116, 91, 25, 0.15);
}

.message-list span {
  display: grid;
  grid-template-columns: 26px 1fr;
  gap: 8px;
  padding: 7px 0;
}

.message-list i {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f1e6ff;
  font-size: 9px;
  font-style: normal;
}

.message-list strong {
  font-size: 10px;
}

.message-list small {
  grid-column: 2;
  color: #7b7b7b;
  font-size: 8px;
}

.gift-cards {
  position: absolute;
  top: 22px;
  right: 22px;
  display: grid;
  grid-template-columns: repeat(3, 116px);
  gap: 12px;
  transform: rotate(-12deg);
}

.gift-cards span {
  display: grid;
  place-items: center;
  height: 62px;
  border-radius: 8px;
  background: #fff;
  color: #111;
  box-shadow: 0 12px 24px rgba(112, 58, 31, 0.18);
  font-weight: 850;
}

.gift-cards span:nth-child(2),
.gift-cards span:nth-child(5) {
  background: #111;
  color: #fff;
}

.send-gifts :deep(.recharts-responsive-container) {
  position: absolute;
  right: 12px;
  bottom: -6px;
  width: 280px !important;
}

.phone-crop {
  position: absolute;
  right: 20px;
  bottom: -54px;
  width: 205px;
  height: 164px;
  border: 9px solid #111;
  border-radius: 28px 28px 0 0;
  background: #dce9e8;
  padding: 50px 14px;
}

.phone-bar {
  position: absolute;
  top: 15px;
  left: 50%;
  width: 70px;
  height: 12px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: #111;
}

.phone-crop span,
.phone-crop small {
  display: block;
  border-radius: 8px;
  background: #fff;
  padding: 8px 10px;
  font-size: 11px;
}

.study-oxelia {
  background: #aab3a8;
}

.oxelia-grid {
  display: grid;
  grid-template-columns: 1.18fr 0.52fr 0.58fr;
  gap: 28px;
  max-width: 980px;
  margin: 0 auto;
}

.lime-project,
.meetings-card,
.roadmap-card,
.date-card,
.time-card,
.assistant-card,
.efficiency-card {
  border-radius: 32px;
}

.lime-project {
  position: relative;
  min-height: 322px;
  background: #dfff3f;
  padding: 28px;
}

.lime-project header {
  display: flex;
  gap: 12px;
  align-items: center;
}

.lime-project h2,
.meetings-card h2,
.roadmap-card h2 {
  margin: 42px 0 4px;
  font-size: 38px;
  line-height: 0.9;
  letter-spacing: 0;
}

.lime-project p,
.meetings-card p {
  margin: 0;
  color: #4b534d;
}

.progress-line {
  margin-top: 30px;
  height: 8px;
  border-radius: 999px;
  background: #fff;
}

.progress-line span {
  display: block;
  width: 34%;
  height: 100%;
  border-radius: inherit;
  background: #000;
}

.select-report {
  display: flex;
  justify-content: space-between;
  width: 260px;
  margin-top: 28px;
  border: 1px solid rgba(0, 0, 0, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  padding: 13px 18px;
}

.project-radial {
  position: absolute;
  right: 10px;
  bottom: 6px;
  width: 150px;
}

.meetings-card,
.roadmap-card,
.date-card,
.assistant-card {
  background: #f0f1ed;
}

.meetings-card {
  grid-column: span 2;
  padding: 28px;
}

.meeting-head h2 {
  margin: 0;
}

.meeting-head button,
.roadmap-head button,
.date-pills span {
  border-radius: 999px;
  background: #fff;
  padding: 15px 23px;
}

.date-pills {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin: 44px 0 20px;
}

.date-pills span {
  display: grid;
  place-items: center;
  min-height: 84px;
  white-space: pre-line;
  text-align: center;
}

.date-pills .active {
  background: #dfff3f;
}

.roadmap-card {
  min-height: 286px;
  padding: 28px;
}

.roadmap-head h2 {
  margin: 0;
}

.roadmap-head button {
  background: #000;
  color: #fff;
}

.roadmap-chart {
  position: relative;
  height: 132px;
  margin-top: 32px;
}

.roadmap-grid {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(90deg, transparent 0 19.5%, rgba(0, 0, 0, 0.12) 19.5% 20%);
}

.roadmap-bar {
  position: absolute;
  display: flex;
  justify-content: space-between;
  height: 43px;
  border-radius: 999px;
  padding: 13px 16px;
  font-size: 13px;
  font-weight: 760;
}

.roadmap-bar:nth-of-type(2) { top: 0; }
.roadmap-bar:nth-of-type(3) { top: 52px; }
.roadmap-bar:nth-of-type(4) { top: 92px; }
.roadmap-bar.sage { background: #9aa596; color: #fff; }
.roadmap-bar.lime { background: #dfff3f; }
.roadmap-bar.pale { background: #e9ece7; }

.milestone {
  position: absolute;
  top: -8px;
  bottom: -8px;
  left: 72%;
  width: 3px;
  background: #000;
}

.milestone::before {
  position: absolute;
  top: -8px;
  left: -5px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #fff;
  box-shadow: inset 0 0 0 3px #000;
  content: "";
}

.roadmap-days {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.oxelia-side {
  display: grid;
  gap: 22px;
}

.date-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
}

.date-card strong {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #000;
  color: #fff;
  font-size: 34px;
}

.date-card span {
  font-size: 18px;
  line-height: 1.05;
}

.efficiency-card {
  overflow: hidden;
  min-height: 222px;
  background: #050505;
  color: #fff;
  padding: 22px;
}

.efficiency-card h3 {
  margin: 0;
  font-size: 22px;
}

.efficiency-card small,
.efficiency-card em {
  display: block;
}

.efficiency-card small {
  color: #c3c3bf;
}

.efficiency-card em {
  width: max-content;
  margin: 28px auto -2px;
  border-radius: 999px;
  background: #fff;
  color: #000;
  padding: 8px 12px;
  font-style: normal;
  font-weight: 800;
}

.time-card {
  min-height: 152px;
  background: #8f998d;
  color: #fff;
  padding: 25px;
}

.time-card span {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #fff;
  color: #111;
  font-size: 11px;
}

.time-card strong {
  display: block;
  margin-top: 36px;
  font-size: 42px;
  font-weight: 500;
}

.assistant-card {
  grid-column: 3;
  display: grid;
  grid-template-columns: 92px 1fr;
  align-items: center;
  min-height: 160px;
  padding: 20px;
}

.assistant-card span {
  font-size: 20px;
  line-height: 0.95;
  font-weight: 860;
}

.study-loud {
  background:
    radial-gradient(circle at 10% 0%, #d7ff56, transparent 26%),
    radial-gradient(circle at 100% 0%, #8b48ff, transparent 34%),
    linear-gradient(145deg, #6d35ff, #733cff 55%, #8a50ff);
  padding-top: 92px;
  padding-bottom: 92px;
}

.loud-shell {
  max-width: 1040px;
  margin: 0 auto;
  border-radius: 18px;
  background: #050506;
  color: #fff;
  padding: 20px;
  box-shadow: 0 44px 90px rgba(25, 7, 58, 0.32);
}

.loud-nav strong,
.loud-nav div,
.loud-hero,
.loud-cards {
  display: flex;
}

.loud-nav strong {
  align-items: center;
  gap: 10px;
}

.loud-nav strong span {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fff, #7445ff);
}

.loud-nav div {
  gap: 8px;
}

.loud-nav button {
  border-radius: 999px;
  background: #1a1a1d;
  color: #a8a8ad;
  padding: 10px 18px;
  font-size: 12px;
}

.loud-nav button.active {
  background: #fff;
  color: #050505;
}

.loud-nav em {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #ffe1cc;
  color: #4d2418;
  font-style: normal;
  font-weight: 800;
}

.loud-hero {
  gap: 28px;
  min-height: 235px;
  padding: 44px 0 18px;
}

.loud-hero > div:first-child {
  flex: 0 0 330px;
}

.loud-hero h2 {
  margin: 0 0 28px;
  font-size: 31px;
  font-weight: 420;
}

.loud-hero h2 span {
  color: #aaaab1;
}

.loud-hero small,
.loud-hero p {
  color: #a0a0a7;
}

.loud-hero strong {
  display: block;
  margin: 8px 0;
  font-size: 34px;
}

.loud-hero button {
  border: 0;
  border-radius: 999px;
  background: #fff;
  color: #000;
  padding: 10px 16px;
  font-weight: 760;
}

.combo-panel {
  position: relative;
  flex: 1;
  min-width: 0;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
  padding-left: 28px;
}

.combo-line,
.red-line {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.loud-cards {
  gap: 12px;
}

.dark-card {
  flex: 1;
  min-height: 250px;
  border-radius: 14px;
  background: #1a1a1d;
  padding: 18px;
}

.dark-card h3 {
  margin: 0 0 16px;
  font-size: 15px;
}

.heatmap {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  margin-top: 30px;
}

.heatmap span {
  aspect-ratio: 1;
  border-radius: 6px;
  background: #24183d;
}

.heatmap .heat-1 { background: #392160; }
.heatmap .heat-2 { background: #563096; }
.heatmap .heat-3 { background: #7a45ee; }
.heatmap .heat-4 { background: #b794ff; }

.heatmap-card small {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  margin-top: 14px;
  color: #9f9fa4;
  font-size: 10px;
}

.heatmap-card i {
  width: 10px;
  height: 7px;
  border-radius: 2px;
  background: #7a45ee;
}

.transaction-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 10px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  font-size: 12px;
}

.transaction-row em {
  border-radius: 999px;
  background: #2b2b30;
  color: #bdbdc4;
  padding: 5px 9px;
  font-style: normal;
}

.study-paytech {
  overflow: hidden;
  border: 10px solid #f8f5ee;
  border-radius: 34px;
  background:
    radial-gradient(circle at 54% 19%, rgba(196, 54, 52, 0.44), transparent 38%),
    linear-gradient(135deg, #141414, #5d1b1b 48%, #151515);
  color: #fff;
}

.paytech-row {
  gap: 28px;
  margin-bottom: 88px;
}

.paytech-row.top {
  align-items: flex-end;
}

.paytech-copy {
  flex: 1;
}

.paytech-copy h2 {
  max-width: 390px;
  margin: 0;
  font-size: clamp(34px, 4.6vw, 56px);
  line-height: 0.92;
  font-weight: 500;
}

.paytech-copy small {
  display: block;
  margin-bottom: 300px;
}

.red-screen,
.signup-screen,
.swap-screen,
.risk-screen,
.wallet-screen {
  border-radius: 20px;
}

.red-screen {
  position: relative;
  overflow: hidden;
  flex: 0 0 360px;
  height: 470px;
  background: #db3030;
  padding: 26px;
}

.red-screen h3 {
  position: absolute;
  left: 30px;
  right: 30px;
  bottom: 28px;
  margin: 0;
  font-size: 29px;
  line-height: 0.92;
}

.red-line {
  top: 96px;
  height: 250px;
}

.signup-screen {
  flex: 0 0 360px;
  background: #050505;
  padding: 76px 46px 42px;
}

.signup-screen h3,
.swap-screen h3,
.risk-screen h3,
.wallet-screen h3 {
  margin: 0;
  font-size: 32px;
}

.signup-screen p {
  color: #a09a98;
  font-size: 12px;
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.signup-screen label,
.mid-card label {
  display: block;
  border: 1px solid #242424;
  background: #151515;
  color: #979797;
  padding: 12px;
}

.signup-screen label {
  margin-top: 12px;
  border-radius: 4px;
  font-size: 12px;
}

.signup-screen .invalid {
  border-color: #b72b2f;
  color: #db3030;
}

.signup-screen button,
.swap-screen button {
  width: 100%;
  margin-top: 22px;
  border-radius: 6px;
  background: #db3030;
  color: #fff;
  padding: 14px;
}

.paytech-row.middle {
  align-items: center;
}

.swap-screen {
  flex: 0 0 470px;
  background: #101111;
  padding: 30px;
}

.swap-box {
  margin-top: 18px;
  border-radius: 8px;
  background: #050505;
  padding: 24px;
}

.swap-box span,
.swap-box strong {
  display: block;
}

.swap-box strong {
  margin-top: 18px;
  font-size: 42px;
  font-weight: 450;
}

.risk-screen {
  flex: 0 0 244px;
  background: #050505;
  padding: 24px;
}

.risk-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 16px;
}

.risk-grid span {
  min-height: 72px;
  border-radius: 10px;
  background: #191919;
  padding: 11px;
  font-size: 11px;
}

.risk-grid b {
  display: block;
  margin-top: 18px;
  color: #fff;
}

.paytech-copy.side {
  flex: 1;
}

.paytech-row.bottom {
  align-items: flex-end;
  margin-bottom: 0;
}

.wallet-screen {
  flex: 0 0 560px;
  overflow: hidden;
  background: #db3030;
  padding: 30px;
}

.wallet-screen h3 {
  margin-top: 8px;
  font-size: 38px;
  font-weight: 420;
}

.mini-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 18px 0;
}

.mini-stats span {
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  padding: 14px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
}

.mini-stats b {
  display: block;
  margin-top: 8px;
  color: #fff;
}

.study-midday {
  background: #080808;
  color: #f4f4f1;
}

.midday-grid {
  display: grid;
  grid-template-columns: 0.95fr 0.95fr 0.95fr 0.9fr;
  gap: 18px;
}

.mid-card {
  min-height: 118px;
  border: 1px solid #202020;
  background: #0b0b0b;
  padding: 18px;
  color: #f2f2ef;
}

.mid-card h2,
.mid-card h3,
.mid-card p {
  margin: 0;
}

.mid-card p,
.mid-card dd,
.mid-card label,
.mid-card small {
  color: #777;
}

.profit p {
  margin-top: 16px;
  line-height: 1.45;
}

.invoice {
  grid-row: span 2;
}

.invoice h2,
.month-summary h2 {
  margin-top: 28px;
  font-size: 36px;
  font-weight: 380;
}

.invoice span {
  border: 1px solid #333;
  border-radius: 999px;
  color: #858585;
  padding: 4px 10px;
  font-size: 12px;
}

.invoice dl {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 14px;
  margin-top: 34px;
  padding-top: 22px;
  border-top: 1px solid #1d1d1d;
}

.invoice dd {
  margin: 0;
  color: #e2e2de;
}

.invoice label {
  margin-top: 26px;
}

.month-summary {
  grid-row: span 2;
}

.search-row {
  display: flex;
  justify-content: space-between;
  border: 1px solid #202020;
  padding: 10px;
  color: #575757;
}

.week-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 20px;
  border: 1px solid #202020;
}

.week-row span,
.week-row strong {
  min-height: 84px;
  padding: 14px;
  border-right: 1px solid #202020;
}

.week-row strong {
  background: repeating-linear-gradient(-45deg, #0d0d0d 0 4px, #171717 4px 7px);
}

.prompt-box {
  display: grid;
  gap: 15px;
  margin-top: 34px;
  background: #111;
  padding: 18px;
  color: #d8d8d3;
}

.assistant-note {
  min-height: 72px;
}

.assistant-note span {
  float: right;
  color: #6b6b6b;
}

.assistant-note small {
  display: block;
  margin-top: 12px;
  text-transform: none;
}

.score {
  position: relative;
}

.score-ticks {
  position: absolute;
  right: 18px;
  top: 24px;
  display: flex;
  gap: 6px;
}

.score-ticks span {
  width: 6px;
  height: 28px;
  background: #fff;
}

.score-ticks span.dim {
  background: #2e2e2e;
}

.calendar-card {
  grid-row: span 2;
}

.calendar-card header button {
  background: #111;
  color: #fff;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-top: 20px;
}

.calendar-grid span {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  color: #4d4d4d;
  font-size: 13px;
}

.calendar-grid .active {
  color: #f0f0ed;
}

.calendar-grid .selected {
  background: #f0f0ed;
  color: #080808;
}

.activity {
  grid-row: span 2;
}

.activity h3 {
  margin-bottom: 16px;
}

.activity p {
  display: grid;
  grid-template-columns: 10px 1fr auto;
  gap: 10px;
  padding: 8px 0;
  color: #d6d6d3;
}

.activity p span {
  width: 7px;
  height: 7px;
  margin-top: 5px;
  border-radius: 50%;
  background: #777;
}

.activity time {
  color: #696969;
  font-size: 12px;
}

.activity label {
  height: 82px;
  margin-top: 28px;
}

.checklist {
  grid-row: span 2;
}

.checklist label {
  display: flex;
  gap: 10px;
  align-items: center;
  border: 0;
  border-bottom: 1px solid #181818;
  background: transparent;
  color: #e8e8e4;
}

.checklist label span {
  width: 15px;
  height: 15px;
  border: 1px solid #333;
}

.checklist label.checked span {
  background: #f0f0ed;
  box-shadow: inset 0 0 0 3px #0b0b0b;
}

.checklist nav {
  display: flex;
  gap: 8px;
  margin-top: 22px;
}

.checklist button {
  border: 1px solid #222;
  background: #101010;
  color: #f0f0ed;
  padding: 10px 12px;
}

.inbox-form {
  grid-row: span 2;
}

.inbox-form h3 span {
  float: right;
  width: 36px;
  height: 18px;
  background: linear-gradient(90deg, #fff 0 50%, #111 50%);
  border: 1px solid #fff;
}

.inbox-form p {
  margin: 12px 0 22px;
}

.inbox-form label {
  margin-top: 14px;
}

.inbox-form strong {
  display: block;
  margin-top: 24px;
  color: #bdbdb8;
  font-weight: 440;
}

.missing-components {
  grid-column: span 4;
}

.missing-components header {
  align-items: flex-start;
}

.missing-components header strong {
  max-width: 420px;
  font-size: 27px;
  line-height: 1;
}

.missing-row {
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 18px;
  padding: 18px 0;
  border-top: 1px solid #202020;
}

.missing-row:first-of-type {
  margin-top: 24px;
}

.missing-row span {
  width: max-content;
  height: max-content;
  border: 1px solid #333;
  color: #f0f0ed;
  padding: 5px 8px;
  font-size: 12px;
}

.missing-row strong {
  display: block;
  margin-bottom: 6px;
}

.missing-row p {
  max-width: 760px;
  margin-bottom: 6px;
  color: #aaa;
}

.missing-row small {
  color: #666;
  text-transform: none;
  letter-spacing: 0;
}

@media (max-width: 980px) {
  .intro-grid,
  .study-frost,
  .oxelia-grid,
  .paytech-row {
    grid-template-columns: 1fr;
  }

  .source-audit,
  .givingli-grid,
  .midday-grid {
    grid-template-columns: 1fr 1fr;
  }

  .givingli-grid {
    grid-auto-rows: minmax(220px, auto);
  }

  .customization,
  .scheduling,
  .send-gifts,
  .meetings-card,
  .assistant-card,
  .missing-components {
    grid-column: span 2;
  }

  .assistant-card {
    grid-column: auto / span 2;
  }

  .loud-hero,
  .loud-cards {
    flex-direction: column;
  }

  .paytech-row {
    display: grid;
  }

  .red-screen,
  .signup-screen,
  .swap-screen,
  .risk-screen,
  .wallet-screen {
    flex: auto;
  }
}

@media (max-width: 640px) {
  .intro,
  .study {
    padding-left: 16px;
    padding-right: 16px;
  }

  .intro-nav,
  .givingli-top {
    align-items: flex-start;
    gap: 14px;
    flex-direction: column;
  }

  .source-audit,
  .givingli-grid,
  .midday-grid {
    grid-template-columns: 1fr;
  }

  .customization,
  .scheduling,
  .send-gifts,
  .meetings-card,
  .assistant-card,
  .missing-components {
    grid-column: auto;
  }

  .scheduling,
  .assistant-card {
    grid-template-columns: 1fr;
  }

  .frost-stage {
    min-height: 430px;
  }

  .employee-strip,
  .attendance-card {
    width: calc(100% - 32px);
  }

  .gift-cards,
  .send-gifts :deep(.recharts-responsive-container),
  .mini-bubble {
    display: none;
  }

  .date-pills {
    grid-template-columns: repeat(3, 1fr);
  }

  .loud-nav {
    gap: 16px;
    align-items: flex-start;
    flex-direction: column;
  }

  .loud-nav div {
    flex-wrap: wrap;
  }

  .mini-stats,
  .field-grid {
    grid-template-columns: 1fr;
  }

  .paytech-copy small {
    margin-bottom: 80px;
  }

  .missing-row {
    grid-template-columns: 1fr;
  }
}
</style>
