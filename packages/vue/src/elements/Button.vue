<script lang="ts" setup>
const props = defineProps<{
  color?: string,
  size: 'sm' | 'md' | 'lg',
  type?: 'solid' | 'outline',
}>();
</script>
<template>
  <button
    :class="[
      props.type === 'outline'
        ? [
            'bg-transparent border',
            props.color === 'white'
              ? 'border-white/20 text-white hover:bg-white/10'
              : props.color === 'black'
                ? 'border-black/20 text-black hover:bg-black/10'
                : 'border-primary text-primary hover:bg-primary/10'
          ].join(' ')
        : (
            props.color === 'white'
              ? 'bg-white hover:bg-white/75'
              : props.color === 'black'
                ? 'bg-neutral-950 hover:bg-black/75 text-white'
                : 'bg-primary hover:bg-primary/75 text-background'
          ),
      'rounded font-medium inline-flex items-center focus:outline-hidden disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 transition-colors gap-1.5 disabled:bg-(--ui-primary) aria-disabled:bg-(--ui-primary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ui-primary)',
      props.size === 'sm' ? 'px-2 py-1 text-xs' : props.size === 'lg' ? 'px-4 py-2 text-base' : 'px-2.5 py-1.5 text-sm'
    ]"
  >
    <slot></slot>
  </button>
</template>
