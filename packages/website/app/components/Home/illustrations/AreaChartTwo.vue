<template>
  <svg
    viewBox="0 0 280 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto w-full max-w-[400px] text-muted"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="area2-fill-a" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="var(--ui-primary)" stop-opacity="0.35" />
        <stop offset="1" stop-color="var(--ui-primary)" stop-opacity="0.02" />
      </linearGradient>
      <linearGradient id="area2-fill-b" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="currentColor" stop-opacity="0.14" />
        <stop offset="1" stop-color="currentColor" stop-opacity="0.01" />
      </linearGradient>
    </defs>

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
    <rect x="24" y="20" width="70" height="8" rx="2" fill="var(--ui-bg-elevated)" stroke="var(--ui-border)" stroke-width="1" />
    <rect x="24" y="34" width="118" height="8" rx="2" fill="var(--ui-bg-elevated)" stroke="var(--ui-border)" stroke-width="1" />

    <!-- legend -->
    <rect x="188" y="21" width="6" height="6" fill="currentColor" class="text-primary" />
    <rect x="200" y="21" width="50" height="6" rx="1.5" fill="var(--ui-bg-elevated)" stroke="var(--ui-border)" stroke-width="1" />
    <rect x="188" y="33" width="6" height="6" fill="currentColor" opacity="0.25" />
    <rect x="200" y="33" width="36" height="6" rx="1.5" fill="var(--ui-bg-elevated)" stroke="var(--ui-border)" stroke-width="1" />

    <!-- corner registration marks -->
    <path
      d="M30 58 H42 M36 52 V64 M246 58 H258 M252 52 V64"
      stroke="currentColor"
      stroke-width="0.5"
      opacity="0.25"
    />

    <!-- dashed frame (top + right) -->
    <path
      d="M36 58 H252 V162"
      stroke="currentColor"
      stroke-width="0.5"
      stroke-dasharray="3 3"
      opacity="0.12"
    />

    <!-- horizontal gridlines -->
    <path
      d="M36 84 H252 M36 110 H252 M36 136 H252"
      stroke="currentColor"
      stroke-width="0.5"
      opacity="0.12"
    />

    <!-- vertical gridlines (construction) -->
    <path
      d="M79 58 V162 M122 58 V162 M165 58 V162 M208 58 V162"
      stroke="currentColor"
      stroke-width="0.5"
      stroke-dasharray="1 4"
      opacity="0.1"
    />

    <!-- axes -->
    <path
      d="M36 58 V162 H252"
      stroke="currentColor"
      stroke-width="1"
      stroke-linecap="round"
      opacity="0.4"
    />

    <!-- y-axis ticks -->
    <path
      d="M32 84 H36 M32 110 H36 M32 136 H36"
      stroke="currentColor"
      stroke-width="0.75"
      opacity="0.3"
    />

    <!-- x-axis ticks -->
    <path
      d="M79 162 V166 M122 162 V166 M165 162 V166 M208 162 V166"
      stroke="currentColor"
      stroke-width="0.75"
      opacity="0.3"
    />

    <!-- y-axis labels -->
    <g class="font-mono" fill="currentColor" opacity="0.35" font-size="5.5" text-anchor="end">
      <text x="28" y="86">60</text>
      <text x="28" y="112">40</text>
      <text x="28" y="138">20</text>
    </g>

    <!-- x-axis labels -->
    <g class="font-mono" fill="currentColor" opacity="0.3" font-size="5.5" text-anchor="middle">
      <text x="79" y="172">01</text>
      <text x="122" y="172">02</text>
      <text x="165" y="172">03</text>
      <text x="208" y="172">04</text>
    </g>

    <!-- back area (secondary series, muted) -->
    <path
      d="M36 136 C54 132 62 118 84 122 C106 126 118 106 142 110 C166 114 184 98 210 102 C228 105 240 96 252 100 L252 162 L36 162 Z"
      fill="url(#area2-fill-b)"
    />
    <path
      d="M36 136 C54 132 62 118 84 122 C106 126 118 106 142 110 C166 114 184 98 210 102 C228 105 240 96 252 100"
      stroke="currentColor"
      stroke-width="1"
      stroke-linecap="round"
      stroke-linejoin="round"
      opacity="0.4"
    />

    <!-- front area (primary series, brand accent) -->
    <path
      d="M36 120 C54 112 64 78 86 82 C108 86 114 118 138 114 C162 110 168 66 192 70 C212 73 236 88 252 82 L252 162 L36 162 Z"
      fill="url(#area2-fill-a)"
    />
    <g class="text-primary">
      <path
        d="M36 120 C54 112 64 78 86 82 C108 86 114 118 138 114 C162 110 168 66 192 70 C212 73 236 88 252 82"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle cx="36" cy="120" r="2" fill="currentColor" />
      <circle cx="86" cy="82" r="2" fill="currentColor" />
      <circle cx="138" cy="114" r="2" fill="currentColor" />
      <circle cx="252" cy="82" r="2" fill="currentColor" />

      <!-- highlight marker -->
      <path
        d="M36 70 H186"
        stroke="currentColor"
        stroke-width="0.5"
        stroke-dasharray="2 3"
        opacity="0.25"
      />
      <line
        x1="192"
        y1="76"
        x2="192"
        y2="162"
        stroke="currentColor"
        stroke-width="0.5"
        stroke-dasharray="2 3"
        opacity="0.35"
      />
      <circle
        cx="192"
        cy="70"
        r="5"
        stroke="currentColor"
        stroke-width="1"
        opacity="0.45"
      />
      <circle cx="192" cy="70" r="2.25" fill="currentColor" />

      <!-- value chip -->
      <rect
        x="204"
        y="50"
        width="26"
        height="12"
        rx="2"
        fill="var(--ui-bg)"
        stroke="currentColor"
        stroke-width="0.5"
        opacity="0.45"
      />
      <text
        x="217"
        y="58.5"
        text-anchor="middle"
        class="font-mono"
        font-size="6"
        fill="currentColor"
        opacity="0.9"
      >36.8</text>
    </g>
  </svg>
</template>
