<template>
  <svg
    viewBox="0 0 240 170"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto size-full max-w-[320px] text-muted"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="bar3-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--ui-primary)" stop-opacity="0.85" />
        <stop offset="100%" stop-color="var(--ui-primary)" stop-opacity="0.35" />
      </linearGradient>
    </defs>

    <rect
      x="12"
      y="10"
      width="216"
      height="150"
      rx="16"
      fill="var(--ui-bg-elevated)"
      opacity="0.45"
    />

    <g stroke="currentColor" stroke-width="1" opacity="0.12">
      <line x1="36" y1="48" x2="204" y2="48" />
      <line x1="36" y1="78" x2="204" y2="78" />
      <line x1="36" y1="108" x2="204" y2="108" />
    </g>

    <g class="text-default">
      <rect x="44" y="88" width="18" height="40" rx="5" fill="currentColor" opacity="0.12" />
      <rect x="74" y="68" width="18" height="60" rx="5" fill="currentColor" opacity="0.12" />
      <rect x="104" y="96" width="18" height="32" rx="5" fill="currentColor" opacity="0.12" />
      <rect x="134" y="58" width="18" height="70" rx="5" fill="url(#bar3-fill)" class="text-primary" />
      <rect x="164" y="78" width="18" height="50" rx="5" fill="currentColor" opacity="0.12" />
    </g>

    <line
      x1="36"
      y1="128"
      x2="204"
      y2="128"
      stroke="currentColor"
      stroke-width="1"
      opacity="0.18"
    />
  </svg>
</template>
