<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

// Props (if needed)
const props = defineProps({
  initialOption: {
    type: String,
    default: "24 hours",
  },
  optionList: {
    type: Array,
    default: () => ["24 hours", "30 days"],
  },
});

// Emits
const emit = defineEmits(["option-selected"]);

// Reactive state
const isOpen = ref(false);
const selectedOption = ref(props.initialOption);
const options = ref(props.optionList);

// Methods
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option) => {
  selectedOption.value = option;
  isOpen.value = false;
  emit("option-selected", option);
};

const clickOutside = (e) => {
  if (!e.target.closest(".relative")) {
    isOpen.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener("click", clickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", clickOutside);
});
</script>

<template>
  <div class="relative min-w-32 w-auto inline-block">
    <!-- Dropdown Button -->
    <button
      @click="toggleDropdown"
      class="flex items-center justify-between w-full px-4 py-2 text-sm text-white bg-card rounded-md hover:bg-card focus:outline-none ring ring-border"
    >
      <span>{{ selectedOption }}</span>
      <svg
        class="w-4 h-4 ml-2"
        :class="{ 'transform rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute z-10 w-full mt-1 bg-card rounded-md shadow-lg ring ring-border"
    >
      <div class="py-1">
        <a
          v-for="(option, index) in options"
          :key="index"
          @click="selectOption(option)"
          class="block px-4 py-2 text-sm text-white hover:bg-background cursor-pointer"
          :class="{ 'bg-card': option === selectedOption }"
        >
          <div class="flex items-center">
            <svg
              v-if="option === selectedOption"
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span v-else class="w-4 h-4 mr-2"></span>
            {{ option }}
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
