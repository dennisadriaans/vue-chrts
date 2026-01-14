import { Component, signal } from '@angular/core';
import { LineChartComponent, AreaChartComponent, AreaChartCategory } from 'ngx-chrts';
import { CurveType } from '@unovis/ts';

interface ChartData {
  month: string;
  value: number;
  sales: number;
  profit: number;
}

@Component({
  selector: 'app-root',
  imports: [LineChartComponent, AreaChartComponent],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('example-app');
  protected readonly CurveType = CurveType;

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

  handleChartClick(event: { event: MouseEvent; values?: ChartData }): void {
    console.log('Chart clicked:', event);
  }

  formatX = (tick: number, i?: number) => {
    return this.data[tick]?.month ?? '';
  };
}
