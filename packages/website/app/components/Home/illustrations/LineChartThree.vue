<template>
  <svg
    viewBox="0 0 240 170"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto size-full max-w-[320px] text-muted"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="line3-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--ui-primary)" stop-opacity="0.22" />
        <stop offset="100%" stop-color="var(--ui-primary)" stop-opacity="0" />
      </linearGradient>
      <filter id="line3-soft" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.2" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
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
      d="M36 118 C58 112 72 96 94 92 C116 88 128 104 150 96 C172 88 186 62 204 52 L204 128 L36 128 Z"
      fill="url(#line3-fill)"
    />
    <path
      d="M36 118 C58 112 72 96 94 92 C116 88 128 104 150 96 C172 88 186 62 204 52"
      class="text-primary"
      stroke="currentColor"
      stroke-width="2.25"
      stroke-linecap="round"
      stroke-linejoin="round"
      filter="url(#line3-soft)"
    />

    <g class="text-primary">
      <circle cx="94" cy="92" r="3.5" fill="currentColor" opacity="0.35" />
      <circle cx="150" cy="96" r="3.5" fill="currentColor" opacity="0.35" />
      <circle cx="204" cy="52" r="5" fill="currentColor" opacity="0.15" />
      <circle cx="204" cy="52" r="3" fill="currentColor" />
    </g>
  </svg>
</template>
