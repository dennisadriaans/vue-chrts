<template>
  <div
    class="min-w-56 max-w-xs rounded-xl border border-neutral-200/50 bg-white/95 backdrop-blur-sm shadow-2xl ring-1 ring-black/5 dark:border-neutral-700/50 dark:bg-neutral-900/95 dark:ring-white/5 transform transition-all duration-200 ease-out scale-105"
  >
    <!-- Enhanced content area -->
    <div class="px-5 py-4 space-y-3">
      <div class="flex items-center justify-between">
        <div class="space-x-3">
          <span
            class="text-sm font-medium text-neutral-600 dark:text-neutral-300"
            >Temperature</span
          >

          <div class="flex items-center">
            <svg
              class="w-4 h-4 text-green-500 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="text-sm text-green-600 dark:text-green-400 font-medium"
              >+2.3°</span
            >
          </div>
        </div>
        <div class="text-right">
          <div class="flex items-baseline space-x-1">
            <span
              class="text-2xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent dark:from-neutral-100 dark:to-neutral-300"
            >
              {{ values?.temperature || "N/A" }}
            </span>
            <span
              class="text-sm font-medium text-neutral-500 dark:text-neutral-400"
              >°C</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Subtle footer -->
    <div class="px-5 py-2 bg-neutral-50/50 dark:bg-neutral-800/50 rounded-b-xl">
      <p class="text-xs text-neutral-400 dark:text-neutral-500 text-center">
        Custom Tooltip Example
      </p>
    </div>
  </div>
</template>
