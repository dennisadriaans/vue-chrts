<script setup lang="ts">
interface Integration {
  name: string
  description: string
  icon: string
  status: 'Connected' | 'Enable'
}

interface Props {
  title?: string
  integrations?: Integration[]
}

const { title = 'Integrations', integrations = [
  {
    name: 'Google Drive',
    description: 'Automate your file upload workflow',
    icon: 'i-simple-icons-googledrive',
    status: 'Connected'
  },
  {
    name: 'Facebook Ads',
    description: 'Analyze ad performance in your workspace',
    icon: 'i-simple-icons-facebook',
    status: 'Enable'
  },
  {
    name: 'Notion',
    description: 'Create, manage and sync documentation',
    icon: 'i-simple-icons-notion',
    status: 'Enable'
  },
  {
    name: 'Slack',
    description: 'Send alerts and updates to your slack account',
    icon: 'i-simple-icons-slack',
    status: 'Connected'
  },
  {
    name: 'Dropbox',
    description: 'Automate your file upload workflow',
    icon: 'i-simple-icons-dropbox',
    status: 'Enable'
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

      <UButton
        :label="item.status"
        :disabled="item.status === 'Connected'"
        color="primary"
        variant="solid"
        size="md"
        block
        class="mt-8"
      />
    </UCard>
  </div>
</template>
