<script lang="ts" setup>
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { RepositoryAccessResult } from '~~/server/api/github/repository-access.post'
import { ProductMap } from '~~/utils/ProductMap'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UIcon = resolveComponent('UIcon')

const { user } = useUserSession()

type Payment = {
  id: string
  status: string
  amount_total: number
  meta?: {
    priceId: string
  }
}

function getProductName(priceId: string) {
  return ProductMap[priceId] || priceId
}

const route = useRoute()

// Define columns for the billing table
const billingColumns: TableColumn<Payment>[] = [
  {
    accessorKey: 'meta.priceId',
    header: 'Product',
    cell: ({ row }) => {
      const priceId = row.original.meta?.priceId
      if (!priceId) return '-'
      const product = getProductName(priceId)
      return typeof product === 'string' ? product : product.title
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string

      if (status === 'completed') {
        return h(
          UBadge,
          {
            color: 'success',
            variant: 'subtle',
            class: 'capitalize'
          },
          () => [
            h(UIcon, { name: 'i-lucide-check', class: 'h-3 w-3' }),
            'Paid'
          ]
        )
      } else if (status === 'pending') {
        return h(
          UBadge,
          {
            color: 'warning',
            variant: 'subtle',
            class: 'capitalize'
          },
          () => [
            h(UIcon, { name: 'i-lucide-clock', class: 'h-3 w-3' }),
            'Pending'
          ]
        )
      } else if (status === 'failed') {
        return h(
          UBadge,
          {
            color: 'error',
            variant: 'subtle',
            class: 'capitalize'
          },
          () => [h(UIcon, { name: 'i-lucide-x', class: 'h-3 w-3' }), 'Failed']
        )
      }

      return h(
        UBadge,
        {
          color: 'neutral',
          variant: 'subtle',
          class: 'capitalize'
        },
        () => status
      )
    }
  },
  {
    accessorKey: 'amount_total',
    header: () => h('div', { class: 'text-right' }, 'Amount'),
    cell: ({ row }) => {
      const amount = row.getValue('amount_total') as number
      const formatted = formatCurrency(amount ? amount / 100 : 0)
      return h('div', { class: 'text-right font-medium' }, formatted)
    }
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-right' }, 'Actions'),
    cell: () => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UButton,
          {
            color: 'neutral',
            variant: 'ghost',
            size: 'sm',
            onClick: downloadInvoice
          },
          () => [
            h(UIcon, {
              name: 'i-lucide-download',
              class: 'mr-1.5 h-3.5 w-3.5'
            }),
            'Invoice'
          ]
        )
      )
    }
  }
]

definePageMeta({
  middleware: ['auth'],
  alias: ['/payments']
})

useSeoMeta({
  title: 'Dashboard - Nuxt Charts',
  description:
    'Manage your repositories, billing history, and access your purchased components.',
  ogTitle: 'Dashboard - Nuxt Charts',
  ogDescription:
    'Manage your repositories, billing history, and access your purchased components.',
  ogType: 'website',
  ogSiteName: 'Nuxt Charts',
  ogImage: 'https://nuxtcharts.com/images/og/home.png',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Dashboard - Nuxt Charts',
  twitterDescription:
    'Manage your repositories, billing history, and access your purchased components.'
})

const toast = useToast()
const isLoading = ref(false)
const discountRequesting = ref(false)
const discountRequested = ref(false)

async function requestDiscount() {
  discountRequesting.value = true
  try {
    await $fetch('/api/payments/discount-request', { method: 'POST' })
    discountRequested.value = true
    toast.add({
      title: 'Request sent!',
      description: 'We\'ll send you a discount code shortly.',
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Something went wrong',
      description: 'Please try again later.',
      color: 'error'
    })
  } finally {
    discountRequesting.value = false
  }
}
const isUsernameModalOpen = ref(false)
const githubUsernameInput = ref('')
const activeTab = ref('repositories')

watchEffect(() => {
  const queryTab = route.query.tab as string
  if (queryTab) {
    if (queryTab === 'affiliate' && !isAllowedAffiliate.value) {
      activeTab.value = 'repositories'
    } else {
      activeTab.value = queryTab
    }
  }
})

const repositories = ref()
const payments = ref()

interface Token {
  id: string
  name: string
  createdAt: string
}

const tokens = ref<Token[]>([])

