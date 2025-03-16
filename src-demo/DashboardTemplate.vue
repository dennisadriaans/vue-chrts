<script lang="ts" setup>
import { computed } from "vue";
import Card from "./elements/Card.vue";
import Button from "./elements/Button.vue";
import Dropdown from "./elements/Dropdown.vue";

import { useColorMode } from "@vueuse/core";

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

import { BarChart } from "./../src/components";
import { PaginationPosition } from "./../src/types";

function setColorMode() {
  colorMode.value = isDark.value ? "light" : "dark";
}

const LLMFields = {
  total_tokens: { name: "Tokens", color: "#00dc82" },
};

const ClaudeData = [
  {
    model: "claude",
    prompt_tokens: 150,
    completion_tokens: 300,
    total_tokens: 450,
    timestamp: "2023-10-26T10:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 50,
    completion_tokens: 100,
    total_tokens: 150,
    timestamp: "2023-10-26T10:15:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 200,
    completion_tokens: 50,
    total_tokens: 0.0,
    timestamp: "2023-10-26T10:30:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 100,
    completion_tokens: 200,
    total_tokens: 0,
    timestamp: "2023-10-27T11:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 300,
    completion_tokens: 150,
    total_tokens: 0,
    timestamp: "2023-10-28T12:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 75,
    completion_tokens: 125,
    total_tokens: 0,
    timestamp: "2023-10-29T13:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 120,
    completion_tokens: 180,
    total_tokens: 300,
    timestamp: "2023-10-30T14:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 250,
    completion_tokens: 350,
    total_tokens: 320,
    timestamp: "2023-10-31T15:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 80,
    completion_tokens: 90,
    total_tokens: 0,
    timestamp: "2023-11-01T16:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 400,
    completion_tokens: 200,
    total_tokens: 0,
    timestamp: "2023-11-02T17:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 60,
    completion_tokens: 140,
    total_tokens: 0,
    timestamp: "2023-11-03T18:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 180,
    completion_tokens: 220,
    total_tokens: 0,
    timestamp: "2023-11-04T19:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 350,
    completion_tokens: 450,
    total_tokens: 300,
    timestamp: "2023-11-05T20:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 90,
    completion_tokens: 110,
    total_tokens: 0,
    timestamp: "2023-11-06T21:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 220,
    completion_tokens: 280,
    total_tokens: 0,
    timestamp: "2023-11-07T22:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 450,
    completion_tokens: 550,
    total_tokens: 680,
    timestamp: "2023-11-08T23:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 110,
    completion_tokens: 190,
    total_tokens: 0,
    timestamp: "2023-11-09T00:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 280,
    completion_tokens: 320,
    total_tokens: 0,
    timestamp: "2023-11-10T01:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 550,
    completion_tokens: 450,
    total_tokens: 0,
    timestamp: "2023-11-11T02:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 190,
    completion_tokens: 210,
    total_tokens: 0,
    timestamp: "2023-11-12T03:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 320,
    completion_tokens: 380,
    total_tokens: 0,
    timestamp: "2023-11-13T04:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 650,
    completion_tokens: 350,
    total_tokens: 250,
    timestamp: "2023-11-14T05:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 210,
    completion_tokens: 290,
    total_tokens: 0,
    timestamp: "2023-11-15T06:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 380,
    completion_tokens: 420,
    total_tokens: 380,
    timestamp: "2023-11-16T07:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 700,
    completion_tokens: 300,
    total_tokens: 410,
    timestamp: "2023-11-17T08:00:00Z",
  },
  {
    model: "claude",
    prompt_tokens: 290,
    completion_tokens: 310,
    total_tokens: 600,
    timestamp: "2023-11-18T09:00:00Z",
  },
];

