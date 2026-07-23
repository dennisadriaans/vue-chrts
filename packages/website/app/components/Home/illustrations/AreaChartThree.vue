<template>
  <svg
    viewBox="0 0 240 170"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto size-full max-w-[320px] text-muted"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="area3-a" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="currentColor" stop-opacity="0.16" />
        <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="area3-b" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--ui-primary)" stop-opacity="0.32" />
        <stop offset="100%" stop-color="var(--ui-primary)" stop-opacity="0.02" />
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

    <path
      d="M36 92 C58 86 74 70 96 66 C118 62 134 78 156 72 C178 66 190 52 204 46 L204 128 L36 128 Z"
      fill="url(#area3-a)"
    />
    <path
      d="M36 92 C58 86 74 70 96 66 C118 62 134 78 156 72 C178 66 190 52 204 46"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      opacity="0.35"
    />

    <path
      d="M36 114 C58 108 74 98 96 94 C118 90 134 102 156 96 C178 90 190 76 204 70 L204 128 L36 128 Z"
      fill="url(#area3-b)"
    />
    <path
      d="M36 114 C58 108 74 98 96 94 C118 90 134 102 156 96 C178 90 190 76 204 70"
      class="text-primary"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
</template>
