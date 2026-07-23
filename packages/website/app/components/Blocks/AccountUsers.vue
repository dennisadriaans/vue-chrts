<script setup lang="ts">
defineOptions({
  tags: ['blocks', 'accountusers']
})
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">
        Account & Users
      </h2>
      <p class="text-toned dark:text-muted">
        Clean UI components for account management and user interactions.
      </p>
    </div>
    <ClientOnly>
      <div class="mt-12 space-y-24 lg:mt-0">
        <PreviewExample title="Basic Sign In Component">
          <template #chart>
            <BlocksAccountUsersBasicSignIn />
          </template>
          <PreviewCode
            id="account-users-basic-sign-in"
            category="account-users"
            block="basic-sign-in"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Basic Create Account">
          <template #chart>
            <BlocksAccountUsersBasicRegister />
          </template>
          <PreviewCode
            id="account-users-basic-create-account"
            category="account-users"
            block="basic-register"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Social Auth">
          <template #chart>
            <BlocksAccountUsersSocialAuth />
          </template>
          <PreviewCode
            id="account-users-social-auth"
            category="account-users"
            block="social-auth"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Forgot Password">
          <template #chart>
            <BlocksAccountUsersForgotPassword />
          </template>
          <PreviewCode
            id="account-users-forgot-password"
            category="account-users"
            block="forgot-password"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Two-Factor Authentication">
          <template #chart>
            <BlocksAccountUsersTwoFactorAuth />
          </template>
          <PreviewCode
            id="account-users-two-factor-auth"
            category="account-users"
            block="two-factor-auth"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="General Settings">
          <template #chart>
            <BlocksAccountUsersGeneralSettings />
          </template>
          <PreviewCode
            id="account-users-general-settings"
            category="account-users"
            block="general-settings"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Early Access Form">
          <template #chart>
            <BlocksAccountUsersEarlyAccessForm />
          </template>
          <PreviewCode
            id="account-users-early-access-form"
            category="account-users"
            block="early-access-form"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Inbox Component">
          <template #chart>
            <BlocksAccountUsersInbox
              class="mx-auto my-16 max-w-2xl"
              :messages="[
                {
                  id: 1,
                  subject: 'Welcome to the platform!',
                  preview:
                    'We are excited to have you onboard. Here are some tips...',
                  timestamp: '2h ago',
                  unread: true
                },
                {
                  id: 2,
                  subject: 'Your account verification',
                  preview:
                    'Please verify your email address by clicking the link inside.',
                  timestamp: '1d ago',
                  unread: true
                },
                {
                  id: 3,
                  subject: 'Weekly Newsletter',
                  preview:
                    'Catch up on the latest updates and features from the past week.',
                  timestamp: '3d ago',
                  unread: false
                },
                {
                  id: 4,
                  subject: 'Security Alert: New Login',
                  preview:
                    'We detected a new login to your account from a different location.',
                  timestamp: '5d ago',
                  unread: false
                }
              ]"
            />
          </template>
          <PreviewCode
            id="account-users-inbox-component"
            category="account-users"
            block="inbox"
            :lock-code="true"
          />
        </PreviewExample>
      </div>
    </ClientOnly>
  </div>
</template>
