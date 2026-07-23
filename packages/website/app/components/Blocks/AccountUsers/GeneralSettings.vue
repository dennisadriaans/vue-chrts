<script setup lang="ts">
defineOptions({
  tags: ['accountusers', 'generalsettings']
})

const colorMode = useColorMode()
const theme = ref(colorMode.preference)

const notifications = ref({
  email: true,
  push: false
})

const changeTheme = (value: string) => {
  colorMode.preference = value
}
</script>

<template>
  <UCard class="!bg-default mx-auto my-16 max-w-3xl">
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
          <div
            class="w-full flex gap-2"
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
          </div>
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
  </UCard>
</template>
