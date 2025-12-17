import { Component, signal } from '@angular/core';
import { LineChartComponent } from 'ngx-chrts';

@Component({
  selector: 'app-root',
  imports: [LineChartComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('example-app');

  protected readonly data = [
    { month: 'Jan', value: 12 },
    { month: 'Feb', value: 18 },
    { month: 'Mar', value: 9 },
    { month: 'Apr', value: 22 },
    { month: 'May', value: 16 },
    { month: 'Jun', value: 28 },
  ];
}
