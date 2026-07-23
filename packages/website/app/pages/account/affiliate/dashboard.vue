<script setup lang="ts">
const route = useRoute()
const { user } = useUserSession()

const accountId = computed(() => {
  const queryAccount = typeof route.query.account === 'string' ? route.query.account : ''
  return queryAccount || ''
})

interface AffiliateStatusResponse {
  status: string
  onboardingCompleted: boolean
  stripeAccountId?: string
  chargesEnabled?: boolean
  payoutsEnabled?: boolean
}

const { data, pending, refresh } = await useFetch<AffiliateStatusResponse>('/api/affiliate/account-status')

const statusLabel = computed(() => data.value?.status || 'not_registered')

const copyAffiliateId = async () => {
  const id = String(data.value?.stripeAccountId || accountId.value || '')
  if (!id) return
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(id)
  }
}

useSeoMeta({
  title: 'Affiliate Dashboard - Nuxt Charts',
  description: 'Check your Stripe Connect affiliate onboarding status.'
})
</script>

<template>
  <div class="max-w-3xl mx-auto py-12 px-6 mt-24">
    <div class="mb-8">
      <h1 class="text-3xl font-semibold text-highlighted">
        Affiliate dashboard
      </h1>
      <p class="mt-2 text-muted">
        Track your onboarding status and copy your affiliate ID.
      </p>
    </div>

    <UCard>
      <div
        v-if="pending"
        class="text-muted"
      >
        Loading your affiliate status...
      </div>

      <template v-else>
        <div
          v-if="statusLabel === 'not_registered'"
          class="space-y-4"
        >
          <p class="text-muted">
            We couldn't find an affiliate account yet.
          </p>
          <UButton
            color="primary"
            @click="navigateTo('/account?tab=affiliate')"
          >
            Start onboarding
          </UButton>
        </div>

        <div
          v-else
          class="space-y-6"
        >
          <div class="flex flex-wrap items-center gap-3">
            <span class="text-sm text-muted">Status</span>
            <UBadge
              color="primary"
              variant="soft"
            >
              {{ statusLabel }}
            </UBadge>
          </div>

          <!-- <UFormField
            label="Affiliate ID"
            description="Use this ID as your affiliate reference in Stripe checkout metadata."
          >
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
              <UInput
                :model-value="data?.stripeAccountId || accountId"
                readonly
                class="flex-1"
              />
              <UButton
                color="primary"
                @click="copyAffiliateId"
              >
                Copy ID
              </UButton>
            </div>
          </UFormField> -->

          <div class="grid gap-4 sm:grid-cols-2">
            <UCard>
              <div class="space-y-1">
                <p class="text-sm text-muted">
                  Charges enabled
                </p>
                <p class="text-lg font-semibold text-highlighted">
                  {{ data?.chargesEnabled ? 'Yes' : 'No' }}
                </p>
              </div>
            </UCard>
            <UCard>
              <div class="space-y-1">
                <p class="text-sm text-muted">
                  Payouts enabled
                </p>
                <p class="text-lg font-semibold text-highlighted">
                  {{ data?.payoutsEnabled ? 'Yes' : 'No' }}
                </p>
              </div>
            </UCard>
          </div>

          <div class="flex flex-wrap gap-3">
            <UButton
              color="primary"
              @click="refresh()"
            >
              Refresh status
            </UButton>
            <UButton
              color="neutral"
              variant="soft"
              @click="navigateTo('/account?tab=affiliate')"
            >
              Update onboarding
            </UButton>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>
