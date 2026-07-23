<template>
  <svg
    viewBox="0 0 280 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto w-full max-w-[400px] text-muted"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="bar2-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="var(--ui-primary)" stop-opacity="0.55" />
        <stop offset="1" stop-color="var(--ui-primary)" stop-opacity="0.12" />
      </linearGradient>
      <linearGradient id="bar2-fill-hi" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="var(--ui-primary)" stop-opacity="0.9" />
        <stop offset="1" stop-color="var(--ui-primary)" stop-opacity="0.3" />
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

    <!-- y-axis labels -->
    <g class="font-mono" fill="currentColor" opacity="0.35" font-size="5.5" text-anchor="end">
      <text x="28" y="86">60</text>
      <text x="28" y="112">40</text>
      <text x="28" y="138">20</text>
    </g>

    <!-- bars (brand series, blocks-style rhythm) -->
    <g class="text-primary" stroke="currentColor" stroke-width="0.5">
      <rect x="39" y="116" width="12" height="46" rx="1" fill="url(#bar2-fill)" />
      <rect x="57" y="92" width="12" height="70" rx="1" fill="url(#bar2-fill)" />
      <rect x="75" y="124" width="12" height="38" rx="1" fill="url(#bar2-fill)" />
      <rect x="93" y="74" width="12" height="88" rx="1" fill="url(#bar2-fill)" />
      <rect x="111" y="104" width="12" height="58" rx="1" fill="url(#bar2-fill)" />
      <rect x="129" y="86" width="12" height="76" rx="1" fill="url(#bar2-fill)" />
      <rect x="147" y="98" width="12" height="64" rx="1" fill="url(#bar2-fill)" />
      <rect x="165" y="78" width="12" height="84" rx="1" fill="url(#bar2-fill)" />
      <rect x="183" y="122" width="12" height="40" rx="1" fill="url(#bar2-fill)" />
      <rect x="201" y="66" width="12" height="96" rx="1" fill="url(#bar2-fill-hi)" stroke-width="0.75" />
      <rect x="219" y="108" width="12" height="54" rx="1" fill="url(#bar2-fill)" />
      <rect x="237" y="90" width="12" height="72" rx="1" fill="url(#bar2-fill)" />
    </g>

    <!-- width dimension under one bar (blueprint measure) -->
    <path
      d="M147 168 V172 M159 168 V172 M147 170 H159"
      stroke="currentColor"
      stroke-width="0.5"
      opacity="0.3"
    />

    <!-- highlight on tallest bar (accent) -->
    <g class="text-primary">
      <path
        d="M36 66 H196"
        stroke="currentColor"
        stroke-width="0.5"
        stroke-dasharray="2 3"
        opacity="0.25"
      />
      <path
        d="M201 66 H213"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <circle
        cx="207"
        cy="66"
        r="4.5"
        stroke="currentColor"
        stroke-width="1"
        opacity="0.45"
      />

      <!-- value chip -->
      <rect
        x="194"
        y="44"
        width="26"
        height="12"
        rx="2"
        fill="var(--ui-bg)"
        stroke="currentColor"
        stroke-width="0.5"
        opacity="0.45"
      />
      <text
        x="207"
        y="52.5"
        text-anchor="middle"
        class="font-mono"
        font-size="6"
        fill="currentColor"
        opacity="0.9"
      >96.2</text>
    </g>
  </svg>
</template>
