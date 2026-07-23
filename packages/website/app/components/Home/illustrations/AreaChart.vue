<template>
  <svg
    viewBox="0 0 220 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto size-full max-w-[300px] text-muted"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="area-accent" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--ui-primary)" stop-opacity="0.28" />
        <stop offset="100%" stop-color="var(--ui-primary)" stop-opacity="0.02" />
      </linearGradient>
    </defs>

    <g stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-dasharray="0.1 5" opacity="0.35">
      <line x1="24" y1="36" x2="196" y2="36" />
      <line x1="24" y1="68" x2="196" y2="68" />
      <line x1="24" y1="100" x2="196" y2="100" />
    </g>
    <line x1="24" y1="132" x2="196" y2="132" stroke="currentColor" stroke-width="1" opacity="0.25" vector-effect="non-scaling-stroke" />

    <g fill="currentColor" opacity="0.15">
      <rect x="37" y="139" width="14" height="3" rx="1.5" />
      <rect x="81" y="139" width="14" height="3" rx="1.5" />
      <rect x="125" y="139" width="14" height="3" rx="1.5" />
      <rect x="169" y="139" width="14" height="3" rx="1.5" />
    </g>

    <g class="text-default area-back">
      <path
        d="M24 96 C44 92 60 82 80 78 C100 74 120 80 140 76 C160 72 180 62 196 58 L196 132 L24 132 Z"
        fill="currentColor"
        opacity="0.07"
      />
      <path
        d="M24 96 C44 92 60 82 80 78 C100 74 120 80 140 76 C160 72 180 62 196 58"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        opacity="0.3"
      />
    </g>

    <g class="text-primary area-front">
      <path
        d="M24 118 C44 114 60 106 80 102 C100 98 120 104 140 100 C160 96 176 84 196 78 L196 132 L24 132 Z"
        fill="url(#area-accent)"
      />
      <path
        d="M24 118 C44 114 60 106 80 102 C100 98 120 104 140 100 C160 96 176 84 196 78"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </g>
  </svg>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .group:hover .area-back {
    animation: area-wipe 0.9s cubic-bezier(0.33, 1, 0.68, 1);
  }

  .group:hover .area-front {
    animation: area-wipe 1s cubic-bezier(0.33, 1, 0.68, 1) 0.05s backwards;
  }
}

@keyframes area-wipe {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}
</style>
