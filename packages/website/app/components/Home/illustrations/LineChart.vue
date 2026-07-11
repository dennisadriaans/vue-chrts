<template>
  <svg
    viewBox="0 0 280 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto w-full max-w-[520px] text-muted"
    aria-hidden="true"
  >
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

    <!-- vertical gridlines (construction) -->
    <path
      d="M74 28 V164 M108 28 V164 M142 28 V164 M176 28 V164 M210 28 V164"
      stroke="currentColor"
      stroke-width="0.5"
      stroke-dasharray="1 4"
      opacity="0.1"
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

    <!-- x-axis ticks -->
    <path
      d="M74 164 V168 M108 164 V168 M142 164 V168 M176 164 V168 M210 164 V168"
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

    <!-- x-axis labels -->
    <g class="font-mono" fill="currentColor" opacity="0.3" font-size="5.5" text-anchor="middle">
      <text x="74" y="174">01</text>
      <text x="108" y="174">02</text>
      <text x="142" y="174">03</text>
      <text x="176" y="174">04</text>
      <text x="210" y="174">05</text>
    </g>

    <!-- secondary line (smooth, descending trend) -->
    <path
      d="M40 72 C58 78 66 96 84 100 C102 104 116 88 142 92 C168 96 184 118 210 116 C226 115 236 124 244 122"
      stroke="currentColor"
      stroke-width="1"
      stroke-linecap="round"
      stroke-linejoin="round"
      opacity="0.35"
    />

    <!-- primary line (ascending, emphasized) -->
    <path
      d="M40 132 C58 124 68 88 90 92 C112 96 118 60 142 64 C166 68 172 44 196 48 C216 51 228 62 244 56"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="text-default"
    />
    <circle cx="40" cy="132" r="2" fill="currentColor" class="text-default" />
    <circle cx="90" cy="92" r="2" fill="currentColor" class="text-default" />
    <circle cx="142" cy="64" r="2" fill="currentColor" class="text-default" />
    <circle cx="244" cy="56" r="2" fill="currentColor" class="text-default" />

    <!-- highlight marker (accent) -->
    <g class="text-primary">
      <path
        d="M40 48 H190"
        stroke="currentColor"
        stroke-width="0.5"
        stroke-dasharray="2 3"
        opacity="0.25"
      />
      <line
        x1="196"
        y1="54"
        x2="196"
        y2="164"
        stroke="currentColor"
        stroke-width="0.5"
        stroke-dasharray="2 3"
        opacity="0.35"
      />
      <circle
        cx="196"
        cy="48"
        r="5"
        stroke="currentColor"
        stroke-width="1"
        opacity="0.45"
      />
      <circle cx="196" cy="48" r="2.25" fill="currentColor" />

      <!-- value chip -->
      <rect
        x="206"
        y="34"
        width="26"
        height="12"
        rx="2"
        stroke="currentColor"
        stroke-width="0.5"
        opacity="0.45"
      />
      <text
        x="219"
        y="42.5"
        text-anchor="middle"
        class="font-mono"
        font-size="6"
        fill="currentColor"
        opacity="0.9"
      >48.2</text>
    </g>
  </svg>
</template>
