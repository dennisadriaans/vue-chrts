<script setup lang="ts">
const segments = [
  { len: 34, offset: 0, o: 1, d: '0s' },
  { len: 24, offset: -38, o: 0.45, d: '0.06s' },
  { len: 18, offset: -66, o: 0.25, d: '0.12s' },
  { len: 12, offset: -88, o: 0.12, d: '0.18s' }
]

const legend = [
  { label: 'Product', value: '34%' },
  { label: 'Services', value: '24%' },
  { label: 'Other', value: '18%' },
  { label: 'Misc', value: '12%' }
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
    <circle
      cx="92"
      cy="88"
      r="48"
      stroke="currentColor"
      stroke-width="12"
      opacity="0.06"
    />

    <g class="donut6-ring">
      <g transform="rotate(-90 92 88)">
        <circle
          v-for="(seg, i) in segments"
          :key="i"
          cx="92"
          cy="88"
          r="48"
          stroke="currentColor"
          stroke-width="12"
          stroke-linecap="butt"
          pathLength="100"
          :stroke-dasharray="`${seg.len} ${100 - seg.len}`"
          :stroke-dashoffset="seg.offset"
          class="donut6-seg"
          :style="{ '--o': seg.o, '--d': seg.d }"
        />
      </g>
    </g>

    <g class="font-mono" fill="currentColor" text-anchor="middle">
      <text x="92" y="84" font-size="16" opacity="0.9">88</text>
      <text x="92" y="98" font-size="7" opacity="0.35">TOTAL</text>
    </g>

    <g class="font-mono" fill="currentColor" font-size="7">
      <g
        v-for="(item, i) in legend"
        :key="i"
        class="donut6-seg"
        :style="{ '--o': 1, '--d': `${0.2 + i * 0.05}s` }"
      >
        <rect
          x="160"
          :y="58 + i * 18"
          width="8"
          height="8"
          fill="currentColor"
          :opacity="segments[i]?.o"
        />
        <text
          x="174"
          :y="65 + i * 18"
          opacity="0.45"
        >{{ item.label }}</text>
        <text
          x="226"
          :y="65 + i * 18"
          text-anchor="end"
          opacity="0.7"
        >{{ item.value }}</text>
      </g>
    </g>
  </svg>
</template>

<style scoped>
.donut6-seg {
  opacity: var(--o);
}

@media (prefers-reduced-motion: no-preference) {
  .donut6-ring {
    transform-origin: 92px 88px;
    transform-box: view-box;
  }

  .group:hover .donut6-ring {
    animation: donut6-spin 0.75s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .group:hover .donut6-seg {
    animation: donut6-in 0.45s ease-out var(--d) backwards;
  }
}

@keyframes donut6-spin {
  from {
    transform: rotate(-8deg);
  }
}

@keyframes donut6-in {
  from {
    opacity: 0;
  }
  to {
    opacity: var(--o);
  }
}
</style>
