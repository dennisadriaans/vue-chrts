<template>
  <svg
    viewBox="0 0 220 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto size-full max-w-[300px] text-muted"
    aria-hidden="true"
  >
    <defs>
      <pattern id="bar4-grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0 H0 V20" stroke="currentColor" stroke-width="0.5" opacity="0.12" />
      </pattern>
      <linearGradient id="bar4-geo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--ui-primary)" stop-opacity="0.95" />
        <stop offset="100%" stop-color="var(--ui-primary)" stop-opacity="0.45" />
      </linearGradient>
    </defs>

    <rect x="20" y="20" width="180" height="120" fill="url(#bar4-grid)" />

    <g stroke="currentColor" stroke-width="0.75" opacity="0.25">
      <line x1="20" y1="20" x2="20" y2="140" />
      <line x1="20" y1="140" x2="200" y2="140" />
    </g>

    <g stroke="currentColor" stroke-width="0.5" opacity="0.15">
      <line x1="20" y1="40" x2="200" y2="40" />
      <line x1="20" y1="60" x2="200" y2="60" />
      <line x1="20" y1="80" x2="200" y2="80" />
      <line x1="20" y1="100" x2="200" y2="100" />
      <line x1="20" y1="120" x2="200" y2="120" />
    </g>

    <g class="text-default">
      <polygon points="40,140 40,96 58,88 58,140" fill="currentColor" opacity="0.14" />
      <polygon points="68,140 68,72 86,64 86,140" fill="currentColor" opacity="0.14" />
      <polygon points="96,140 96,108 114,100 114,140" fill="currentColor" opacity="0.14" />
      <polygon points="124,140 124,52 142,44 142,140" fill="url(#bar4-geo)" />
      <polygon points="152,140 152,84 170,76 170,140" fill="currentColor" opacity="0.14" />
      <polygon points="180,140 180,68 198,60 198,140" fill="currentColor" opacity="0.14" />
    </g>

    <g class="text-primary" stroke="currentColor" stroke-width="1">
      <line x1="124" y1="52" x2="142" y2="44" />
      <line x1="142" y1="44" x2="142" y2="140" />
      <line x1="124" y1="52" x2="124" y2="140" />
    </g>

    <g stroke="currentColor" stroke-width="0.75" opacity="0.3">
      <path d="M118 44 H148 M124 38 V50 M142 38 V50" />
    </g>
  </svg>
</template>
