<script setup lang="ts">
const bars = [
  { x: 52, h: 28, o: 0.35 },
  { x: 84, h: 44, o: 0.35 },
  { x: 116, h: 22, o: 0.35 },
  { x: 148, h: 58, accent: true, o: 1 },
  { x: 180, h: 36, o: 0.35 }
]

function isoBar(x: number, h: number, w = 14, d = 10) {
  const baseY = 128
  const top = baseY - h
  const tipX = x + w * 0.55
  const tipY = top - d * 0.55
  return {
    front: `${x},${baseY} ${x},${top} ${x + w},${top} ${x + w},${baseY}`,
    top: `${x},${top} ${tipX},${tipY} ${tipX + w},${tipY} ${x + w},${top}`,
    side: `${x + w},${top} ${tipX + w},${tipY} ${tipX + w},${baseY - d * 0.55} ${x + w},${baseY}`
  }
}
</script>

<template>
  <svg
    viewBox="0 0 240 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto size-full max-w-[320px] text-muted"
    aria-hidden="true"
  >
    <g stroke="currentColor" stroke-width="0.5" opacity="0.14">
      <path d="M36 128 L120 86 L204 128 L120 170 Z" />
      <path d="M60 116 L144 74 M84 128 L168 86 M108 140 L192 98" />
      <path d="M60 140 L144 98 M84 152 L168 110" />
    </g>

    <path
      d="M36 128 L204 128"
      stroke="currentColor"
      stroke-width="0.75"
      opacity="0.3"
    />
    <path
      d="M36 128 L120 170 L204 128"
      stroke="currentColor"
      stroke-width="0.75"
      opacity="0.22"
    />

    <g
      v-for="(bar, i) in bars"
      :key="i"
      :class="bar.accent ? 'text-primary' : 'text-default'"
    >
      <polygon
        :points="isoBar(bar.x, bar.h).side"
        fill="currentColor"
        :opacity="bar.accent ? 0.45 : 0.1"
      />
      <polygon
        :points="isoBar(bar.x, bar.h).front"
        fill="currentColor"
        :opacity="bar.accent ? 0.85 : 0.16"
      />
      <polygon
        :points="isoBar(bar.x, bar.h).top"
        fill="currentColor"
        :opacity="bar.accent ? 1 : 0.22"
      />
      <polygon
        :points="isoBar(bar.x, bar.h).front"
        stroke="currentColor"
        stroke-width="0.6"
        :opacity="bar.accent ? 0.9 : 0.25"
      />
    </g>

    <g stroke="currentColor" stroke-width="0.5" opacity="0.35" class="text-primary">
      <path d="M148 70 L148 48 M162 70 L162 48 M148 52 H162" />
      <path d="M148 48 V44 M162 48 V44" />
    </g>
    <text
      x="155"
      y="40"
      text-anchor="middle"
      class="font-mono text-primary"
      font-size="6.5"
      fill="currentColor"
      opacity="0.7"
    >58.0</text>

    <g class="font-mono" fill="currentColor" opacity="0.35" font-size="5.5">
      <text x="56" y="142">01</text>
      <text x="88" y="142">02</text>
      <text x="120" y="142">03</text>
      <text x="152" y="142">04</text>
      <text x="184" y="142">05</text>
    </g>
  </svg>
</template>
