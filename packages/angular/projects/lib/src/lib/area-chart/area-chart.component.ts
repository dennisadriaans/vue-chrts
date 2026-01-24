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
  VisAreaModule,
  VisAxisModule,
  VisLineModule,
  VisTooltipModule,
  VisCrosshairModule,
  VisBulletLegendModule,
} from '@unovis/angular';
import { CurveType, Position } from '@unovis/ts';
import { LegendPosition } from '../types';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { createMarkers } from '../utils';

@Component({
  selector: 'area-chart',
  standalone: true,
  imports: [
    CommonModule,
    VisXYContainerModule,
    VisAreaModule,
    VisAxisModule,
    VisLineModule,
    VisTooltipModule,
    VisCrosshairModule,
    VisBulletLegendModule,
    TooltipComponent,
  ],
  template: `
    <div
      [style.display]="'flex'"
      [style.flexDirection]="isLegendTop() ? 'column-reverse' : 'column'"
      [style.gap]="'var(--vis-legend-spacing)'"
      [style]="markerCssVars()"
      [class.stacked-area-chart]="stacked()"
      [id]="markerConfig()?.id"
      (click)="onClick($event)"
    >
      <vis-xy-container
        [data]="data()"
        [height]="height()"
        [padding]="padding()"
        [yDomain]="yDomain()"
        [xDomain]="xDomain()"
        [svgDefs]="svgDefs() + markerSvgDefs()"
      >
        @if (!hideTooltip()) {
          <vis-tooltip
            [horizontalPlacement]="Position.Right"
            [verticalPlacement]="Position.Top"
          ></vis-tooltip>
        }

        @if (stacked()) {
          <vis-area
            [x]="_x"
            [y]="stackedYAccessors()"
            [color]="stackedColorAccessor"
            [opacity]="hideArea() ? 0 : DEFAULT_OPACITY"
            [curveType]="curveType() || CurveType.MonotoneX"
          ></vis-area>
          <vis-line
            [x]="_x"
            [y]="stackedLineYAccessors()"
            [color]="stackedColorAccessor"
            [curveType]="curveType() || CurveType.MonotoneX"
            [lineWidth]="lineWidth()"
          ></vis-line>
        } @else {
          @for (categoryId of categoryKeys(); track categoryId; let i = $index) {
            <vis-area
              [x]="_x"
              [y]="getYAccessor(categoryId)"
              [color]="getGradientSelector(i)"
              [opacity]="hideArea() ? 0 : DEFAULT_OPACITY"
              [curveType]="curveType() || CurveType.MonotoneX"
            ></vis-area>
            <vis-line
              [x]="_x"
              [y]="getYAccessor(categoryId)"
              [color]="colors()[i]"
              [curveType]="curveType() || CurveType.MonotoneX"
              [lineWidth]="lineWidth()"
              [lineDashArray]="lineDashArray() ? lineDashArray()![i] : undefined"
            ></vis-line>
          }
        }

        @if (!hideXAxis()) {
          <vis-axis
            type="x"
            [label]="xLabel()"
            [labelMargin]="8"
            [numTicks]="xNumTicks()"
            [tickFormat]="xFormatter()"
            [tickValues]="xExplicitTicks()"
            [gridLine]="xGridLine()"
            [domainLine]="xDomainLine()"
            [tickLine]="xTickLine()"
            [minMaxTicksOnly]="minMaxTicksOnly()"
          ></vis-axis>
        }

        @if (!hideYAxis()) {
          <vis-axis
            type="y"
            [label]="yLabel()"
            [numTicks]="yNumTicks()"
            [tickFormat]="yFormatter()"
            [gridLine]="yGridLine()"
            [domainLine]="yDomainLine()"
            [tickLine]="yTickLine()"
          ></vis-axis>
        }

        @if (!hideTooltip()) {
          <vis-crosshair
            [template]="onCrosshairUpdate"
          ></vis-crosshair>
        }
      </vis-xy-container>

      @if (!hideLegend()) {
        <div
          [style.display]="'flex'"
          [style.justifyContent]="legendAlignment()"
        >
          <vis-bullet-legend
            [style]="legendStyle()"
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
              [yFormatter]="yFormatter()"
            ></tooltip>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaChartComponent<T extends Record<string, any>> {
  private readonly uid = Math.random().toString(36).slice(2);
  readonly data = input.required<T[]>();
  readonly height = input<number>(400);
  readonly padding = input<{ top: number; right: number; bottom: number; left: number }>({
    top: 5,
    right: 5,
    bottom: 5,
    left: 5,
  });
  readonly categories = input.required<Record<string, any>>();
  readonly stacked = input<boolean>(false);
  readonly hideArea = input<boolean>(false);
  readonly curveType = input<CurveType>();
  readonly lineWidth = input<number>(2);
  readonly lineDashArray = input<number[][]>();
  readonly xLabel = input<string>();
  readonly yLabel = input<string>();
  readonly xFormatter = input<any>();
  readonly yFormatter = input<any>();
  readonly xNumTicks = input<number>();
  readonly xExplicitTicks = input<any[]>();
  readonly minMaxTicksOnly = input<boolean>(false);
  readonly yNumTicks = input<number>();
  readonly hideXAxis = input<boolean>(false);
  readonly hideYAxis = input<boolean>(false);
  readonly xGridLine = input<boolean>(false);
  readonly yGridLine = input<boolean>(false);
  readonly xDomainLine = input<boolean>(false);
  readonly yDomainLine = input<boolean>(false);
  readonly xTickLine = input<boolean>(false);
  readonly yTickLine = input<boolean>(false);
  readonly hideTooltip = input<boolean>(false);
  readonly hideLegend = input<boolean>(false);
  readonly legendPosition = input<LegendPosition>(LegendPosition.BottomCenter);
  readonly legendStyle = input<Record<string, string>>();
  readonly tooltipStyle = input<Record<string, string>>({});
  readonly tooltipTitleFormatter = input<(data: T) => string | number>();
  readonly markerConfig = input<any>();
  readonly gradientStops = input<Array<{ offset: string; stopOpacity: number }>>([
    { offset: '0%', stopOpacity: 1 },
    { offset: '75%', stopOpacity: 0 },
  ]);
  readonly yDomain = input<[number, number]>();
  readonly xDomain = input<[number, number]>();

  readonly click = output<{ event: MouseEvent; values?: T }>();

  readonly tooltipWrapper = viewChild<ElementRef<HTMLDivElement>>('tooltipWrapper');
  readonly hoverValues = signal<T | undefined>(undefined);

  readonly DEFAULT_OPACITY = 0.5;
  readonly DEFAULT_COLOR = '#3b82f6';
  readonly Position = Position;
  readonly CurveType = CurveType;

  readonly categoryKeys = computed(() => Object.keys(this.categories()));
  
  readonly colors = computed(() => {
    const cats = this.categories();
    return Object.keys(cats).map((key, index) => {
      return cats[key].color ?? `var(--vis-color${index})`;
    });
  });

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

  readonly svgDefs = computed(() => {
    const stops = this.gradientStops();
    const colors = this.colors();
    
    return colors.map((color, index) => {
      const id = `gradient-${index}-${color.replace(/#/g, '')}`;
      return `
        <linearGradient id="${id}" gradientTransform="rotate(90)">
          ${stops.map(stop => `
            <stop offset="${stop.offset}" stop-color="${color}" stop-opacity="${stop.stopOpacity}" />
          `).join('')}
          <stop offset="100%" stop-color="${color}" stop-opacity="0" />
        </linearGradient>
      `;
    }).join('');
  });

  readonly stackedYAccessors = computed(() => {
    const keys = this.categoryKeys();
    return keys.map(key => (d: T) => Number(d[key]));
  });

  readonly stackedLineYAccessors = computed(() => {
    const keys = this.categoryKeys();
    return keys.map((_, index) => {
      return (d: T) => {
        let sum = 0;
        for (let i = 0; i <= index; i++) {
          sum += Number(d[keys[i]]) || 0;
        }
        return sum;
      };
    });
  });

  readonly markerSvgDefs = computed(() => {
    const config = this.markerConfig();
    if (!config?.config) return '';
    return createMarkers(config);
  });

  readonly markerCssVars = computed(() => {
    const config = this.markerConfig();
    if (!config?.config) return {};

    const vars: Record<string, string> = {};
    for (const key of Object.keys(config.config)) {
      vars[`--vis-marker-${key}`] = `url("#${config.id}-${key}")`;
    }
    return vars;
  });

  readonly stackedColorAccessor: any = (_d: any, i: number) => this.colors()[i] ?? this.DEFAULT_COLOR;

  _x: any = (_: any, i: number) => i;

  getYAccessor(categoryId: string): any {
    return (d: T) => Number(d[categoryId]);
  }

  getGradientSelector(index: number): any {
    const color = this.colors()[index];
    const id = `gradient-${index}-${color.replace(/#/g, '')}`;
    return `url(#${id})`;
  }

  onCrosshairUpdate = (d: T): string => {
    this.hoverValues.set(d);
    this.cdr.detectChanges();
    return this.tooltipWrapper()?.nativeElement.innerHTML || '';
  };

  onClick(event: MouseEvent) {
    this.click.emit({ event, values: this.hoverValues() });
  }

  private cdr = inject(ChangeDetectorRef);
}
