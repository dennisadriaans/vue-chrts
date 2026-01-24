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
  VisAxisModule,
  VisTooltipModule,
  VisBulletLegendModule,
  VisGroupedBarModule,
  VisStackedBarModule,
} from '@unovis/angular';
import { GroupedBar, Orientation, StackedBar } from '@unovis/ts';
import { LegendPosition, BulletLegendItemInterface, AxisConfig } from '../types';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { ValueLabel } from './types';

@Component({
  selector: 'bar-chart',
  standalone: true,
  imports: [
    CommonModule,
    VisXYContainerModule,
    VisAxisModule,
    VisTooltipModule,
    VisBulletLegendModule,
    VisGroupedBarModule,
    VisStackedBarModule,
    TooltipComponent,
  ],
  template: `
    <div
      [style.display]="'flex'"
      [style.flexDirection]="isLegendTop() ? 'column-reverse' : 'column'"
      [style.gap]="'var(--vis-legend-spacing)'"
      (click)="onClick($event)"
    >
      <vis-xy-container
        [data]="data()"
        [height]="height()"
        [padding]="padding()"
      >
        <vis-tooltip
          [triggers]="tooltipTriggers"
        ></vis-tooltip>

        @if (!stacked()) {
          <vis-grouped-bar
            [data]="data()"
            [x]="_x"
            [y]="yAccessors()"
            [color]="colorAccessor"
            [roundedCorners]="radius() ?? 0"
            [groupPadding]="groupPadding()"
            [barPadding]="barPadding()"
            [orientation]="orientation()"
          ></vis-grouped-bar>
        } @else {
          <vis-stacked-bar
            [data]="data()"
            [x]="_x"
            [y]="yAccessors()"
            [color]="colorAccessor"
            [roundedCorners]="radius() ?? 0"
            [barPadding]="barPadding()"
            [orientation]="orientation()"
          ></vis-stacked-bar>
        }

        @if (!hideXAxis()) {
          <vis-axis
            type="x"
            [label]="xLabel()"
            [tickFormat]="xFormatterFn"
            [gridLine]="xGridLine()"
            [domainLine]="!!xDomainLine()"
            [tickLine]="xTickLine()"
            [numTicks]="xNumTicks()"
            [tickValues]="xExplicitTicks()"
            [minMaxTicksOnly]="minMaxTicksOnly()"
          ></vis-axis>
        }

        @if (!hideYAxis()) {
          <vis-axis
            type="y"
            [label]="yLabel()"
            [tickFormat]="yFormatterFn"
            [gridLine]="orientation() !== Orientation.Horizontal && yGridLine()"
            [domainLine]="!!yDomainLine()"
            [numTicks]="yNumTicks()"
            [tickLine]="yTickLine()"
          ></vis-axis>
        }
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
        @if (hoverValues()) {
          <tooltip
            [data]="hoverValues()!"
            [categories]="categories()"
            [titleFormatter]="tooltipTitleFormatter()"
            [yFormatter]="orientation() === Orientation.Horizontal ? xFormatter() : yFormatter()"
          ></tooltip>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent<T extends Record<string, any>> {
  readonly data = input.required<T[]>();
  readonly height = input<number>(400);
  readonly padding = input<{ top: number; right: number; bottom: number; left: number }>({
    top: 5,
    right: 5,
    bottom: 5,
    left: 5,
  });
  readonly categories = input.required<Record<string, BulletLegendItemInterface>>();
  readonly yAxis = input.required<(keyof T)[]>();
  readonly stacked = input<boolean>(false);
  readonly orientation = input<Orientation>(Orientation.Vertical);
  readonly radius = input<number>();
  readonly groupPadding = input<number>(0);
  readonly barPadding = input<number>(0.2);
  readonly xLabel = input<string>();
  readonly yLabel = input<string>();
  readonly xFormatter = input<(tick: number | Date, i?: number, ticks?: (number | Date)[]) => string>();
  readonly yFormatter = input<(tick: number | Date, i?: number, ticks?: (number | Date)[]) => string>();
  readonly tooltipTitleFormatter = input<(data: T) => string | number>();
  readonly xNumTicks = input<number>();
  readonly xExplicitTicks = input<any[]>();
  readonly minMaxTicksOnly = input<boolean>(false);
  readonly yNumTicks = input<number>();
  readonly hideXAxis = input<boolean>(false);
  readonly hideYAxis = input<boolean>(false);
  readonly xGridLine = input<boolean>(false);
  readonly yGridLine = input<boolean>(true);
  readonly xDomainLine = input<boolean>(false);
  readonly yDomainLine = input<boolean>(false);
  readonly xTickLine = input<boolean>(false);
  readonly yTickLine = input<boolean>(false);
  readonly hideTooltip = input<boolean>(false);
  readonly hideLegend = input<boolean>(false);
  readonly legendPosition = input<LegendPosition>(LegendPosition.BottomCenter);
  readonly legendStyle = input<Record<string, string>>();
  readonly valueLabel = input<ValueLabel>();
  readonly xAxisConfig = input<AxisConfig>();
  readonly yAxisConfig = input<AxisConfig>();

  readonly click = output<{ event: MouseEvent; values?: T }>();

  readonly tooltipWrapper = viewChild<ElementRef<HTMLDivElement>>('tooltipWrapper');
  readonly hoverValues = signal<T | undefined>(undefined);

  readonly Orientation = Orientation;

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

  readonly yAccessors = computed(() => {
    return this.yAxis().map((key) => (d: T) => d[key]);
  });

  colorAccessor: any = (_: T, i: number) => {
    const cats = Object.values(this.categories());
    return cats[i]?.color;
  };

  _x: any = (_: T, i: number) => i;

  xFormatterFn = (tick: number | Date, i: number, ticks: (number | Date)[]) => {
    const formatter = this.xFormatter();
    return formatter ? formatter(tick, i, ticks) : String(tick);
  };

  yFormatterFn = (tick: number | Date, i: number, ticks: (number | Date)[]) => {
    const formatter = this.yFormatter();
    return formatter ? formatter(tick, i, ticks) : String(tick);
  };

  tooltipTriggers: Record<string, (d: T) => string> = {
    [GroupedBar.selectors.bar]: (d: T) => {
      this.onCrosshairUpdate(d);
      return d ? this.tooltipWrapper()?.nativeElement.innerHTML ?? '' : '';
    },
    [StackedBar.selectors.bar]: (d: T) => {
      this.onCrosshairUpdate(d);
      return d ? this.tooltipWrapper()?.nativeElement.innerHTML ?? '' : '';
    },
  };

  onCrosshairUpdate(d: T): void {
    this.hoverValues.set(d);
    this.cdr.detectChanges();
  }

  onClick(event: MouseEvent): void {
    this.click.emit({ event, values: this.hoverValues() });
  }

  private cdr = inject(ChangeDetectorRef);
}
