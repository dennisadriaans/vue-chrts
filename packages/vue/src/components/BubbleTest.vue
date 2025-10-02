<script lang="ts" setup>
import BubbleChart from './../../lib/components/BubbleChart/BubbleChart.vue'
const bubbleChartData = [
  {
    id: 'Drama-Jan',
    title: 'Drama',
    month: 1,
    viewingHours: 2.8,
    subscribers: 45,
  },
  {
    id: 'Drama-Feb',
    title: 'Drama',
    month: 2,
    viewingHours: 2.9,
    subscribers: 48,
  },
  {
    id: 'Drama-Mar',
    title: 'Drama',
    month: 3,
    viewingHours: 3.1,
    subscribers: 52,
  },
  {
    id: 'Drama-Apr',
    title: 'Drama',
    month: 4,
    viewingHours: 2.7,
    subscribers: 46,
  },
  {
    id: 'Drama-May',
    title: 'Drama',
    month: 5,
    viewingHours: 3.2,
    subscribers: 55,
  },
  {
    id: 'Drama-Jun',
    title: 'Drama',
    month: 6,
    viewingHours: 3.0,
    subscribers: 50,
  },
  {
    id: 'Drama-Jul',
    title: 'Drama',
    month: 7,
    viewingHours: 3.3,
    subscribers: 58,
  },
  {
    id: 'Drama-Aug',
    title: 'Drama',
    month: 8,
    viewingHours: 3.1,
    subscribers: 53,
  },
  {
    id: 'Drama-Sep',
    title: 'Drama',
    month: 9,
    viewingHours: 2.9,
    subscribers: 49,
  },
  {
    id: 'Drama-Oct',
    title: 'Drama',
    month: 10,
    viewingHours: 3.4,
    subscribers: 60,
  },
  {
    id: 'Drama-Nov',
    title: 'Drama',
    month: 11,
    viewingHours: 3.5,
    subscribers: 62,
  },
  {
    id: 'Drama-Dec',
    title: 'Drama',
    month: 12,
    viewingHours: 3.6,
    subscribers: 65,
  },

  // Action/Thriller
  {
    id: 'Action-Jan',
    title: 'Action/Thriller',
    month: 1,
    viewingHours: 2.5,
    subscribers: 42,
  },
  {
    id: 'Action-Feb',
    title: 'Action/Thriller',
    month: 2,
    viewingHours: 2.6,
    subscribers: 44,
  },
  {
    id: 'Action-Mar',
    title: 'Action/Thriller',
    month: 3,
    viewingHours: 2.8,
    subscribers: 48,
  },
  {
    id: 'Action-Apr',
    title: 'Action/Thriller',
    month: 4,
    viewingHours: 2.4,
    subscribers: 40,
  },
  {
    id: 'Action-May',
    title: 'Action/Thriller',
    month: 5,
    viewingHours: 2.9,
    subscribers: 50,
  },
  {
    id: 'Action-Jun',
    title: 'Action/Thriller',
    month: 6,
    viewingHours: 2.7,
    subscribers: 46,
  },
  {
    id: 'Action-Jul',
    title: 'Action/Thriller',
    month: 7,
    viewingHours: 3.0,
    subscribers: 52,
  },
  {
    id: 'Action-Aug',
    title: 'Action/Thriller',
    month: 8,
    viewingHours: 2.8,
    subscribers: 48,
  },
  {
    id: 'Action-Sep',
    title: 'Action/Thriller',
    month: 9,
    viewingHours: 2.6,
    subscribers: 44,
  },
  {
    id: 'Action-Oct',
    title: 'Action/Thriller',
    month: 10,
    viewingHours: 3.1,
    subscribers: 54,
  },
  {
    id: 'Action-Nov',
    title: 'Action/Thriller',
    month: 11,
    viewingHours: 3.2,
    subscribers: 56,
  },
  {
    id: 'Action-Dec',
    title: 'Action/Thriller',
    month: 12,
    viewingHours: 3.3,
    subscribers: 58,
  },

  // Comedy
  {
    id: 'Comedy-Jan',
    title: 'Comedy',
    month: 1,
    viewingHours: 2.2,
    subscribers: 38,
  },
  {
    id: 'Comedy-Feb',
    title: 'Comedy',
    month: 2,
    viewingHours: 2.3,
    subscribers: 40,
  },
  {
    id: 'Comedy-Mar',
    title: 'Comedy',
    month: 3,
    viewingHours: 2.5,
    subscribers: 43,
  },
  {
    id: 'Comedy-Apr',
    title: 'Comedy',
    month: 4,
    viewingHours: 2.1,
    subscribers: 36,
  },
  {
    id: 'Comedy-May',
    title: 'Comedy',
    month: 5,
    viewingHours: 2.6,
    subscribers: 45,
  },
  {
    id: 'Comedy-Jun',
    title: 'Comedy',
    month: 6,
    viewingHours: 2.4,
    subscribers: 42,
  },
  {
    id: 'Comedy-Jul',
    title: 'Comedy',
    month: 7,
    viewingHours: 2.7,
    subscribers: 47,
  },
  {
    id: 'Comedy-Aug',
    title: 'Comedy',
    month: 8,
    viewingHours: 2.5,
    subscribers: 44,
  },
  {
    id: 'Comedy-Sep',
    title: 'Comedy',
    month: 9,
    viewingHours: 2.3,
    subscribers: 40,
  },
  {
    id: 'Comedy-Oct',
    title: 'Comedy',
    month: 10,
    viewingHours: 2.8,
    subscribers: 49,
  },
  {
    id: 'Comedy-Nov',
    title: 'Comedy',
    month: 11,
    viewingHours: 2.9,
    subscribers: 51,
  },
  {
    id: 'Comedy-Dec',
    title: 'Comedy',
    month: 12,
    viewingHours: 3.0,
    subscribers: 53,
  },

  // Documentary
  {
    id: 'Doc-Jan',
    title: 'Documentary',
    month: 1,
    viewingHours: 1.8,
    subscribers: 30,
  },
  {
    id: 'Doc-Feb',
    title: 'Documentary',
    month: 2,
    viewingHours: 1.9,
    subscribers: 32,
  },
  {
    id: 'Doc-Mar',
    title: 'Documentary',
    month: 3,
    viewingHours: 2.1,
    subscribers: 35,
  },
  {
    id: 'Doc-Apr',
    title: 'Documentary',
    month: 4,
    viewingHours: 1.7,
    subscribers: 28,
  },
  {
    id: 'Doc-May',
    title: 'Documentary',
    month: 5,
    viewingHours: 2.2,
    subscribers: 37,
  },
  {
    id: 'Doc-Jun',
    title: 'Documentary',
    month: 6,
    viewingHours: 2.0,
    subscribers: 34,
  },
  {
    id: 'Doc-Jul',
    title: 'Documentary',
    month: 7,
    viewingHours: 2.3,
    subscribers: 39,
  },
  {
    id: 'Doc-Aug',
    title: 'Documentary',
    month: 8,
    viewingHours: 2.1,
    subscribers: 36,
  },
  {
    id: 'Doc-Sep',
    title: 'Documentary',
    month: 9,
    viewingHours: 1.9,
    subscribers: 32,
  },
  {
    id: 'Doc-Oct',
    title: 'Documentary',
    month: 10,
    viewingHours: 2.4,
    subscribers: 41,
  },
  {
    id: 'Doc-Nov',
    title: 'Documentary',
    month: 11,
    viewingHours: 2.5,
    subscribers: 43,
  },
  {
    id: 'Doc-Dec',
    title: 'Documentary',
    month: 12,
    viewingHours: 2.6,
    subscribers: 45,
  },

  // Romance
  {
    id: 'Romance-Jan',
    title: 'Romance',
    month: 1,
    viewingHours: 1.9,
    subscribers: 32,
  },
  {
    id: 'Romance-Feb',
    title: 'Romance',
    month: 2,
    viewingHours: 2.4,
    subscribers: 41,
  },
  {
    id: 'Romance-Mar',
    title: 'Romance',
    month: 3,
    viewingHours: 2.2,
    subscribers: 38,
  },
  {
    id: 'Romance-Apr',
    title: 'Romance',
    month: 4,
    viewingHours: 1.8,
    subscribers: 30,
  },
  {
    id: 'Romance-May',
    title: 'Romance',
    month: 5,
    viewingHours: 2.3,
    subscribers: 40,
  },
  {
    id: 'Romance-Jun',
    title: 'Romance',
    month: 6,
    viewingHours: 2.1,
    subscribers: 36,
  },
  {
    id: 'Romance-Jul',
    title: 'Romance',
    month: 7,
    viewingHours: 2.4,
    subscribers: 42,
  },
  {
    id: 'Romance-Aug',
    title: 'Romance',
    month: 8,
    viewingHours: 2.2,
    subscribers: 38,
  },
  {
    id: 'Romance-Sep',
    title: 'Romance',
    month: 9,
    viewingHours: 2.0,
    subscribers: 34,
  },
  {
    id: 'Romance-Oct',
    title: 'Romance',
    month: 10,
    viewingHours: 2.5,
    subscribers: 44,
  },
  {
    id: 'Romance-Nov',
    title: 'Romance',
    month: 11,
    viewingHours: 2.6,
    subscribers: 46,
  },
  {
    id: 'Romance-Dec',
    title: 'Romance',
    month: 12,
    viewingHours: 2.7,
    subscribers: 48,
  },

  // Sci-Fi/Fantasy
  {
    id: 'SciFi-Jan',
    title: 'Sci-Fi/Fantasy',
    month: 1,
    viewingHours: 2.1,
    subscribers: 35,
  },
  {
    id: 'SciFi-Feb',
    title: 'Sci-Fi/Fantasy',
    month: 2,
    viewingHours: 2.2,
    subscribers: 37,
  },
  {
    id: 'SciFi-Mar',
    title: 'Sci-Fi/Fantasy',
    month: 3,
    viewingHours: 2.4,
    subscribers: 41,
  },
  {
    id: 'SciFi-Apr',
    title: 'Sci-Fi/Fantasy',
    month: 4,
    viewingHours: 2.0,
    subscribers: 33,
  },
  {
    id: 'SciFi-May',
    title: 'Sci-Fi/Fantasy',
    month: 5,
    viewingHours: 2.5,
    subscribers: 43,
  },
  {
    id: 'SciFi-Jun',
    title: 'Sci-Fi/Fantasy',
    month: 6,
    viewingHours: 2.3,
    subscribers: 39,
  },
  {
    id: 'SciFi-Jul',
    title: 'Sci-Fi/Fantasy',
    month: 7,
    viewingHours: 2.6,
    subscribers: 45,
  },
  {
    id: 'SciFi-Aug',
    title: 'Sci-Fi/Fantasy',
    month: 8,
    viewingHours: 2.4,
    subscribers: 42,
  },
  {
    id: 'SciFi-Sep',
    title: 'Sci-Fi/Fantasy',
    month: 9,
    viewingHours: 2.2,
    subscribers: 38,
  },
  {
    id: 'SciFi-Oct',
    title: 'Sci-Fi/Fantasy',
    month: 10,
    viewingHours: 2.7,
    subscribers: 47,
  },
  {
    id: 'SciFi-Nov',
    title: 'Sci-Fi/Fantasy',
    month: 11,
    viewingHours: 2.8,
    subscribers: 49,
  },
  {
    id: 'SciFi-Dec',
    title: 'Sci-Fi/Fantasy',
    month: 12,
    viewingHours: 2.9,
    subscribers: 51,
  },

  // Horror
  {
    id: 'Horror-Jan',
    title: 'Horror',
    month: 1,
    viewingHours: 1.5,
    subscribers: 25,
  },
  {
    id: 'Horror-Feb',
    title: 'Horror',
    month: 2,
    viewingHours: 1.6,
    subscribers: 27,
  },
  {
    id: 'Horror-Mar',
    title: 'Horror',
    month: 3,
    viewingHours: 1.7,
    subscribers: 29,
  },
  {
    id: 'Horror-Apr',
    title: 'Horror',
    month: 4,
    viewingHours: 1.4,
    subscribers: 23,
  },
  {
    id: 'Horror-May',
    title: 'Horror',
    month: 5,
    viewingHours: 1.8,
    subscribers: 30,
  },
  {
    id: 'Horror-Jun',
    title: 'Horror',
    month: 6,
    viewingHours: 1.6,
    subscribers: 27,
  },
  {
    id: 'Horror-Jul',
    title: 'Horror',
    month: 7,
    viewingHours: 1.9,
    subscribers: 32,
  },
  {
    id: 'Horror-Aug',
    title: 'Horror',
    month: 8,
    viewingHours: 1.7,
    subscribers: 29,
  },
  {
    id: 'Horror-Sep',
    title: 'Horror',
    month: 9,
    viewingHours: 1.6,
    subscribers: 27,
  },
  {
    id: 'Horror-Oct',
    title: 'Horror',
    month: 10,
    viewingHours: 2.3,
    subscribers: 39,
  },
  {
    id: 'Horror-Nov',
    title: 'Horror',
    month: 11,
    viewingHours: 2.0,
    subscribers: 34,
  },
  {
    id: 'Horror-Dec',
    title: 'Horror',
    month: 12,
    viewingHours: 1.8,
    subscribers: 30,
  },
]

