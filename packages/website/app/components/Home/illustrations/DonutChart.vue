<script setup lang="ts">
const segments = [
  { len: 33, offset: 0, accent: true, o: 1, d: '0s' },
  { len: 25, offset: -36.5, o: 0.5, d: '0.06s' },
  { len: 17, offset: -65, o: 0.28, d: '0.12s' },
  { len: 11, offset: -85.5, o: 0.14, d: '0.18s' }
]

const legend = [
  { cy: 53, w: 30 },
  { cy: 71, w: 24 },
  { cy: 89, w: 27 },
  { cy: 107, w: 20 }
]
</script>

<template>
  <svg
    viewBox="0 0 220 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto size-full max-w-[300px] text-muted"
    aria-hidden="true"
  >
    <circle
      cx="86"
      cy="80"
      r="44"
      stroke="currentColor"
      stroke-width="13"
      opacity="0.08"
    />

    <g class="donut-ring">
      <g transform="rotate(-90 86 80)" class="text-default">
        <circle
          v-for="(seg, i) in segments"
          :key="i"
          cx="86"
          cy="80"
          r="44"
          stroke="currentColor"
          stroke-width="13"
          stroke-linecap="round"
          pathLength="100"
          :stroke-dasharray="`${seg.len} ${100 - seg.len}`"
          :stroke-dashoffset="seg.offset"
          :class="['donut-seg', seg.accent && 'text-primary']"
          :style="{ '--o': seg.o, '--d': seg.d }"
        />
      </g>
    </g>

    <g class="text-default">
      <g
        v-for="(item, i) in legend"
        :key="i"
        class="donut-seg"
        :style="{ '--o': 1, '--d': `${0.2 + i * 0.06}s` }"
      >
        <circle
          cx="156"
          :cy="item.cy"
          r="3"
          fill="currentColor"
          :class="segments[i]?.accent && 'text-primary'"
          :opacity="segments[i]?.o"
        />
        <rect
          x="166"
          :y="item.cy - 2"
          :width="item.w"
          height="4"
          rx="2"
          fill="currentColor"
          opacity="0.12"
        />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.donut-seg {
  opacity: var(--o);
}

@media (prefers-reduced-motion: no-preference) {
  .donut-ring {
    transform-origin: 86px 80px;
    transform-box: view-box;
  }

  .group:hover .donut-ring {
    animation: ring-in 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .group:hover .donut-seg {
    animation: seg-in 0.5s ease-out var(--d) backwards;
  }
}

@keyframes ring-in {
  from {
    transform: rotate(-10deg);
  }
}

@keyframes seg-in {
  from {
    opacity: 0;
  }
  to {
    opacity: var(--o);
  }
}
</style>
