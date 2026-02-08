import { computed, type ComputedRef } from "vue";

export interface ChartAccessibilityProps {
  /**
   * Accessible label for the chart. Required for screen readers.
   * Example: "Sales data by quarter"
   */
  ariaLabel?: string;
  
  /**
   * ID of an element that labels the chart.
   * Alternative to ariaLabel when you want to reference an existing element.
   */
  ariaLabelledby?: string;
  
  /**
   * ID of an element that describes the chart.
   * Provides additional context beyond the label.
   */
  ariaDescribedby?: string;
  
  /**
   * Whether the chart should be focusable via keyboard.
   * @default true
   */
  focusable?: boolean;

  /**
   * Human-readable role description for screen readers.
   * Useful to distinguish between different types of charts or provide more context than just "img".
   * @default "chart"
   */
  ariaRoledescription?: string;
}

export interface ChartAccessibilityAttrs {
  role: string;
  "aria-roledescription"?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  tabindex?: number;
}

/**
 * Composable to provide consistent accessibility attributes for charts
 */
export function useChartAccessibility(
  props: ChartAccessibilityProps,
  defaultLabel?: string
): ComputedRef<ChartAccessibilityAttrs> {
  return computed(() => {
    const attrs: ChartAccessibilityAttrs = {
      role: "img",
      "aria-roledescription": props.ariaRoledescription || "chart",
    };

    // Add aria-label or use default
    if (props.ariaLabel) {
      attrs["aria-label"] = props.ariaLabel;
    } else if (!props.ariaLabelledby && defaultLabel) {
      attrs["aria-label"] = defaultLabel;
    }

    // Add aria-labelledby if provided
    if (props.ariaLabelledby) {
      attrs["aria-labelledby"] = props.ariaLabelledby;
    }

    // Add aria-describedby if provided
    if (props.ariaDescribedby) {
      attrs["aria-describedby"] = props.ariaDescribedby;
    }

    // Make chart focusable by default for keyboard navigation
    if (props.focusable !== false) {
      attrs.tabindex = 0;
    }

    return attrs;
  });
}

/**
 * Generate a descriptive label for a chart based on its configuration
 */
export function generateChartLabel(
  chartType: string,
  categories?: Record<string, any>,
  dataLength?: number
): string {
  const categoryNames = categories 
    ? Object.values(categories).map((c: any) => c.name).join(", ")
    : "";
  
  const baseLabel = `${chartType} chart`;
  
  if (categoryNames && dataLength) {
    return `${baseLabel} showing ${categoryNames} with ${dataLength} data points`;
  } else if (categoryNames) {
    return `${baseLabel} showing ${categoryNames}`;
  } else if (dataLength) {
    return `${baseLabel} with ${dataLength} data points`;
  }
  
  return baseLabel;
}
