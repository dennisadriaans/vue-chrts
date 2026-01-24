import { Component, signal } from '@angular/core';
import {
  LineChartComponent,
  AreaChartComponent,
  AreaChartCategory,
  BarChartComponent,
  DonutChartComponent,
  BubbleChartComponent,
  GanttChartComponent,
  LegendPosition,
  CurveType,
  Orientation,
  DonutType
} from 'angular-chrts';

interface ChartData {
  month: string;
  value: number;
  sales: number;
  profit: number;
}

interface BubbleData {
  x: number;
  y: number;
  size: number;
  category: string;
}

interface GanttData {
  label: string;
  start: number;
  end: number;
  type: string;
}

@Component({
  selector: 'app-root',
  imports: [
    LineChartComponent,
    AreaChartComponent,
    BarChartComponent,
    DonutChartComponent,
    BubbleChartComponent,
    GanttChartComponent,
  ],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('example-app');
    protected readonly CurveType = CurveType;
  protected readonly Orientation = Orientation;
  protected readonly DonutType = DonutType;
  protected readonly LegendPosition = LegendPosition;


  protected readonly data: ChartData[] = [
    { month: 'Jan', value: 12, sales: 100, profit: 50 },
    { month: 'Feb', value: 18, sales: 120, profit: 55 },
    { month: 'Mar', value: 9, sales: 180, profit: 80 },
    { month: 'Apr', value: 22, sales: 110, profit: 40 },
    { month: 'May', value: 16, sales: 90, profit: 30 },
    { month: 'Jun', value: 28, sales: 150, profit: 70 },
  ];

  protected readonly areaCategories: Record<string, AreaChartCategory> = {
    sales: {
      name: 'Sales',
      color: '#3b82f6',
    },
    profit: {
      name: 'Profit',
      color: '#10b981',
    },
  };

  protected readonly stackedData: ChartData[] = [
    { month: 'Jan', value: 10, sales: 40, profit: 20 },
    { month: 'Feb', value: 15, sales: 50, profit: 25 },
    { month: 'Mar', value: 20, sales: 60, profit: 30 },
    { month: 'Apr', value: 25, sales: 55, profit: 28 },
    { month: 'May', value: 18, sales: 45, profit: 22 },
    { month: 'Jun', value: 30, sales: 70, profit: 35 },
  ];

  // Donut chart data
  protected readonly donutData: number[] = [30, 45, 25];
  protected readonly donutCategories: Record<string, AreaChartCategory> = {
    product: { name: 'Product', color: '#3b82f6' },
    services: { name: 'Services', color: '#10b981' },
    other: { name: 'Other', color: '#f59e0b' },
  };

  // Bubble chart data
  protected readonly bubbleData: BubbleData[] = [
    { x: 10, y: 20, size: 5, category: 'A' },
    { x: 25, y: 35, size: 10, category: 'B' },
    { x: 40, y: 15, size: 8, category: 'A' },
    { x: 55, y: 45, size: 15, category: 'B' },
    { x: 70, y: 30, size: 12, category: 'A' },
  ];
  protected readonly bubbleCategories: Record<string, AreaChartCategory> = {
    A: { name: 'Category A', color: '#3b82f6' },
    B: { name: 'Category B', color: '#10b981' },
  };

  // Gantt chart data
  protected readonly ganttData: GanttData[] = [
    { label: 'Task 1', start: Date.now(), end: Date.now() + 86400000 * 3, type: 'design' },
    { label: 'Task 2', start: Date.now() + 86400000 * 2, end: Date.now() + 86400000 * 5, type: 'development' },
    { label: 'Task 3', start: Date.now() + 86400000 * 4, end: Date.now() + 86400000 * 7, type: 'design' },
  ];
  protected readonly ganttCategories: Record<string, AreaChartCategory> = {
    design: { name: 'Design', color: '#3b82f6' },
    development: { name: 'Development', color: '#10b981' },
  };

  handleChartClick(event: { event: MouseEvent; values?: ChartData }): void {
    console.log('Chart clicked:', event);
  }

  formatX = (tick: number | Date, i?: number) => {
    if (typeof tick === 'number') {
      return this.data[tick]?.month ?? '';
    }
    return '';
  };

  // Bubble chart accessors
  xAccessor = (d: BubbleData) => d.x;
  yAccessor = (d: BubbleData) => d.y;
  sizeAccessor = (d: BubbleData) => d.size;

  // Gantt chart accessors
  ganttX = (d: GanttData) => d.start;
  ganttLength = (d: GanttData) => d.end - d.start;
  ganttType = (d: GanttData) => d.type;
}
