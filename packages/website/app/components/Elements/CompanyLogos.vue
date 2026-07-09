<script setup lang="ts">
const logos = [
  { name: 'Spotify', src: '/logos/spotify.svg' },
  { name: 'Notion', src: '/logos/notion.svg' },
  { name: 'Slack', src: '/logos/slack.svg' },
  { name: 'Figma', src: '/logos/figma.svg' },
  { name: 'Linear', src: '/logos/linear.svg' },
  { name: 'Twitter', src: '/logos/Group.svg' }
]
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-3 gap-4 p-8 h-full items-center justify-center">
    <UCard
      v-for="logo in logos"
      :key="logo.name"
      class="flex items-center justify-center bg-default rounded-2xl aspect-square hover:bg-elevated/50 transition"
      :ui="{
        body: 'sm:p-0 p-0'
      }"
    >
      <img
        :src="logo.src"
        :alt="logo.name"
        class="w-12 h-12"
      >
    </UCard>
  </div>
</template>