const OpenAIData = [
  {
    model: "open-ai",
    prompt_tokens: 75,
    completion_tokens: 125,
    total_tokens: 0,
    timestamp: "2023-10-26T11:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 300,
    completion_tokens: 200,
    total_tokens: 0,
    timestamp: "2023-10-26T11:15:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 1000,
    completion_tokens: 700,
    total_tokens: 0,
    timestamp: "2023-10-26T11:30:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 150,
    completion_tokens: 250,
    total_tokens: 0,
    timestamp: "2023-10-27T12:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 400,
    completion_tokens: 300,
    total_tokens: 0,
    timestamp: "2023-10-28T13:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 100,
    completion_tokens: 150,
    total_tokens: 0,
    timestamp: "2023-10-29T14:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 200,
    completion_tokens: 200,
    total_tokens: 0,
    timestamp: "2023-10-30T15:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 500,
    completion_tokens: 400,
    total_tokens: 0,
    timestamp: "2023-10-31T16:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 120,
    completion_tokens: 180,
    total_tokens: 0,
    timestamp: "2023-11-01T17:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 600,
    completion_tokens: 350,
    total_tokens: 0,
    timestamp: "2023-11-02T18:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 80,
    completion_tokens: 170,
    total_tokens: 0,
    timestamp: "2023-11-03T19:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 350,
    completion_tokens: 250,
    total_tokens: 0,
    timestamp: "2023-11-04T20:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 700,
    completion_tokens: 500,
    total_tokens: 0,
    timestamp: "2023-11-05T21:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 130,
    completion_tokens: 220,
    total_tokens: 0,
    timestamp: "2023-11-06T22:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 450,
    completion_tokens: 350,
    total_tokens: 0,
    timestamp: "2023-11-07T23:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 900,
    completion_tokens: 600,
    total_tokens: 0,
    timestamp: "2023-11-08T00:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 170,
    completion_tokens: 230,
    total_tokens: 0,
    timestamp: "2023-11-09T01:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 550,
    completion_tokens: 450,
    total_tokens: 0,
    timestamp: "2023-11-10T02:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 1100,
    completion_tokens: 800,
    total_tokens: 0,
    timestamp: "2023-11-11T03:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 230,
    completion_tokens: 270,
    total_tokens: 0,
    timestamp: "2023-11-12T04:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 650,
    completion_tokens: 550,
    total_tokens: 0,
    timestamp: "2023-11-13T05:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 1300,
    completion_tokens: 700,
    total_tokens: 0,
    timestamp: "2023-11-14T06:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 270,
    completion_tokens: 330,
    total_tokens: 0,
    timestamp: "2023-11-15T07:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 750,
    completion_tokens: 650,
    total_tokens: 210,
    timestamp: "2023-11-16T08:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 1500,
    completion_tokens: 500,
    total_tokens: 260,
    timestamp: "2023-11-17T09:00:00Z",
  },
  {
    model: "open-ai",
    prompt_tokens: 330,
    completion_tokens: 370,
    total_tokens: 190,
    timestamp: "2023-11-18T10:00:00Z",
  },
];

const GeminiData = [
  {
    model: "gemini",
    prompt_tokens: 500,
    completion_tokens: 1000,
    total_tokens: 0,
    timestamp: "2023-10-26T12:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 100,
    completion_tokens: 200,
    total_tokens: 0,
    timestamp: "2023-10-26T12:15:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 2000,
    completion_tokens: 1500,
    total_tokens: 0,
    timestamp: "2023-10-26T12:30:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 700,
    completion_tokens: 1200,
    total_tokens: 0,
    timestamp: "2023-10-27T13:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 300,
    completion_tokens: 500,
    total_tokens: 0,
    timestamp: "2023-10-28T14:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 1200,
    completion_tokens: 900,
    total_tokens: 0,
    timestamp: "2023-10-29T15:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 600,
    completion_tokens: 800,
    total_tokens: 0,
    timestamp: "2023-10-30T16:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 400,
    completion_tokens: 600,
    total_tokens: 0,
    timestamp: "2023-10-31T17:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 1500,
    completion_tokens: 1100,
    total_tokens: 0,
    timestamp: "2023-11-01T18:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 800,
    completion_tokens: 1300,
    total_tokens: 0,
    timestamp: "2023-11-02T19:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 250,
    completion_tokens: 450,
    total_tokens: 0,
    timestamp: "2023-11-03T20:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 1800,
    completion_tokens: 1200,
    total_tokens: 0,
    timestamp: "2023-11-04T21:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 900,
    completion_tokens: 1400,
    total_tokens: 20,
    timestamp: "2023-11-05T22:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 350,
    completion_tokens: 550,
    total_tokens: 21,
    timestamp: "2023-11-06T23:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 2200,
    completion_tokens: 1300,
    total_tokens: 10,
    timestamp: "2023-11-07T00:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 1000,
    completion_tokens: 1500,
    total_tokens: 0,
    timestamp: "2023-11-08T01:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 450,
    completion_tokens: 650,
    total_tokens: 0,
    timestamp: "2023-11-09T02:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 2500,
    completion_tokens: 1400,
    total_tokens: 0,
    timestamp: "2023-11-10T03:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 1100,
    completion_tokens: 1600,
    total_tokens: 30,
    timestamp: "2023-11-11T04:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 550,
    completion_tokens: 750,
    total_tokens: 40,
    timestamp: "2023-11-12T05:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 2800,
    completion_tokens: 1500,
    total_tokens: 50,
    timestamp: "2023-11-13T06:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 1200,
    completion_tokens: 1700,
    total_tokens: 0,
    timestamp: "2023-11-14T07:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 650,
    completion_tokens: 850,
    total_tokens: 0,
    timestamp: "2023-11-15T08:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 3100,
    completion_tokens: 1600,
    total_tokens: 0,
    timestamp: "2023-11-16T09:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 1300,
    completion_tokens: 1800,
    total_tokens: 0,
    timestamp: "2023-11-17T10:00:00Z",
  },
  {
    model: "gemini",
    prompt_tokens: 750,
    completion_tokens: 950,
    total_tokens: 0,
    timestamp: "2023-11-18T11:00:00Z",
  },
];

