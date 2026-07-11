<template>
  <svg
    viewBox="0 0 280 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto w-full max-w-[260px] text-muted"
    aria-hidden="true"
  >
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

    <!-- x-axis ticks -->
    <path
      d="M74 164 V168 M108 164 V168 M142 164 V168 M176 164 V168 M210 164 V168"
      stroke="currentColor"
      stroke-width="0.75"
      opacity="0.3"
    />

    <!-- secondary line (smooth, descending trend) -->
    <path
      d="M40 72 C58 78 66 96 84 100 C102 104 116 88 142 92 C168 96 184 118 210 116 C226 115 236 124 244 122"
      stroke="currentColor"
      stroke-width="1"
      stroke-linecap="round"
      stroke-linejoin="round"
      opacity="0.4"
    />
    <circle cx="40" cy="72" r="1.75" fill="currentColor" opacity="0.4" />
    <circle cx="84" cy="100" r="1.75" fill="currentColor" opacity="0.4" />
    <circle cx="142" cy="92" r="1.75" fill="currentColor" opacity="0.4" />
    <circle cx="210" cy="116" r="1.75" fill="currentColor" opacity="0.4" />
    <circle cx="244" cy="122" r="1.75" fill="currentColor" opacity="0.4" />

    <!-- tertiary line (dashed reference) -->
    <path
      d="M40 128 C64 124 88 120 112 114 C140 107 168 100 196 92 C216 86 232 82 244 80"
      stroke="currentColor"
      stroke-width="0.75"
      stroke-linecap="round"
      stroke-dasharray="3 4"
      opacity="0.3"
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
    <circle cx="196" cy="48" r="2.5" fill="currentColor" class="text-default" />
    <circle cx="244" cy="56" r="2" fill="currentColor" class="text-default" />

    <!-- highlight marker -->
    <circle
      cx="196"
      cy="48"
      r="5"
      stroke="currentColor"
      stroke-width="1"
      opacity="0.35"
    />
    <line
      x1="196"
      y1="48"
      x2="196"
      y2="164"
      stroke="currentColor"
      stroke-width="0.5"
      stroke-dasharray="2 3"
      opacity="0.3"
    />
  </svg>
</template>
