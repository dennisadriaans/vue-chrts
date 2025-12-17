import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnChanges,
  OnDestroy,
  output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { Area, Axis, AxisType, CurveType, Line, Position, XYContainer } from '@unovis/ts';

export interface AreaChartCategory {
  name: string;
  color?: string;
}

@Component({
  selector: 'ngx-area-chart',
  standalone: true,
  template: `<div #container class="ngx-chrts-container" [style.height.px]="height()"></div>`,
  styles: [
    `:host{display:block}`,
    `.ngx-chrts-container{width:100%;}`, // height is controlled via inline style
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaChartComponent<T extends Record<string, any> = Record<string, any>>
  implements AfterViewInit, OnChanges, OnDestroy
{
  @ViewChild('container', { static: true })
  private readonly containerRef!: ElementRef<HTMLDivElement>;

  // Core properties
  readonly data = input.required<T[]>();
  readonly categories = input.required<Record<string, AreaChartCategory>>();
  readonly height = input<number>(280);

  // Axis labels and formatters
  readonly xLabel = input<string>();
  readonly yLabel = input<string>();
  readonly xKey = input<keyof T & string>();
  readonly xFormatter = input<(tick: number | Date, i: number, ticks: number[] | Date[]) => string>();
  readonly yFormatter = input<(tick: number | Date, i: number, ticks: number[] | Date[]) => string>();

  // Curve and line styling
  readonly curveType = input<CurveType>(CurveType.MonotoneX);
  readonly lineWidth = input<number>(2);
  readonly lineDashArray = input<number[][]>();

  // Axis configuration
  readonly xNumTicks = input<number>();
  readonly yNumTicks = input<number>();
  readonly xExplicitTicks = input<number[]>();
  readonly minMaxTicksOnly = input<boolean>(false);

  // Grid and domain lines
  readonly xGridLine = input<boolean>(true);
  readonly yGridLine = input<boolean>(true);
  readonly xDomainLine = input<boolean>(true);
  readonly yDomainLine = input<boolean>(true);
  readonly xTickLine = input<boolean>(true);
  readonly yTickLine = input<boolean>(true);

  // Visibility toggles
  readonly hideArea = input<boolean>(false);
  readonly hideXAxis = input<boolean>(false);
  readonly hideYAxis = input<boolean>(false);

  // Domains
  readonly xDomain = input<[number | undefined, number | undefined]>();
  readonly yDomain = input<[number | undefined, number | undefined]>();

  // Padding
  readonly padding = input<{ top: number; right: number; bottom: number; left: number }>({
    top: 5,
    right: 5,
    bottom: 5,
    left: 5,
  });

  // Stacked mode
  readonly stacked = input<boolean>(false);

  // Gradient stops for area fill
  readonly gradientStops = input<Array<{ offset: string; stopOpacity: number }>>([
    { offset: '0%', stopOpacity: 1 },
    { offset: '75%', stopOpacity: 0 },
  ]);

  // Events
  readonly chartClick = output<{ event: MouseEvent; data?: T }>();

  private xy?: XYContainer<T>;
  private areas: Area<T>[] = [];
  private lines: Line<T>[] = [];
  private xAxis?: Axis<T>;
  private yAxis?: Axis<T>;
  private svgDefs?: SVGDefsElement;

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.xy) return;

    // Handle height change
    if (changes['height']) {
      this.xy.updateContainer({ ...this.xy.config, height: this.height() }, true);
    }

    // Handle padding change
    if (changes['padding']) {
      this.xy.updateContainer({ ...this.xy.config, ...this.padding() }, true);
    }

    // Handle domain changes
    if (changes['xDomain'] || changes['yDomain']) {
      this.xy.updateContainer(
        {
          ...this.xy.config,
          xDomain: this.xDomain(),
          yDomain: this.yDomain(),
        },
        true
      );
    }

    // If categories, curve type, line width, stacked mode, or other visual properties change, recreate components
    if (
      changes['categories'] ||
      changes['curveType'] ||
      changes['lineWidth'] ||
      changes['lineDashArray'] ||
      changes['stacked'] ||
      changes['hideArea'] ||
      changes['gradientStops']
    ) {
      this.updateComponents();
    }

    // Handle axis configuration changes
    if (
      changes['xFormatter'] ||
      changes['xNumTicks'] ||
      changes['xExplicitTicks'] ||
      changes['minMaxTicksOnly'] ||
      changes['xGridLine'] ||
      changes['xDomainLine'] ||
      changes['xTickLine'] ||
      changes['xLabel'] ||
      changes['hideXAxis']
    ) {
      this.updateXAxis();
    }

    if (
      changes['yFormatter'] ||
      changes['yNumTicks'] ||
      changes['yGridLine'] ||
      changes['yDomainLine'] ||
      changes['yTickLine'] ||
      changes['yLabel'] ||
      changes['hideYAxis']
    ) {
      this.updateYAxis();
    }

    // Handle data change
    if (changes['data']) {
      this.xy.setData(this.data() ?? []);
    } else {
      // Ensure we render after config-only updates
      this.xy.setData(this.data() ?? []);
    }
  }

  ngOnDestroy(): void {
    this.xy?.destroy();
    this.xy = undefined;
    this.areas = [];
    this.lines = [];
  }

  private initChart(): void {
    // Create gradient definitions
    this.createGradientDefs();

    // Create area and line components
    this.createComponents();

    // Create axes
    this.createAxes();

    // Create XY container
    this.xy = new XYContainer<T>(
      this.containerRef.nativeElement,
      {
        height: this.height(),
        ...this.padding(),
        components: [...this.areas, ...this.lines],
        xAxis: this.hideXAxis() ? undefined : this.xAxis,
        yAxis: this.hideYAxis() ? undefined : this.yAxis,
        xDomain: this.xDomain(),
        yDomain: this.yDomain(),
      },
      this.data() ?? []
    );

    // Add click handler
    this.containerRef.nativeElement.addEventListener('click', (event: MouseEvent) => {
      this.chartClick.emit({ event, data: undefined });
    });
  }

  private createGradientDefs(): void {
    const container = this.containerRef.nativeElement;
    
    // Find or create SVG element
    let svg = container.querySelector('svg');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.style.position = 'absolute';
      svg.style.width = '0';
      svg.style.height = '0';
      container.appendChild(svg);
    }

    // Create or find defs element
    this.svgDefs = svg.querySelector('defs') as SVGDefsElement;
    if (!this.svgDefs) {
      this.svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svg.appendChild(this.svgDefs);
    }

    // Create gradients for each category
    const categories = this.categories();
    const categoryKeys = Object.keys(categories);
    const gradientStops = this.gradientStops();

    this.svgDefs.innerHTML = '';
    categoryKeys.forEach((key, index) => {
      const category = categories[key];
      const color = category.color || `var(--vis-color${index})`;
      const gradientId = `gradient-${index}-${key}`;

      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      gradient.setAttribute('id', gradientId);
      gradient.setAttribute('gradientTransform', 'rotate(90)');

      gradientStops.forEach((stop) => {
        const stopElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stopElement.setAttribute('offset', stop.offset);
        stopElement.setAttribute('stop-color', color);
        stopElement.setAttribute('stop-opacity', String(stop.stopOpacity));
        gradient.appendChild(stopElement);
      });

      // Add final stop
      const finalStop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      finalStop.setAttribute('offset', '100%');
      finalStop.setAttribute('stop-color', color);
      finalStop.setAttribute('stop-opacity', '0');
      gradient.appendChild(finalStop);

      this.svgDefs!.appendChild(gradient);
    });
  }

  private createComponents(): void {
    // Clear existing components
    this.areas = [];
    this.lines = [];

    const categories = this.categories();
    const categoryKeys = Object.keys(categories);
    const stacked = this.stacked();

    if (stacked) {
      // Stacked mode: Single area and line with array of y accessors
      const stackedYAccessors = categoryKeys.map(
        (key) => (d: T) => Number(d[key as keyof T]) || 0
      );

      // For stacked areas, the color accessor receives the data array index
      const stackedColorAccessor = (_d: T | T[], i: number) => {
        const category = categories[categoryKeys[i]];
        return category?.color || `var(--vis-color${i})`;
      };

      this.areas.push(
        new Area<T>({
          x: (_d: T, i: number) => i,
          y: stackedYAccessors as any,
          color: stackedColorAccessor as any,
          opacity: this.hideArea() ? 0 : 0.5,
          curveType: this.curveType(),
        })
      );

      // Stacked line accessors - cumulative values
      const stackedLineYAccessors = categoryKeys.map((_, index) => {
        return (d: T) => {
          let sum = 0;
          for (let i = 0; i <= index; i++) {
            sum += Number(d[categoryKeys[i] as keyof T]) || 0;
          }
          return sum;
        };
      });

      this.lines.push(
        new Line<T>({
          x: (_d: T, i: number) => i,
          y: stackedLineYAccessors as any,
          color: stackedColorAccessor as any,
          curveType: this.curveType(),
          lineWidth: this.lineWidth(),
        })
      );
    } else {
      // Non-stacked mode: Overlapping areas
      const lineDashArray = this.lineDashArray();

      categoryKeys.forEach((key, index) => {
        const category = categories[key];
        const color = category.color || `var(--vis-color${index})`;
        const gradientId = `gradient-${index}-${key}`;

        this.areas.push(
          new Area<T>({
            x: (_d: T, i: number) => i,
            y: (d: T) => Number(d[key as keyof T]) || 0,
            color: `url(#${gradientId})`,
            opacity: this.hideArea() ? 0 : 0.5,
            curveType: this.curveType(),
          })
        );

        this.lines.push(
          new Line<T>({
            x: (_d: T, i: number) => i,
            y: (d: T) => Number(d[key as keyof T]) || 0,
            color: color,
            curveType: this.curveType(),
            lineWidth: this.lineWidth(),
            lineDashArray: lineDashArray?.[index],
          })
        );
      });
    }
  }

  private createAxes(): void {
    this.xAxis = new Axis<T>({
      type: AxisType.X,
      position: Position.Bottom,
      label: this.xLabel(),
      tickFormat: (tick) => this.formatXTick(tick),
      numTicks: this.xNumTicks(),
      tickValues: this.xExplicitTicks(),
      minMaxTicksOnly: this.minMaxTicksOnly(),
      gridLine: this.xGridLine(),
      domainLine: this.xDomainLine(),
      tickLine: this.xTickLine(),
    });

    this.yAxis = new Axis<T>({
      type: AxisType.Y,
      position: Position.Left,
      label: this.yLabel(),
      tickFormat: this.yFormatter(),
      numTicks: this.yNumTicks(),
      gridLine: this.yGridLine(),
      domainLine: this.yDomainLine(),
      tickLine: this.yTickLine(),
    });
  }

  private updateComponents(): void {
    if (!this.xy) return;

    // Recreate gradient defs
    this.createGradientDefs();

    // Recreate components
    this.createComponents();

    // Update the container with new components
    this.xy.updateContainer(
      {
        ...this.xy.config,
        components: [...this.areas, ...this.lines],
      },
      true
    );
  }

  private updateXAxis(): void {
    if (!this.xAxis) return;

    this.xAxis.setConfig({
      ...this.xAxis.config,
      label: this.xLabel(),
      tickFormat: (tick) => this.formatXTick(tick),
      numTicks: this.xNumTicks(),
      tickValues: this.xExplicitTicks(),
      minMaxTicksOnly: this.minMaxTicksOnly(),
      gridLine: this.xGridLine(),
      domainLine: this.xDomainLine(),
      tickLine: this.xTickLine(),
    });
  }

  private updateYAxis(): void {
    if (!this.yAxis) return;

    this.yAxis.setConfig({
      ...this.yAxis.config,
      label: this.yLabel(),
      tickFormat: this.yFormatter(),
      numTicks: this.yNumTicks(),
      gridLine: this.yGridLine(),
      domainLine: this.yDomainLine(),
      tickLine: this.yTickLine(),
    });
  }

  private formatXTick(tick: number | Date): string {
    const formatter = this.xFormatter();
    if (formatter) {
      return formatter(Number(tick), 0, []);
    }

    const xKey = this.xKey();
    if (!xKey) return String(tick);
    if (typeof tick !== 'number' || !Number.isFinite(tick)) return '';

    const index = Math.round(tick);
    const row = this.data()?.[index];
    const value = row?.[xKey];
    return value == null ? '' : String(value);
  }
}