// Token generation for UI Editor
const isGeneratingToken = ref(false)
const uiEditorTokenName = ref('')
const showTokenModal = ref(false)
const generatedToken = ref('')

const allowedAffiliateEmails = [
  'seb@atinux.com',
  'mail@adriaansendennis.nl',
  'adriaansendennis@gmail.com'
]
const isAllowedAffiliate = computed(() => {
  return user.value?.email && allowedAffiliateEmails.includes(user.value.email)
})

// Fetch license data directly
const { data: licenseData } = await useFetch<{
  hasAllAccess: boolean
  hasUIThemeEditor: boolean
}>('/api/payments/has-license', {
  key: 'license-check-payments',
  default: () => ({ hasAllAccess: false, hasUIThemeEditor: false })
})
const hasAllAccess = computed(() => licenseData.value?.hasAllAccess ?? false)
const hasUIThemeEditor = computed(
  () => licenseData.value?.hasUIThemeEditor ?? false
)

// Token generation for CLI
const isGeneratingCLIToken = ref(false)
const cliTokenName = ref('')

// Affiliate logic
const affiliateEmail = ref('')
const selectedCountry = ref('FR')
const countries = [
  { label: 'France', value: 'FR' },
  { label: 'United States', value: 'US' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'Germany', value: 'DE' },
  { label: 'Canada', value: 'CA' },
  { label: 'Australia', value: 'AU' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'Spain', value: 'ES' },
  { label: 'Italy', value: 'IT' }
]
const isAffiliateLoading = ref(false)
const affiliateErrorMessage = ref('')
const affiliateStatus = ref<{
  isExistingAccount?: boolean
  needsOnboarding?: boolean
} | null>(null)

const canSubmitAffiliate = computed(() => {
  return Boolean(affiliateEmail.value || (user.value as any)?.email)
})

async function handleAffiliateSignup() {
  if (!canSubmitAffiliate.value) return

  isAffiliateLoading.value = true
  affiliateErrorMessage.value = ''

  try {
    const response = await $fetch<{
      url: string
      isExistingAccount?: boolean
      needsOnboarding?: boolean
    }>('/api/affiliate/onboard', {
      method: 'POST',
      body: {
        country: selectedCountry.value
      }
    })

    if (response?.url) {
      affiliateStatus.value = {
        isExistingAccount: response.isExistingAccount,
        needsOnboarding: response.needsOnboarding
      }
      await navigateTo(response.url, { external: true })
    } else {
      affiliateErrorMessage.value = 'No onboarding link returned.'
    }
  } catch (error: any) {
    affiliateErrorMessage.value
      = error.data?.message || error.message || 'Failed to start onboarding.'
    toast.add({
      title: 'Error',
      description: affiliateErrorMessage.value,
      color: 'error'
    })
  } finally {
    isAffiliateLoading.value = false
  }
}

async function fetchTokens() {
  try {
    const response = await $fetch<{ tokens: Token[] }>('/api/tokens')
    tokens.value = response.tokens || []
  } catch (error) {
    console.error('Failed to fetch tokens:', error)
  }
}

async function generateUIEditorToken() {
  if (!uiEditorTokenName.value.trim()) return

  isGeneratingToken.value = true
  try {
    const response = await $fetch<{ token: string }>('/api/tokens', {
      method: 'POST',
      body: { name: `ui-editor:${uiEditorTokenName.value.trim()}` }
    })

    generatedToken.value = response.token
    showTokenModal.value = true
    uiEditorTokenName.value = ''

    await fetchTokens()

    toast.add({
      title: 'Token Generated',
      description: 'Your UI Editor token has been generated successfully.',
      color: 'success'
    })
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to generate token.',
      color: 'error'
    })
  } finally {
    isGeneratingToken.value = false
  }
}

async function generateCLIToken() {
  if (!cliTokenName.value.trim()) return

  isGeneratingCLIToken.value = true
  try {
    const response = await $fetch<{ token: string }>('/api/tokens', {
      method: 'POST',
      body: { name: `cli:${cliTokenName.value.trim()}` }
    })

    generatedToken.value = response.token
    showTokenModal.value = true
    cliTokenName.value = ''

    await fetchTokens()

    toast.add({
      title: 'Token Generated',
      description: 'Your CLI token has been generated successfully.',
      color: 'success'
    })
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to generate token.',
      color: 'error'
    })
  } finally {
    isGeneratingCLIToken.value = false
  }
}

