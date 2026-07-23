<script setup lang="ts">
definePageMeta({
  layout: 'storybook',
  middleware: ['storybook']
})

const languageOptions = [
  { label: 'Vue', value: 'vue' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'CSS', value: 'css' },
  { label: 'JSON', value: 'json' },
  { label: 'Bash', value: 'bash' }
]

const variantOptions = [
  { label: 'MDC (default)', value: 'mdc' },
  { label: 'Shiki', value: 'shiki' },
  { label: 'Lowlight', value: 'lowlight' }
]

const data = reactive({
  variant: 'shiki' as 'mdc' | 'shiki' | 'lowlight',
  language: 'vue',
  filename: 'MyComponent.vue'
})

const snippets: Record<string, string> = {
  vue: `<script setup lang="ts">
const count = ref(0)
const doubled = computed(() => count.value * 2)
${'<'}/script>

<template>
  <div class="flex flex-col items-center gap-4 p-8">
    <p class="text-lg font-semibold">Count: {{ count }}</p>
    <p class="text-sm text-muted">Doubled: {{ doubled }}</p>
    <UButton @click="count++">Increment</UButton>
  </div>
</template>`,
  typescript: `import { ref, computed } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

export function useUsers() {
  const users = ref<User[]>([])
  const loading = ref(false)

  async function fetchUsers(): Promise<void> {
    loading.value = true
    try {
      const response = await fetch('/api/users')
      users.value = await response.json()
    } finally {
      loading.value = false
    }
  }

  const activeUsers = computed(() =>
    users.value.filter(u => u.email.includes('@'))
  )

  return { users, loading, fetchUsers, activeUsers }
}`,
  javascript: `export function debounce(fn, delay = 300) {
  let timer = null

  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

const search = debounce(async (query) => {
  const res = await fetch(\`/api/search?q=\${query}\`)
  return res.json()
}, 400)`,
  css: `@layer components {
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    transition: background-color 0.2s ease;
  }

  .btn-primary {
    background-color: var(--ui-primary);
    color: var(--ui-text-inverted);
  }

  .btn-primary:hover {
    background-color: color-mix(in srgb, var(--ui-primary) 85%, black);
  }
}`,
  json: `{
  "name": "nuxt-app",
  "version": "1.0.0",
  "dependencies": {
    "nuxt": "^4.0.0",
    "@nuxt/ui": "^4.2.1",
    "vue": "^3.5.22"
  },
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate"
  }
}`,
  bash: `# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Run type checking
pnpm typecheck

# Run tests
pnpm test:unit`
}

const currentCode = computed(() => snippets[data.language] ?? snippets.vue ?? '')
</script>

<template>
  <StorybookPage
    title="CodeBlock"
    description="Syntax-highlighted code blocks with three rendering backends."
  >
    <StorybookPreview
      resizable
      :default-width="70"
    >
      <LibCodeBlock
        :key="`${data.variant}-${data.language}`"
        :code="currentCode"
        :language="data.language"
        :filename="data.filename || undefined"
        :variant="data.variant"
      />
    </StorybookPreview>

    <StorybookControls>
      <StorybookSelectControl
        v-model="data.variant"
        label="Variant"
        description="Rendering backend for syntax highlighting"
        :options="variantOptions"
      />
      <StorybookSelectControl
        v-model="data.language"
        label="Language"
        description="Programming language for syntax highlighting"
        :options="languageOptions"
      />
      <StorybookInputControl
        v-model="data.filename"
        label="Filename"
        description="Displayed in the toolbar header"
        input-class="w-48"
      />
    </StorybookControls>

    <div class="space-y-6">
      <h2 class="text-lg font-semibold text-highlighted">
        All Variants Comparison
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="v in variantOptions"
          :key="v.value"
          :ui="{ body: 'p-0 overflow-hidden' }"
        >
          <!-- <template #header>
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold">{{ v.label }}</span>
              <UBadge
                v-if="v.value === 'shiki'"
                size="sm"
                variant="subtle"
              >
                Recommended
              </UBadge>
            </div>
          </template> -->
          <LibCodeBlock
            :key="`all-${v.value}-${data.language}`"
            :code="currentCode"
            :language="data.language"
            :filename="v.label"
            :variant="(v.value as 'mdc' | 'shiki' | 'lowlight')"
          />
        </div>
      </div>
    </div>
  </StorybookPage>
</template>
