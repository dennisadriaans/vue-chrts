<script lang="ts" setup>
defineOptions({
  name: "HomePage",
});

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

const LLMFields = {
  total_tokens: { name: "Tokens", color: "#00DC82" },
};

function formatDate(timestamp?: number | string) {
  if (!timestamp) return "";
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
  <div>
    <BarChart
      :data="ClaudeData"
      :height="250"
      :categories="LLMFields"
      :y-axis="['total_tokens']"
      :x-num-ticks="6"
      :radius="0"
      :y-formatter="(i: number) => i"
      :x-formatter="(i: number): string => formatDate(ClaudeData[i]?.timestamp)"
    />
  </div>
</template>