function formatDate(timestamp) {
  const options = {
    month: "short",
    day: "numeric",
  };

  const date = new Date(timestamp);
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  return `${formattedDate}`;
}
</script>
<template>
  <div class="max-w-7xl mx-auto py-8">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold">Nuxt Admin Dashboard</h2>

      <svg
        @click="setColorMode"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        class="size-5 cursor-pointer"
      >
        <path
          v-if="!isDark"
          d="M14.438 10.148c.19-.425-.321-.787-.748-.601A5.5 5.5 0 0 1 6.453 2.31c.186-.427-.176-.938-.6-.748a6.501 6.501 0 1 0 8.585 8.586Z"
        />
        <path
          v-else
          d="M8 1a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 1ZM10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM12.95 4.11a.75.75 0 1 0-1.06-1.06l-1.062 1.06a.75.75 0 0 0 1.061 1.062l1.06-1.061ZM15 8a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 15 8ZM11.89 12.95a.75.75 0 0 0 1.06-1.06l-1.06-1.062a.75.75 0 0 0-1.062 1.061l1.061 1.06ZM8 12a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 12ZM5.172 11.89a.75.75 0 0 0-1.061-1.062L3.05 11.89a.75.75 0 1 0 1.06 1.06l1.06-1.06ZM4 8a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 4 8ZM4.11 5.172A.75.75 0 0 0 5.173 4.11L4.11 3.05a.75.75 0 1 0-1.06 1.06l1.06 1.06Z"
        />
      </svg>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4 mt-16 mb-8">
        <Dropdown></Dropdown>
        <span class="text-white/75">Token Usages</span>
      </div>

      <Button color="white" icon="i-heroicons:swatch" size="lg">
        Add items
      </Button>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <Card>
        <h2 class="text-xl text-white/75 my-2 font-medium mb-6">Sonnet 3.7</h2>

        <div class="space-y-1">
          <h4 class="text-lg text-white/50">Total Tokens</h4>
          <h3 class="text-xl font-semibold">2,381</h3>
        </div>

        <BarChart
          :data="ClaudeData"
          :height="250"
          :categories="LLMFields"
          :y-axis="['total_tokens']"
          :xNumTicks="6"
          :radius="0"
          :y-formatter="(i: number) => i"
          :x-formatter="(i: number): string => formatDate(ClaudeData[i].timestamp)"
          :pagination-position="PaginationPosition.Top"
        />
      </Card>
      <Card>
        <h2 class="text-xl text-white/75 my-2 font-medium mb-6">GPT-4o</h2>

        <div class="space-y-1">
          <h4 class="text-lg text-white/50">Total Tokens</h4>
          <h3 class="text-xl font-semibold">2,381</h3>
        </div>

        <BarChart
          :data="OpenAIData"
          :height="250"
          :categories="LLMFields"
          :y-axis="['total_tokens']"
          :xNumTicks="6"
          :radius="0"
          :y-formatter="(i: number) => i"
          :x-formatter="(i: number): string => formatDate(ClaudeData[i].timestamp)"
          :pagination-position="PaginationPosition.Top"
        />
      </Card>
      <Card>
        <h2 class="text-xl text-white/75 my-2 font-medium mb-6">Flash 2.0</h2>

        <div class="space-y-1">
          <h4 class="text-lg text-white/50">Total Tokens</h4>
          <h3 class="text-xl font-semibold">2,381</h3>
        </div>

        <BarChart
          :data="GeminiData"
          :height="250"
          :categories="LLMFields"
          :y-axis="['total_tokens']"
          :xNumTicks="6"
          :radius="0"
          :y-formatter="(i: number) => i"
          :x-formatter="(i: number): string => formatDate(ClaudeData[i].timestamp)"
          :pagination-position="PaginationPosition.Top"
        />
      </Card>
    </div>
  </div>
</template>
