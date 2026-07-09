<script setup lang="ts">
defineOptions({
  tags: ['statusuptime', 'stepper']
})

enum Alignment {
  Horizontal = 'horizontal',
  Vertical = 'vertical'
}

enum LabelPosition {
  Top = 'top',
  Bottom = 'bottom'
}

interface Props {
  steps: any[]
  alignment?: Alignment
  labelPosition?: LabelPosition
}

const { steps, alignment = Alignment.Horizontal, labelPosition = LabelPosition.Bottom } = defineProps<Props>()

const activeStepIndex = computed(() => {
  const completedIndex = steps.findIndex(
    step => step.status !== 'completed'
  )
  return completedIndex === -1 ? steps.length : completedIndex
})

const isStepCompleted = (index: number) => {
  return index < activeStepIndex.value
}
</script>

<template>
  <UCard class="!bg-default pb-4">
    <div>
      <div
        class="relative"
        :class="[
          alignment === 'vertical'
            ? 'flex h-[300px] flex-col items-center justify-between'
            : ''
        ]"
      >
        <div
          class="absolute top-0 right-0 bottom-0 left-0"
          :class="[alignment === 'vertical' ? 'mx-auto w-1' : 'my-auto h-1']"
          :style="
            alignment === 'vertical' ? { transform: 'rotate(180deg)' } : {}
          "
        >
          <div class="flex h-full items-center justify-center">
            <template
              v-for="(_, index) in steps"
              :key="`progress-bar-${index}`"
            >
              <div
                v-if="index > 0"
                class="h-full w-full"
                :style="{
                  backgroundColor: isStepCompleted(index)
                    ? 'var(--steps-bg-complete)'
                    : 'var(--steps-bg)'
                }"
                aria-hidden="true"
              />

              <div
                v-if="index < steps.length - 1"
                class="h-full w-full"
                :style="{
                  backgroundColor:
                    isStepCompleted(index) && isStepCompleted(index + 1)
                      ? 'var(--steps-bg-complete)'
                      : 'var(--steps-bg)'
                }"
                aria-hidden="true"
              />
            </template>
          </div>
        </div>
        <div
          class="relative flex items-center justify-between"
          :class="[alignment === 'vertical' ? 'h-full flex-col' : '']"
        >
          <div
            v-for="(step, index) in steps"
            :key="`step-${index}`"
          >
            <div
              class="ring-default flex h-8 w-8 items-center justify-center rounded-full ring-2"
              :style="{
                backgroundColor: isStepCompleted(index)
                  ? 'var(--steps-bg-complete)'
                  : 'var(--steps-bg)',
                borderColor: isStepCompleted(index)
                  ? 'var(--steps-border-complete)'
                  : 'var(--steps-border)'
              }"
            >
              <UIcon
                v-if="step.status === 'completed'"
                name="i-lucide-check"
                aria-hidden="true"
                :style="{
                  color: isStepCompleted(index)
                    ? 'var(--steps-icon-complete)'
                    : 'var(--steps-icon)'
                }"
              />
              <span
                v-else
                class="text-sm font-medium"
                aria-hidden="true"
              >
                {{ index + 1 }}
              </span>
              <div
                class="absolute text-sm whitespace-nowrap"
                :class="[
                  alignment === 'vertical'
                    ? 'left-0 ml-12'
                    : labelPosition === 'bottom'
                      ? 'bottom-0 -mb-6'
                      : 'top-0 -mt-8'
                ]"
                :style="{
                  color: isStepCompleted(index)
                    ? 'var(--steps-text-complete)'
                    : 'var(--steps-text)'
                }"
              >
                {{ step.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
