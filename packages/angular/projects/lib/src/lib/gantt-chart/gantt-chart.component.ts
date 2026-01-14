import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  VisXYContainerModule,
  VisTimelineModule,
  VisAxisModule,
  VisTooltipModule,
  VisBulletLegendModule,
} from '@unovis/angular';
import { Timeline } from '@unovis/ts';
import { LegendPosition, BulletLegendItemInterface } from '../types';
import { TooltipComponent } from '../tooltip/tooltip.component';

// Cached date formatter instance for better performance
const cachedDateFormatter = new Intl.DateTimeFormat();
const dateFormatter = (date: number | Date) => cachedDateFormatter.format(typeof date === 'number' ? date : date.getTime());

@Component({
  selector: 'ngx-gantt-chart',
  standalone: true,
  imports: [
    CommonModule,
    VisXYContainerModule,
    VisTimelineModule,
    VisAxisModule,
    VisTooltipModule,
    VisBulletLegendModule,
    TooltipComponent,
  ],
  template: `
    <div
      [style.display]="'flex'"
      [style.flexDirection]="isLegendTop() ? 'column-reverse' : 'column'"
      [style.gap]="'var(--vis-legend-spacing)'"
    >
      <vis-xy-container
        [data]="data()"
        [height]="height()"
        (wheel)="onScroll($event)"
      >
        <vis-timeline
          [x]="x()"
          [length]="length()"
          [lineWidth]="lineWidth()"
          [rowHeight]="rowHeight()"
          [type]="type()"
          [color]="colors()"
          [labelWidth]="labelWidth()"
          [showLabels]="showLabels()"
        ></vis-timeline>

        <vis-tooltip
          [triggers]="tooltipTriggers"
        ></vis-tooltip>

        <vis-axis
          type="x"
          [tickFormat]="tickFormatFn"
          [numTicks]="xNumTicks()"
          [tickLine]="xTickLine()"
          [gridLine]="xGridLine()"
          [domainLine]="xDomainLine()"
        ></vis-axis>
      </vis-xy-container>

      @if (!hideLegend()) {
        <div
          [style.display]="'flex'"
          [style.justifyContent]="legendAlignment()"
        >
          <vis-bullet-legend
            [items]="legendItems()"
          ></vis-bullet-legend>
        </div>
      }

      <div #tooltipWrapper style="display: none">
        @if (slotValue()) {
          <ngx-tooltip
            [data]="slotValue()!"
            [categories]="categories()"
            [titleFormatter]="tooltipTitleFormatter()"
          ></ngx-tooltip>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttChartComponent<T extends Record<string, any>> {
  readonly data = input.required<T[]>();
  readonly height = input<number>();
  readonly categories = input.required<Record<string, BulletLegendItemInterface>>();
  readonly x = input.required<(d: T) => number>();
  readonly length = input.required<(d: T) => number>();
  readonly type = input.required<(d: T) => string>();
  readonly labelWidth = input<number>(220);
  readonly title = input<string>('');
  readonly showLabels = input<boolean>(true);
  readonly hideTooltip = input<boolean>(false);
  readonly lineWidth = input<number>(12);
  readonly rowHeight = input<number>(24);
  readonly legendPosition = input<LegendPosition>(LegendPosition.TopRight);
  readonly legendStyle = input<Record<string, string>>();
  readonly hideLegend = input<boolean>(false);
  readonly xNumTicks = input<number>();
  readonly xTickLine = input<boolean>();
  readonly xTickFormat = input<(tick: number | Date, i?: number, ticks?: (number | Date)[]) => string>();
  readonly xGridLine = input<boolean>();
  readonly xDomainLine = input<boolean>();
  readonly tooltipTitleFormatter = input<(data: T) => string | number>();

  readonly clickEvent = output<{ event: MouseEvent; data: { index: number; item: T } }>();
  readonly scrollEvent = output<number>();
  readonly labelHover = output<T | undefined>();

  readonly tooltipWrapper = viewChild<ElementRef<HTMLDivElement>>('tooltipWrapper');
  readonly slotValue = signal<T | undefined>(undefined);

  readonly isLegendTop = computed(() => this.legendPosition().startsWith('top'));

  readonly legendAlignment = computed(() => {
    const pos = this.legendPosition();
    if (pos.includes('left')) return 'flex-start';
    if (pos.includes('right')) return 'flex-end';
    return 'center';
  });

  readonly legendItems = computed(() => {
    return Object.values(this.categories()).map((item) => ({
      ...item,
      color: Array.isArray(item.color) ? item.color[0] : item.color,
    }));
  });

  readonly colors = computed(() => {
    const cats = this.categories();
    const defaultColors = Object.values(cats).map((_, index) => `var(--vis-color${index})`);
    return Object.values(cats).map((c, i) => {
      const color = c.color ?? defaultColors[i];
      return Array.isArray(color) ? color[0] : color;
    });
  });

  tickFormatFn = (tick: number | Date, i: number, ticks: (number | Date)[]) => {
    const formatter = this.xTickFormat();
    return formatter ? formatter(tick, i, ticks) : dateFormatter(tick);
  };

  tooltipTriggers: Record<string, (d: T) => string> = {
    [Timeline.selectors.label]: (d: T) => {
      this.generateLabelTooltip(d);
      return d ? this.tooltipWrapper()?.nativeElement.innerHTML ?? '' : '';
    },
  };

  generateLabelTooltip(d: T): void {
    this.slotValue.set(d);
    this.labelHover.emit(d);
    this.cdr.detectChanges();
  }

  onScroll(event: WheelEvent): void {
    this.scrollEvent.emit(event.deltaY);
  }

  private cdr = inject(ChangeDetectorRef);
}
