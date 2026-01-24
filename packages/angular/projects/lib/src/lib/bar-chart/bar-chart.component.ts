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
  VisXYLabelsModule,
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
    VisXYLabelsModule,
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
        [height]="height()"
        [padding]="padding()"
      >
        @if (valueLabel()) {
          <vis-xy-labels
            [data]="labelData()"
            [x]="labelX()"
            [y]="labelY()"
            [label]="labelAccessor()"
            [backgroundColor]="valueLabel()?.backgroundColor ?? 'transparent'"
            [color]="valueLabel()?.color ?? 'red'"
            [labelFontSize]="valueLabel()?.labelFontSize"
          ></vis-xy-labels>
        }

        @if (!hideTooltip()) {
          <vis-tooltip
            [triggers]="tooltipTriggers"
          ></vis-tooltip>
        }

        @if (stackAndGrouped()) {
          @for (state of stackedGroupedData().states; track state) {
            <vis-stacked-bar
              [data]="stackedGroupedData().chartData"
              [x]="getXForState(state)"
              [y]="stackedGroupedData().bars[state]"
              [color]="stackedGroupedData().colorFunctions[state]"
              [roundedCorners]="radius() ?? 0"
              [barPadding]="barPadding()"
              [orientation]="orientation()"
            ></vis-stacked-bar>
          }
        } @else if (!stacked()) {
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
  readonly stackAndGrouped = input<boolean>(false);
  readonly xAxis = input<keyof T>();
  readonly stackedGroupedSpacing = input<number>(0.1);

  readonly click = output<{ event: MouseEvent; values?: T }>();

  readonly tooltipWrapper = viewChild<ElementRef<HTMLDivElement>>('tooltipWrapper');
  readonly hoverValues = signal<T | undefined>(undefined);

  readonly Orientation = Orientation;

  readonly isLegendTop = computed(() => this.legendPosition().startsWith('top'));

  readonly stackedGroupedData = computed(() => {
    const data = this.data();
    const categories = this.categories();
    const stackAndGrouped = this.stackAndGrouped();
    const xAxis = this.xAxis();
    const spacing = this.stackedGroupedSpacing() ?? 0.1;

    // Local helper functions matching stackedGroupedUtils.ts
    const extractStates = (cats: Record<string, BulletLegendItemInterface>): string[] => {
      const states = new Set<string>();
      Object.keys(cats).forEach((key) => {
        const match = key.match(/([A-Z][a-z]+)$/);
        if (match) states.add(match[1]);
      });
      return Array.from(states);
    };

    const states = extractStates(categories);
    const groupedByState: Record<string, string[]> = {};
    states.forEach((state) => {
      groupedByState[state] = Object.keys(categories).filter((key) => key.endsWith(state));
    });

    const colorsByState: Record<string, string[]> = {};
    Object.entries(groupedByState).forEach(([state, keys]) => {
      colorsByState[state] = keys.map((key) => {
        const color = categories[key]?.color;
        return (Array.isArray(color) ? color[0] : color) ?? '#ccc';
      });
    });

    const bars: Record<string, ((d: any) => any)[]> = {};
    Object.entries(groupedByState).forEach(([state, keys]) => {
      bars[state] = keys.map((key) => {
        const baseName = key.replace(state, '').toLowerCase();
        return (d: any) => d[baseName + state];
      });
    });

    const colorFunctions: Record<string, (d: unknown, i: number) => string> = {};
    Object.entries(colorsByState).forEach(([state, stateColors]) => {
      colorFunctions[state] = (_d: unknown, i: number) => stateColors[i] ?? '#ccc';
    });

    const positions: Record<string, number> = {};
    const numStates = states.length;
    states.forEach((state, index) => {
      const offset = (index - (numStates - 1) / 2) * spacing;
      positions[state] = offset;
    });

    // Simple flattenData logic
    let chartData = data;

    return {
      states,
      bars,
      colorFunctions,
      positions,
      chartData,
    };
  });

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

  readonly labelData = computed(() => {
    const data = this.data();
    const keys = this.yAxis();
    return data.flatMap((item, colIndex) =>
      keys.map((key, itemIndex) => ({
        x: colIndex,
        y: Number(item[key] ?? 0),
        itemIndex,
        datum: item,
      }))
    );
  });

  readonly labelX = computed(() => {
    const isStacked = this.stacked();
    const numBars = this.yAxis().length;
    const groupPadding = this.groupPadding();
    const barPadding = this.barPadding();

    return (d: any) => {
      // Do not offset for stacked variants
      if (isStacked) return d.x;
      if (numBars <= 1) return d.x; // single series, already centered

      // Effective drawable width of the group after outer group padding (heuristic)
      const groupEffectiveWidth = 1 - groupPadding;
      const barEffectiveWidth = groupEffectiveWidth / numBars;

      // Start (left) edge of effective group relative to group center (which is at d.x)
      const leftOffsetFromCenter = -groupEffectiveWidth / 2;
      const barCenterOffset = barEffectiveWidth * d.itemIndex + barEffectiveWidth / 2;
      
      // Bars inside the group usually don't span the full theoretical width due to internal barPadding.
      const compression = 1 - barPadding; // pull towards center
      const offsetFromCenter = (leftOffsetFromCenter + barCenterOffset) * compression;

      return d.x + offsetFromCenter;
    };
  });

  readonly labelY = computed(() => {
    const spacing = this.valueLabel()?.labelSpacing ?? 0;
    return (d: any) => d.y + spacing;
  });

  readonly labelAccessor = computed(() => {
    const labelFn = this.valueLabel()?.label;
    return (d: any, i: number) => {
      if (!labelFn) return '';
      const value = labelFn(d, i);
      return value == null ? '' : String(value);
    };
  });

  colorAccessor: any = (_: T, i: number) => {
    const cats = Object.values(this.categories());
    return cats[i]?.color;
  };

  _x: any = (_: T, i: number) => i;

  getXForState(state: string): any {
    return (_: T, i: number) => i + this.stackedGroupedData().positions[state];
  }

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
