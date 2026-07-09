<script setup lang="ts">
import type { Component } from 'vue'
import type { BlockItem } from '~/types/blocks'

defineOptions({
  tags: ['blocks', 'searchresults']
})

const { blocks, active = true } = defineProps<{
  blocks: BlockItem[]
  active?: boolean
}>()

// Load all sub-block components lazily
const subBlocksGlob = import.meta.glob('~/components/Blocks/**/*.vue') as Record<
  string,
  () => Promise<{ default: Component }>
>

// Helper to get component from glob
function getBlockComponent(path: string) {
  const target = path.replace('~/', '')
  const entry = Object.entries(subBlocksGlob).find(([p]) => p.endsWith(target))
  if (!entry) return null
  return defineAsyncComponent(async () => {
    const mod = await entry[1]()
    return mod.default
  })
}
</script>

<template>
  <div>
    <div
      v-if="blocks?.length === 0"
      class="text-dimmed text-center"
    >
      No blocks found.
    </div>
    <ClientOnly>
      <PreviewExample
        v-for="block in blocks"
        :key="block.id"
        :title="block.title"
      >
        <template #chart>
          <component
            :is="getBlockComponent(block._path)"
            v-if="active"
          />
        </template>
        <PreviewCode
          :id="block.id"
          :category="block.categorySlug"
          :block="block.slug"
          :lock-code="true"
        />
      </PreviewExample>
    </ClientOnly>
  </div>
</template>
