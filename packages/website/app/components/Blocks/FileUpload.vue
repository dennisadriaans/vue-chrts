<script setup lang="ts">
defineOptions({
  tags: ['blocks', 'fileupload']
})
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">
        File Upload Components
      </h2>
      <p class="text-toned dark:text-muted">
        A collection of different file upload components for your applications.
      </p>
    </div>
    <ClientOnly>
      <div class="mt-12 space-y-24 lg:mt-0">
        <PreviewExample title="Nuxt UI File Upload modal">
          <template #chart>
            <BlocksFileUploadModal />
          </template>
          <PreviewCode
            id="file-upload-modal"
            category="application/file-upload"
            block="modal"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Nuxt UI File Upload Profile">
          <template #chart>
            <BlocksFileUploadProfile />
          </template>
          <PreviewCode
            id="file-upload-profile"
            category="application/file-upload"
            block="profile"
            :lock-code="true"
          />
        </PreviewExample>
      </div>
    </ClientOnly>
  </div>
</template>
