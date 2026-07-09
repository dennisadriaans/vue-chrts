<script setup lang="ts">
interface Integration {
  name: string
  description: string
  icon: string
  status: 'Connected' | 'Enable'
  installs: number
}

interface Props {
  title?: string
  integrations?: Integration[]
}

const { title = 'Integrations', integrations = [
  {
    name: 'GitHub',
    description: 'Sync your repositories and manage issues',
    icon: 'i-simple-icons-github',
    status: 'Connected',
    installs: Math.floor(Math.random() * 10000) + 1000
  },
  {
    name: 'Trello',
    description: 'Organize tasks and collaborate with your team',
    icon: 'i-simple-icons-trello',
    status: 'Enable',
    installs: Math.floor(Math.random() * 10000) + 1000
  },
  {
    name: 'Figma',
    description: 'Design and prototype collaboratively',
    icon: 'i-simple-icons-figma',
    status: 'Enable',
    installs: Math.floor(Math.random() * 10000) + 1000
  },
  {
    name: 'Twitter',
    description: 'Share updates and monitor engagement',
    icon: 'i-simple-icons-twitter',
    status: 'Connected',
    installs: Math.floor(Math.random() * 10000) + 1000
  },
  {
    name: 'Zendesk',
    description: 'Support your customers efficiently',
    icon: 'i-simple-icons-zendesk',
    status: 'Enable',
    installs: Math.floor(Math.random() * 10000) + 1000
  }
] } = defineProps<Props>()
</script>

<template>
  <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <UCard
      v-for="item in integrations"
      :key="item.name"
      variant="outline"
      class="flex flex-col justify-between"
    >
      <div class="flex size-12 shrink-0 items-center justify-center rounded-md border border-default bg-default p-1">
        <UIcon
          :name="item.icon"
          class="size-5 text-muted"
        />
      </div>

      <div class="mt-5 flex-1">
        <h4 class="text-sm font-medium text-default">
          {{ item.name }}
        </h4>
        <p class="mt-1 text-sm leading-6 text-muted">
          {{ item.description }}
        </p>
      </div>

      <template #footer>
        <div class="flex items-center gap-2 text-sm text-muted">
          <UIcon name="i-lucide-download" />
          <span>{{ item.installs.toLocaleString() }} installs</span>
        </div>
      </template>
    </UCard>
  </div>
</template>
