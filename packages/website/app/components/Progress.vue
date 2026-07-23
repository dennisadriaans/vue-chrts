<script lang="ts" setup>
interface StorageProps {
  progress: number
  total: number
  color: string
}

const props = defineProps<StorageProps>()

const width = computed(() => {
  return `${(props.progress / props.total) * 100}%`
})
</script>

<template>
  <div class="space-y-1">
    <div class="h-2 rounded-full bg-neutral-100 dark:bg-white/5">
      <div
        class="h-full rounded-full"
        :style="{ width, backgroundColor: color }"
      />
    </div>
  </div>
</template>
