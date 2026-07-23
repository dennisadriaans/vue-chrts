<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonValue = any
type JsonObject = Record<string, JsonValue>

const model = defineModel<JsonValue>({ required: true })

const props = defineProps<{
  label?: string
  description?: string
  /** Schema definition for the JSON structure */
  schema?: JsonSchema
}>()

export interface JsonSchema {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean'
  properties?: Record<string, JsonSchema & { label?: string, description?: string }>
  items?: JsonSchema & { label?: string }
  enum?: string[]
  default?: JsonValue
}

const isOpen = ref(false)
const editValue = ref<JsonValue>(null)

function openEditor() {
  editValue.value = JSON.parse(JSON.stringify(model.value))
  isOpen.value = true
}

function saveChanges() {
  model.value = JSON.parse(JSON.stringify(editValue.value))
  isOpen.value = false
}

function cancelChanges() {
  isOpen.value = false
}

// Helper to get preview text
const previewText = computed(() => {
  if (model.value === null || model.value === undefined) return 'null'
  if (Array.isArray(model.value)) {
    return `${model.value.length} item${model.value.length !== 1 ? 's' : ''}`
  }
  if (typeof model.value === 'object') {
    const keys = Object.keys(model.value)
    return `${keys.length} field${keys.length !== 1 ? 's' : ''}`
  }
  return String(model.value)
})

// Type checking helpers
function isObject(val: unknown): val is JsonObject {
  return val !== null && typeof val === 'object' && !Array.isArray(val)
}

function isArray(val: unknown): val is JsonValue[] {
  return Array.isArray(val)
}

// Array manipulation
function addArrayItem() {
  if (!isArray(editValue.value)) return
  const itemSchema = props.schema?.items
  let newItem: JsonValue = ''

  if (itemSchema?.type === 'object' && itemSchema.properties) {
    newItem = {}
    for (const [key, propSchema] of Object.entries(itemSchema.properties)) {
      (newItem as JsonObject)[key] = propSchema.default ?? getDefaultForType(propSchema.type)
    }
  } else if (itemSchema?.type === 'array') {
    newItem = []
  } else if (itemSchema?.type === 'number') {
    newItem = 0
  } else if (itemSchema?.type === 'boolean') {
    newItem = false
  }

  editValue.value.push(newItem)
}

function removeArrayItem(index: number) {
  if (!isArray(editValue.value)) return
  editValue.value.splice(index, 1)
}

function moveArrayItem(index: number, direction: 'up' | 'down') {
  if (!isArray(editValue.value)) return
  const arr = editValue.value
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= arr.length) return
  const temp = arr[index]
  if (temp !== undefined && arr[newIndex] !== undefined) {
    arr[index] = arr[newIndex]!
    arr[newIndex] = temp
  }
}

function getDefaultForType(type: string): JsonValue {
  switch (type) {
    case 'string': return ''
    case 'number': return 0
    case 'boolean': return false
    case 'object': return {}
    case 'array': return []
    default: return ''
  }
}

// Object key manipulation
function addObjectKey() {
  if (!isObject(editValue.value)) return
  const newKey = `key_${Date.now()}`
  editValue.value[newKey] = ''
}

function removeObjectKey(key: string) {
  if (!isObject(editValue.value)) return
  const obj = editValue.value
  const newObj: JsonObject = {}
  for (const k of Object.keys(obj)) {
    if (k !== key) {
      newObj[k] = obj[k]!
    }
  }
  editValue.value = newObj
}

function renameObjectKey(oldKey: string, newKey: string) {
  if (!isObject(editValue.value) || oldKey === newKey) return
  if (newKey in editValue.value) return // Key already exists
  const obj = editValue.value
  const newObj: JsonObject = {}
  for (const k of Object.keys(obj)) {
    if (k === oldKey) {
      newObj[newKey] = obj[k]!
    } else {
      newObj[k] = obj[k]!
    }
  }
  editValue.value = newObj
}

function updateArrayItemField(index: number, key: string, value: JsonValue) {
  if (!isArray(editValue.value)) return
  const item = editValue.value[index]
  if (isObject(item)) {
    item[key] = value
  }
}

function updateArrayItem(index: number, value: JsonValue) {
  if (!isArray(editValue.value)) return
  editValue.value[index] = value
}

function updateObjectField(key: string, value: JsonValue) {
  if (!isObject(editValue.value)) return
  editValue.value[key] = value
}

function handleJsonParse(key: string, value: string) {
  try {
    updateObjectField(key, JSON.parse(value))
  } catch {
    // Invalid JSON, ignore
  }
}
</script>

