<script setup lang="ts">
const maskGradients = [
  'radial-gradient(67.78% 58.09% at 24.12% 46.87%, #000 30%, rgba(0,0,0,0.96) 34%, rgba(0,0,0,0.91) 38%, rgba(0,0,0,0.85) 42%, rgba(0,0,0,0.78) 46%, rgba(0,0,0,0.71) 50%, rgba(0,0,0,0.63) 54%, rgba(0,0,0,0.55) 58%, rgba(0,0,0,0.47) 62%, rgba(0,0,0,0.39) 66%, rgba(0,0,0,0.31) 70%, rgba(0,0,0,0.24) 74%, rgba(0,0,0,0.17) 78%, rgba(0,0,0,0.11) 82%, rgba(0,0,0,0.06) 86%, rgba(0,0,0,0.03) 90%, rgba(0,0,0,0.01) 94%, transparent 100%)',
  'radial-gradient(circle, #000 30%, rgba(0,0,0,0.96) 34%, rgba(0,0,0,0.91) 38%, rgba(0,0,0,0.85) 42%, rgba(0,0,0,0.78) 46%, rgba(0,0,0,0.71) 50%, rgba(0,0,0,0.63) 54%, rgba(0,0,0,0.55) 58%, rgba(0,0,0,0.47) 62%, rgba(0,0,0,0.39) 66%, rgba(0,0,0,0.31) 70%, rgba(0,0,0,0.24) 74%, rgba(0,0,0,0.17) 78%, rgba(0,0,0,0.11) 82%, rgba(0,0,0,0.06) 86%, rgba(0,0,0,0.03) 90%, rgba(0,0,0,0.01) 94%, transparent 100%)',
  'linear-gradient(to right, #000 30%, rgba(0,0,0,0.96) 34%, rgba(0,0,0,0.91) 38%, rgba(0,0,0,0.85) 42%, rgba(0,0,0,0.78) 46%, rgba(0,0,0,0.71) 50%, rgba(0,0,0,0.63) 54%, rgba(0,0,0,0.55) 58%, rgba(0,0,0,0.47) 62%, rgba(0,0,0,0.39) 66%, rgba(0,0,0,0.31) 70%, rgba(0,0,0,0.24) 74%, rgba(0,0,0,0.17) 78%, rgba(0,0,0,0.11) 82%, rgba(0,0,0,0.06) 86%, rgba(0,0,0,0.03) 90%, rgba(0,0,0,0.01) 94%, transparent 100%)',
  'radial-gradient(67.78% 58.09% at 14.12% 46.87%, #000 50%, rgba(0,0,0,0.97) 53%, rgba(0,0,0,0.93) 56%, rgba(0,0,0,0.88) 59%, rgba(0,0,0,0.83) 62%, rgba(0,0,0,0.77) 65%, rgba(0,0,0,0.71) 68%, rgba(0,0,0,0.65) 71%, rgba(0,0,0,0.59) 74%, rgba(0,0,0,0.54) 77%, rgba(0,0,0,0.49) 80%, rgba(0,0,0,0.46) 83%, rgba(0,0,0,0.44) 86%, rgba(0,0,0,0.42) 89%, rgba(0,0,0,0.41) 93%, rgba(0,0,0,0.4) 100%)'
]

const colorMode = useColorMode()
function getMaskStyle(index: number) {
  if (colorMode.value !== 'dark') return {}
  const order = [0, 1, 2, 3] // card 0, 1, 2, 3 → gradient 0, 1, 2, 3
  return { maskImage: maskGradients[order[index]], WebkitMaskImage: maskGradients[order[index]] }
}
</script>

<template>
  <div class="relative space-y-12 overflow-hidden">
    <div class="absolute -inset-y-32 left-1/2 -translate-x-1/2 w-[1800px] -z-10 pointer-events-none overflow-hidden">
      <svg
        class="w-full h-full stroke-(--ui-primary)/20 dark:stroke-(--ui-primary)/15 mask-[radial-gradient(100%_100%_at_0%_0%,white,transparent_80%)]"
        fill="none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line
          x1="0"
          y1="5"
          x2="45"
          y2="40"
          stroke-width="0.5"
          vector-effect="non-scaling-stroke"
        />
        <line
          x1="5"
          y1="0"
          x2="50"
          y2="35"
          stroke-width="0.5"
          vector-effect="non-scaling-stroke"
        />
        <line
          x1="12"
          y1="0"
          x2="55"
          y2="35"
          stroke-width="0.5"
          vector-effect="non-scaling-stroke"
        />
      </svg>
    </div>
  </div>
</template>
