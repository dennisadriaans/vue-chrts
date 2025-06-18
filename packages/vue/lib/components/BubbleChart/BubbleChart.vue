<template>
  <div :class="['bubble-chart-container', customClass]">
    <h3 v-if="chartTitle" class="chart-title">{{ chartTitle }}</h3>
    <svg ref="svgRef" :width="effectiveWidth" :height="effectiveHeight"></svg>
    <div
      v-if="tooltip.visible"
      class="tooltip"
      :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }"
    >
      <div v-if="tooltip.title" class="tooltip-title">{{ tooltip.title }}</div>
      <div>Value: {{ tooltip.value?.toLocaleString() }}</div>
      <div v-if="tooltip.xValue">X: {{ tooltip.xValue?.toLocaleString() }}</div>
      <div v-if="tooltip.yValue">Y: {{ tooltip.yValue?.toLocaleString() }}</div>
    </div>
    <div v-if="showLegend && legendItems.length" class="legend">
      <div v-for="item in legendItems" :key="item.label" class="legend-item">
        <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
        <span class="legend-label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect, computed, PropType, onMounted, onBeforeUnmount } from 'vue';
import * as d3 from 'd3'; // Ensure d3 is installed
import {
  BubbleDataItem,
  BubbleChartProps, // This now correctly refers to the recreated interface
  SizeOptions,
  ColorOptions,
  LabelOptions,
  AxisOptions,
} from './types'; // Correctly refers to the recreated types.ts

interface PackedBubble extends d3.HierarchyNode<BubbleDataItem> {
  x: number;
  y: number;
  r: number;
}

interface TooltipData {
  visible: boolean;
  x: number;
  y: number;
  title?: string;
  label?: string; // General label like "Size" or specific from data
  value?: number;
  xValue?: number | string | Date;
  yValue?: number | string | Date;
}

interface LegendItem {
  label: string;
  color: string;
}

// Default options (recreated)
const defaultSizeOptions: Required<SizeOptions> = {
  minRadius: 3,
  maxRadius: 45,
};

const defaultLabelOptions: Required<LabelOptions> = {
  show: true,
  fontSize: 10,
  color: '#000000',
  fontFamily: 'sans-serif',
};

const defaultColor = '#A9A9A9'; // DarkGray

