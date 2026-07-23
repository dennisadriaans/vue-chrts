<template>
  <svg
    viewBox="0 0 220 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto size-full max-w-[300px] text-muted"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="line-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--ui-primary)" stop-opacity="0.14" />
        <stop offset="100%" stop-color="var(--ui-primary)" stop-opacity="0" />
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

    <path
      d="M24 116 C44 112 60 106 80 104 C100 102 120 94 140 90 C160 86 180 78 196 74"
      class="text-default line-ghost"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      opacity="0.25"
      pathLength="100"
      stroke-dasharray="100"
    />

    <path
      d="M24 108 C40 104 52 97 68 92 C84 87 94 97 110 93 C126 89 134 68 150 60 C166 52 180 48 196 44 L196 132 L24 132 Z"
      fill="url(#line-fill)"
      class="line-area"
    />
    <path
      d="M24 108 C40 104 52 97 68 92 C84 87 94 97 110 93 C126 89 134 68 150 60 C166 52 180 48 196 44"
      class="text-primary line-main"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      pathLength="100"
      stroke-dasharray="100"
    />

    <g class="text-primary line-dot">
      <circle cx="196" cy="44" r="8" fill="currentColor" opacity="0.12" />
      <circle cx="196" cy="44" r="5.5" stroke="currentColor" stroke-width="1.5" class="line-pulse" />
      <circle cx="196" cy="44" r="3" fill="currentColor" />
    </g>
  </svg>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .line-pulse {
    transform-origin: 196px 44px;
    transform-box: view-box;
    animation: line-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .group:hover .line-main {
    animation: line-draw 0.9s cubic-bezier(0.33, 1, 0.68, 1);
  }

  .group:hover .line-ghost {
    animation: line-draw 1.1s cubic-bezier(0.33, 1, 0.68, 1);
  }

  .group:hover .line-area {
    animation: line-fade 1.1s ease-out;
  }

  .group:hover .line-dot {
    transform-origin: 196px 44px;
    transform-box: view-box;
    animation: line-pop 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.55s backwards;
  }
}

@keyframes line-draw {
  from {
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes line-fade {
  from {
    opacity: 0;
  }
  60% {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes line-pop {
  from {
    opacity: 0;
    transform: scale(0.4);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes line-pulse {
  0% {
    opacity: 0.5;
    transform: scale(0.65);
  }
  70%,
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
}
</style>