<template>
  <StorybookCustomControl
    :label="label ?? 'JSON Editor'"
    :description="description"
  >
    <UModal v-model:open="isOpen">
      <UButton
        color="neutral"
        variant="outline"
        trailing-icon="i-lucide-chevron-right"
        class="w-40 justify-between"
        @click="openEditor"
      >
        <span class="truncate text-muted">{{ previewText }}</span>
      </UButton>

      <template #content>
        <div class="flex h-[90vh] max-h-[800px] flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-(--ui-border) px-6 py-4">
            <div>
              <h3 class="text-base font-semibold text-(--ui-text-highlighted)">
                {{ label }}
              </h3>
              <p
                v-if="description"
                class="mt-0.5 text-sm text-(--ui-text-muted)"
              >
                {{ description }}
              </p>
            </div>
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              square
              @click="cancelChanges"
            />
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto bg-[repeating-linear-gradient(45deg,var(--ui-bg-elevated)_0,var(--ui-bg-muted)_1px,transparent_0,transparent_50%)] bg-[length:10px_10px] p-6">
            <!-- Array Editor -->
            <template v-if="isArray(editValue)">
              <div class="space-y-3">
                <!-- Empty state -->
                <div
                  v-if="editValue.length === 0"
                  class="flex flex-col items-center justify-center rounded-lg border border-dashed border-(--ui-border) bg-(--ui-bg) py-12 text-center"
                >
                  <div class="flex size-12 items-center justify-center rounded-full bg-(--ui-bg-muted)">
                    <UIcon
                      name="i-lucide-list"
                      class="size-6 text-(--ui-text-muted)"
                    />
                  </div>
                  <p class="mt-3 text-sm font-medium text-(--ui-text-highlighted)">
                    No items yet
                  </p>
                  <p class="mt-1 text-sm text-(--ui-text-muted)">
                    Add your first item to get started
                  </p>
                  <UButton
                    label="Add item"
                    icon="i-lucide-plus"
                    color="neutral"
                    variant="outline"
                    class="mt-4"
                    @click="addArrayItem"
                  />
                </div>

                <div
                  v-for="(item, index) in editValue"
                  :key="index"
                  class="group relative overflow-hidden rounded-lg border border-(--ui-border) bg-(--ui-bg)"
                >
                  <!-- Array item header -->
                  <div class="flex items-center justify-between border-b border-(--ui-border) px-4 py-2">
                    <span class="text-xs font-medium text-(--ui-text-muted)">
                      Item {{ index + 1 }}
                    </span>
                    <div class="flex items-center gap-1">
                      <UButton
                        icon="i-lucide-chevron-up"
                        color="neutral"
                        variant="ghost"
                        square
                        :disabled="index === 0"
                        @click="moveArrayItem(index, 'up')"
                      />
                      <UButton
                        icon="i-lucide-chevron-down"
                        color="neutral"
                        variant="ghost"
                        square
                        :disabled="index === editValue.length - 1"
                        @click="moveArrayItem(index, 'down')"
                      />
                      <UButton
                        icon="i-lucide-trash-2"
                        color="error"
                        variant="ghost"
                        square
                        @click="removeArrayItem(index)"
                      />
                    </div>
                  </div>

                  <!-- Array item content -->
                  <template v-if="isObject(item)">
                    <div class="divide-y divide-(--ui-border)">
                      <div
                        v-for="(value, key) in item"
                        :key="key"
                        class="flex items-center justify-between px-4 py-3"
                      >
                        <div class="shrink-0">
                          <p class="text-sm font-medium">
                            {{ schema?.items?.properties?.[key as string]?.label || String(key) }}
                          </p>
                        </div>
                        <div class="ml-4 w-48">
                          <!-- Color input for color fields -->
                          <template v-if="String(key).toLowerCase().includes('color')">
                            <div class="flex items-center gap-2">
                              <input
                                :value="value as string"
                                type="color"
                                class="h-9 w-12 cursor-pointer rounded border border-(--ui-border) bg-transparent p-1"
                                @input="updateArrayItemField(index, key as string, ($event.target as HTMLInputElement).value)"
                              >
                              <UInput
                                :model-value="value as string"
                                class="w-full"
                                @update:model-value="updateArrayItemField(index, key as string, $event as string)"
                              />
                            </div>
                          </template>
                          <!-- Number input -->
                          <template v-else-if="typeof value === 'number'">
                            <UInput
                              :model-value="value"
                              type="number"
                              class="w-full"
                              @update:model-value="updateArrayItemField(index, key as string, Number($event))"
                            />
                          </template>
                          <!-- Boolean toggle -->
                          <template v-else-if="typeof value === 'boolean'">
                            <USwitch
                              :model-value="value"
                              @update:model-value="updateArrayItemField(index, key as string, $event)"
                            />
                          </template>
                          <!-- String input -->
                          <template v-else>
                            <UInput
                              :model-value="value as string"
                              class="w-full"
                              @update:model-value="updateArrayItemField(index, key as string, $event as string)"
                            />
                          </template>
                        </div>
                      </div>
                    </div>
                  </template>

                  <!-- Primitive array item -->
                  <template v-else>
                    <div class="px-4 py-3">
                      <UInput
                        v-if="typeof item === 'string' || typeof item === 'number'"
                        :model-value="item"
                        :type="typeof item === 'number' ? 'number' : 'text'"
                        class="w-full"
                        @update:model-value="updateArrayItem(index, typeof item === 'number' ? Number($event) : $event as string)"
                      />
                      <USwitch
                        v-else-if="typeof item === 'boolean'"
                        :model-value="item"
                        @update:model-value="updateArrayItem(index, $event)"
                      />
                    </div>
                  </template>
                </div>

                <!-- Add item button -->
                <button
                  v-if="editValue.length > 0"
                  class="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-(--ui-border) bg-(--ui-bg) py-3 text-sm text-(--ui-text-muted) transition-colors hover:border-(--ui-border-accented) hover:text-(--ui-text)"
                  @click="addArrayItem"
                >
                  <UIcon
                    name="i-lucide-plus"
                    class="size-4"
                  />
                  Add item
                </button>
              </div>
            </template>

            <!-- Object Editor -->
            <template v-else-if="isObject(editValue)">
              <div class="space-y-3">
                <!-- Empty state -->
                <div
                  v-if="Object.keys(editValue).length === 0"
                  class="flex flex-col items-center justify-center rounded-lg border border-dashed border-(--ui-border) bg-(--ui-bg) py-12 text-center"
                >
                  <div class="flex size-12 items-center justify-center rounded-full bg-(--ui-bg-muted)">
                    <UIcon
                      name="i-lucide-braces"
                      class="size-6 text-(--ui-text-muted)"
                    />
                  </div>
                  <p class="mt-3 text-sm font-medium text-(--ui-text-highlighted)">
                    No fields yet
                  </p>
                  <p class="mt-1 text-sm text-(--ui-text-muted)">
                    Add your first field to get started
                  </p>
                  <UButton
                    label="Add field"
                    icon="i-lucide-plus"
                    color="neutral"
                    variant="outline"
                    class="mt-4"
                    @click="addObjectKey"
                  />
                </div>

                <div
                  v-for="(value, key) in editValue"
                  :key="key"
                  class="group overflow-hidden rounded-lg border border-(--ui-border) bg-(--ui-bg)"
                >
                  <div class="flex items-center justify-between border-b border-(--ui-border) px-4 py-2">
                    <UInput
                      :model-value="key"
                      placeholder="Key"
                      class="w-32"
                      @blur="renameObjectKey(key as string, ($event.target as HTMLInputElement).value)"
                    />
                    <UButton
                      icon="i-lucide-trash-2"
                      color="error"
                      variant="ghost"
                      square
                      @click="removeObjectKey(key as string)"
                    />
                  </div>
                  <div class="px-4 py-3">
                    <template v-if="typeof value === 'number'">
                      <UInput
                        :model-value="value"
                        type="number"
                        class="w-full"
                        @update:model-value="updateObjectField(key as string, Number($event))"
                      />
                    </template>
                    <template v-else-if="typeof value === 'boolean'">
                      <USwitch
                        :model-value="value"
                        @update:model-value="updateObjectField(key as string, $event)"
                      />
                    </template>
                    <template v-else-if="isObject(value) || isArray(value)">
                      <UTextarea
                        :model-value="JSON.stringify(value, null, 2)"
                        :rows="3"
                        class="w-full font-mono text-xs"
                        @update:model-value="handleJsonParse(key as string, $event)"
                      />
                    </template>
                    <template v-else>
                      <UInput
                        :model-value="value as string"
                        class="w-full"
                        @update:model-value="updateObjectField(key as string, $event as string)"
                      />
                    </template>
                  </div>
                </div>

                <!-- Add key button -->
                <button
                  v-if="Object.keys(editValue).length > 0"
                  class="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-(--ui-border) bg-(--ui-bg) py-3 text-sm text-(--ui-text-muted) transition-colors hover:border-(--ui-border-accented) hover:text-(--ui-text)"
                  @click="addObjectKey"
                >
                  <UIcon
                    name="i-lucide-plus"
                    class="size-4"
                  />
                  Add field
                </button>
              </div>
            </template>

            <!-- Primitive Editor (fallback) -->
            <template v-else>
              <div class="overflow-hidden rounded-lg border border-(--ui-border) bg-(--ui-bg)">
                <div class="border-b border-(--ui-border) px-4 py-2">
                  <span class="text-xs font-medium text-(--ui-text-muted)">Value</span>
                </div>
                <div class="px-4 py-3">
                  <UInput
                    v-if="typeof editValue === 'string'"
                    :model-value="editValue"
                    class="w-full"
                    @update:model-value="editValue = $event as string"
                  />
                  <UInput
                    v-else-if="typeof editValue === 'number'"
                    :model-value="editValue"
                    type="number"
                    class="w-full"
                    @update:model-value="editValue = Number($event)"
                  />
                  <USwitch
                    v-else-if="typeof editValue === 'boolean'"
                    :model-value="editValue"
                    @update:model-value="editValue = $event"
                  />
                </div>
              </div>
            </template>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-3 border-t border-(--ui-border) px-6 py-4">
            <UButton
              label="Cancel"
              color="neutral"
              variant="ghost"
              @click="cancelChanges"
            />
            <UButton
              label="Save changes"
              color="neutral"
              variant="solid"
              @click="saveChanges"
            />
          </div>
        </div>
      </template>
    </UModal>
  </StorybookCustomControl>
</template>
