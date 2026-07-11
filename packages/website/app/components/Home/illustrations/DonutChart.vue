<template>
  <svg
    viewBox="0 0 280 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto w-full max-w-[400px] text-muted"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="donut-seg-a" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="currentColor" stop-opacity="0.9" />
        <stop offset="1" stop-color="currentColor" stop-opacity="0.55" />
      </linearGradient>
    </defs>

    <!-- angle ticks, every 30deg (r 71 -> 76) -->
    <path
      d="M175.5 38.5 L178 34.2 M201.5 64.5 L205.8 62 M201.5 135.5 L205.8 138 M175.5 161.5 L178 165.8 M104.5 161.5 L102 165.8 M78.5 135.5 L74.2 138 M78.5 64.5 L74.2 62 M104.5 38.5 L102 34.2"
      stroke="currentColor"
      stroke-width="0.5"
      opacity="0.15"
    />

    <!-- quadrant ticks, longer (r 69 -> 78) -->
    <path
      d="M140 31 V22 M209 100 H218 M140 169 V178 M71 100 H62"
      stroke="currentColor"
      stroke-width="0.5"
      opacity="0.3"
    />

    <!-- track -->
    <circle
      cx="140"
      cy="100"
      r="58"
      stroke="currentColor"
      stroke-width="20"
      opacity="0.08"
    />

    <!--
      C = 2*PI*58 = 364.424. gap = 3, four gaps = 12. arc budget = 352.424.
      seg1 38% -> 133.92  seg2 27% -> 95.15  seg3 20% -> 70.48  seg4 15% -> 52.86
      cumulative offsets (dash + 3 gap each): 0, -136.92, -235.07, -308.55
    -->
    <g transform="rotate(-90 140 100)">
      <!-- highlight segment (primary, 38%) -->
      <circle
        cx="140"
        cy="100"
        r="58"
        stroke="url(#donut-seg-a)"
        stroke-width="20"
        stroke-linecap="butt"
        stroke-dasharray="133.92 230.5"
        stroke-dashoffset="0"
        class="text-default"
      />
      <!-- segment 2 (27%) -->
      <circle
        cx="140"
        cy="100"
        r="58"
        stroke="currentColor"
        stroke-width="20"
        stroke-linecap="butt"
        stroke-dasharray="95.15 269.27"
        stroke-dashoffset="-136.92"
        opacity="0.55"
      />
      <!-- segment 3 (20%) -->
      <circle
        cx="140"
        cy="100"
        r="58"
        stroke="currentColor"
        stroke-width="20"
        stroke-linecap="butt"
        stroke-dasharray="70.48 293.94"
        stroke-dashoffset="-235.07"
        opacity="0.4"
      />
      <!-- segment 4 (15%) -->
      <circle
        cx="140"
        cy="100"
        r="58"
        stroke="currentColor"
        stroke-width="20"
        stroke-linecap="butt"
        stroke-dasharray="52.86 311.56"
        stroke-dashoffset="-308.55"
        opacity="0.28"
      />
    </g>

    <!-- inner ring detail (construction circle) -->
    <circle
      cx="140"
      cy="100"
      r="43"
      stroke="currentColor"
      stroke-width="0.5"
      stroke-dasharray="2 3"
      opacity="0.2"
    />

    <!-- radius dimension (blueprint measure, 135deg, r44 -> r74) -->
    <path
      d="M108.9 131.1 L87.7 152.3 M103.96 131.84 L108.16 136.04 M89.82 145.98 L94.02 150.18"
      stroke="currentColor"
      stroke-width="0.5"
      stroke-dasharray="2 2"
      opacity="0.25"
    />

    <!-- center label -->
    <text
      x="140"
      y="98"
      text-anchor="middle"
      dominant-baseline="middle"
      font-size="19"
      font-weight="600"
      letter-spacing="-0.5"
      fill="currentColor"
      class="text-default"
    >38%</text>
    <text
      x="140"
      y="113"
      text-anchor="middle"
      dominant-baseline="middle"
      font-size="7.5"
      letter-spacing="1.5"
      fill="currentColor"
      opacity="0.45"
    >TOTAL</text>

    <!-- highlight annotations (accent) -->
    <g class="text-primary">
      <!-- bracket arc spanning highlight segment (r 74, 0 -> 132.3deg) -->
      <path
        d="M140 26 A74 74 0 0 1 194.7 149.8"
        stroke="currentColor"
        stroke-width="0.5"
        stroke-dasharray="2 3"
        opacity="0.4"
      />
      <!-- leader: dot on segment mid (66deg) + radial line to chip -->
      <circle cx="193" cy="76.6" r="2" fill="currentColor" />
      <path
        d="M203 72.5 L214 63"
        stroke="currentColor"
        stroke-width="0.5"
        opacity="0.45"
        stroke-linecap="round"
      />

      <!-- value chip -->
      <rect
        x="208"
        y="48"
        width="26"
        height="12"
        rx="2"
        stroke="currentColor"
        stroke-width="0.5"
        opacity="0.45"
      />
      <text
        x="221"
        y="56.5"
        text-anchor="middle"
        class="font-mono"
        font-size="6"
        fill="currentColor"
        opacity="0.9"
      >142</text>
    </g>
  </svg>
</template>