const categories1 = {
  Drama: { name: 'Drama', color: 'var(--color-red-400)' },
  'Action/Thriller': {
    name: 'Action/Thriller',
    color: 'var(--color-orange-400)',
  },
  Comedy: { name: 'Comedy', color: 'var(--color-yellow-400)' },
  Documentary: { name: 'Documentary', color: 'var(--color-blue-400)' },
  Romance: { name: 'Romance', color: 'var(--color-pink-400)' },
  'Sci-Fi/Fantasy': {
    name: 'Sci-Fi/Fantasy',
    color: 'var(--color-green-400)',
  },
  Horror: { name: 'Horror', color: 'var(--color-purple-400)' },
}

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function formatNumber(tick: number | Date): string {
  return typeof tick === 'number' ? tick.toFixed(1) : String(tick)
}

const xAccessor1 = (d: any) => d.month
const yAccessor1 = (d: any) => d.viewingHours
const sizeAccessor1 = (d: any) => d.subscribers
</script>

<template>
  <BubbleChart
    :data="bubbleChartData"
    :height="230"
    :categories="categories1"
    category-key="title"
    :x-accessor="xAccessor1"
    :y-accessor="yAccessor1"
    :y-domain-line="false"
    :size-accessor="sizeAccessor1"
    :legend-position="'top'"
    :legend-style="`
      justify-content: end;
    `"
    :x-formatter="(tick: number) => monthNames[tick - 1] ?? String(tick)"
    :y-formatter="(v: number | Date) => `${formatNumber(v)}B hrs`"
  />
</template>
