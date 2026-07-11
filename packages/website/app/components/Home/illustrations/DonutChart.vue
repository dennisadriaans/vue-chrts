<template>
  <svg
    viewBox="0 0 280 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto w-full max-w-[260px] text-muted"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="donut-seg-a" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="currentColor" stop-opacity="0.9" />
        <stop offset="1" stop-color="currentColor" stop-opacity="0.55" />
      </linearGradient>
    </defs>

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
      circumference = 2 * PI * 58 = 364.42
      rotated -90deg so segments start at 12 o'clock, drawn clockwise.
      gap = 3 between each segment.
      seg1 38% -> 138.5   seg2 27% -> 98.4   seg3 20% -> 72.9   seg4 15% -> 54.7
    -->
    <g transform="rotate(-90 140 100)">
      <!-- highlight segment (primary, 38%) -->
      <circle
        cx="140"
        cy="100"
        r="58"
        stroke="url(#donut-seg-a)"
        stroke-width="22"
        stroke-linecap="butt"
        stroke-dasharray="135.5 228.9"
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
        stroke-dasharray="95.4 269"
        stroke-dashoffset="-141.5"
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
        stroke-dasharray="69.9 294.5"
        stroke-dashoffset="-239.9"
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
        stroke-dasharray="51.7 312.7"
        stroke-dashoffset="-312.8"
        opacity="0.28"
      />
    </g>

    <!-- inner ring detail -->
    <circle
      cx="140"
      cy="100"
      r="43"
      stroke="currentColor"
      stroke-width="0.75"
      opacity="0.2"
    />

    <!-- center label -->
    <text
      x="140"
      y="97"
      text-anchor="middle"
      font-size="20"
      font-weight="600"
      fill="currentColor"
      class="text-default"
    >38%</text>
    <text
      x="140"
      y="112"
      text-anchor="middle"
      font-size="8"
      fill="currentColor"
      opacity="0.5"
    >total</text>

    <!-- leader tick + dot on highlight segment -->
    <circle cx="205" cy="72" r="2.5" fill="currentColor" class="text-default" />
    <path
      d="M198 76 L214 66"
      stroke="currentColor"
      stroke-width="0.75"
      opacity="0.4"
      stroke-linecap="round"
    />
  </svg>
</template>
