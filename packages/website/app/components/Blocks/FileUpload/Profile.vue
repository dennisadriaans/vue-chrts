<script setup lang="ts">
defineOptions({
  tags: ['fileupload', 'profile']
})

const authorName = ref('')
const title = ref('Marketing Manager')
const fileInputRef = ref<HTMLInputElement | null>(null)

const handleImageClick = () => {
  fileInputRef.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file && file.size <= 1024 * 1024) { // 1MB limit
    // Handle file upload
    console.log('File selected:', file)
  } else if (file) {
    console.error('File size exceeds 1MB')
  }
}
</script>

<template>
  <UCard class="w-full max-w-lg mx-auto">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold">
          Add a writer
        </h3>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          size="sm"
          square
        />
      </div>
    </template>

    <div class="flex flex-col md:flex-row gap-6">
      <div class="flex flex-col items-center gap-3 w-full md:w-auto md:flex-none">
        <div class="relative">
          <UAvatar
            icon="i-lucide-user"
            size="3xl"
          />
          <UButton
            icon="i-lucide-plus"
            size="xs"
            color="neutral"
            variant="solid"
            square
            class="absolute -top-1 -right-1 rounded-full"
            @click="handleImageClick"
          />
        </div>
        <div class="text-center space-y-0.5">
          <p class="text-sm font-medium">
            <span class="font-bold">Upload</span> image
          </p>
          <p class="text-xs text-dimmed">
            Max file size: 1MB
          </p>
        </div>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileChange"
        >
        <UButton
          color="neutral"
          variant="outline"
          label="Add Image"
          size="sm"
          class="w-full"
          @click="handleImageClick"
        />
      </div>

      <div class="hidden md:block w-px" />

      <div class="flex-1 space-y-4">
        <UFormField
          label="Author name"
          required
        >
          <UInput
            v-model="authorName"
            class="w-full"
            placeholder="Enter author name"
          />
        </UFormField>

        <UFormField label="Title">
          <template #label>
            <div class="flex items-center gap-1">
              <span>Title</span>
              <UIcon
                name="i-lucide-circle-help"
                class="w-3.5 h-3.5"
              />
            </div>
          </template>
          <UInput
            v-model="title"
            class="w-full"
            placeholder="Marketing Manager"
          />
        </UFormField>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="outline"
          label="Cancel"
        />
        <UButton
          label="Save Changes"
        />
      </div>
    </template>
  </UCard>
</template>
