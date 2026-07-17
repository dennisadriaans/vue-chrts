<script setup lang="ts">
const bars = [
  { x: 33, h: 44 },
  { x: 67, h: 30 },
  { x: 101, h: 62 },
  { x: 135, h: 50 },
  { x: 169, h: 84, accent: true }
]

function barPath({ x, h }: { x: number, h: number }, w = 18, r = 3) {
  const y = 132 - h
  return `M${x} 132 V${y + r} Q${x} ${y} ${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V132 Z`
}
</script>

<template>
  <svg
    viewBox="0 0 220 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto size-full max-w-[300px] text-muted"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="bar-accent" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--ui-primary)" stop-opacity="0.95" />
        <stop offset="100%" stop-color="var(--ui-primary)" stop-opacity="0.5" />
      </linearGradient>
    </defs>

    <g stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-dasharray="0.1 5" opacity="0.35">
      <line x1="24" y1="36" x2="196" y2="36" />
      <line x1="24" y1="68" x2="196" y2="68" />
      <line x1="24" y1="100" x2="196" y2="100" />
    </g>
    <line x1="24" y1="132" x2="196" y2="132" stroke="currentColor" stroke-width="1" opacity="0.25" vector-effect="non-scaling-stroke" />

    <g class="text-default">
      <path
        v-for="(bar, i) in bars"
        :key="i"
        :d="barPath(bar)"
        :fill="bar.accent ? 'url(#bar-accent)' : 'currentColor'"
        :fill-opacity="bar.accent ? 1 : 0.12"
        class="bar"
        :style="{ '--d': `${i * 0.05}s` }"
      />
    </g>

    <g fill="currentColor" opacity="0.15">
      <rect
        v-for="(bar, i) in bars"
        :key="i"
        :x="bar.x + 2"
        y="139"
        width="14"
        height="3"
        rx="1.5"
      />
    </g>
  </svg>
</template>

<style scoped>
.bar {
  transform-box: fill-box;
  transform-origin: 50% 100%;
}

@media (prefers-reduced-motion: no-preference) {
  .group:hover .bar {
    animation: bar-grow 0.65s cubic-bezier(0.22, 1, 0.36, 1) var(--d) backwards;
  }
}

@keyframes bar-grow {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}
</style>
