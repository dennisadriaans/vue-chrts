<script setup lang="ts">
import { createLowlight } from 'lowlight'
import { toHtml } from 'hast-util-to-html'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import plaintext from 'highlight.js/lib/languages/plaintext'
import 'highlight.js/styles/github-dark.css'
import type { CodeBlockProps } from './types'

const lowlight = createLowlight()
lowlight.register({ javascript, typescript, xml, css, json, bash, plaintext })

const props = withDefaults(defineProps<CodeBlockProps>(), {
  language: 'text',
  showLineNumbers: false,
  highlighter: 'shiki',
  darkTheme: 'github-dark',
  lightTheme: 'github-light'
})

const copied = ref(false)
// Fallback for colorMode in non-Nuxt projects
const colorMode = typeof useColorMode === 'function' ? useColorMode() : ref('dark')

const safeCode = computed(() => typeof props.code === 'string' ? props.code : '')

const highlightedLowlightCode = computed(() => {
  if (props.highlighter !== 'lowlight') return ''
  try {
    const lang = (props.language === 'vue' || props.language === 'html') ? 'xml' : (props.language || 'plaintext')
    const tree = lowlight.highlight(lang, safeCode.value)
    return toHtml(tree)
  } catch (err) {
    console.error('[CodeBlock] Lowlight failure:', err)
    return safeCode.value
  }
})

const activeTheme = computed(() =>
  props.theme ?? (colorMode.value === 'dark' ? props.darkTheme : props.lightTheme)
)

const containerStyle = computed(() => {
  if (!props.maxHeight) return {}
  return {
    maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight,
    overflowY: 'auto' as const
  }
})

async function copyCode() {
  if (!safeCode.value) return
  try {
    await navigator.clipboard.writeText(safeCode.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('[CodeBlock] Copy failed:', err)
  }
}
</script>

<template>
  <UCard
    :ui="{
      body: 'p-0 sm:p-0',
      header: 'px-4 py-3 sm:px-4'
    }"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-code-2"
            class="size-4 text-toned"
          />
          <span class="text-xs font-medium text-toned">
            {{ filename || language || 'code' }}
          </span>
        </div>

        <div class="flex items-center gap-1">
          <UColorModeButton
            size="xs"
            variant="ghost"
            color="neutral"
          />
          <UTooltip
            :text="copied ? 'Copied!' : 'Copy code'"
            :kbds="['meta', 'c']"
          >
            <UButton
              :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
              :color="copied ? 'success' : 'neutral'"
              size="xs"
              variant="ghost"
              @click="copyCode"
            />
          </UTooltip>
        </div>
      </div>
    </template>

    <div
      :style="containerStyle"
      class="relative"
    >
      <div
        v-if="loading"
        class="flex min-h-32 items-center justify-center"
      >
        <Loader color="text-primary" />
      </div>

      <template v-else>
        <div
          v-if="safeCode"
          class="text-sm/3 [&>pre]:bg-transparent! [&>pre]:p-4 [&>pre]:m-0 [&>pre]:overflow-x-auto"
          :class="{ 'line-numbers': showLineNumbers }"
        >
          <Shiki
            v-if="highlighter === 'shiki'"
            :code="safeCode"
            :highlight-options="{ theme: activeTheme }"
          />
          <pre
            v-else-if="highlighter === 'lowlight'"
            class="hljs"
            :class="[`language-${language}`]"
          ><code v-html="highlightedLowlightCode" /></pre>
        </div>
        <div
          v-else
          class="p-4 text-xs text-muted italic"
        >
          No code provided
        </div>
      </template>
    </div>
  </UCard>
</template>
