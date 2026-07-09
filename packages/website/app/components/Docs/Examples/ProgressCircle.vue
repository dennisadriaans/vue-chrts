<template>
  <UCard class="w-full">
    <UCard>
      <div class="flex flex-col items-center justify-center space-y-2">
        <LibProgressCircle
          :value="88"
          :size="80"
          :stroke-width="8"
          :show-label="true"
        />
        <span class="text-toned dark:text-muted text-center">Progress Example</span>
      </div>
    </UCard>
  </UCard>
</template>