export default defineComponent({
  name: 'BubbleChart',
  props: {
    data: {
      type: Array as PropType<BubbleDataItem[]>,
      required: true,
    },
    width: { type: Number, default: 500 },
    height: { type: Number, default: 350 },
    xAxisOptions: { type: Object as PropType<AxisOptions>, default: () => ({ show: false }) },
    yAxisOptions: { type: Object as PropType<AxisOptions>, default: () => ({ show: false }) },
    labelOptions: { type: Object as PropType<LabelOptions>, default: () => defaultLabelOptions },
    colorOptions: { type: [String, Array, Object] as PropType<ColorOptions>, default: defaultColor },
    sizeOptions: { type: Object as PropType<SizeOptions>, default: () => defaultSizeOptions },
    chartTitle: { type: String, default: '' },
    showLegend: { type: Boolean, default: false },
    customClass: { type: String, default: '' },
  },
  setup(props: BubbleChartProps) {
    const svgRef = ref<SVGSVGElement | null>(null);
    const tooltip = ref<TooltipData>({ visible: false, x: 0, y: 0 });

    const margin = { top: 20, right: 20, bottom: props.showLegend ? 40 : 20, left: 20 };

    const effectiveWidth = computed(() => props.width!);
    const effectiveHeight = computed(() => props.height!);

    const mergedSizeOptions = computed(() => ({ ...defaultSizeOptions, ...props.sizeOptions }));
    const mergedLabelOptions = computed(() => ({ ...defaultLabelOptions, ...props.labelOptions }));

    const getColor = (d: BubbleDataItem, index: number): string => {
      if (typeof props.colorOptions === 'string') return props.colorOptions;
      if (Array.isArray(props.colorOptions)) return props.colorOptions[index % props.colorOptions.length];
      if (typeof props.colorOptions === 'object' && d.category) return props.colorOptions[d.category] || d.color || defaultColor;
      return d.color || defaultColor;
    };

    const legendItems = computed<LegendItem[]>(() => {
      if (!props.showLegend || !props.data) return [];
      const items: Record<string, string> = {};
      props.data.forEach((d, i) => {
        const color = getColor(d, i);
        const label = d.category || d.label || d.id;
        if (label && !items[label] && (typeof props.colorOptions === 'object' && d.category || Array.isArray(props.colorOptions))) {
          items[label] = color;
        }
      });
      if (Object.keys(items).length === 0 && typeof props.colorOptions === 'string' && props.data.length > 0) {
        return [{ label: props.chartTitle || 'Data', color: props.colorOptions }];
      }
      return Object.entries(items).map(([label, color]) => ({ label, color }));
    });

    const renderChart = () => {
      if (!svgRef.value || !props.data || props.data.length === 0) {
        if(svgRef.value) d3.select(svgRef.value).selectAll('*').remove();
        return;
      }

      const rootHierarchy = d3.hierarchy({ children: props.data })
        .sum(d => Math.max(0, (d as BubbleDataItem).sizeValue || 1));

      const packLayout = d3.pack<BubbleDataItem>()
        .size([
          effectiveWidth.value - margin.left - margin.right,
          effectiveHeight.value - margin.top - margin.bottom
        ])
        .padding(3);

      const packedRoot = packLayout(rootHierarchy as any) as PackedBubble;
      const packedBubbles = packedRoot.leaves() as PackedBubble[];

      const svg = d3.select(svgRef.value);
      svg.selectAll('*').remove();

      const chartGroup = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      // Simplified Axis rendering (placeholders, not data-driven)
      if (props.xAxisOptions?.show) {
        chartGroup.append('line')
          .attr('x1', 0).attr('x2', effectiveWidth.value - margin.left - margin.right)
          .attr('y1', effectiveHeight.value - margin.top - margin.bottom)
          .attr('y2', effectiveHeight.value - margin.top - margin.bottom)
          .attr('stroke', 'currentColor').attr('opacity', 0.5);
        if(props.xAxisOptions.label) {
          chartGroup.append('text').text(props.xAxisOptions.label)
            .attr('x', (effectiveWidth.value - margin.left - margin.right)/2)
            .attr('y', effectiveHeight.value - margin.top - margin.bottom + 15)
            .attr('text-anchor', 'middle').attr('font-size', '0.8em');
        }
      }
       if (props.yAxisOptions?.show) {
        chartGroup.append('line')
          .attr('x1', 0).attr('x2', 0)
          .attr('y1', 0).attr('y2', effectiveHeight.value - margin.top - margin.bottom)
          .attr('stroke', 'currentColor').attr('opacity', 0.5);
         if(props.yAxisOptions.label) {
          chartGroup.append('text').text(props.yAxisOptions.label)
            .attr('transform', `translate(-10, ${(effectiveHeight.value - margin.top - margin.bottom)/2}) rotate(-90)`)
            .attr('text-anchor', 'middle').attr('font-size', '0.8em');
        }
      }

      const bubbles = chartGroup.selectAll<SVGCircleElement, PackedBubble>('circle')
        .data(packedBubbles)
        .join('circle')
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
          .attr('r', 0)
          .attr('fill', (d, i) => getColor(d.data, i))
          .attr('stroke', '#555')
          .attr('stroke-width', 0.3)
          .style('cursor', 'pointer')
          .on('mouseover', (event: MouseEvent, d: PackedBubble) => {
            d3.select(event.currentTarget).transition().duration(100).attr('r', d.r * 1.05);
            const containerRect = (svgRef.value?.parentNode as HTMLElement)?.getBoundingClientRect();
            tooltip.value = {
              visible: true,
              x: event.clientX - (containerRect?.left || 0) + 5,
              y: event.clientY - (containerRect?.top || 0) - 5,
              title: d.data.label || d.data.id,
              value: d.data.sizeValue,
              xValue: d.data.xValue,
              yValue: d.data.yValue,
            };
          })
          .on('mouseout', (event: MouseEvent, d: PackedBubble) => {
            d3.select(event.currentTarget).transition().duration(100).attr('r', d.r);
            tooltip.value.visible = false;
          });

      bubbles.transition().duration(600).delay((d,i) => i * 5).attr('r', d => d.r);

      if (mergedLabelOptions.value.show) {
        chartGroup.selectAll<SVGTextElement, PackedBubble>('text.bubble-label')
          .data(packedBubbles)
          .join('text')
            .attr('class', 'bubble-label')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('dy', '0.3em')
            .style('text-anchor', 'middle')
            .style('font-size', d => Math.min(d.r / 3, mergedLabelOptions.value.fontSize!) + 'px') // Dynamic font size based on radius
            .style('fill', mergedLabelOptions.value.color)
            .style('font-family', mergedLabelOptions.value.fontFamily)
            .style('pointer-events', 'none')
            .text(d => d.data.label || d.data.id);
      }
    };

    let resizeObserver: ResizeObserver | null = null;
    onMounted(() => {
      watchEffect(renderChart); // Re-render on prop changes

      // Observe parent for resize if width/height are not fixed
      if (svgRef.value?.parentElement && (!props.width || !props.height)) {
         resizeObserver = new ResizeObserver(() => {
            // If width/height are not set, component could be responsive
            // For now, keep it simple, direct prop changes trigger re-render via watchEffect
            renderChart();
        });
        resizeObserver.observe(svgRef.value.parentElement);
      }
    });

    onBeforeUnmount(() => {
      if (resizeObserver && svgRef.value?.parentElement) {
        resizeObserver.unobserve(svgRef.value.parentElement);
      }
    });

    return {
      svgRef,
      tooltip,
      effectiveWidth,
      effectiveHeight,
      legendItems,
      // Exposing props for template access if needed, though mostly used in setup
      chartTitle: props.chartTitle,
      customClass: props.customClass,
      showLegend: props.showLegend,
    };
  },
});
</script>

<style scoped>
.bubble-chart-container {
  position: relative;
  font-family: 'Arial', sans-serif; /* Example font */
}
.chart-title {
  text-align: center;
  font-size: 1.1em; /* Slightly smaller */
  margin-bottom: 8px;
  color: #333;
}
.dark .chart-title { /* Dark mode consideration */
  color: #eee;
}
.tooltip {
  position: fixed;
  background-color: rgba(20, 20, 20, 0.85); /* Darker tooltip */
  color: white;
  padding: 6px 10px; /* Slightly smaller padding */
  border-radius: 3px;
  font-size: 0.85em; /* Slightly smaller font */
  pointer-events: none;
  white-space: nowrap;
  z-index: 1000;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  transition: opacity 0.15s;
}
.tooltip-title {
  font-weight: bold;
  margin-bottom: 3px;
}
.legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 8px;
  font-size: 0.8em;
}
.legend-item {
  display: flex;
  align-items: center;
  margin-right: 12px;
  margin-bottom: 4px;
}
.legend-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 4px;
  border: 1px solid #777;
}
.legend-label {
  color: #444;
}
.dark .legend-label { /* Dark mode consideration */
  color: #ccc;
}
svg {
  display: block; /* Helps with layout */
  margin: 0 auto; /* Center if container is wider */
}
</style>
