<script lang="ts" setup>
import { PriceEnum } from '~~/utils/ProductMap'

const { purchaseDashboard, getAllLicense } = usePayments()

async function handlePurchaseDashboard() {
  await purchaseDashboard(PriceEnum.NuxtDashboard)
}

async function handlePurchaseUIEditor() {
  await purchaseDashboard(PriceEnum.NuxtUIThemeEditor)
}

async function handlePurchaseTeams() {
  await purchaseDashboard(PriceEnum.NuxtChartsTeams)
}

const blackFridayVisible = inject('blackFridayVisible')
</script>

<template>
  <div
    class="mx-auto flex w-full flex-col-reverse items-start gap-8 px-8 lg:flex-row"
  >
    <UCard
      class="w-full p-2"
      :ui="{ root: 'rounded-2xl' }"
    >
      <div>
        <h3 class="text-highlighted text-lg font-semibold">
          Nuxt Dashboard
        </h3>
        <p class="text-muted dark:text-dimmed mb-1 text-sm">
          Access to Nuxt Dashboard Template
        </p>
        <p class="mt-4 mb-6 text-4xl font-medium text-highlighted">
          $99
          <span class="text-muted text-base font-normal">
            <span class="line-through">$199</span>
          </span>
        </p>
      </div>
      <hr class="border-default my-4 border-t">
      <ul class="mb-8 space-y-3">
        <li class="text-default flex items-center">
          <div
            class="mr-2 flex h-5 w-5 items-center justify-center rounded-full"
          >
            <UIcon
              name="i-lucide-circle-check"
              class="h-4 w-4 text-(--ui-primary)"
            />
          </div>
          <span>Access To Nuxt Dashboard </span>
        </li>
        <li class="text-default flex items-center">
          <div
            class="mr-2 flex h-5 w-5 items-center justify-center rounded-full"
          >
            <UIcon
              name="i-lucide-circle-check"
              class="h-4 w-4 text-(--ui-primary)"
            />
          </div>
          <span>One-time Purchase </span>
        </li>
        <li class="text-default flex items-center">
          <div
            class="mr-2 flex h-5 w-5 items-center justify-center rounded-full"
          >
            <UIcon
              name="i-lucide-circle-check"
              class="h-4 w-4 text-(--ui-primary)"
            />
          </div>
          <span>Support the Project </span>
        </li>
      </ul>
      <div class="mt-auto">
        <UButton
          class="w-full items-center justify-center"
          color="neutral"
          variant="outline"
          size="xl"
          @click="handlePurchaseDashboard"
        >
          Get Nuxt Dashboard
        </UButton>
      </div>
    </UCard>
    <UCard
      class="relative w-full p-2"
      :ui="{
        root: 'overflow-visible rounded-2xl bg-gradient-to-r from-(--ui-primary)/5 to-(--ui-secondary)/5'
      }"
    >
      <div class="absolute -top-3 left-1/2 -translate-x-1/2 transform">
        <span
          v-if="blackFridayVisible"
          class="rounded-md border border-yellow-500/30 bg-black/60 px-2.5 py-1 font-mono text-sm whitespace-nowrap font-bold text-yellow-400 shadow-lg backdrop-blur-sm"
        >🔥 BLACK FRIDAY DEAL</span>
        <span
          v-else
          class="rounded-full bg-(--ui-primary) px-3 py-1 text-xs font-bold text-(--ui-text-inverted)"
        >
          MOST POPULAR
        </span>
      </div>
      <div>
        <div class="flex items-center justify-between">
          <h3 class="text-highlighted text-lg font-bold">
            All-Access Pass
          </h3>
        </div>
        <p class="text-muted dark:text-dimmed mb-1 text-sm">
          Access to all blocks and templates
        </p>
        <!-- <div
              class="mt-2 mb-1 flex items-center gap-1 text-xs text-green-600 dark:text-green-400"
            >
              <UIcon name="i-lucide-users" class="h-3 w-3" />
              <span>1,198+ weekly installs</span>
            </div> -->
        <p class="mt-4 mb-6 text-4xl font-medium text-highlighted">
          <span v-if="blackFridayVisible">€119</span>
          <span v-else>€149</span>
          <span class="text-muted text-base font-normal ml-1">
            <span class="line-through">€249</span>
          </span>
          <span
            class="ml-2 rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400"
          >
            <template v-if="blackFridayVisible">SAVE €130!</template>
            <template v-else>SAVE €100!</template>
          </span>
        </p>
      </div>
      <hr class="border-default my-4 border-t">
      <ul class="mb-8 space-y-3">
        <li class="text-default flex items-center">
          <div
            class="mr-2 flex h-5 w-5 items-center justify-center rounded-full"
          >
            <UIcon
              name="i-lucide-circle-check"
              class="h-4 w-4 text-(--ui-primary)"
            />
          </div>
          <span>Access to Nuxt Dashboard</span>
        </li>
        <li class="text-default flex items-center">
          <div
            class="mr-2 flex h-5 w-5 items-center justify-center rounded-full"
          >
            <UIcon
              name="i-lucide-circle-check"
              class="h-4 w-4 text-(--ui-primary)"
            />
          </div>
          <span>Blocks & Templates</span>
        </li>
        <li class="text-default flex items-center">
          <div
            class="mr-2 flex h-5 w-5 items-center justify-center rounded-full"
          >
            <UIcon
              name="i-lucide-circle-check"
              class="h-4 w-4 text-(--ui-primary)"
            />
          </div>
          <span>CLI Access</span>
        </li>
        <li class="text-default flex items-center">
          <div
            class="mr-2 flex h-5 w-5 items-center justify-center rounded-full"
          >
            <UIcon
              name="i-lucide-circle-check"
              class="h-4 w-4 text-(--ui-primary)"
            />
          </div>
          <span>
            Nuxt UI Theme Editor
            <span
              class="ml-1 rounded bg-blue-100 px-1 py-0.5 text-xs text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
            >NEW</span>
          </span>
        </li>
        <li class="text-default flex items-center">
          <div
            class="mr-2 flex h-5 w-5 items-center justify-center rounded-full"
          >
            <UIcon
              name="i-lucide-circle-check"
              class="h-4 w-4 text-(--ui-primary)"
            />
          </div>
          <span>50+ Charts</span>
        </li>
        <li class="text-default flex items-center">
          <div
            class="mr-2 flex h-5 w-5 items-center justify-center rounded-full"
          >
            <UIcon
              name="i-lucide-circle-check"
              class="h-4 w-4 text-(--ui-primary)"
            />
          </div>
          <span>Lifetime Updates & Support</span>
        </li>
        <li class="text-default flex items-center">
          <div
            class="mr-2 flex h-5 w-5 items-center justify-center rounded-full"
          >
            <UIcon
              name="i-lucide-circle-check"
              class="h-4 w-4 text-(--ui-primary)"
            />
          </div>
          <span>Commercial License Included</span>
        </li>
        <li class="text-default flex items-center">
          <div
            class="mr-2 flex h-5 w-5 items-center justify-center rounded-full"
          >
            <UIcon
              name="i-lucide-circle-check"
              class="h-4 w-4 text-(--ui-primary)"
            />
          </div>
          <span>30-Day Money Back Guarantee</span>
        </li>
      </ul>
      <div class="mt-auto space-y-3">
        <!-- <div
              class="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-center dark:border-yellow-800 dark:bg-yellow-900/20"
            >
              <div
                class="flex items-center justify-center gap-1 text-sm font-medium text-yellow-800 dark:text-yellow-200"
              >
                <UIcon name="i-lucide-zap" class="h-4 w-4" />
                <span>Only 6 licenses left at this price!</span>
              </div>
            </div> -->
        <UButton
          class="w-full items-center justify-center ring-4 ring-primary/20"
          size="xl"
          @click="getAllLicense"
        >
          🚀 <span class="ml-1 font-bold tracking-tighter">Get Instant Access -</span>
          <span
            v-if="blackFridayVisible"
            class="ml-1 font-bold"
          >€119</span>
          <span
            v-else
            class="ml-1 font-bold"
          >€149</span>
        </UButton>
        <!-- <div
              class="flex items-center justify-center gap-6 rounded-lg border border-green-100 bg-green-50 p-3 text-xs text-muted dark:border-green-800/30 dark:bg-green-900/10"
            >
              <div class="flex items-center gap-1">
                <UIcon
                  name="i-lucide-shield-check"
                  class="h-4 w-4 text-green-600"
                />
                <span class="font-medium">Secure Payment</span>
              </div>
              <div class="flex items-center gap-1">
                <UIcon
                  name="i-lucide-download"
                  class="h-4 w-4 text-green-600"
                />
                <span class="font-medium">Instant Access</span>
              </div>
            </div> -->
      </div>
    </UCard>

    <UCard
      class="w-full p-2"
      :ui="{ root: 'rounded-2xl' }"
    >
      <div>
        <h3 class="text-highlighted text-lg font-medium">
          Teams
        </h3>
        <p class="text-dimmed mb-1 text-sm">
          Invite up to 5 team members
        </p>
        <p class="mt-4 mb-6 text-4xl font-medium text-highlighted">
          €499
          <span class="text-muted text-base font-normal">
            <span class="line-through">€999</span>
          </span>
        </p>
      </div>
      <hr class="border-default my-4 border-t">
      <ul class="mb-8 space-y-3">
        <li class="flex items-center">
          <div
            class="mr-2 flex h-5 w-5 items-center justify-center rounded-full"
          >
            <UIcon
              name="i-lucide-circle-check"
              class="h-4 w-4 text-primary"
            />
          </div>
          <span>Everything in All-Access</span>
        </li>
        <li class="flex items-center">
          <div
            class="mr-2 flex h-5 w-5 items-center justify-center rounded-full"
          >
            <UIcon
              name="i-lucide-circle-check"
              class="h-4 w-4 text-(--ui-primary)"
            />
          </div>
          <span>Priority Email Support</span>
        </li>
        <li class="flex items-center">
          <div
            class="mr-2 flex h-5 w-5 items-center justify-center rounded-full"
          >
            <UIcon
              name="i-lucide-circle-check"
              class="h-4 w-4 text-(--ui-primary)"
            />
          </div>
          <span>Custom Chart Development</span>
        </li>
        <li class="flex items-center">
          <div
            class="mr-2 flex h-5 w-5 items-center justify-center rounded-full"
          >
            <UIcon
              name="i-lucide-circle-check"
              class="h-4 w-4 text-(--ui-primary)"
            />
          </div>
          <span>Consultation Calls</span>
        </li>
      </ul>
      <div class="mt-auto">
        <UButton
          class="w-full items-center justify-center"
          color="neutral"
          variant="outline"
          size="xl"
          @click="handlePurchaseTeams"
        >
          Get Teams Pass
        </UButton>
      </div>
    </UCard>
  </div>

  <!-- <div class="mt-12 w-full px-8">
    <UCard
      class="w-full p-2"
      :ui="{ root: 'rounded-2xl' }"
    >
      <div class="flex flex-col items-center justify-between gap-6 p-4 md:flex-row">
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <h3 class="text-highlighted text-xl font-bold">
              Nuxt UI Theme Editor
            </h3>
          </div>
          <p class="text-muted dark:text-dimmed mt-1 text-sm">
            A clean tool to customize your Nuxt UI configuration in real-time.
          </p>
          <ul class="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            <li class="text-default flex items-center text-sm">
              <UIcon
                name="i-lucide-circle-check"
                class="mr-2 h-4 w-4 text-(--ui-primary)"
              />
              <span>Real-time Theme Customization</span>
            </li>
            <li class="text-default flex items-center text-sm">
              <UIcon
                name="i-lucide-circle-check"
                class="mr-2 h-4 w-4 text-(--ui-primary)"
              />
              <span>Export to `app.config.ts`</span>
            </li>
            <li class="text-default flex items-center text-sm">
              <UIcon
                name="i-lucide-circle-check"
                class="mr-2 h-4 w-4 text-(--ui-primary)"
              />
              <span>Color Palette Generator</span>
            </li>
            <li class="text-default flex items-center text-sm">
              <UIcon
                name="i-lucide-circle-check"
                class="mr-2 h-4 w-4 text-(--ui-primary)"
              />
              <span>Lifetime Access</span>
            </li>
          </ul>
        </div>
        <div class="flex flex-col items-center gap-4 md:items-end">
          <div class="text-right">
            <p class="text-3xl font-bold">
              €49
              <span class="text-muted text-sm font-normal line-through">€99</span>
            </p>
            <p class="text-sm font-medium text-green-600 dark:text-green-400">
              Save 50% today
            </p>
          </div>
          <UButton
            size="lg"
            color="neutral"
            variant="solid"
            class="ring-2 ring-neutral-500"
            @click="handlePurchaseUIEditor"
          >
            Get UI Editor Access
          </UButton>
        </div>
      </div>
    </UCard>
  </div> -->
</template>
