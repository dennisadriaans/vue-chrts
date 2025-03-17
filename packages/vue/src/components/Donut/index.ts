export { default as DonutChart } from "./DonutChart.vue";

type DonutChartProps = {
  type?: string;
  data: number[];
  height: number;
  radius: number;
  hidePagination?: boolean;
  labels: {
    name: string;
    color: string;
  }[];
};

enum DonutType {
  Half = "half",
  Full = "full",
}

export { type DonutChartProps, DonutType };
