<template>
  <svg
    viewBox="0 0 240 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto size-full max-w-[320px] text-highlighted"
    aria-hidden="true"
  >
    <g stroke="currentColor" stroke-width="1" opacity="0.08">
      <line x1="40" y1="36" x2="216" y2="36" />
      <line x1="40" y1="68" x2="216" y2="68" />
      <line x1="40" y1="100" x2="216" y2="100" />
    </g>

    <line
      x1="40"
      y1="132"
      x2="216"
      y2="132"
      stroke="currentColor"
      stroke-width="1"
      opacity="0.2"
    />
    <line
      x1="40"
      y1="36"
      x2="40"
      y2="132"
      stroke="currentColor"
      stroke-width="1"
      opacity="0.2"
    />

    <g stroke="currentColor" stroke-width="1" opacity="0.2">
      <line x1="40" y1="36" x2="36" y2="36" />
      <line x1="40" y1="68" x2="36" y2="68" />
      <line x1="40" y1="100" x2="36" y2="100" />
      <line x1="40" y1="132" x2="36" y2="132" />
    </g>

    <g class="font-mono" fill="currentColor" opacity="0.35" font-size="7">
      <text x="30" y="39" text-anchor="end">100</text>
      <text x="30" y="71" text-anchor="end">75</text>
      <text x="30" y="103" text-anchor="end">50</text>
      <text x="30" y="135" text-anchor="end">0</text>
    </g>

    <g class="font-mono" fill="currentColor" opacity="0.3" font-size="7">
      <text x="40" y="148">Jan</text>
      <text x="84" y="148">Mar</text>
      <text x="128" y="148">May</text>
      <text x="172" y="148">Jul</text>
      <text x="208" y="148">Sep</text>
    </g>

    <path
      d="M40 108 L75 96 L110 102 L145 64 L180 72 L216 40"
      class="line6-ghost"
      stroke="currentColor"
      stroke-width="1"
      stroke-linejoin="miter"
      stroke-linecap="square"
      opacity="0.18"
      pathLength="100"
      stroke-dasharray="100"
    />

    <path
      d="M40 98 L75 84 L110 90 L145 52 L180 58 L216 28"
      class="line6-main"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linejoin="miter"
      stroke-linecap="square"
      pathLength="100"
      stroke-dasharray="100"
    />

    <g class="line6-dots" fill="var(--ui-bg)" stroke="currentColor" stroke-width="1.5">
      <rect x="72.5" y="81.5" width="5" height="5" />
      <rect x="142.5" y="49.5" width="5" height="5" />
      <rect x="213.5" y="25.5" width="5" height="5" />
    </g>
  </svg>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .group:hover .line6-main,
  .group:hover .line6-ghost {
    animation: line6-draw 0.85s cubic-bezier(0.33, 1, 0.68, 1);
  }

  .group:hover .line6-dots {
    animation: line6-fade 0.4s ease-out 0.5s backwards;
  }
}

@keyframes line6-draw {
  from {
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes line6-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
