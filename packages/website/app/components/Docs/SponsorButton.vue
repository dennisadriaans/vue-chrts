<script setup lang="ts">
const props = defineProps<{
  probability?: number
}>()

const showSponsor = ref(false)

onMounted(() => {
  // Show sponsor button based on probability (default 50%)
  showSponsor.value = Math.random() < (props.probability ?? 0.5)
})
</script>

<template>
  <div v-if="showSponsor">
    <iframe
      src="https://github.com/sponsors/dennisadriaans/button"
      title="Sponsor dennisadriaans"
      height="32"
      width="114"
      style="border: 0; border-radius: 6px;"
    />
  </div>
</template>
