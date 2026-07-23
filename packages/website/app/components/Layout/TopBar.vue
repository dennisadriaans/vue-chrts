<script setup lang="ts">
const colorMode = useColorMode()
const route = useRoute()
const { loggedIn, user } = useUserSession()

const { getAllLicense } = usePayments()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})

const mainMenuLinks = [
  { to: '/blocks', label: 'Blocks' },
  { to: '/docs/getting-started/installation', label: 'Docs' },
  { to: '/charts', label: 'Charts' },
  { to: '/templates', label: 'Templates' }
]
const { items: rawItems } = useMainMenuItems()

function setLoginRedirectPath() {
  const redirectCookie = useCookie('redirectPath')
  redirectCookie.value = '/payments'
  navigateTo('/login')
}

const isDropdownVisible = ref(false)

function toggleDropdown() {
  isDropdownVisible.value = !isDropdownVisible.value
}

function closeDropdown() {
  isDropdownVisible.value = false
}

// Add onSelect handler to all items and their children to close dropdown on click
const items = computed(() => {
  return rawItems.value.map((group: any) =>
    group.map((item: any) => ({
      ...item,
      defaultOpen: false,
      onSelect: closeDropdown,
      children: item.children?.map((child: any) => ({
        ...child,
        defaultOpen: false,
        onSelect: closeDropdown
      }))
    }))
  )
})

const isShop = computed(() => route.name === 'templates-slug')
</script>

<template>
  <div
    class="strix-bar border-default w-full border-b bg-(--ui-bg)/60 backdrop-blur-md"
  >
    <div
      v-if="isDropdownVisible"
      class="bg-default/50 fixed top-0 right-0 bottom-0 left-0 z-50 mt-36 hidden h-full w-full lg:block"
    />

    <div
      class="mx-auto flex max-w-7xl items-center py-3 px-4 lg:py-3"
      :class="isShop ? 'lg:pr-3 lg:pl-6' : 'lg:px-6'"
    >
      <NuxtLink
        to="/"
        class="flex-shrink-0"
      >
        <Logo />
      </NuxtLink>

      <div
        v-if="!isShop"
        class="flex flex-1 items-center justify-center gap-2 lg:gap-8"
      >
        <div class="hidden items-center justify-center gap-1 lg:flex">
          <template
            v-for="item in mainMenuLinks"
            :key="item.to"
          >
            <NuxtLink :to="item.to">
              <UButton
                color="neutral"
                variant="ghost"
                :active="route.path === item.to"
                class="-ml-1.5 rounded-full py-2"
                :ui="{
                  leadingIcon: `mr-1  text-lg ${route.path === item.to ? '' : 'text-dimmed'}`
                }"
              >{{ item.label }}</UButton>
            </NuxtLink>
          </template>
          <NuxtLink
            to="/pricing"
            class="text-sm font-semibold subpixel-antialiased"
          >
            <UButton
              color="neutral"
              variant="ghost"
              :active="route.path === '/pricing'"
              class="-ml-1.5 rounded-full py-2"
              :ui="{
                leadingIcon: `mr-1  text-lg ${route.path === '/pricing' ? '' : 'text-dimmed'}`
              }"
            ><UChip>Pricing</UChip></UButton>
          </NuxtLink>
        </div>
      </div>

      <UButton
        icon="i-lucide-menu"
        size="xl"
        color="neutral"
        variant="outline"
        label="menu"
        class="ml-auto rounded-full lg:hidden"
        @click="toggleDropdown"
      />
      <div
        v-if="isDropdownVisible"
        id="dropdownMenu"
        class="bg-default border-default absolute top-0 right-0 left-0 mt-20 w-[calc(100%-0px)] rounded-4xl border p-4"
      >
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          color="neutral"
          variant="link"
          class="w-full"
          :ui="{
            link: 'text-white hover:text-white',
            linkLabel: 'text-white text-base',
            childLink: 'text-white hover:text-white',
            childLinkLabel: 'text-white'
          }"
        />
      </div>
      <div class="hidden flex-shrink-0 items-center gap-4 lg:flex">
        <template v-if="isShop">
          <UButton
            class="rounded-full ring-primary-500/20 ring-4"
            leading-icon="i-lucide-lock"
            trailing-icon="i-lucide-chevron-right"
            label="Get All-Access"
            @click="getAllLicense"
          />
        </template>
        <template v-else>
          <div class="flex items-center gap-3">
            <a
              href="https://ui.nuxtcharts.com/"
              target="_blank"
              class="text-muted hover:text-default text-sm hidden"
            >
              <UButton
                color="neutral"
                variant="ghost"
                leading-icon="i-lucide-paintbrush"
                size="sm"
              />
            </a>
            <a
              href="https://github.com/dennisadriaans/vue-chrts"
              target="_blank"
              class="text-muted hover:text-default text-sm"
            >
              <UButton
                color="neutral"
                variant="ghost"
                leading-icon="i-lucide-github"
                size="sm"
              />
            </a>
            <ClientOnly>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                style="cursor: pointer;"
                @click="isDark = !isDark"
              >
                <path
                  stroke="none"
                  d="M0 0h18v18H0z"
                  fill="none"
                />

                <path d="M9 9m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />

                <path d="M9 2v14" />

                <path d="M9 6.5l3.5 -3.5" />
                <path d="M9 11l5 -5" />
                <path d="M9 15.5l6.5 -6.5" />
              </svg>
            </ClientOnly>
            <NuxtLink
              v-if="!loggedIn"
              @click="setLoginRedirectPath"
            >
              <UButton
                color="neutral"
                class="rounded-full px-4"
                variant="outline"
              >Sign In</UButton>
            </NuxtLink>

            <NuxtLink
              v-else-if="user"
              to="/payments"
            >
              <UButton
                color="neutral"
                variant="outline"
              >
                <span class="max-w-[64px] truncate">{{
                  user.name || 'My Account'
                }}</span></UButton>
            </NuxtLink>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
