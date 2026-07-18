<template>
  <svg
    viewBox="0 0 240 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto size-full max-w-[320px] text-muted"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="line5-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--ui-primary)" stop-opacity="0.28" />
        <stop offset="100%" stop-color="var(--ui-primary)" stop-opacity="0.04" />
      </linearGradient>
    </defs>

    <g stroke="currentColor" stroke-width="0.5" opacity="0.14">
      <path d="M40 120 L120 80 L200 120 L120 160 Z" />
      <path d="M60 110 L140 70 M80 120 L160 80 M100 130 L180 90" />
      <path d="M60 130 L140 90 M80 140 L160 100 M100 110 L20 150" />
      <path d="M100 90 L180 130 M120 100 L40 140 M140 110 L60 150" />
    </g>

    <path
      d="M40 120 L120 80 L200 120 L120 160 Z"
      stroke="currentColor"
      stroke-width="0.75"
      opacity="0.28"
    />

    <g stroke="currentColor" stroke-width="0.5" opacity="0.35">
      <path d="M36 116 L40 120 L44 118" />
      <path d="M196 116 L200 120 L196 124" />
      <path d="M116 164 L120 160 L124 164" />
    </g>

    <path
      d="M56 112 L84 88 L112 96 L140 62 L168 74 L196 48 L196 120 L120 160 L56 128 Z"
      fill="url(#line5-fill)"
      opacity="0.9"
    />
    <path
      d="M56 128 L84 104 L112 112 L140 78 L168 90 L196 64"
      stroke="currentColor"
      stroke-width="1"
      opacity="0.2"
    />
    <path
      d="M56 112 L84 88 L112 96 L140 62 L168 74 L196 48"
      class="text-primary"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linejoin="round"
      stroke-linecap="round"
    />

    <g class="text-primary" fill="currentColor">
      <circle cx="84" cy="88" r="2.25" />
      <circle cx="140" cy="62" r="2.25" />
      <circle cx="196" cy="48" r="2.25" />
    </g>

    <g class="font-mono" fill="currentColor" opacity="0.4" font-size="6">
      <text x="202" y="46">48.2</text>
      <text x="146" y="58">31.0</text>
      <text x="28" y="110">12.4</text>
    </g>

    <g stroke="currentColor" stroke-width="0.5" opacity="0.3">
      <path d="M196 48 L210 48 M210 44 V52" />
      <path d="M40 120 L28 120 M28 116 V124" />
    </g>
  </svg>
</template>
