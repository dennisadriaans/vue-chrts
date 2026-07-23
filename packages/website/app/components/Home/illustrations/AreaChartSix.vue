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

    <g class="font-mono" fill="currentColor" opacity="0.35" font-size="7">
      <text x="30" y="39" text-anchor="end">100</text>
      <text x="30" y="71" text-anchor="end">75</text>
      <text x="30" y="103" text-anchor="end">50</text>
      <text x="30" y="135" text-anchor="end">0</text>
    </g>

    <g class="font-mono" fill="currentColor" opacity="0.3" font-size="7">
      <text x="40" y="148">Q1</text>
      <text x="98" y="148">Q2</text>
      <text x="156" y="148">Q3</text>
      <text x="208" y="148">Q4</text>
    </g>

    <g class="area6-back">
      <path
        d="M40 96 L75 88 L110 92 L145 70 L180 76 L216 58 L216 132 L40 132 Z"
        fill="currentColor"
        opacity="0.05"
      />
      <path
        d="M40 96 L75 88 L110 92 L145 70 L180 76 L216 58"
        stroke="currentColor"
        stroke-width="1"
        stroke-linejoin="miter"
        stroke-linecap="square"
        opacity="0.2"
      />
    </g>

    <g class="area6-front">
      <path
        d="M40 112 L75 104 L110 108 L145 84 L180 90 L216 72 L216 132 L40 132 Z"
        fill="currentColor"
        opacity="0.12"
      />
      <path
        d="M40 112 L75 104 L110 108 L145 84 L180 90 L216 72"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="miter"
        stroke-linecap="square"
      />
    </g>
  </svg>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .group:hover .area6-back {
    animation: area6-wipe 0.85s cubic-bezier(0.33, 1, 0.68, 1);
  }

  .group:hover .area6-front {
    animation: area6-wipe 0.95s cubic-bezier(0.33, 1, 0.68, 1) 0.04s backwards;
  }
}

@keyframes area6-wipe {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}
</style>
