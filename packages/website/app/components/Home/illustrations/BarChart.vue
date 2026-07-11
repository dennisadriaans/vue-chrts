<template>
  <svg
    viewBox="0 0 280 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto w-full max-w-[400px] text-muted"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="bar-fill-a" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="currentColor" stop-opacity="0.4" />
        <stop offset="1" stop-color="currentColor" stop-opacity="0.08" />
      </linearGradient>
      <linearGradient id="bar-fill-b" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="currentColor" stop-opacity="0.18" />
        <stop offset="1" stop-color="currentColor" stop-opacity="0.03" />
      </linearGradient>
    </defs>

    <!-- corner registration marks -->
    <path
      d="M34 28 H46 M40 22 V34 M238 28 H250 M244 22 V34 M238 164 H250 M244 158 V170"
      stroke="currentColor"
      stroke-width="0.5"
      opacity="0.25"
    />

    <!-- dashed frame (top + right) -->
    <path
      d="M40 28 H244 V164"
      stroke="currentColor"
      stroke-width="0.5"
      stroke-dasharray="3 3"
      opacity="0.12"
    />

    <!-- horizontal gridlines -->
    <path
      d="M40 44 H244 M40 76 H244 M40 108 H244 M40 140 H244"
      stroke="currentColor"
      stroke-width="0.5"
      opacity="0.12"
    />

    <!-- axes -->
    <path
      d="M40 28 V164 H244"
      stroke="currentColor"
      stroke-width="1"
      stroke-linecap="round"
      opacity="0.4"
    />

    <!-- y-axis ticks -->
    <path
      d="M36 44 H40 M36 76 H40 M36 108 H40 M36 140 H40"
      stroke="currentColor"
      stroke-width="0.75"
      opacity="0.3"
    />

    <!-- y-axis labels -->
    <g class="font-mono" fill="currentColor" opacity="0.35" font-size="5.5" text-anchor="end">
      <text x="32" y="46">80</text>
      <text x="32" y="78">60</text>
      <text x="32" y="110">40</text>
      <text x="32" y="142">20</text>
    </g>

    <!-- group labels -->
    <g class="font-mono" fill="currentColor" opacity="0.3" font-size="5.5" text-anchor="middle">
      <text x="67" y="174">A</text>
      <text x="111" y="174">B</text>
      <text x="155" y="174">C</text>
      <text x="199" y="174">D</text>
    </g>

    <!-- grouped bars: each group = secondary (back) + primary (front) -->
    <!-- group 1 -->
    <rect x="56" y="88" width="14" height="76" rx="1.5" fill="url(#bar-fill-b)" stroke="currentColor" stroke-width="0.5" opacity="0.5" />
    <rect x="64" y="72" width="14" height="92" rx="1.5" fill="url(#bar-fill-a)" stroke="currentColor" stroke-width="0.75" class="text-default" />

    <!-- group 2 -->
    <rect x="100" y="112" width="14" height="52" rx="1.5" fill="url(#bar-fill-b)" stroke="currentColor" stroke-width="0.5" opacity="0.5" />
    <rect x="108" y="96" width="14" height="68" rx="1.5" fill="url(#bar-fill-a)" stroke="currentColor" stroke-width="0.75" class="text-default" />

    <!-- group 3 -->
    <rect x="144" y="60" width="14" height="104" rx="1.5" fill="url(#bar-fill-b)" stroke="currentColor" stroke-width="0.5" opacity="0.5" />
    <rect x="152" y="48" width="14" height="116" rx="1.5" fill="url(#bar-fill-a)" stroke="currentColor" stroke-width="0.75" class="text-default" />

    <!-- group 4 -->
    <rect x="188" y="100" width="14" height="64" rx="1.5" fill="url(#bar-fill-b)" stroke="currentColor" stroke-width="0.5" opacity="0.5" />
    <rect x="196" y="84" width="14" height="80" rx="1.5" fill="url(#bar-fill-a)" stroke="currentColor" stroke-width="0.75" class="text-default" />

    <!-- width dimension under group 3 (blueprint measure) -->
    <path
      d="M152 168 V173 M166 168 V173 M152 170.5 H166"
      stroke="currentColor"
      stroke-width="0.5"
      opacity="0.3"
    />

    <!-- highlight on tallest bar (accent) -->
    <g class="text-primary">
      <path
        d="M40 48 H146"
        stroke="currentColor"
        stroke-width="0.5"
        stroke-dasharray="2 3"
        opacity="0.25"
      />
      <path
        d="M152 48 H166"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <circle
        cx="159"
        cy="48"
        r="4.5"
        stroke="currentColor"
        stroke-width="1"
        opacity="0.45"
      />

      <!-- value chip -->
      <rect
        x="146"
        y="28"
        width="26"
        height="12"
        rx="2"
        stroke="currentColor"
        stroke-width="0.5"
        opacity="0.45"
      />
      <text
        x="159"
        y="36.5"
        text-anchor="middle"
        class="font-mono"
        font-size="6"
        fill="currentColor"
        opacity="0.9"
      >72.4</text>
    </g>
  </svg>
</template>