async function revokeToken(tokenId: string) {
  try {
    await $fetch(`/api/tokens/${tokenId}`, { method: 'DELETE' })
    await fetchTokens()
    toast.add({
      title: 'Token Revoked',
      description: 'The API token has been revoked successfully.',
      color: 'success'
    })
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to revoke token.',
      color: 'error'
    })
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function copyToken() {
  navigator.clipboard.writeText(generatedToken.value)
  toast.add({
    title: 'Copied',
    description: 'Token copied to clipboard.',
    color: 'success'
  })
}

onMounted(async () => {
  isLoading.value = true
  const storedUsername = getStoredGithubUsername()

  const [paymentsRes] = await Promise.all([
    $fetch('/api/payments'),
    fetchTokens()
  ])

  payments.value = paymentsRes

  if (storedUsername) {
    githubUsernameInput.value = storedUsername

    const response = await $fetch('/api/github/repositories', {
      headers: {
        'X-GitHub-Username': storedUsername
      }
    })

    repositories.value = response
  }
  isLoading.value = false
})

type AvailableRepoSlug = (typeof ProductMap)[keyof typeof ProductMap]['slug']

interface AvailableRepo {
  repoSlug: AvailableRepoSlug
  pageSlug: string
  productTitle: string
  productDescription: string
}

const availableRepos: AvailableRepo[] = [
  {
    repoSlug: 'nuxt-dashboard-2',
    pageSlug: '/templates/nuxt-dashboard',
    productTitle: 'Nuxt Dashboard 2',
    productDescription:
      'A modern, fully-featured dashboard template built with Nuxt UI v4 and Nuxt.'
  },
  {
    repoSlug: 'nuxt-planner-dashboard',
    pageSlug: '/templates/nuxt-planner',
    productTitle: 'Nuxt Planner',
    productDescription:
      'A clean Linear.app inspired planning and project management dashboard for Nuxt.'
  },
  {
    repoSlug: 'nuxt-shadcn-dashboard',
    pageSlug: '/templates/nuxt-shadcn-dashboard',
    productTitle: 'Nuxt shadcn/vue Dashboard',
    productDescription:
      'Beautiful dashboard template using shadcn/vue components with Nuxt.'
  },
  {
    repoSlug: 'nuxt-simplistic',
    pageSlug: '/templates/nuxt-simplistic',
    productTitle: 'Nuxt Simplistic',
    productDescription:
      'A clean and minimalist dashboard template focusing on simplicity.'
  },
  {
    repoSlug: 'nuxt-clean-gray-dashboard',
    pageSlug: '/templates/nuxt-clean-gray-dashboard',
    productTitle: 'Nuxt Clean Gray Dashboard',
    productDescription:
      'A clean and minimal gray-themed dashboard template for Nuxt.'
  },
  {
    repoSlug: 'nuxt-dashboard-e-commerce',
    pageSlug: '/templates/e-commerce-dashboard',
    productTitle: 'Nuxt E-commerce Dashboard',
    productDescription:
      'Complete e-commerce admin dashboard with analytics and management tools.'
  }
]

const availableRepositories = computed(() => {
  const filtered = repositories.value.filter((repo: any) =>
    availableRepos.some(ar => ar.repoSlug === repo.name)
  )
  // Sort by the order in availableRepos and merge with product info
  return filtered
    .map((repo: any) => {
      const productInfo = availableRepos.find(
        ar => ar.repoSlug === repo.name
      )
      return {
        ...repo,
        productTitle: productInfo?.productTitle,
        productDescription: productInfo?.productDescription,
        pageSlug: productInfo?.pageSlug
      }
    })
    .sort((a: any, b: any) => {
      return (
        availableRepos.findIndex(ar => ar.repoSlug === a.name)
        - availableRepos.findIndex(ar => ar.repoSlug === b.name)
      )
    })
})

const filteredPayments = computed(() => {
  return Array.isArray(payments.value)
    ? payments.value.filter(
        (i: any) =>
          !!i.meta?.priceId && (i.status === 'complete' || i.status === 'paid')
      )
    : []
})

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

async function downloadInvoice() {
  window.open(
    'https://billing.stripe.com/p/login/9AQ4hR8kL3sp3hC5kk',
    '_blank'
  )
}

