<script lang="ts" setup>
interface Props {
  autoShow?: boolean
  showDelay?: number
  hideDelay?: number
  fetchInterval?: number
}

const {
  autoShow = true,
  showDelay = 8000,
  hideDelay = 12000,
  fetchInterval = 0
} = defineProps<Props>()

const showNotification = ref(false)

const latestPurchase = ref<{
  firstname: string | null
  date: string | null
  city: string | null
} | null>(null)

async function fetchLatestPurchase() {
  try {
    latestPurchase.value = await $fetch('/api/stripe-latest-payment')
  } catch (e) {
    latestPurchase.value = null
  }
}

function show() {
  showNotification.value = true
}

function hide() {
  showNotification.value = false
}

onMounted(() => {
  fetchLatestPurchase()

  if (autoShow) {
    setTimeout(() => {
      showNotification.value = true
      setTimeout(() => {
        showNotification.value = false
      }, hideDelay)
    }, showDelay)
  }
})

const isRecentPurchase = computed(() => {
  if (!latestPurchase.value || !latestPurchase.value.date) return false
  const purchaseDate = new Date(latestPurchase.value.date).getTime()
  const now = Date.now()
  const diff = now - purchaseDate
  return diff < 48 * 60 * 60 * 1000 // 48 hours in ms
})

defineExpose({
  show,
  hide,
  showNotification,
  latestPurchase
})
</script>

<template>
  <Transition name="fade">
    <UCard
      v-if="
        showNotification
          && latestPurchase
          && latestPurchase.firstname
          && latestPurchase.date
          && isRecentPurchase
      "
      class="!bg-default fixed bottom-0 left-0 m-8"
    >
      <div class="flex items-start gap-4">
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900"
        >
          <UIcon
            name="i-lucide-check"
            size="16"
            class="text-green-600 dark:text-green-400"
          />
        </div>
        <div class="flex-1">
          <div class="text-sm font-medium text-(--ui-text-highlighted)">
            🎉 Someone just purchased!
          </div>
          <div class="text-dimmed mt-1 text-sm">
            {{ latestPurchase.firstname }} from {{ latestPurchase.city || '' }}
          </div>
          <div class="mt-1 text-xs text-green-600 dark:text-green-400">
            {{ new Date(latestPurchase.date).toLocaleString() }}
          </div>
        </div>
        <button
          class="text-muted hover:text-default transition-colors"
          @click="showNotification = false"
        >
          <UIcon
            name="i-lucide-x"
            class="h-4 w-4"
          />
        </button>
      </div>
    </UCard>
  </Transition>
</template>
