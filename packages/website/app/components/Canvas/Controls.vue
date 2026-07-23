<template>
  <div class="absolute top-6 right-6 z-30 flex items-center gap-2">
    <button
      class="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/5 text-[10px] font-mono tracking-wider uppercase text-white/40 hover:text-white/80 hover:border-white/20 transition-all flex items-center gap-2"
      @click="$emit('autoAlign')"
    >
      <UIcon
        name="i-lucide-layout-grid"
        class="w-3.5 h-3.5"
      />
      Auto Align
    </button>

    <div
      class="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/5"
    >
      <div
        class="flex items-center gap-4 text-[10px] font-mono tracking-wider uppercase text-white/40"
      >
        <div class="flex items-center gap-2">
          <span>Particles: {{ particleCount }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span>FPS: {{ fps }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  particleCount: number
  fps: number
}>()

defineEmits<{
  (e: 'autoAlign'): void
}>()
</script>
