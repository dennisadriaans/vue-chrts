<script lang="ts" setup>
const props = withDefaults(defineProps<{
  color?: 'fuchsia' | 'emerald' | 'orange' | 'blue' | 'slate'
  rounded?: string
}>(), {
  rounded: 'full'
})
</script>

<template>
  <div
    class="relative p-1 overflow-hidden group/container"
    :class="[
      rounded === 'full' ? 'rounded-full' : (rounded ? `rounded-${rounded}` : 'rounded-full'),
      $attrs.class?.toString().includes('w-') ? '' : 'w-max'
    ]"
  >
    <div
      v-if="props.color === 'fuchsia'"
      class="absolute inset-0 z-0 bg-fuchsia-600 bg-[radial-gradient(at_0%_0%,#d946ef_0px,transparent_50%),radial-gradient(at_100%_0%,#8b5cf6_0px,transparent_50%),radial-gradient(at_100%_100%,#ec4899_0px,transparent_50%),radial-gradient(at_0%_100%,#3b82f6_0px,transparent_50%)]"
    />
    <div
      v-if="props.color === 'emerald'"
      class="absolute inset-0 z-0 bg-emerald-500 bg-[radial-gradient(at_0%_0%,#10b981_0px,transparent_50%),radial-gradient(at_100%_0%,#34d399_0px,transparent_50%),radial-gradient(at_100%_100%,#3b82f6_0px,transparent_50%),radial-gradient(at_0%_100%,#a855f7_0px,transparent_50%)]"
    />
    <div
      v-if="props.color === 'orange'"
      class="absolute inset-0 z-0 bg-orange-500 [background-image:radial-gradient(at_0%_0%,_#f59e0b_0px,_transparent_50%),radial-gradient(at_100%_0%,_#ef4444_0px,_transparent_50%),radial-gradient(at_100%_100%,_#f97316_0px,_transparent_50%),radial-gradient(at_0%_100%,_#facc15_0px,_transparent_50%)]"
    />
    <div
      v-if="props.color === 'blue'"
      class="absolute inset-0 z-0 bg-blue-600 [background-image:radial-gradient(at_0%_0%,_#06b6d4_0px,_transparent_50%),radial-gradient(at_100%_0%,_#3b82f6_0px,_transparent_50%),radial-gradient(at_100%_100%,_#2dd4bf_0px,_transparent_50%),radial-gradient(at_0%_100%,_#6366f1_0px,_transparent_50%)]"
    />
    <div
      v-if="props.color === 'slate'"
      class="absolute inset-0 z-0 bg-slate-800 [background-image:radial-gradient(at_0%_0%,_#475569_0px,_transparent_50%),radial-gradient(at_100%_0%,_#1e293b_0px,_transparent_50%),radial-gradient(at_100%_100%,_#94a3b8_0px,_transparent_50%),radial-gradient(at_0%_100%,_#0f172a_0px,_transparent_50%)]"
    />
    <div
      class="relative z-[1]"
      :class="[
        $attrs.class?.toString().includes('w-full') ? 'w-full' : ''
      ]"
    >
      <slot />
    </div>
  </div>
</template>
