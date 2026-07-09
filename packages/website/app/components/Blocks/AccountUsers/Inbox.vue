<script setup lang="ts">
defineOptions({
  tags: ['accountusers', 'inbox']
})

interface Message {
  id: number
  subject: string
  preview: string
  timestamp: string
  unread: boolean
}

const props = defineProps<{
  messages: Message[]
}>()
</script>

<template>
  <UCard
    :ui="{ body: 'p-0 sm:p-2' }"
    class="!bg-default"
  >
    <template #header>
      <h2 class="text-lg font-semibold">
        Inbox
      </h2>
    </template>

    <div class="divide-y divide-neutral-200 dark:divide-neutral-800">
      <div
        v-if="messages.length === 0"
        class="text-muted text-center text-sm"
      >
        No messages yet.
      </div>

      <div
        v-for="(message, index) in messages"
        :key="message.id"
        class="relative flex cursor-pointer items-center px-6 py-4 hover:bg-(--color-neutral-800)"
      >
        <div class="relative flex items-center">
          <div
            v-if="messages.length > 1 && index < messages.length - 1"
            class="absolute top-5 left-1/2 -ml-px h-full w-0.5"
            aria-hidden="true"
          />
          <div
            v-if="message.unread"
            class="relative z-10"
          >
            <div class="h-2 w-2 rounded-full bg-(--ui-primary)" />
          </div>
          <div
            v-else
            class="relative z-10"
          >
            <div class="h-2 w-2 rounded-full bg-transparent" />
          </div>
        </div>

        <div class="min-w-0 flex-1 pl-4">
          <div class="flex items-center justify-between gap-x-2">
            <p
              class="truncate text-sm font-medium text-neutral-900 dark:text-white"
            >
              {{ message.subject }}
            </p>
            <div class="flex items-center space-x-1">
              <p class="text-muted flex-shrink-0 text-xs">
                {{ message.timestamp }}
              </p>
              <UButton
                icon="i-heroicons-trash-20-solid"
                size="xs"
                variant="ghost"
                aria-label="Delete message"
                @click="deleteMessage(message.id)"
              />
            </div>
          </div>
          <p class="text-muted mt-1 text-sm">
            {{ message.preview }}
          </p>
        </div>
      </div>
    </div>
  </UCard>
</template>
