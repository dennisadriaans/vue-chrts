<script setup lang="ts">
import { getBlockCode } from '~/composables/useBlockCode'
import { useButtonTracking } from '~/composables/useButtonTracking'

type CodeBlock = {
  label: string
  code: string
  language?: string
}

type CodeProps = {
  id: string
  category?: string
  block?: string
  code?: string | CodeBlock[]
  language?: string
}

const hasAllAccess = inject<Ref<boolean>>('hasAllAccess', ref(false))

const { loggedIn } = useUserSession()

const props = defineProps<CodeProps>()

const route = useRoute()

const fetchedCode = ref<string | CodeBlock[] | null>(null)
const isLoading = ref(false)
const activeTab = ref('0')

// Simple access checks
const showSignIn = computed(() => !loggedIn.value)
const showUpgrade = computed(() => loggedIn.value && !hasAllAccess.value)
const hasAccess = computed(() => loggedIn.value && hasAllAccess.value)

// Code helpers
const isCodeArray = computed(() => Array.isArray(fetchedCode.value))
const currentCode = computed(() => {
  if (isCodeArray.value) {
    const blocks = fetchedCode.value as CodeBlock[]
    const index = parseInt(activeTab.value)
    return blocks[index]?.code || ''
  }
  return fetchedCode.value as string || ''
})

const currentLanguage = computed(() => {
  if (isCodeArray.value) {
    const blocks = fetchedCode.value as CodeBlock[]
    const index = parseInt(activeTab.value)
    return blocks[index]?.language || props.language || 'vue'
  }
  return props.language || 'vue'
})

const tabItems = computed(() => {
  if (!isCodeArray.value) return []
  return (fetchedCode.value as CodeBlock[]).map((block, index) => ({
    label: block.label,
    value: index.toString()
  }))
})

function toFencedCodeBlock(codeText: string, language: string) {
  const backtickRuns = codeText.match(/`+/g) || []
  const maxRun = backtickRuns.reduce((max, run) => Math.max(max, run.length), 0)
  const fence = '`'.repeat(Math.max(3, maxRun + 1))
  const normalizedCode = codeText.endsWith('\n') ? codeText : `${codeText}\n`
  return `${fence}${language}\n${normalizedCode}${fence}`
}

const currentMarkdown = computed(() => {
  if (!currentCode.value) return ''
  return toFencedCodeBlock(currentCode.value, currentLanguage.value)
})

function authAndRedirect(provider: 'github' | 'google' = 'github') {
  const finalProvider = import.meta.dev ? 'google' : provider

  const { trackLogin } = useButtonTracking()
  trackLogin(finalProvider)

  const redirectCookie = useCookie('redirectPath', { path: '/' })
  redirectCookie.value = `${route.path}?code=${props.id}`
  window.location.href = `/api/auth/${finalProvider}`
}

async function fetchCode() {
  if (fetchedCode.value || isLoading.value || !hasAllAccess.value) return

  isLoading.value = true

  try {
    // Use provided code or fetch from category/block
    if (props.code) {
      fetchedCode.value = props.code
    } else if (props.category && props.block) {
      const rawCodeImport = getBlockCode(props.category, props.block)
      if (rawCodeImport) {
        fetchedCode.value = await rawCodeImport()
      }
    }
  } catch (error) {
    console.error('Failed to fetch code:', error)
  } finally {
    isLoading.value = false
  }
}

// Auto-fetch when access is granted
watch(hasAccess, (access) => {
  if (access && !fetchedCode.value) {
    void fetchCode()
  }
})

onMounted(async () => {
  if (hasAccess.value) {
    void fetchCode()
  }
})
</script>

<template>
  <div>
    <UCard
      v-if="isLoading"
      class="flex h-full min-h-[400px] items-center justify-center"
    >
      <Loader />
    </UCard>

    <!-- Sign In screen (not authenticated) -->
    <UCard
      v-else-if="showSignIn"
      class="flex-1"
      :ui="{ body: 'h-full' }"
    >
      <div class="flex min-h-[260px] items-center justify-center">
        <div class="text-dimmed max-w-xs text-center">
          Please
          <UButton
            variant="link"
            color="neutral"
            size="xl"
            class="!p-0 text-(--ui-primary) underline"
            @click="authAndRedirect('github')"
          >
            log in
          </UButton>
          to get access to the source code of premium components.
        </div>
      </div>
    </UCard>

    <!-- Upgrade screen (authenticated but no license) -->
    <UCard
      v-else-if="showUpgrade"
      class="flex h-full flex-col items-center justify-center border border-(--ui-border-accented) bg-(--ui-bg-elevated) p-8 text-center"
    >
      <div class="space-y-2">
        <h3 class="text-xl font-semibold text-(--ui-text-highlighted)">
          Unlock Premium Source Code
        </h3>
        <p class="text-toned dark:text-muted">
          Get Nuxt Charts PRO to view and use the source code for all premium components.
        </p>
        <NuxtLink to="/pricing">
          <UButton
            icon="i-lucide-lock"
            trailing-icon="i-lucide-chevron-right"
            size="lg"
            color="primary"
            class="mt-4"
            @click="useButtonTracking().trackSelectContent('upsell', props.id)"
          >
            Get All-Access
          </UButton>
        </NuxtLink>
      </div>
    </UCard>

    <!-- Code display (has access) -->
    <div v-else-if="hasAccess && fetchedCode">
      <UTabs
        v-if="isCodeArray && tabItems.length > 0"
        v-model="activeTab"
        :items="tabItems"
        :content="false"
        size="sm"
        color="neutral"
        :ui="{
          list: 'rounded-full',
          indicator: 'rounded-full',
          label: 'text-sm'
        }"
      />

      <Suspense>
        <template #default>
          <MDC
            v-if="currentMarkdown"
            :value="currentMarkdown"
            class="-mt-4"
          />
        </template>
        <template #fallback>
          <div class="flex min-h-100 items-center justify-center h-full">
            <Loader />
          </div>
        </template>
      </Suspense>
    </div>
  </div>
</template>
