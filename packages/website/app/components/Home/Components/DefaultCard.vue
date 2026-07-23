<script setup lang="ts">
const card = {
  name: "Unique visitors",
  stat: "10,450",
  change: "12.5%",
  changeType: "positive",
};
</script>

<template>
  <UCard>
    <div class="mb-2 flex items-center justify-between">
      <div class="text-muted text-sm">
        {{ card.name }}
      </div>
      <UBadge
        variant="soft"
        :color="card.changeType === 'positive' ? 'success' : 'error'"
      >
        {{ card.change }}
      </UBadge>
    </div>

    <div class="flex items-center justify-between">
      <div class="text-2xl font-semibold">
        {{ card.stat }}
      </div>
    </div>
  </UCard>
</template>
