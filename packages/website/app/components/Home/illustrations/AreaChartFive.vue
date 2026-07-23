<template>
  <svg
    viewBox="0 0 240 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto size-full max-w-[320px] text-muted"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="area5-top" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="var(--ui-primary)" stop-opacity="0.35" />
        <stop offset="100%" stop-color="var(--ui-primary)" stop-opacity="0.12" />
      </linearGradient>
      <linearGradient id="area5-side" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--ui-primary)" stop-opacity="0.4" />
        <stop offset="100%" stop-color="var(--ui-primary)" stop-opacity="0.08" />
      </linearGradient>
    </defs>

    <g stroke="currentColor" stroke-width="0.5" opacity="0.14">
      <path d="M40 120 L120 80 L200 120 L120 160 Z" />
      <path d="M60 110 L140 70 M80 120 L160 80 M100 130 L180 90" />
      <path d="M60 130 L140 90 M80 140 L160 100" />
    </g>

    <path
      d="M40 120 L120 80 L200 120 L120 160 Z"
      stroke="currentColor"
      stroke-width="0.75"
      opacity="0.25"
    />

    <path
      d="M56 118 L84 96 L112 102 L140 72 L168 82 L196 56
         L210 64 L182 90 L154 80 L126 110 L98 104 L70 126 Z"
      fill="url(#area5-side)"
      opacity="0.85"
    />

    <path
      d="M56 118 L84 96 L112 102 L140 72 L168 82 L196 56
         L182 48 L154 74 L126 64 L98 94 L70 88 L42 110 Z"
      fill="url(#area5-top)"
    />

    <path
      d="M56 118 L84 96 L112 102 L140 72 L168 82 L196 56"
      class="text-primary"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linejoin="round"
      stroke-linecap="round"
    />
    <path
      d="M42 110 L70 88 L98 94 L126 64 L154 74 L182 48"
      class="text-primary"
      stroke="currentColor"
      stroke-width="1"
      stroke-linejoin="round"
      opacity="0.55"
    />
    <path
      d="M196 56 L182 48 M56 118 L42 110"
      class="text-primary"
      stroke="currentColor"
      stroke-width="1"
      opacity="0.45"
    />

    <g stroke="currentColor" stroke-width="0.5" opacity="0.25" stroke-dasharray="2 2">
      <path d="M140 72 L140 120" />
      <path d="M112 102 L112 132" />
    </g>

    <g class="font-mono" fill="currentColor" opacity="0.4" font-size="6">
      <text x="144" y="68">36.4</text>
      <text x="200" y="52">52.0</text>
    </g>

    <g stroke="currentColor" stroke-width="0.5" opacity="0.3">
      <path d="M36 124 L40 120 L44 122" />
      <path d="M196 124 L200 120 L196 116" />
    </g>
  </svg>
</template>
