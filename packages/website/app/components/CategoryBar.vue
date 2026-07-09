<script lang="ts" setup>
interface Category {
  label: string
  value: number
  color: string
}

defineProps<{
  categories: Category[]
  height?: number
  rounded?: boolean
  showValues?: boolean
  showLabels?: boolean
}>()

const hoveredIndex = ref(null)
</script>

<template>
  <div class="mx-auto max-w-7xl p-4 lg:p-8">
    <div class="flex h-full w-full flex-col">
      <div
        class="flex w-full"
        :style="{ height: `${height || 16}px` }"
      >
        <div
          v-for="(category, index) in categories"
          :key="index"
          class="group relative flex items-center justify-center text-xs font-semibold text-white transition-all duration-300"
          :class="[
            index === 0 ? 'rounded-tl-lg rounded-bl-lg' : '',
            index === categories.length - 1
              ? 'rounded-tr-lg rounded-br-lg'
              : ''
          ]"
          :style="{
            width: `${category.value}%`,
            backgroundColor: category.color
          }"
          @mouseover="hoveredIndex = index"
          @mouseleave="hoveredIndex = null"
        >
          <span v-if="showValues">{{ category.label }} {{ category.value }}%</span>
          <div
            v-if="showLabels"
            class="absolute -top-6 left-0 inline-flex text-xs font-semibold text-neutral-300"
            :class="index !== 0 ? '-translate-x-1/2' : ''"
          >
            {{ category.label }}
          </div>
          <div
            v-if="index === hoveredIndex"
            class="border-default absolute -top-6 mr-auto ml-1 -translate-x-1/2 rounded-lg border bg-(--ui-bg) px-2"
          >
            {{ category.value }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
