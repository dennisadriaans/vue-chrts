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
  VisScatterModule,
  VisAxisModule,
  VisTooltipModule,
  VisBulletLegendModule,
} from '@unovis/angular';
import { Position, Scatter, type NumericAccessor } from '@unovis/ts';
import { LegendPosition, BulletLegendItemInterface, AxisConfig, CrosshairConfig } from '../types';
import { TooltipComponent } from '../tooltip/tooltip.component';

@Component({
  selector: 'bubble-chart',
  standalone: true,
  imports: [
    CommonModule,
    VisXYContainerModule,
    VisScatterModule,
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
        [padding]="padding()"
        [scaleByDomain]="true"
        (click)="onClick($event)"
      >
        @if (!hideTooltip()) {
          <vis-tooltip [triggers]="tooltipTriggers"></vis-tooltip>
        }

        <vis-scatter
          [x]="xAccessor()"
          [y]="yAccessor()"
          [color]="colorAccessor"
          [size]="sizeAccessorFn()"
          [labelPosition]="labelPosition() || Position.Bottom"
          [sizeRange]="sizeRange() || [1, 20]"
          cursor="pointer"
        ></vis-scatter>

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
            [gridLine]="yGridLine()"
            [domainLine]="!!yDomainLine()"
            [tickLine]="yTickLine()"
            [numTicks]="yNumTicks()"
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
            [categories]="categories() || {}"
            [titleFormatter]="tooltipTitleFormatter()"
            [yFormatter]="yFormatter()"
          ></tooltip>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BubbleChartComponent<T extends Record<string, any>> {
  readonly data = input.required<T[]>();
  readonly height = input<number>(600);
  readonly padding = input<{ top: number; right: number; bottom: number; left: number }>({
    top: 5,
    right: 5,
    bottom: 5,
    left: 5,
  });
  readonly categories = input<Record<string, BulletLegendItemInterface>>({});
  readonly categoryKey = input<keyof T>();
  readonly xAccessor = input<NumericAccessor<T>>();
  readonly yAccessor = input<NumericAccessor<T>>();
  readonly sizeAccessor = input<NumericAccessor<T>>();
  readonly labelPosition = input<Position>();
  readonly sizeRange = input<[number, number]>();
  readonly xLabel = input<string>('');
  readonly yLabel = input<string>('');
  readonly xFormatter = input<(tick: number | Date, i?: number, ticks?: (number | Date)[]) => string>();
  readonly yFormatter = input<(tick: number | Date, i?: number, ticks?: (number | Date)[]) => string>();
  readonly tooltipTitleFormatter = input<(data: T) => string | number>();
  readonly xNumTicks = input<number>();
  readonly yNumTicks = input<number>();
  readonly xExplicitTicks = input<any[]>();
  readonly minMaxTicksOnly = input<boolean>(false);
  readonly hideXAxis = input<boolean>(false);
  readonly hideYAxis = input<boolean>(false);
  readonly xGridLine = input<boolean>(false);
  readonly yGridLine = input<boolean>(true);
  readonly xDomainLine = input<boolean>(true);
  readonly yDomainLine = input<boolean>(true);
  readonly xTickLine = input<boolean>(true);
  readonly yTickLine = input<boolean>(true);
  readonly hideTooltip = input<boolean>(false);
  readonly hideLegend = input<boolean>(false);
  readonly legendPosition = input<LegendPosition>(LegendPosition.BottomCenter);
  readonly legendStyle = input<Record<string, string>>();
  readonly crosshairConfig = input<CrosshairConfig>({ color: '#666' });
  readonly xAxisConfig = input<AxisConfig>();
  readonly yAxisConfig = input<AxisConfig>();

  readonly click = output<{ event: MouseEvent; values?: T }>();

  readonly tooltipWrapper = viewChild<ElementRef<HTMLDivElement>>('tooltipWrapper');
  readonly hoverValues = signal<T | undefined>(undefined);

  readonly Position = Position;

  readonly isLegendTop = computed(() => this.legendPosition().startsWith('top'));

  readonly legendAlignment = computed(() => {
    const pos = this.legendPosition();
    if (pos.includes('left')) return 'flex-start';
    if (pos.includes('right')) return 'flex-end';
    return 'center';
  });

  readonly legendItems = computed(() => {
    const cats = this.categories();
    return Object.values(cats).map((item) => ({
      ...item,
      color: Array.isArray(item.color) ? item.color[0] : item.color,
    }));
  });

  readonly sizeAccessorFn = computed(() => {
    const accessor = this.sizeAccessor();
    if (accessor) return accessor;
    return (d: any) => (typeof d.comments === 'number' ? d.comments : 1);
  });

  colorAccessor = (d: T): string | null | undefined => {
    const cats = this.categories();
    const catKey = this.categoryKey();
    if (!cats || !catKey) {
      return '#cccccc';
    }

    const categoryValue = String(d[catKey as keyof T]);
    let categoryColor = cats[categoryValue]?.color;

    // Special case: when only one category is defined, use the categoryKey
    // directly as the category lookup key (matching Vue behavior)
    if (Object.keys(cats).length === 1) {
      categoryColor = cats[catKey as keyof typeof cats]?.color;
    }

    if (!categoryColor) {
      return '#cccccc';
    }

    // Ensure we return a string, not an array
    return Array.isArray(categoryColor) ? categoryColor[0] : categoryColor;
  };

  xFormatterFn = (tick: number | Date, i: number, ticks: (number | Date)[]) => {
    const formatter = this.xFormatter();
    return formatter ? formatter(tick, i, ticks) : String(tick);
  };

  yFormatterFn = (tick: number | Date, i: number, ticks: (number | Date)[]) => {
    const formatter = this.yFormatter();
    return formatter ? formatter(tick, i, ticks) : String(tick);
  };

  tooltipTriggers: Record<string, (d: T) => string> = {
    [Scatter.selectors.point]: (d: T) => {
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
