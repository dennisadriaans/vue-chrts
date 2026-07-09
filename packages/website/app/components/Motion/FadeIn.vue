<script lang="ts" setup>
import { motion } from 'motion-v'
</script>

<template>
  <motion.div
    :initial="{
      opacity: 0,
      transform: 'translateY(10%)'
    }"
    :animate="{
      opacity: 1,
      transform: 'translateY(0%)'
    }"
    :transition="{
      duration: 1,
      delay: 1
    }"
  >
    <slot />
  </motion.div>
</template>