function getStoredGithubUsername() {
  if (import.meta.client) {
    return localStorage.getItem('githubUsername')
  }
  return null
}

function saveGithubUsername(username: string) {
  if (import.meta.client) {
    localStorage.setItem('githubUsername', username)
  }
}

const repositoryInviteLoading = ref<Record<string, boolean>>({})

async function requestRepositoryAccess(repository: any) {
  const githubUsername = getStoredGithubUsername()

  if (!githubUsername) {
    isUsernameModalOpen.value = true
    return
  }

  try {
    repositoryInviteLoading.value[repository.name] = true

    const response = await $fetch<RepositoryAccessResult>(
      '/api/github/repository-access',
      {
        method: 'POST',
        body: {
          githubUsername,
          product: repository.name
        }
      }
    )

    // Handle response - should always be single repo now
    if ('link' in response) {
      toast.add({
        title: 'Invitation Sent',
        description: `An invitation has been sent to ${githubUsername} for ${repository.name}. Check your email.`,
        color: 'info'
      })

      // Update the repository status to show invitation was sent
      if (repositories.value) {
        const repo = repositories.value.find(
          (r: any) => r.name === repository.name
        )
        if (repo) {
          repo.userInvited = true
        }
      }
    } else if ('hasAccess' in response && response.hasAccess) {
      toast.add({
        title: 'Repository Access Granted',
        description: `You already have access to ${repository.name}`,
        color: 'success'
      })

      // Update the repository status
      if (repositories.value) {
        const repo = repositories.value.find(
          (r: any) => r.name === repository.name
        )
        if (repo) {
          repo.userInvited = true
        }
      }
    }
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description:
        error?.data?.message
        || error?.message
        || `Failed to grant repository access for ${repository.name}`,
      color: 'error'
    })
  } finally {
    repositoryInviteLoading.value[repository.name] = false
  }
}

function submitGithubUsername() {
  if (!githubUsernameInput.value.trim()) {
    toast.add({
      title: 'Error',
      description: 'Please enter a valid GitHub username.',
      color: 'error'
    })
    return
  }

  saveGithubUsername(githubUsernameInput.value.trim())
  isUsernameModalOpen.value = false

  window.location.reload()
}

const ImageMap = {
  0: {
    dark: '/images/dashboard/screenshots/0.png',
    light: '/images/dashboard/screenshots/0-light-mode.png'
  },
  1: {
    dark: '/images/planner/screenshots/1.png',
    light: '/images/planner/screenshots/1-light-mode.png'
  },
  2: {
    dark: '/images/shadcn-dashboard/screenshots/1.png',
    light: '/images/shadcn-dashboard/screenshots/1-light-mode.png'
  },
  3: {
    dark: '/images/simplistic/screenshots/1.png',
    light: '/images/simplistic/screenshots/1-light-mode.png'
  },
  4: {
    dark: '/images/clean-gray-dashboard/screenshots/1.png',
    light: '/images/clean-gray-dashboard/screenshots/1-light-mode.png'
  },
  5: {
    dark: '/images/e-commerce-dashboard/screenshots/1.png',
    light: '/images/e-commerce-dashboard/screenshots/1-light-mode.png'
  }
}
</script>

