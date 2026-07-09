<script setup lang="ts">
interface TeamMember {
  name: string
  avatar: string
  role?: string
}

interface Team {
  name: string
  description: string
  members: TeamMember[]
  totalMembers?: number
}

interface Props {
  teams?: Team[]
}

const { teams = [
  {
    name: 'Engineering',
    description: 'Building the future of our platform',
    members: [
      { name: 'Benjamin Canac', avatar: 'https://github.com/benjamincanac.png' },
      { name: 'Romain Hamel', avatar: 'https://github.com/romhml.png' },
      { name: 'Neil Richter', avatar: 'https://github.com/noook.png' },
      { name: 'Sébastien Chopin', avatar: 'https://github.com/atinux.png' }
    ],
    totalMembers: 12
  },
  {
    name: 'Product',
    description: 'Defining the product roadmap',
    members: [
      { name: 'Benjamin Canac', avatar: 'https://github.com/benjamincanac.png' },
      { name: 'Romain Hamel', avatar: 'https://github.com/romhml.png' },
      { name: 'Neil Richter', avatar: 'https://github.com/noook.png' }
    ],
    totalMembers: 6
  },
  {
    name: 'Design',
    description: 'Crafting exceptional user experiences',
    members: [
      { name: 'Benjamin Canac', avatar: 'https://github.com/benjamincanac.png' },
      { name: 'Romain Hamel', avatar: 'https://github.com/romhml.png' }
    ],
    totalMembers: 5
  }
] } = defineProps<Props>()
</script>

<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <UCard
      v-for="team in teams"
      :key="team.name"
      class="flex flex-col bg-default!"
    >
      <div class="flex-1">
        <h4 class="font-semibold text-default">
          {{ team.name }}
        </h4>
        <p class="mt-1 text-sm text-muted">
          {{ team.description }}
        </p>
      </div>

      <div class="mt-6 flex items-center justify-between">
        <UAvatarGroup
          size="sm"
          :max="3"
        >
          <UTooltip
            v-for="member in team.members"
            :key="member.name"
            :text="member.name"
          >
            <UAvatar
              :src="member.avatar"
              :alt="member.name"
            />
          </UTooltip>
        </UAvatarGroup>

        <span class="text-sm text-muted">
          {{ team.totalMembers }} {{ team.totalMembers === 1 ? 'member' : 'members' }}
        </span>
      </div>
    </UCard>
  </div>
</template>
