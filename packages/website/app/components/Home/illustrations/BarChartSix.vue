<script setup lang="ts">
const bars = [
  { x: 52, h: 40, o: 0.2 },
  { x: 84, h: 62, o: 0.35 },
  { x: 116, h: 34, o: 0.2 },
  { x: 148, h: 88, o: 1 },
  { x: 180, h: 52, o: 0.35 }
]
</script>

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

    <g fill="currentColor">
      <rect
        v-for="(bar, i) in bars"
        :key="i"
        :x="bar.x"
        :y="132 - bar.h"
        width="18"
        :height="bar.h"
        :opacity="bar.o"
        class="bar6"
        :style="{ '--d': `${i * 0.05}s` }"
      />
    </g>

    <g class="font-mono" fill="currentColor" opacity="0.3" font-size="7">
      <text x="61" y="148" text-anchor="middle">A</text>
      <text x="93" y="148" text-anchor="middle">B</text>
      <text x="125" y="148" text-anchor="middle">C</text>
      <text x="157" y="148" text-anchor="middle">D</text>
      <text x="189" y="148" text-anchor="middle">E</text>
    </g>
  </svg>
</template>

<style scoped>
.bar6 {
  transform-box: fill-box;
  transform-origin: 50% 100%;
}

@media (prefers-reduced-motion: no-preference) {
  .group:hover .bar6 {
    animation: bar6-grow 0.6s cubic-bezier(0.22, 1, 0.36, 1) var(--d) backwards;
  }
}

@keyframes bar6-grow {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}
</style>
