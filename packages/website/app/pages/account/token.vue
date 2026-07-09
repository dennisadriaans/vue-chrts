<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  middleware: ['auth']
})

useSeoMeta({
  title: 'API Token - Nuxt Charts',
  description: 'Generate API tokens for CLI access to your purchased components.'
})

const toast = useToast()

interface Token {
  id: string
  name: string
  createdAt: string
}

const tokens = ref<Token[]>([])
const isGenerating = ref(false)
const newTokenName = ref('')
const showTokenModal = ref(false)
const generatedToken = ref('')
const loading = ref(true)

// Fetch license data directly
const { data: licenseData } = await useFetch<{ hasAllAccess: boolean }>('/api/payments/has-license', {
  key: 'license-check-token',
  default: () => ({ hasAllAccess: false, hasUIThemeEditor: false })
})
const hasAllAccess = computed(() => licenseData.value?.hasAllAccess ?? false)

onMounted(async () => {
  loading.value = true
  try {
    const tokensRes = await $fetch<{ tokens: Token[] }>('/api/tokens')
    tokens.value = tokensRes.tokens || []
  } catch (error) {
    console.error('Failed to load tokens:', error)
  } finally {
    loading.value = false
  }
})

const canGenerateToken = computed(() => {
  return hasAllAccess.value && newTokenName.value.trim().length > 0
})

async function generateToken() {
  if (!hasAllAccess.value) {
    toast.add({
      title: 'Access Denied',
      description: 'You do not have access to generate tokens.',
      color: 'error'
    })
    return
  }
  if (!canGenerateToken.value) return

  isGenerating.value = true
  try {
    const response = await $fetch<{ token: string }>('/api/tokens', {
      method: 'POST',
      body: { name: `cli:${newTokenName.value.trim()}` }
    })

    generatedToken.value = response.token
    showTokenModal.value = true
    newTokenName.value = ''

    const tokensResponse = await $fetch<{ tokens: Token[] }>('/api/tokens')
    tokens.value = tokensResponse.tokens || []

    toast.add({
      title: 'Token Generated',
      description: 'Your API token has been generated successfully.',
      color: 'success'
    })
  } catch (error: unknown) {
    const err = error as { data?: { message?: string } }
    toast.add({
      title: 'Error',
      description: err.data?.message || 'Failed to generate token.',
      color: 'error'
    })
  } finally {
    isGenerating.value = false
  }
}

async function revokeToken(tokenId: string) {
  try {
    await $fetch(`/api/tokens/${tokenId}`, { method: 'DELETE' })
    const response = await $fetch<{ tokens: Token[] }>('/api/tokens')
    tokens.value = response.tokens || []
    toast.add({
      title: 'Token Revoked',
      description: 'The API token has been revoked successfully.',
      color: 'success'
    })
  } catch (error: unknown) {
    const err = error as { data?: { message?: string } }
    toast.add({
      title: 'Error',
      description: err.data?.message || 'Failed to revoke token.',
      color: 'error'
    })
  }
}

