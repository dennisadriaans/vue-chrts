<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  middleware: 'admin',
  title: 'Affiliate Commissions'
})

interface Commission {
  id: string
  amount: number
  currency: string
  status: string
  orderId: string
  stripeTransferId: string | null
  stripeInvoiceUrl: string | null
  paymentIntentId: string | null
  paymentDashboardUrl: string | null
  createdAt: Date
  paidAt: Date | null
  metadata: string | null
  customerEmail: string | null
  affiliate: {
    id: string
    stripeAccountId: string
    status: string
    user: {
      id: string
      name: string
      email: string
    }
  }
}

const { data: commissions, pending, refresh } = await useFetch<{ commissions: Commission[] }>('/api/admin/affiliates/commissions')

const processingPayment = ref<string | null>(null)
const processingPayAll = ref(false)
const affiliateFilter = ref<string>('')

const formatDate = (date: Date | null) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase()
  }).format(amount)
}

const handlePayout = async (commissionId: string) => {
  if (!confirm('Are you sure you want to process this payout?')) {
    return
  }

  processingPayment.value = commissionId

  try {
    const result = await $fetch('/api/admin/affiliates/pay', {
      method: 'POST',
      body: { commissionId }
    })

    console.log('Payout result:', result)
    const r = result as { message?: string, commission?: { amount: number }, transferId?: string, stripeInvoiceUrl?: string | null }
    alert(`${r.message}\n\nCommission: €${r.commission?.amount}\nTransfer: ${r.transferId}\nInvoice: ${r.stripeInvoiceUrl || 'none'}`)
    await refresh()
  } catch (err: unknown) {
    const message = (err as { data?: { message?: string }, statusMessage?: string, message?: string })?.data?.message
      || (err as { statusMessage?: string })?.statusMessage
      || (err instanceof Error ? err.message : String(err))
    console.error('Payout error:', err)
    alert(`Error processing payout:\n${message}`)
  } finally {
    processingPayment.value = null
  }
}

const handlePayAll = async () => {
  const count = pendingCommissions.value.length
  if (!count) return

  if (!confirm(`Are you sure you want to process ALL ${count} pending commissions?\n\nThis will create a single invoice and transfer for €${totalPending.value.toFixed(2)}.`)) {
    return
  }

  processingPayAll.value = true

  try {
    const result = await $fetch('/api/admin/affiliates/pay-all', {
      method: 'POST',
      body: {}
    })

    console.log('Pay all result:', result)
    alert(result.message)
    await refresh()
  } catch (err: unknown) {
    const message = (err as { data?: { message?: string }, statusMessage?: string })?.data?.message
      || (err as { statusMessage?: string })?.statusMessage
      || (err instanceof Error ? err.message : String(err))
    console.error('Pay all error:', err)
    alert(`Error processing batch payout:\n${message}`)
  } finally {
    processingPayAll.value = false
  }
}

const pendingCommissions = computed(() => {
  if (!affiliateFilter.value.toLowerCase()) {
    return commissions.value?.commissions.filter(c => c.status === 'PENDING') || []
  }
  const filter = affiliateFilter.value.toLowerCase()
  return commissions.value?.commissions.filter((c) => {
    const affiliateId = c.affiliate?.id?.toLowerCase() || ''
    const affiliateName = c.affiliate?.user?.name?.toLowerCase() || ''
    const affiliateEmail = c.affiliate?.user?.email?.toLowerCase() || ''
    return (affiliateId.includes(filter) || affiliateName.includes(filter) || affiliateEmail.includes(filter)) && c.status === 'PENDING'
  }) || []
})

const paidCommissions = computed(() => {
  if (!affiliateFilter.value.toLowerCase()) {
    return commissions.value?.commissions.filter(c => c.status === 'PAID') || []
  }
  const filter = affiliateFilter.value.toLowerCase()
  return commissions.value?.commissions.filter((c) => {
    const affiliateId = c.affiliate?.id?.toLowerCase() || ''
    const affiliateName = c.affiliate?.user?.name?.toLowerCase() || ''
    const affiliateEmail = c.affiliate?.user?.email?.toLowerCase() || ''
    return (affiliateId.includes(filter) || affiliateName.includes(filter) || affiliateEmail.includes(filter)) && c.status === 'PAID'
  }) || []
})

const totalPending = computed(() => {
  return pendingCommissions.value.reduce((sum, c) => sum + c.amount, 0)
})

