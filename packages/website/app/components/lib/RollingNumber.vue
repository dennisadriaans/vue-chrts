<script setup lang="ts">
const props = withDefaults(defineProps<{
  value: string | number
  baseDelayDigit?: number
  randomizeDelay?: boolean
  height?: string
}>(), {
  height: '1.2em',
  baseDelayDigit: 50,
  randomizeDelay: true
})

const characters = computed(() => {
  const str = String(props.value)
  return str.split('').map((char, index) => {
    const isDigit = /\d/.test(char)
    const delay = props.randomizeDelay
      ? (index * props.baseDelayDigit) + Math.random() * 300
      : (index * props.baseDelayDigit)

    return {
      char,
      isDigit,
      delay: isDigit ? `${delay}ms` : '0ms',
      duration: isDigit ? `${800 + Math.random() * 1000}ms` : '0ms',
      id: `${index}-${char}`
    }
  })
})

const digitList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
</script>

<template>
  <div
    class="inline-flex overflow-hidden items-center"
    :style="{ height: props.height }"
  >
    <div
      v-for="(item, index) in characters"
      :key="index"
      class="relative"
      :style="{ height: props.height }"
    >
      <div
        v-if="!item.isDigit"
        class="flex items-center h-full"
      >
        {{ item.char }}
      </div>
      <div
        v-else
        class="overflow-hidden h-full"
      >
        <div
          class="flex flex-col transition-transform ease-[cubic-bezier(0.45,0.05,0.55,0.95)]"
          :style="{
            transform: `translateY(-${Number(item.char) * 10}%)`,
            transitionDelay: item.delay,
            transitionDuration: item.duration
          }"
        >
          <div
            v-for="digit in digitList"
            :key="digit"
            class="flex items-center justify-center font-mono tabular-nums"
            :style="{ height: props.height }"
          >
            {{ digit }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inline-flex {
  line-height: normal;
}
</style>
