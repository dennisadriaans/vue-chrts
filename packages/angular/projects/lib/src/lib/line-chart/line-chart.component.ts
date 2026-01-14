import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ngx-line-chart',
  standalone: true,
  imports: [CommonModule],
  template: `<div>Line Chart Placeholder</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent {
  readonly data = input<any[]>();
  readonly xKey = input<string>();
  readonly yKey = input<string>();
}
