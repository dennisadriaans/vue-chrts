<template>
  <UButton
    :loading="loading"
    :disabled="loading"
    external
    block
    color="neutral"
    size="lg"
    :icon="icon"
    variant="subtle"
    @click="open"
  >
    {{ label }}
  </UButton>
</template>

<script setup lang="ts">
const loading = ref(false)
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  preCallback: {
    type: Function,
    required: false
  }
})

function open() {
  if (props.preCallback) {
    props.preCallback()
  }
  loading.value = true
  window.open(`/api/auth/${props.provider}`, '_blank')
}
</script>
