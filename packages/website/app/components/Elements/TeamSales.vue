<script setup lang="ts">
const items = [
  {
    name: 'John Carter',
    email: 'contact@johncarter.com',
    amount: '$240,80',
    avatar: {
      src: 'https://i.pravatar.cc/150?u=john'
    }
  },
  {
    name: 'Sophie Moore',
    email: 'hi@sophiemoore.com',
    amount: '$180,64',
    avatar: {
      src: 'https://i.pravatar.cc/150?u=sophie'
    }
  },
  {
    name: 'Matt Cannon',
    email: 'info@mattcannon.com',
    amount: '$320,54',
    avatar: {
      src: 'https://i.pravatar.cc/150?u=matt'
    }
  }
]
</script>

<template>
  <UCard class="bg-default dark:bg-elevated/20">
    <div class="space-y-8">
      <h2 class="text-2xl font-bold">
        Team Sales
      </h2>

      <div class="flex flex-col">
        <div
          v-for="item in items"
          :key="item.email"
          class="flex items-center justify-between gap-4 py-4 px-4 rounded-xl hover:bg-elevated/50 transition"
        >
          <div class="flex items-center gap-5">
            <UAvatar
              :src="item.avatar.src"
              :alt="item.name"
              size="lg"
            />

            <div class="flex flex-col space-y-1">
              <span class="font-bold text-default text-lg">
                {{ item.name }}
              </span>
              <span class="text-muted text-sm">
                {{ item.email }}
              </span>
            </div>
          </div>

          <div class="font-bold text-xl text-default">
            {{ item.amount }}
          </div>
        </div>
      </div>

      <UButton
        class="w-full flex justify-center items-center"
        variant="soft"
        color="neutral"
        size="xl"
      >
        Add More
      </UButton>
    </div>
  </UCard>
</template>
