<script lang="ts" setup>
import GithubButton from 'vue-github-button'
</script>

<template>
  <div class="flex items-center">
    <ClientOnly>
      <github-button
        href="https://github.com/dennisadriaans/vue-chrts"
        data-color-scheme="no-preference: light; light: light; dark: dark;"
        data-size="large"
        data-show-count="true"
        aria-label="Star Vue charts on GitHub"
      >
        Star
      </github-button>
    </ClientOnly>
  </div>
</template>