const totalPaid = computed(() => {
  return paidCommissions.value.reduce((sum, c) => sum + c.amount, 0)
})

const stripePaymentsListUrl = computed(() => {
  const sample = commissions.value?.commissions.find(c => c.paymentDashboardUrl)?.paymentDashboardUrl
  if (!sample) return ''
  return sample.replace(/\/payments\/[^/]+$/, '/payments')
})

const pendingColumns: TableColumn<Commission>[] = [
  { id: 'affiliate', header: 'Affiliate' },
  { id: 'customerEmail', header: 'Customer' },
  { id: 'amount', header: 'Amount' },
  { id: 'orderId', header: 'Order ID' },
  { id: 'payment', header: 'Payment' },
  { id: 'createdAt', header: 'Created' },
  { id: 'status', header: 'Status' },
  { id: 'action', header: 'Action' }
]

const paidColumns: TableColumn<Commission>[] = [
  { id: 'affiliate', header: 'Affiliate' },
  { id: 'customerEmail', header: 'Customer' },
  { id: 'amount', header: 'Amount' },
  { id: 'orderId', header: 'Order ID' },
  { id: 'payment', header: 'Payment' },
  { id: 'invoice', header: 'Invoice' },
  { id: 'paidAt', header: 'Paid At' },
  { id: 'stripeTransferId', header: 'Transfer ID' },
  { id: 'status', header: 'Status' }
]
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">
        Affiliate Commissions
      </h1>
      <p class="text-muted">
        Manage and process affiliate payouts
      </p>
    </div>

    <!-- Affiliate Filter -->
    <div class="mb-6">
      <UInput
        v-model="affiliateFilter"
        placeholder="Filter by affiliate ID, name, or email..."
        icon="i-lucide-search"
      />
    </div>

    <div
      v-if="pending"
      class="text-center py-12"
    >
      <p class="text-muted">
        Loading commissions...
      </p>
    </div>

    <div
      v-else-if="!commissions?.commissions.length"
      class="text-center py-12"
    >
      <p class="text-muted">
        No commissions found
      </p>
    </div>

    <div
      v-else
      class="space-y-8"
    >
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UCard>
          <div class="text-center">
            <p class="text-sm text-muted mb-1">
              Total Pending
            </p>
            <p class="text-2xl font-bold text-highlighted">
              {{ formatCurrency(totalPending, 'usd') }}
            </p>
            <p class="text-sm text-muted mt-1">
              {{ pendingCommissions.length }} commission(s)
            </p>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <p class="text-sm text-muted mb-1">
              Total Paid
            </p>
            <p class="text-2xl font-bold text-highlighted">
              {{ formatCurrency(totalPaid, 'usd') }}
            </p>
            <p class="text-sm text-muted mt-1">
              {{ paidCommissions.length }} commission(s)
            </p>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <p class="text-sm text-muted mb-1">
              Total Commissions
            </p>
            <p class="text-2xl font-bold text-highlighted">
              {{ commissions.commissions.length }}
            </p>
            <ULink
              v-if="stripePaymentsListUrl"
              :to="stripePaymentsListUrl"
              target="_blank"
              rel="noopener"
              class="mt-2 inline-flex text-xs font-medium underline"
            >
              View payments in Stripe
            </ULink>
          </div>
        </UCard>
      </div>

      <!-- Pending Commissions -->
      <div v-if="pendingCommissions.length">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold">
            Pending Commissions
          </h2>
          <div class="flex items-center gap-2">
            <UButton
              color="primary"
              variant="solid"
              icon="i-lucide-banknote"
              :loading="processingPayAll"
              :disabled="processingPayment !== null || processingPayAll"
              @click="handlePayAll"
            >
              Pay All ({{ pendingCommissions.length }}) — {{ formatCurrency(totalPending, 'eur') }}
            </UButton>
            <ULink
              v-if="stripePaymentsListUrl"
              :to="stripePaymentsListUrl"
              target="_blank"
              rel="noopener"
              class="text-xs font-medium underline"
            >
              View in Stripe
            </ULink>
          </div>
        </div>
        <UCard>
          <UTable
            :data="pendingCommissions"
            :columns="pendingColumns"
          >
            <template #affiliate-cell="{ row }">
              <div class="space-y-1">
                <div class="font-medium text-highlighted">
                  {{ row.original.affiliate?.user?.name }}
                </div>
                <div class="text-sm text-muted">
                  {{ row.original.affiliate?.user?.email }}
                </div>
              </div>
            </template>
            <template #customerEmail-cell="{ row }">
              <span class="text-sm text-highlighted">
                {{ row.original.customerEmail || '—' }}
              </span>
            </template>
            <template #amount-cell="{ row }">
              <span class="font-semibold text-highlighted">
                {{ formatCurrency(row.original.amount, row.original.currency) }}
              </span>
            </template>
            <template #orderId-cell="{ row }">
              <span class="text-sm text-muted font-mono">
                {{ row.original.orderId.substring(0, 20) }}...
              </span>
            </template>
            <template #payment-cell="{ row }">
              <ULink
                v-if="row.original.paymentDashboardUrl"
                :to="row.original.paymentDashboardUrl"
                target="_blank"
                rel="noopener"
                class="text-xs font-medium underline"
              >
                View in Stripe
              </ULink>
              <span
                v-else
                class="text-sm text-muted"
              >—</span>
            </template>
            <template #createdAt-cell="{ row }">
              <span class="text-sm text-muted">
                {{ formatDate(row.original.createdAt) }}
              </span>
            </template>
            <template #status-cell="{ row }">
              <UBadge
                color="warning"
                variant="soft"
              >
                {{ row.original.status }}
              </UBadge>
            </template>
            <template #action-cell="{ row }">
              <UButton
                color="primary"
                :loading="processingPayment === row.original.id"
                :disabled="processingPayment !== null || processingPayAll"
                @click="handlePayout(row.original.id)"
              >
                Generate Invoice & Pay
              </UButton>
            </template>
          </UTable>
        </UCard>
      </div>

      <!-- Paid Commissions -->
      <div v-if="paidCommissions.length">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold">
            Paid Commissions
          </h2>
          <ULink
            v-if="stripePaymentsListUrl"
            :to="stripePaymentsListUrl"
            target="_blank"
            rel="noopener"
            class="text-xs font-medium underline"
          >
            View in Stripe
          </ULink>
        </div>
        <UCard>
          <UTable
            :data="paidCommissions"
            :columns="paidColumns"
          >
            <template #affiliate-cell="{ row }">
              <div class="space-y-1">
                <div class="font-medium text-highlighted">
                  {{ row.original.affiliate?.user?.name }}
                </div>
                <div class="text-sm text-muted">
                  {{ row.original.affiliate?.user?.email }}
                </div>
              </div>
            </template>
            <template #customerEmail-cell="{ row }">
              <span class="text-sm text-highlighted">
                {{ row.original.customerEmail || '—' }}
              </span>
            </template>
            <template #amount-cell="{ row }">
              <span class="font-semibold text-highlighted">
                {{ formatCurrency(row.original.amount, row.original.currency) }}
              </span>
            </template>
            <template #orderId-cell="{ row }">
              <span class="text-sm text-muted font-mono">
                {{ row.original.orderId.substring(0, 20) }}...
              </span>
            </template>
            <template #payment-cell="{ row }">
              <ULink
                v-if="row.original.paymentDashboardUrl"
                :to="row.original.paymentDashboardUrl"
                target="_blank"
                rel="noopener"
                class="text-xs font-medium underline"
              >
                View in Stripe
              </ULink>
              <span
                v-else
                class="text-sm text-muted"
              >—</span>
            </template>
            <template #paidAt-cell="{ row }">
              <span class="text-sm text-muted">
                {{ formatDate(row.original.paidAt) }}
              </span>
            </template>
            <template #stripeTransferId-cell="{ row }">
              <span class="text-sm text-muted font-mono">
                {{ row.original.stripeTransferId?.substring(0, 20) || 'N/A' }}
              </span>
            </template>
            <template #invoice-cell="{ row }">
              <ULink
                v-if="row.original.stripeInvoiceUrl"
                :to="row.original.stripeInvoiceUrl"
                target="_blank"
                rel="noopener"
                class="text-xs font-medium underline"
              >
                View invoice
              </ULink>
              <span
                v-else
                class="text-sm text-muted"
              >—</span>
            </template>
            <template #status-cell="{ row }">
              <UBadge
                color="success"
                variant="soft"
              >
                {{ row.original.status }}
              </UBadge>
            </template>
          </UTable>
        </UCard>
      </div>
    </div>
  </div>
</template>
