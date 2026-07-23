<script setup lang="ts">
defineOptions({
  tags: ['accountusers', 'accountsettings']
})

const colorMode = useColorMode()
const theme = ref(colorMode.preference)

const notifications = ref({
  email: true,
  push: false
})

const userInfo = ref({
  email: 'user@example.com',
  twoFactorEnabled: false
})

const privacySettings = ref({
  analyticsConsent: true
})

const changeTheme = (value: string) => {
  colorMode.preference = value
}
</script>

<template>
  <UCard class="mx-auto my-16 max-w-3xl">
    <h3 class="text-lg font-semibold tracking-tight">
      General
    </h3>
    <div class="max-w-7xl space-y-6">
      <div class="flex items-center gap-8">
        <div class="w-1/2 pt-2">
          <div class="font-medium">
            Theme
          </div>
          <p class="text-muted text-sm">
            Customize your workspace
          </p>
        </div>
        <div class="flex-1">
          <UButtonGroup
            v-model="theme"
            class="w-full sm:w-auto"
          >
            <UButton
              value="light"
              color="neutral"
              variant="subtle"
              @click="changeTheme('light')"
            >
              <template #leading>
                <UIcon name="i-lucide-sun" />
              </template>
              Light
            </UButton>
            <UButton
              value="dark"
              color="neutral"
              variant="subtle"
              @click="changeTheme('dark')"
            >
              <template #leading>
                <UIcon name="i-lucide-moon" />
              </template>
              Dark
            </UButton>
            <UButton
              value="system"
              color="neutral"
              variant="subtle"
              @click="changeTheme('system')"
            >
              <template #leading>
                <UIcon name="i-lucide-computer" />
              </template>
              System
            </UButton>
          </UButtonGroup>
        </div>
      </div>

      <div class="flex items-center gap-8">
        <div class="w-1/2 pt-2">
          <div class="font-medium">
            Language
          </div>
          <p class="text-muted text-sm">
            Set your preferred language
          </p>
        </div>
        <div class="flex-1">
          <USelect
            :options="[
              { label: 'English', value: 'en' },
              { label: 'Spanish', value: 'es' },
              { label: 'French', value: 'fr' },
              { label: 'German', value: 'de' }
            ]"
            value="en"
            placeholder="Select a language"
            class="w-full sm:w-64"
          />
        </div>
      </div>

      <div class="flex items-start gap-8">
        <div class="w-1/2 pt-2">
          <div class="font-medium">
            Notifications
          </div>
          <p class="text-muted text-sm">
            Enable/disable notifications
          </p>
        </div>
        <div class="flex-1 space-y-3">
          <UCheckbox
            v-model="notifications.email"
            label="Email Notifications"
          />
          <UCheckbox
            v-model="notifications.push"
            label="Push Notifications"
          />
        </div>
      </div>
    </div>

    <USeparator class="my-6" />

    <h3 class="text-lg font-semibold tracking-tight">
      Account Settings
    </h3>

    <div class="max-w-7xl space-y-6">
      <div class="flex items-start gap-8">
        <div class="w-1/2 pt-2 font-medium">
          Name
        </div>
        <div class="flex-1">
          <UFormField class="mb-0">
            <UInput
              v-model="userInfo.name"
              placeholder="Your name"
              type="text"
              class="w-full sm:w-64"
            />
          </UFormField>
        </div>
      </div>

      <div class="flex items-start gap-8">
        <div class="w-1/2 pt-2 font-medium">
          Email Address
        </div>
        <div class="flex-1">
          <UFormField class="mb-0">
            <UInput
              v-model="userInfo.email"
              placeholder="your@email.com"
              type="email"
              class="w-full sm:w-64"
            />
          </UFormField>
        </div>
      </div>

      <div class="flex items-start gap-8">
        <div class="w-1/2 pt-2 font-medium">
          Password
        </div>
        <div class="flex-1">
          <UButton
            color="neutral"
            variant="subtle"
            size="sm"
          >
            Change Password
          </UButton>
        </div>
      </div>

      <div class="flex items-start gap-8">
        <div class="w-1/2 pt-2 font-medium">
          Two-Factor Authentication
        </div>
        <div class="flex-1">
          <USwitch v-model="userInfo.twoFactorEnabled" />
          <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ userInfo.twoFactorEnabled ? 'Enabled' : 'Disabled' }}
          </div>
        </div>
      </div>
    </div>

    <USeparator class="my-6" />

    <h3 class="text-lg font-semibold tracking-tight">
      Privacy & Data
    </h3>

    <div class="max-w-7xl space-y-6">
      <div class="flex items-start gap-8">
        <div class="w-1/2 pt-2 font-medium">
          Data Sharing
        </div>
        <div class="flex-1">
          <UCheckbox
            v-model="privacySettings.analyticsConsent"
            label="Share anonymous usage data"
          />
        </div>
      </div>

      <div class="flex items-start gap-8">
        <div class="w-1/2 pt-2 font-medium">
          Data Export
        </div>
        <div class="flex-1">
          <UButton
            color="neutral"
            variant="subtle"
            icon="i-lucide-download"
          >
            Export All Data
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>
