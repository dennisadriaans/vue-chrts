<template>
  <svg
    viewBox="0 0 220 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto size-full max-w-[300px] text-muted"
    aria-hidden="true"
  >
    <defs>
      <pattern id="donut4-grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0 H0 V20" stroke="currentColor" stroke-width="0.5" opacity="0.12" />
      </pattern>
    </defs>

    <rect x="20" y="20" width="180" height="120" fill="url(#donut4-grid)" />

    <g transform="translate(78 80)">
      <circle r="48" stroke="currentColor" stroke-width="0.5" opacity="0.15" />
      <circle r="32" stroke="currentColor" stroke-width="0.5" opacity="0.15" />
      <circle r="16" stroke="currentColor" stroke-width="0.5" opacity="0.15" />

      <g stroke="currentColor" stroke-width="0.5" opacity="0.2">
        <line x1="0" y1="-52" x2="0" y2="52" />
        <line x1="-52" y1="0" x2="52" y2="0" />
        <line x1="-37" y1="-37" x2="37" y2="37" />
        <line x1="-37" y1="37" x2="37" y2="-37" />
      </g>

      <path
        d="M0 -40 A40 40 0 0 1 38.5 -10.4 L15.4 -4.1 A16 16 0 0 0 0 -16 Z"
        class="text-primary"
        fill="currentColor"
      />
      <path
        d="M38.5 -10.4 A40 40 0 0 1 12.4 38 A16 16 0 0 0 5 15.2 L15.4 -4.1 Z"
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M12.4 38 A40 40 0 0 1 -34.6 -20 L-13.8 -8 A16 16 0 0 0 5 15.2 Z"
        fill="currentColor"
        opacity="0.22"
      />
      <path
        d="M-34.6 -20 A40 40 0 0 1 0 -40 L0 -16 A16 16 0 0 0 -13.8 -8 Z"
        fill="currentColor"
        opacity="0.12"
      />

      <circle r="3" class="text-primary" fill="currentColor" />

      <g stroke="currentColor" stroke-width="0.75" opacity="0.35">
        <path d="M0 -48 L0 -54 M48 0 L54 0 M0 48 L0 54 M-48 0 L-54 0" />
      </g>
    </g>

    <g fill="currentColor">
      <rect x="158" y="48" width="8" height="8" class="text-primary" />
      <rect x="172" y="50" width="24" height="4" rx="0" opacity="0.16" />
      <rect x="158" y="68" width="8" height="8" opacity="0.4" />
      <rect x="172" y="70" width="20" height="4" opacity="0.16" />
      <rect x="158" y="88" width="8" height="8" opacity="0.22" />
      <rect x="172" y="90" width="16" height="4" opacity="0.16" />
      <rect x="158" y="108" width="8" height="8" opacity="0.12" />
      <rect x="172" y="110" width="12" height="4" opacity="0.16" />
    </g>
  </svg>
</template>
