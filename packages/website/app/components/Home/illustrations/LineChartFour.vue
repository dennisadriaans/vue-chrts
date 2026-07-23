<template>
  <svg
    viewBox="0 0 220 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto size-full max-w-[300px] text-muted"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="line4-geo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--ui-primary)" stop-opacity="0.2" />
        <stop offset="100%" stop-color="var(--ui-primary)" stop-opacity="0" />
      </linearGradient>
      <pattern id="line4-grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0 H0 V20" stroke="currentColor" stroke-width="0.5" opacity="0.12" />
      </pattern>
    </defs>

    <rect x="20" y="20" width="180" height="120" fill="url(#line4-grid)" />

    <g stroke="currentColor" stroke-width="0.75" opacity="0.25">
      <line x1="20" y1="20" x2="20" y2="140" />
      <line x1="20" y1="140" x2="200" y2="140" />
      <line x1="20" y1="20" x2="28" y2="20" />
      <line x1="200" y1="140" x2="200" y2="132" />
    </g>

    <path
      d="M20 120 L50 100 L80 108 L110 72 L140 84 L170 48 L200 40 L200 140 L20 140 Z"
      fill="url(#line4-geo)"
    />
    <path
      d="M20 120 L50 100 L80 108 L110 72 L140 84 L170 48 L200 40"
      class="text-primary"
      stroke="currentColor"
      stroke-width="2"
      stroke-linejoin="miter"
      stroke-linecap="square"
    />

    <g class="text-primary" fill="currentColor">
      <rect x="47" y="97" width="6" height="6" transform="rotate(45 50 100)" />
      <rect x="107" y="69" width="6" height="6" transform="rotate(45 110 72)" />
      <rect x="167" y="45" width="6" height="6" transform="rotate(45 170 48)" />
      <rect x="197" y="37" width="6" height="6" transform="rotate(45 200 40)" />
    </g>

    <g stroke="currentColor" stroke-width="0.5" opacity="0.2" stroke-dasharray="2 3">
      <line x1="110" y1="72" x2="110" y2="140" />
      <line x1="170" y1="48" x2="170" y2="140" />
    </g>
  </svg>
</template>
