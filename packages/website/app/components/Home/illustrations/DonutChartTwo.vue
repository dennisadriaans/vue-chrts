<template>
  <svg
    viewBox="0 0 280 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto w-full max-w-[400px] text-muted"
    aria-hidden="true"
  >
    <!-- card frame -->
    <rect
      x="6"
      y="4"
      width="268"
      height="192"
      rx="12"
      fill="var(--ui-bg)"
      stroke="var(--ui-border)"
      stroke-width="1.5"
    />

    <!-- header skeletons -->
    <rect x="24" y="20" width="70" height="8" rx="2" fill="var(--ui-bg)" stroke="var(--ui-border)" stroke-width="1" />
    <rect x="24" y="34" width="118" height="8" rx="2" fill="var(--ui-bg)" stroke="var(--ui-border)" stroke-width="1" />

    <!-- legend -->
    <rect x="188" y="21" width="6" height="6" fill="currentColor" class="text-primary" />
    <rect x="200" y="21" width="50" height="6" rx="1.5" fill="var(--ui-bg)" stroke="var(--ui-border)" stroke-width="1" />
    <rect x="188" y="33" width="6" height="6" fill="currentColor" opacity="0.25" />
    <rect x="200" y="33" width="36" height="6" rx="1.5" fill="var(--ui-bg)" stroke="var(--ui-border)" stroke-width="1" />

    <!-- angle ticks, every 45deg (r 52 -> 57) -->
    <path
      d="M176.8 81.2 L180.3 77.7 M176.8 154.8 L180.3 158.3 M103.2 154.8 L99.7 158.3 M103.2 81.2 L99.7 77.7"
      stroke="currentColor"
      stroke-width="0.5"
      opacity="0.15"
    />

    <!-- quadrant ticks, longer -->
    <path
      d="M140 66 V60 M192 118 H198 M140 170 V176 M88 118 H82"
      stroke="currentColor"
      stroke-width="0.5"
      opacity="0.3"
    />

    <!-- track -->
    <circle
      cx="140"
      cy="118"
      r="40"
      stroke="currentColor"
      stroke-width="16"
      opacity="0.08"
    />

    <!--
      C = 2*PI*40 = 251.33. gap = 3, four gaps = 12. arc budget = 239.33.
      seg1 38% -> 90.95  seg2 27% -> 64.62  seg3 20% -> 47.87  seg4 15% -> 35.9
      cumulative offsets (dash + 3 gap each): 0, -93.95, -161.57, -212.44
    -->
    <g transform="rotate(-90 140 118)">
      <!-- highlight segment (primary, 38%) -->
      <circle
        cx="140"
        cy="118"
        r="40"
        stroke="currentColor"
        stroke-width="16"
        stroke-linecap="butt"
        stroke-dasharray="90.95 160.38"
        stroke-dashoffset="0"
        class="text-primary"
      />
      <!-- segment 2 (27%) -->
      <circle
        cx="140"
        cy="118"
        r="40"
        stroke="currentColor"
        stroke-width="16"
        stroke-linecap="butt"
        stroke-dasharray="64.62 186.71"
        stroke-dashoffset="-93.95"
        opacity="0.45"
      />
      <!-- segment 3 (20%) -->
      <circle
        cx="140"
        cy="118"
        r="40"
        stroke="currentColor"
        stroke-width="16"
        stroke-linecap="butt"
        stroke-dasharray="47.87 203.46"
        stroke-dashoffset="-161.57"
        opacity="0.3"
      />
      <!-- segment 4 (15%) -->
      <circle
        cx="140"
        cy="118"
        r="40"
        stroke="currentColor"
        stroke-width="16"
        stroke-linecap="butt"
        stroke-dasharray="35.9 215.43"
        stroke-dashoffset="-212.44"
        opacity="0.18"
      />
    </g>

    <!-- inner ring detail (construction circle) -->
    <circle
      cx="140"
      cy="118"
      r="29"
      stroke="currentColor"
      stroke-width="0.5"
      stroke-dasharray="2 3"
      opacity="0.2"
    />

    <!-- center label -->
    <text
      x="140"
      y="116"
      text-anchor="middle"
      dominant-baseline="middle"
      font-size="13"
      font-weight="600"
      letter-spacing="-0.5"
      fill="currentColor"
      class="text-default"
    >38%</text>
    <text
      x="140"
      y="128"
      text-anchor="middle"
      dominant-baseline="middle"
      font-size="6"
      letter-spacing="1.5"
      fill="currentColor"
      opacity="0.45"
    >TOTAL</text>

    <!-- highlight annotations (accent) -->
    <g class="text-primary">
      <!-- bracket arc spanning highlight segment (r 52, 0 -> 132deg) -->
      <path
        d="M140 66 A52 52 0 0 1 178.6 152.8"
        stroke="currentColor"
        stroke-width="0.5"
        stroke-dasharray="2 3"
        opacity="0.4"
      />
      <!-- leader: dot on segment mid + line to chip -->
      <circle cx="177" cy="103" r="2" fill="currentColor" />
      <path
        d="M186 96 L196 88"
        stroke="currentColor"
        stroke-width="0.5"
        opacity="0.45"
        stroke-linecap="round"
      />

      <!-- value chip -->
      <rect
        x="192"
        y="74"
        width="26"
        height="12"
        rx="2"
        fill="var(--ui-bg)"
        stroke="currentColor"
        stroke-width="0.5"
        opacity="0.45"
      />
      <text
        x="205"
        y="82.5"
        text-anchor="middle"
        class="font-mono"
        font-size="6"
        fill="currentColor"
        opacity="0.9"
      >142</text>
    </g>
  </svg>
</template>