function copyToken() {
  navigator.clipboard.writeText(generatedToken.value)
  toast.add({
    title: 'Copied',
    description: 'Token copied to clipboard.',
    color: 'success'
  })
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <UContainer class="py-24">
    <UPage>
      <UPageHeader
        title="API Tokens"
        description="Generate tokens for CLI access to your purchased components."
        :links="[{
          label: 'Back to Dashboard',
          to: '/payments',
          icon: 'i-lucide-arrow-left',
          color: 'neutral',
          variant: 'ghost'
        }]"
      />

      <UPageBody>
        <div
          v-if="loading"
          class="flex items-center justify-center py-24"
        >
          <UIcon
            name="i-lucide-loader"
            class="text-dimmed h-8 w-8 animate-spin"
          />
        </div>

        <div
          v-else
          class="space-y-12"
        >
          <!-- No Access State -->
          <UAlert
            v-if="!hasAllAccess"
            icon="i-lucide-lock"
            color="error"
            variant="soft"
            title="Access Required"
            description="You do not have access to generate API tokens. Please purchase a license to unlock this feature."
            :actions="[{ label: 'View Pricing', to: '/pricing', color: 'error' }]"
          />

          <template v-else>
            <!-- Info Alert -->
            <UAlert
              icon="i-lucide-info"
              color="info"
              variant="soft"
              title="How to use your token"
              description="Check the CLI Documentation for instructions on how to use the CLI."
              :actions="[{ label: 'Read Docs', to: '/docs/getting-started/cli', target: '_blank', color: 'info', variant: 'link' }]"
            />

            <!-- Tokens List -->
            <section class="space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">
                  Your Tokens
                </h2>
                <UBadge
                  v-if="tokens.length"
                  :label="`${tokens.length} active`"
                  color="neutral"
                  variant="subtle"
                />
              </div>

              <UCard :ui="{ body: 'p-0' }">
                <div
                  v-if="tokens.length === 0"
                  class="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div
                    class="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                  >
                    <UIcon
                      name="i-lucide-key"
                      class="text-dimmed h-6 w-6"
                    />
                  </div>
                  <h3 class="text-sm font-medium">
                    No tokens yet
                  </h3>
                  <p class="text-dimmed mt-1 text-sm">
                    Generate your first API token to start using the CLI.
                  </p>
                </div>

                <ul
                  v-else
                  class="divide-(--ui-border-default) divide-y"
                >
                  <li
                    v-for="token in tokens"
                    :key="token.id"
                    class="flex items-center justify-between"
                  >
                    <div class="flex items-center gap-4">
                      <div
                        class="bg-muted flex h-10 w-10 items-center justify-center rounded-lg"
                      >
                        <UIcon
                          name="i-lucide-key"
                          class="text-toned h-5 w-5"
                        />
                      </div>
                      <div>
                        <p class="text-sm font-medium">
                          {{ token.name }}
                        </p>
                        <p class="text-dimmed text-xs">
                          Created {{ formatDate(token.createdAt) }}
                        </p>
                      </div>
                    </div>
                    <UButton
                      color="error"
                      variant="ghost"
                      icon="i-lucide-trash-2"
                      size="sm"
                      @click="revokeToken(token.id)"
                    >
                      Revoke
                    </UButton>
                  </li>
                </ul>
              </UCard>
            </section>

            <!-- Generate Token Form -->
            <section class="space-y-4">
              <h2 class="text-lg font-semibold">
                Generate New Token
              </h2>
              <UCard>
                <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <UFormField
                    label="Token Name"
                    class="flex-1"
                    description="Give your token a descriptive name to identify it later."
                  >
                    <UInput
                      v-model="newTokenName"
                      placeholder="e.g. Production CLI"
                      :disabled="isGenerating"
                      class="w-full"
                      @keyup.enter="generateToken"
                    />
                  </UFormField>
                  <UButton
                    :loading="isGenerating"
                    :disabled="!canGenerateToken"
                    icon="i-lucide-plus"
                    class="sm:mb-6"
                    @click="generateToken"
                  >
                    Generate
                  </UButton>
                </div>
              </UCard>
            </section>
          </template>
        </div>
      </UPageBody>
    </UPage>

    <!-- Token Modal -->
    <UModal v-model:open="showTokenModal">
      <template #content>
        <UCard :ui="{ header: 'border-b-0', footer: 'border-t-0' }">
          <template #header>
            <div class="flex items-center gap-3">
              <div
                class="bg-success/10 flex h-10 w-10 items-center justify-center rounded-full"
              >
                <UIcon
                  name="i-lucide-check"
                  class="text-success h-6 w-6"
                />
              </div>
              <div>
                <h3 class="text-lg font-semibold">
                  Token Generated
                </h3>
                <p class="text-dimmed text-sm">
                  Copy this token and store it securely.
                </p>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <UAlert
              color="warning"
              variant="soft"
              icon="i-lucide-alert-triangle"
              title="Security Warning"
              description="You won't be able to see this token again once you close this window."
            />

            <UFormField label="Your API Token">
              <div class="flex items-center gap-2">
                <UInput
                  :value="generatedToken"
                  readonly
                  class="w-full font-mono text-sm"
                  :ui="{ base: 'bg-muted' }"
                />
                <UButton
                  variant="outline"
                  icon="i-lucide-copy"
                  @click="copyToken"
                >
                  Copy
                </UButton>
              </div>
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end">
              <UButton
                color="neutral"
                @click="showTokenModal = false"
              >
                Done
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </UContainer>
</template>
