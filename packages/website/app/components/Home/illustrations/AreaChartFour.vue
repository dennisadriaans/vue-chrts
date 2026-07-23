<template>
  <svg
    viewBox="0 0 220 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto size-full max-w-[300px] text-muted"
    aria-hidden="true"
  >
    <defs>
      <pattern id="area4-grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0 H0 V20" stroke="currentColor" stroke-width="0.5" opacity="0.12" />
      </pattern>
      <linearGradient id="area4-back" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="currentColor" stop-opacity="0.14" />
        <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="area4-front" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--ui-primary)" stop-opacity="0.3" />
        <stop offset="100%" stop-color="var(--ui-primary)" stop-opacity="0.02" />
      </linearGradient>
    </defs>

    <rect x="20" y="20" width="180" height="120" fill="url(#area4-grid)" />

    <g stroke="currentColor" stroke-width="0.75" opacity="0.25">
      <line x1="20" y1="20" x2="20" y2="140" />
      <line x1="20" y1="140" x2="200" y2="140" />
    </g>

    <polygon
      points="20,100 50,84 80,90 110,58 140,66 170,40 200,34 200,140 20,140"
      fill="url(#area4-back)"
    />
    <polyline
      points="20,100 50,84 80,90 110,58 140,66 170,40 200,34"
      stroke="currentColor"
      stroke-width="1.25"
      stroke-linejoin="miter"
      opacity="0.35"
    />

    <polygon
      points="20,118 50,104 80,110 110,82 140,90 170,64 200,56 200,140 20,140"
      fill="url(#area4-front)"
    />
    <polyline
      points="20,118 50,104 80,110 110,82 140,90 170,64 200,56"
      class="text-primary"
      stroke="currentColor"
      stroke-width="2"
      stroke-linejoin="miter"
      stroke-linecap="square"
    />

    <g class="text-primary" fill="currentColor">
      <circle cx="110" cy="82" r="2.5" />
      <circle cx="170" cy="64" r="2.5" />
      <circle cx="200" cy="56" r="2.5" />
    </g>

    <g stroke="currentColor" stroke-width="0.5" opacity="0.2">
      <line x1="20" y1="20" x2="200" y2="20" stroke-dasharray="3 3" />
      <line x1="200" y1="20" x2="200" y2="140" stroke-dasharray="3 3" />
    </g>
  </svg>
</template>
