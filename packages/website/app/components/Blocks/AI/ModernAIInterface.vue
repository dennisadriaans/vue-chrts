<script setup lang="ts">
defineOptions({
  tags: ['ai', 'modernaiinterface']
})

interface Message {
  type: 'user' | 'assistant'
  content: string
  time: string
}

interface QuickAction {
  label: string
  icon: string
  prompt: string
}

const currentMessage = ref('')
const messages = ref<Message[]>([])
const isLoading = ref(false)
const isTyping = ref(false)

const quickActions: QuickAction[] = [
  {
    label: 'Code Review',
    icon: 'i-lucide-code',
    prompt: 'Can you review my code for best practices?'
  },
  {
    label: 'Write Tests',
    icon: 'i-lucide-flask-conical',
    prompt: 'Help me write unit tests for my component'
  },
  {
    label: 'Optimize Performance',
    icon: 'i-lucide-zap',
    prompt: 'How can I optimize this code for better performance?'
  },
  {
    label: 'Documentation',
    icon: 'i-lucide-book-open',
    prompt: 'Generate documentation for my functions'
  },
  {
    label: 'Bug Fix',
    icon: 'i-lucide-bug',
    prompt: 'Help me debug this issue'
  }
]

const formatTime = () => {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const simulateAIResponse = async (userMessage: string) => {
  isTyping.value = true

  // Simulate AI thinking time
  await new Promise(resolve =>
    setTimeout(resolve, 1500 + Math.random() * 1000)
  )

  isTyping.value = false

  // Sample AI responses based on keywords
  let response
    = 'I\'d be happy to help you with that! Could you provide more details about what you\'re working on?'

  if (userMessage.toLowerCase().includes('code')) {
    response
      = 'I can help you with code! Please share your code snippet and I\'ll review it for best practices, potential improvements, and any issues.'
  } else if (userMessage.toLowerCase().includes('test')) {
    response
      = 'Great! I can help you write comprehensive tests. What type of testing are you looking for - unit tests, integration tests, or end-to-end tests?'
  } else if (userMessage.toLowerCase().includes('performance')) {
    response
      = 'Performance optimization is crucial! I can analyze your code for bottlenecks, suggest caching strategies, and recommend best practices for faster execution.'
  } else if (userMessage.toLowerCase().includes('bug')) {
    response
      = 'Let\'s debug this together! Please share the error message, relevant code, and steps to reproduce the issue. I\'ll help you identify and fix the problem.'
  }

  messages.value.push({
    type: 'assistant',
    content: response,
    time: formatTime()
  })
}

const sendMessage = async () => {
  if (!currentMessage.value.trim() || isLoading.value) return

  const messageToSend = currentMessage.value.trim()

  // Add user message
  messages.value.push({
    type: 'user',
    content: messageToSend,
    time: formatTime()
  })

  currentMessage.value = ''
  isLoading.value = true

  try {
    await simulateAIResponse(messageToSend)
  } finally {
    isLoading.value = false
  }
}

const handleQuickAction = (prompt: string) => {
  currentMessage.value = prompt
  sendMessage()
}
</script>

<template>
  <div class="mx-auto flex w-full flex-col gap-4 pt-32 lg:pt-48">
    <div>new</div>

    <!-- Quick Actions as pill buttons -->
    <div class="flex min-h-0 shrink-0 items-center justify-center">
      <div
        class="flex max-w-[1000px] flex-wrap justify-center gap-3"
        role="list"
      >
        <UButton
          v-for="action in quickActions"
          :key="action.label"
          :icon="action.icon"
          :label="action.label"
          color="neutral"
          variant="soft"
          class="h-8 rounded-full px-3 text-[13px] shadow-sm"
          @click="handleQuickAction(action.prompt)"
        />
      </div>
    </div>
  </div>
</template>
