<script lang="ts" setup>
const { loggedIn } = useUserSession()
async function setRedirectCookie() {
  const redirectCookie = useCookie('redirectPath')
  redirectCookie.value = '/api/payments/redirect'
}
</script>

<template>
  <div>
    <slot v-if="loggedIn" />
    <UModal
      v-else
      title="Nuxt UI Dashboard "
      :ui="{
        content: 'max-w-2xl'
      }"
    >
      <slot />

      <template #body>
        <div class="flex gap-8">
          <div class="w-1/2">
            <table class="w-full">
              <tbody>
                <tr>
                  <td class="text-muted">
                    Subtotal
                  </td>
                  <td class="text-right text-sm">
                    99,00
                  </td>
                </tr>
                <tr>
                  <td class="text-muted">
                    Tax
                  </td>
                  <td class="text-right text-sm">
                    Calculated at checkout
                  </td>
                </tr>
                <tr>
                  <td class="text-muted">
                    Total
                  </td>
                  <td class="text-right text-sm font-bold">
                    $99.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex w-1/2 items-center justify-center">
            <div class="space-y-1">
              <div class="flex items-center space-x-2 text-sm">
                <div
                  class="flex items-center justify-center rounded-full bg-(--ui-bg-muted) p-1"
                >
                  <UIcon
                    name="i-lucide-check"
                    class="text-primary-500"
                  />
                </div>
                <span>100% Money Back Guarantee</span>
              </div>
              <div class="flex items-center space-x-2 text-sm">
                <div
                  class="flex items-center justify-center rounded-full bg-(--ui-bg-muted) p-1"
                >
                  <UIcon
                    name="i-lucide-check"
                    class="text-primary-500"
                  />
                </div>
                <span>Following Best Practices</span>
              </div>
              <div class="flex items-center space-x-2 text-sm">
                <div
                  class="flex items-center justify-center rounded-full bg-(--ui-bg-muted) p-1"
                >
                  <UIcon
                    name="i-lucide-check"
                    class="text-primary-500"
                  />
                </div>
                <span>Optimized for Performance</span>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-8 mb-2 space-y-2">
          <!-- <p class="mt-4 text-center text-sm text-muted">
            Please login with your GitHub account to purchase the Nuxt UI
            Dashboard template
          </p> -->

          <AuthButton
            label="Purchase Now"
            icon="i-mdi-github"
            provider="github"
            :pre-callback="setRedirectCookie"
          />

          <p class="text-dimmed text-center text-xs">
            By proceeding, you agree to our
            <a
              href="#"
              class="font-semibold underline"
            >Terms of Service</a>
            and
            <a
              href="#"
              class="font-semibold underline"
            >Privacy Policy</a>.
          </p>
        </div>
      </template>
    </UModal>
  </div>
</template>
