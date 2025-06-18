<template>
  <div class="bubble-chart-container">
    <svg :width="width" :height="height" class="bubble-chart">
      <g transform="translate(0,0)">
        <circle
          v-for="bubble in bubbles"
          :key="bubble.id"
          :cx="bubble.x"
          :cy="bubble.y"
          :r="bubble.radius"
          :fill="bubble.color || '#ccc'"
          @mouseover="showTooltip(bubble)"
          @mouseout="hideTooltip"
        />
        <text
          v-for="bubble in bubbles"
          :key="`text-${bubble.id}`"
          :x="bubble.x"
          :y="bubble.y"
          text-anchor="middle"
          dy=".3em"
          font-size="10"
          fill="#000"
        >
          {{ bubble.label }}
        </text>
      </g>
    </svg>
    <div v-if="tooltip.visible" class="tooltip" :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }">
      <div>{{ tooltip.label }}</div>
      <div>Value: {{ tooltip.value }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from 'vue';
import { BubbleData, BubbleChartProps } from './types';

interface Bubble {
  id: string;
  x: number;
  y: number;
  radius: number;
  label: string;
  value: number;
  color?: string;
}

interface Tooltip {
  visible: boolean;
  x: number;
  y: number;
  label: string;
  value: number;
}

export default defineComponent({
  name: 'BubbleChart',
  props: {
    data: {
      type: Array as PropType<BubbleData[]>,
      required: true,
    },
    width: {
      type: Number,
      default: 500,
    },
    height: {
      type: Number,
      default: 500,
    },
  },
  setup(props: BubbleChartProps) {
    const bubbles = computed<Bubble[]>(() => {
      // A very basic layout algorithm, not a proper packing algorithm
      // This is just for demonstration purposes.
      // A real implementation would use d3-pack or similar.
      const bubbleData = props.data || [];
      const maxRadius = 50;
      const padding = 5;
      let currentX = 0;
      let currentY = props.height / 2; // Center vertically for simplicity

      return bubbleData.map((item, index) => {
        const radius = Math.max(5, Math.min(item.value / 10, maxRadius)); // Scale radius based on value
        if (index === 0) {
            currentX = radius + padding;
        } else {
            currentX += (bubbles.value[index-1]?.radius || 0) + radius + padding;
        }
        // Simple row layout, will overflow if too many bubbles
        // A proper implementation needs a circle packing algorithm
        if (currentX + radius > props.width) {
            // This reset logic is overly simple and will cause overlaps
            // currentX = radius + padding;
            // currentY += maxRadius * 2 + padding; // Move to next "row" - very crude
        }

        return {
          id: item.id,
          x: currentX,
          y: currentY,
          radius,
          label: item.label,
          value: item.value,
          color: item.color,
        };
      });
    });

    const tooltip = ref<Tooltip>({
      visible: false,
      x: 0,
      y: 0,
      label: '',
      value: 0,
    });

    const showTooltip = (bubble: Bubble) => {
      // Get mouse position relative to the container for tooltip
      // This is a simplified example; you might need to adjust based on actual event handling
      const container = document.querySelector('.bubble-chart-container');
      const rect = container?.getBoundingClientRect();
      tooltip.value = {
        visible: true,
        // These are placeholders, event object would be better
        x: bubble.x + (rect?.left || 0) + 10,
        y: bubble.y + (rect?.top || 0) - bubble.radius - 10,
        label: bubble.label,
        value: bubble.value,
      };
    };

    const hideTooltip = () => {
      tooltip.value.visible = false;
    };

    return {
      bubbles,
      tooltip,
      showTooltip,
      hideTooltip,
    };
  },
});
</script>

<style scoped>
.bubble-chart-container {
  position: relative;
  display: inline-block; /* Or block, depending on layout needs */
}
.bubble-chart {
  border: 1px solid #eee;
}
circle {
  transition: fill 0.3s ease;
  cursor: pointer;
}
circle:hover {
  opacity: 0.7;
}
.tooltip {
  position: absolute; /* Changed to absolute for positioning within the container */
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none; /* So it doesn't interfere with mouse events on bubbles */
  white-space: nowrap;
  z-index: 10;
}
</style>
