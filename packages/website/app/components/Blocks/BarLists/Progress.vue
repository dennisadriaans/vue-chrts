<script setup lang="ts">
defineOptions({
  tags: ['barlists', 'progress']
})

const orders = [
  { id: 'ORD-001', date: '2024-01-15', status: 'fulfilled' },
  { id: 'ORD-002', date: '2024-01-16', status: 'open' },
  { id: 'ORD-003', date: '2024-01-17', status: 'fulfilled' },
  { id: 'ORD-004', date: '2024-01-18', status: 'open' },
  { id: 'ORD-005', date: '2024-01-19', status: 'fulfilled' },
  { id: 'ORD-006', date: '2024-01-20', status: 'fulfilled' },
  { id: 'ORD-007', date: '2024-01-21', status: 'open' },
  { id: 'ORD-008', date: '2024-01-22', status: 'fulfilled' },
  { id: 'ORD-009', date: '2024-01-23', status: 'open' },
  { id: 'ORD-010', date: '2024-01-24', status: 'fulfilled' },
  { id: 'ORD-011', date: '2024-01-25', status: 'open' },
  { id: 'ORD-012', date: '2024-01-26', status: 'fulfilled' },
  { id: 'ORD-013', date: '2024-01-27', status: 'open' },
  { id: 'ORD-014', date: '2024-01-28', status: 'fulfilled' },
  { id: 'ORD-015', date: '2024-01-29', status: 'open' },
  { id: 'ORD-016', date: '2024-01-30', status: 'fulfilled' },
  { id: 'ORD-017', date: '2024-01-31', status: 'open' },
  { id: 'ORD-018', date: '2024-02-01', status: 'fulfilled' },
  { id: 'ORD-019', date: '2024-02-02', status: 'open' },
  { id: 'ORD-020', date: '2024-02-03', status: 'fulfilled' }
]

const fulfilledOrders = computed(() =>
  orders.filter(order => order.status === 'fulfilled')
)

const openOrders = computed(() =>
  orders.filter(order => order.status === 'open')
)

const orderLength = computed(() => orders.length * 10)

const fulfilledPercentage = computed(() =>
  orderLength.value > 0
    ? Math.round((fulfilledOrders.value.length / orderLength.value) * 100)
    : 0
)

const openPercentage = computed(() =>
  orderLength.value > 0
    ? Math.round(((openOrders.value.length * 10) / orderLength.value) * 100)
    : 0
)

const width = computed(() => {
  return `${((fulfilledOrders.value.length * 10) / orderLength.value) * 100}%`
})
</script>

<template>
  <div>
    <UCard class="!bg-default my-8 sm:mx-auto sm:max-w-lg">
      <template #header>
        <h3 class="font-medium">
          Orders Overview
        </h3>
      </template>

      <div class="mt-2">
        <div class="h-2 rounded-full bg-neutral-100 dark:bg-white/5">
          <div
            class="h-4 h-full rounded-full"
            :style="{ width, backgroundColor: 'var(--ui-primary)' }"
          />
        </div>
      </div>

      <ul
        role="list"
        class="mt-3 flex items-center justify-between"
      >
        <li class="border-primary border-l-2 pl-4">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium"> Fulfilled </span>
          </div>
          <p class="mt-1 font-semibold">
            {{ fulfilledOrders.length }}
            <span class="text-dimmed font-normal">
              ({{ fulfilledPercentage }}%)
            </span>
          </p>
        </li>
        <li class="border-default border-r-2 pr-4">
          <div class="flex items-center justify-end space-x-2">
            <span class="text-sm font-medium"> Open </span>
          </div>
          <p class="mt-1 text-right font-semibold">
            {{ openOrders.length }}
            <span class="text-dimmed font-normal">
              ({{ openPercentage }}%)
            </span>
          </p>
        </li>
      </ul>

      <div
        v-if="orders.length > 0"
        class="mt-6 flex items-center justify-between border-b border-neutral-100 pb-2 dark:border-neutral-800"
      >
        <p class="text-dimmed text-xs font-medium tracking-wide uppercase">
          Order ID
        </p>
        <p class="text-dimmed text-xs font-medium tracking-wide uppercase">
          Date
        </p>
      </div>

      <ul
        v-if="orders.length > 0"
        role="list"
        class="divide-y divide-neutral-100 dark:divide-neutral-800"
      >
        <li
          v-for="order in orders.slice(0, 5)"
          :key="order.id"
          class="flex items-center justify-between py-2"
        >
          <span class="text-sm">{{ order.id }}</span>
          <span class="text-sm">{{ order.date }}</span>
        </li>
      </ul>

      <div
        v-else
        class="text-dimmed mt-3 text-sm"
      >
        No orders available.
      </div>

      <template #footer>
        <div class="flex w-full justify-between gap-4">
          <UButton
            color="neutral"
            variant="link"
          >
            Close
          </UButton>
          <UButton color="neutral">
            Go to Dashboard
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>
