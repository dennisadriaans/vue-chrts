<script setup lang="ts">
defineOptions({
  tags: ['blocks', 'ai']
})
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">
        AI Blocks
      </h2>
      <p class="text-toned dark:text-muted">
        These blocks provide interfaces for interacting with AI models.
      </p>
    </div>
    <ClientOnly>
      <div class="mt-12 space-y-24 lg:mt-0">
        <PreviewExample title="Gemini 3 Dashboard">
          <template #chart>
            <BlocksAIGeminiDashboard />
          </template>
          <PreviewCode
            id="ai-gemini-dashboard"
            category="ai"
            block="gemini-dashboard"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="AI Interface 1">
          <template #chart>
            <BlocksAIPromptInput />
          </template>
          <PreviewCode
            id="ai-interface-1"
            category="ai"
            block="prompt-input"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="AI Chat Interface">
          <template #chart>
            <BlocksAIChatInterface />
          </template>
          <PreviewCode
            id="ai-chat-interface"
            category="ai"
            block="chat-interface"
            :lock-code="true"
          />
        </PreviewExample>
      </div>
    </ClientOnly>
  </div>
</template>