<template>
  <div class="py-32">
    <ClientOnly>
      <div class="">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="py-8">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-bold">
                  Hello, {{ user.name.split(" ")[0] }}
                </h1>
                <p class="mt-2 text-dimmed">
                  Manage your repositories and billing information
                </p>
              </div>

              <div
                v-if="!getStoredGithubUsername()"
                class="flex items-center gap-2"
              >
                <UIcon
                  name="i-lucide-info"
                  class="h-4 w-4 text-primary"
                />
                <span class="text-sm">
                  Add your GitHub username to access repositories
                </span>
                <UButton
                  size="sm"
                  color="primary"
                  @click="isUsernameModalOpen = true"
                >
                  Add Username
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div v-if="getStoredGithubUsername()">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <nav class="-mb-px flex gap-8">
            <button
              :class="[
                'border-b-2 py-4 text-sm font-medium transition-colors',
                activeTab === 'repositories'
                  ? 'border-primary text-foreground'
                  : 'border-transparent hover:text-foreground'
              ]"
              @click="activeTab = 'repositories'"
            >
              Templates
            </button>
            <button
              :class="[
                'border-b-2 py-4 text-sm font-medium transition-colors',
                activeTab === 'billing'
                  ? 'border-primary text-foreground'
                  : 'border-transparent hover:text-foreground'
              ]"
              @click="activeTab = 'billing'"
            >
              Billing
            </button>
            <button
              :class="[
                'border-b-2 py-4 text-sm font-medium transition-colors',
                activeTab === 'tokens'
                  ? 'border-primary text-foreground'
                  : 'border-transparent hover:text-foreground'
              ]"
              @click="activeTab = 'tokens'"
            >
              API Tokens
            </button>
            <button
              v-if="isAllowedAffiliate"
              :class="[
                'border-b-2 py-4 text-sm font-medium transition-colors',
                activeTab === 'affiliate'
                  ? 'border-primary text-foreground'
                  : 'border-transparent hover:text-foreground'
              ]"
              @click="activeTab = 'affiliate'"
            >
              Affiliate
            </button>
          </nav>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="flex items-center justify-center py-32"
      >
        <Loader />
      </div>

      <!-- Content Section -->
      <div
        v-else-if="getStoredGithubUsername()"
        class="mx-auto max-w-7xl p-6 lg:p-8 rounded-xl"
      >
        <!-- Repositories Tab -->
        <div v-if="activeTab === 'repositories'">
          <!-- Empty State -->
          <div
            v-if="repositories?.length === 0"
            class="py-32 text-center"
          >
            <div
              class="mx-auto h-12 w-12 rounded-full bg-gray-100 p-3 dark:bg-gray-900"
            >
              <UIcon
                name="i-lucide-folder-git-2"
                class="h-6 w-6 text-gray-400"
              />
            </div>
            <h3 class="mt-4 text-base font-semibold text-muted">
              No templates yet
            </h3>
            <p class="mt-2 text-sm text-muted">
              Purchase a template to get started with your next project.
            </p>
            <UButton
              to="/pricing"
              class="mt-6"
              color="neutral"
            >
              Browse Templates
            </UButton>
          </div>

          <!-- Templates Grid -->
          <div
            v-if="repositories && repositories.length > 0"
            class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <UCard
              v-for="(repo, repoKey) in availableRepositories"
              :key="repoKey"
              :ui="{
                header: 'p-0 sm:p-0'
              }"
              class="group relative flex flex-col overflow-hidden rounded-lg transition-all hover:shadow-lg"
            >
              <!-- Template Preview Image -->

              <template #header>
                <NuxtLink
                  :to="repo.pageSlug"
                  target="_blank"
                >
                  <div class="aspect-[16/10] overflow-hidden rounded-xl">
                    <img
                      class="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105 dark:hidden"
                      :src="ImageMap[repoKey]?.light"
                      :alt="
                        repo.full_name
                          .replace('nuxtcharts/', '')
                          .replaceAll('-', ' ')
                      "
                    >
                    <img
                      class="hidden h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105 dark:block"
                      :src="ImageMap[repoKey]?.dark"
                      :alt="
                        repo.full_name
                          .replace('nuxtcharts/', '')
                          .replaceAll('-', ' ')
                      "
                    >

                    <!-- Status Badge Overlay -->
                    <div
                      v-if="repoKey === 0 || repoKey === 1"
                      class="absolute right-6 top-6"
                    >
                      <UBadge
                        variant="soft"
                        label="NEW"
                      />
                    </div>
                  </div>
                </NuxtLink>
              </template>

              <!-- Template Info -->
              <div>
                <div class="flex-1">
                  <h3 class="text-base font-semibold capitalize">
                    {{
                      repo.productTitle
                        || repo.full_name
                          .replace("nuxtcharts/", "")
                          .replaceAll("-", " ")
                    }}
                  </h3>
                  <p
                    v-if="repo.productDescription"
                    class="mt-2 text-sm text-muted"
                  >
                    {{ repo.productDescription }}
                  </p>
                  <p
                    v-else-if="repo.purchaseDate"
                    class="mt-2 text-sm text-muted"
                  >
                    Purchased {{ repo.purchaseDate }}
                  </p>
                </div>

                <!-- Actions -->
                <div class="mt-6 flex items-center gap-2">
                  <a
                    :href="repo.html_url"
                    target="_blank"
                    class="flex-1"
                  >
                    <UButton
                      variant="outline"
                      color="neutral"
                      block
                      size="sm"
                    >
                      <UIcon
                        name="i-lucide-external-link"
                        class="mr-1.5 h-3.5 w-3.5"
                      />
                      View Repo
                    </UButton>
                  </a>

                  <UButton
                    v-if="!repo.userInvited"
                    :loading="repositoryInviteLoading[repo.name]"
                    color="neutral"
                    block
                    size="sm"
                    class="flex-1"
                    @click="requestRepositoryAccess(repo)"
                  >
                    <UIcon
                      name="i-lucide-user-plus"
                      class="mr-1.5 h-3.5 w-3.5"
                    />
                    Get Access
                  </UButton>
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <!-- Billing History Tab -->
        <div v-if="activeTab === 'billing'">
          <!-- Empty State -->
          <div
            v-if="filteredPayments?.length === 0"
            class="py-32 text-center"
          >
            <div
              class="mx-auto h-12 w-12 rounded-full bg-gray-100 p-3 dark:bg-gray-900"
            >
              <UIcon
                name="i-lucide-receipt"
                class="h-6 w-6 text-gray-400"
              />
            </div>
            <h3
              class="mt-4 text-base font-semibold text-gray-900 dark:text-white"
            >
              No billing history
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Your purchase history will appear here.
            </p>
          </div>

          <!-- Billing Table -->
          <UCard v-else>
            <UTable
              :data="filteredPayments"
              :columns="billingColumns"
              class="flex-1"
            />
          </UCard>
        </div>

        <!-- API Tokens Tab -->
        <div v-if="activeTab === 'tokens'">
          <div class="space-y-12">
            <div class="max-w-2xl">
              <h2 class="text-xl font-bold">
                API Tokens
              </h2>
              <p class="mt-2">
                Manage your tokens for CLI access and the UI Editor.
              </p>
            </div>

            <!-- No Access State -->
            <UAlert
              v-if="!hasAllAccess"
              icon="i-lucide-lock"
              color="error"
              variant="soft"
              title="Access Required"
              description="You do not have access to generate API tokens. Please purchase a license to unlock this feature."
              :actions="[{ label: 'View Pricing', to: '/', color: 'error' }]"
            />

            <template v-else>
              <!-- Tokens List -->
              <section class="space-y-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h2 class="text-lg font-semibold">
                      Active Tokens
                    </h2>
                    <p class="text-sm text-[var(--ui-text-dimmed)]">
                      Manage your existing API tokens and their access.
                    </p>
                  </div>
                  <UBadge
                    v-if="tokens.length"
                    :label="`${tokens.length} active`"
                    variant="subtle"
                    size="sm"
                    class="rounded-full"
                  />
                </div>

                <div
                  class="overflow-hidden rounded-xl border border-default bg-elevated/20"
                >
                  <div
                    v-if="tokens.length === 0"
                    class="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div
                      class="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                    >
                      <UIcon
                        name="i-lucide-key"
                        class="h-6 w-6 text-[var(--ui-text-muted)]"
                      />
                    </div>
                    <h3 class="text-sm font-medium">
                      No tokens yet
                    </h3>
                    <p class="mt-1 text-sm text-[var(--ui-text-dimmed)]">
                      Generate a token below to get started.
                    </p>
                  </div>

                  <ul
                    v-else
                    class="divide-y divide-(--ui-border)"
                  >
                    <li
                      v-for="token in tokens"
                      :key="token.id"
                      class="group flex items-center justify-between p-4 transition-colors bg-default"
                    >
                      <div class="flex items-center gap-4">
                        <div
                          class="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--ui-border-muted)] bg-[var(--ui-bg-muted)]"
                        >
                          <UIcon
                            :name="
                              token.name.startsWith('ui-editor:')
                                ? 'i-lucide-layout-template'
                                : 'i-lucide-terminal'
                            "
                            class="h-5 w-5 text-[var(--ui-text-toned)]"
                          />
                        </div>
                        <div>
                          <div class="flex items-center gap-2">
                            <span class="text-sm font-medium">
                              {{ token.name.replace(/^(cli|ui-editor):/, "") }}
                            </span>
                            <span
                              class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border border-[var(--ui-border-muted)] text-[var(--ui-text-dimmed)]"
                            >
                              {{
                                token.name.startsWith("ui-editor:")
                                  ? "UI Editor"
                                  : "CLI"
                              }}
                            </span>
                          </div>
                          <p class="text-xs text-[var(--ui-text-muted)]">
                            Created on {{ formatDate(token.createdAt) }}
                          </p>
                        </div>
                      </div>
                      <UButton
                        color="error"
                        variant="ghost"
                        icon="i-lucide-trash-2"
                        size="sm"
                        class="opacity-0 transition-opacity group-hover:opacity-100"
                        @click="revokeToken(token.id)"
                      >
                        Revoke
                      </UButton>
                    </li>
                  </ul>
                </div>
              </section>

              <div class="grid gap-8 lg:grid-cols-2">
                <!-- UI Editor Token Form -->
                <section class="space-y-4">
                  <h2
                    class="text-sm font-semibold uppercase tracking-wider text-[var(--ui-text-muted)]"
                  >
                    UI Editor Token
                  </h2>
                  <div
                    class="rounded-xl border border-[var(--ui-border-muted)] bg-[var(--ui-bg)] p-6"
                  >
                    <div class="space-y-4">
                      <p class="text-sm text-[var(--ui-text-dimmed)]">
                        Generate a token to save and export your UI config from
                        the
                        <NuxtLink
                          target="_blank"
                          class="text-[var(--ui-primary)] hover:underline"
                          to="https://ui.nuxtcharts.com/"
                        >Nuxt Charts UI Editor</NuxtLink>.
                      </p>
                      <UFormField
                        label="Token Name"
                        :ui="{
                          label:
                            'text-xs font-medium text-[var(--ui-text-dimmed)]'
                        }"
                      >
                        <div class="flex gap-2">
                          <UInput
                            v-model="uiEditorTokenName"
                            placeholder="e.g. My Local Project"
                            class="flex-1"
                            :disabled="isGeneratingToken"
                            @keyup.enter="generateUIEditorToken"
                          />
                          <UButton
                            :loading="isGeneratingToken"
                            :disabled="
                              !uiEditorTokenName.trim()
                                || (!hasAllAccess && !hasUIThemeEditor)
                            "
                            color="neutral"
                            @click="generateUIEditorToken"
                          >
                            Generate
                          </UButton>
                        </div>
                      </UFormField>
                    </div>
                  </div>
                </section>

                <!-- CLI Token Form -->
                <section class="space-y-4">
                  <h2
                    class="text-sm font-semibold uppercase tracking-wider text-[var(--ui-text-muted)]"
                  >
                    CLI Access Token
                  </h2>
                  <div
                    class="rounded-xl border border-[var(--ui-border-muted)] bg-[var(--ui-bg)] p-6"
                  >
                    <div class="space-y-4">
                      <p class="text-sm text-[var(--ui-text-dimmed)]">
                        Generate a token to download components directly via the
                        Nuxt Charts CLI.
                      </p>
                      <UFormField
                        label="Token Name"
                        :ui="{
                          label:
                            'text-xs font-medium text-[var(--ui-text-dimmed)]'
                        }"
                      >
                        <div class="flex gap-2">
                          <UInput
                            v-model="cliTokenName"
                            placeholder="e.g. Production CLI"
                            class="flex-1"
                            :disabled="isGeneratingCLIToken"
                            @keyup.enter="generateCLIToken"
                          />
                          <UButton
                            :loading="isGeneratingCLIToken"
                            :disabled="!cliTokenName.trim() || !hasAllAccess"
                            color="neutral"
                            @click="generateCLIToken"
                          >
                            Generate
                          </UButton>
                        </div>
                      </UFormField>
                    </div>
                  </div>
                </section>
              </div>
            </template>
          </div>
        </div>

        <!-- DashboardStack discount callout for premium users -->
        <div
          v-if="hasAllAccess"
          class="mx-auto max-w-7xl mt-6"
        >
          <UAlert
            v-if="hasAllAccess && user"
            icon="i-lucide-party-popper"
            color="primary"
            variant="subtle"
            class="mb-8"
            orientation="horizontal"
          >
            <template #title>
              Get €100 discount on <NuxtLink
                to="https://dashboardstack.sh/"
                target="_blank"
              >DashboardStack.sh</NuxtLink>
            </template>
            <template #actions>
              <UButton
                color="primary"
                variant="subtle"
                size="sm"
                :loading="discountRequesting"
                :disabled="discountRequested"
                @click="requestDiscount"
              >
                {{ discountRequested ? 'Request sent' : 'Request Discount' }}
              </UButton>
            </template>
          </UAlert>
        </div>

        <!-- Affiliate Tab -->
        <div v-if="activeTab === 'affiliate'">
          <div class="space-y-12">
            <div class="max-w-2xl">
              <h2 class="text-xl font-bold">
                Affiliate Program
              </h2>
              <p class="mt-2">
                Join the Nuxt Charts affiliate program and get paid for
                referrals.
              </p>
            </div>

            <div class="w-full">
              <UCard>
                <div class="space-y-6">
                  <UAlert
                    color="warning"
                    variant="soft"
                    title="Manual Verification Required"
                    description="Your affiliate account and referrals will only be tracked after manual verification by our team. This usually takes 24-48 hours."
                    icon="i-lucide-shield-check"
                  />

                  <UAlert
                    v-if="route.query.refresh"
                    title="Finish your onboarding"
                    description="Your onboarding session expired. Continue with a fresh link below."
                    icon="i-lucide-chevron-right"
                    variant="soft"
                  />

                  <div class="mb-6 flex items-center gap-4">
                    <div
                      class="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--ui-bg-accented)]/10"
                    >
                      <UIcon
                        name="i-simple-icons-stripe"
                        class="h-7 w-7 text-[#635BFF]"
                      />
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold">
                        Affiliate Dashboard
                      </h3>
                      <p class="text-sm text-muted">
                        Access your Stripe dashboard or complete your affiliate
                        setup.
                      </p>
                    </div>
                  </div>

                  <UFormField
                    v-if="!user"
                    label="Email"
                    description="Enter your email to access your affiliate dashboard or create a new account."
                    required
                  >
                    <UInput
                      v-model="affiliateEmail"
                      type="email"
                      placeholder="you@example.com"
                    />
                  </UFormField>

                  <UFormField
                    label="Business Country"
                    description="Select the country where you or your business is located."
                    required
                  >
                    <USelect
                      v-model="selectedCountry"
                      :items="countries"
                      class="w-full"
                    />
                  </UFormField>

                  <div
                    class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div class="text-xs text-dimmed max-w-md">
                      If you already have an affiliate account, you'll be
                      redirected to your Stripe dashboard. Otherwise, you'll be
                      guided through the setup process.
                    </div>
                    <UButton
                      color="neutral"
                      :loading="isAffiliateLoading"
                      :disabled="!canSubmitAffiliate"
                      @click="handleAffiliateSignup"
                    >
                      <UIcon
                        name="i-lucide-external-link"
                        class="mr-1.5 h-4 w-4"
                      />
                      Open Stripe Dashboard
                    </UButton>
                  </div>

                  <p
                    v-if="affiliateErrorMessage"
                    class="text-sm text-error"
                  >
                    {{ affiliateErrorMessage }}
                  </p>
                </div>
              </UCard>
            </div>
          </div>
        </div>
      </div>

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

      <!-- GitHub Username Modal -->
      <UModal v-model:open="isUsernameModalOpen">
        <template #content>
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-900"
                >
                  <UIcon
                    name="i-lucide-github"
                    class="h-5 w-5"
                  />
                </div>
                <div>
                  <h3 class="text-lg font-semibold">
                    Connect GitHub Account
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Enter your GitHub username to access repositories
                  </p>
                </div>
              </div>
            </template>

            <div class="space-y-4">
              <UFormField
                label="GitHub Username"
                required
                help="You'll receive an email invitation to access your purchased repositories"
              >
                <UInput
                  v-model="githubUsernameInput"
                  class="w-full"
                  placeholder="octocat"
                  :loading="isLoading"
                  @keyup.enter="submitGithubUsername"
                />
              </UFormField>
            </div>

            <template #footer>
              <div class="flex justify-end gap-3">
                <UButton
                  color="neutral"
                  variant="outline"
                  @click="isUsernameModalOpen = false"
                >
                  Cancel
                </UButton>
                <UButton
                  :loading="isLoading"
                  :disabled="!githubUsernameInput.trim()"
                  @click="submitGithubUsername"
                >
                  Connect
                </UButton>
              </div>
            </template>
          </UCard>
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>
