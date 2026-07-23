<script setup lang="ts">
const selectedImage = ref<number | null>(null)

defineOptions({
  tags: ['fileupload', 'modal']
})

const galleryImages = [
  '/illustrations/demo1.png',
  '/illustrations/demo2.png',
  '/illustrations/demo3.png',
  '/illustrations/demo4.png',
  '/illustrations/demo5.png'
]

function onUpdate(e) {
  console.log('File uploaded:', e)
}
</script>

<template>
  <UCard class="w-full max-w-md mx-auto">
    <template #header>
      <div class="space-y-1">
        <h3 class="font-semibolde">
          Upload your profile image
        </h3>
        <p class="text-sm text-dimmed">
          Choose an image that will appear everywhere in our app.
        </p>
      </div>
    </template>

    <div class="space-y-6">
      <div class="space-y-2">
        <div>
          <label class="text-sm font-medium0">Upload new image:</label>
        </div>
        <div>
          <UFileUpload
            icon="i-heroicons-folder-open"
            label="Click or drag and drop to upload your file"
            description="PNG, JPG, PDF, GIF, SVG (Max 5 MB)"
            multiple
            layout="list"
            @update:model-value="onUpdate"
          />
        </div>
      </div>

      <USeparator label="OR" />

      <div class="space-y-2">
        <div>
          <label class="text-sm font-medium0">Choose from your gallery:</label>
        </div>
        <div class="grid grid-cols-5 gap-2">
          <img
            v-for="(bg, index) in galleryImages"
            :key="index"
            class="aspect-square rounded-lg transition-ring focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            :class="[selectedImage === index ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-900' : 'hover:ring-2 hover:ring-primary-500/50']"
            :src="bg"
            @click="selectedImage = index"
          >
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between">
        <UButton
          color="neutral"
          variant="outline"
        >
          Cancel
        </UButton>
        <UButton
          color="primary"
          variant="solid"
        >
          Save
        </UButton>
      </div>
    </template>
  </UCard>
</template>
