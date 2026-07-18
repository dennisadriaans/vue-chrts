<template>
  <svg
    viewBox="0 0 240 170"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto size-full max-w-[320px] text-muted"
    aria-hidden="true"
  >
    <rect
      x="12"
      y="10"
      width="216"
      height="150"
      rx="16"
      fill="var(--ui-bg-elevated)"
      opacity="0.45"
    />

    <g transform="translate(0 4)">
      <circle
        cx="100"
        cy="80"
        r="42"
        stroke="currentColor"
        stroke-width="14"
        opacity="0.08"
      />

      <g transform="rotate(-90 100 80)">
        <circle
          cx="100"
          cy="80"
          r="42"
          class="text-primary"
          stroke="currentColor"
          stroke-width="14"
          stroke-linecap="round"
          pathLength="100"
          stroke-dasharray="34 66"
          stroke-dashoffset="0"
        />
        <circle
          cx="100"
          cy="80"
          r="42"
          stroke="currentColor"
          stroke-width="14"
          stroke-linecap="round"
          pathLength="100"
          stroke-dasharray="24 76"
          stroke-dashoffset="-38"
          opacity="0.45"
        />
        <circle
          cx="100"
          cy="80"
          r="42"
          stroke="currentColor"
          stroke-width="14"
          stroke-linecap="round"
          pathLength="100"
          stroke-dasharray="16 84"
          stroke-dashoffset="-66"
          opacity="0.22"
        />
      </g>

      <text
        x="100"
        y="78"
        text-anchor="middle"
        class="font-mono text-primary"
        font-size="14"
        font-weight="600"
        fill="currentColor"
      >42%</text>
      <text
        x="100"
        y="94"
        text-anchor="middle"
        fill="currentColor"
        opacity="0.35"
        font-size="7"
      >share</text>
    </g>

    <g fill="currentColor">
      <circle cx="168" cy="58" r="3.5" class="text-primary" />
      <rect x="178" y="56" width="28" height="4" rx="2" opacity="0.14" />
      <circle cx="168" cy="76" r="3.5" opacity="0.45" />
      <rect x="178" y="74" width="22" height="4" rx="2" opacity="0.14" />
      <circle cx="168" cy="94" r="3.5" opacity="0.22" />
      <rect x="178" y="92" width="18" height="4" rx="2" opacity="0.14" />
    </g>
  </svg>
</template>
