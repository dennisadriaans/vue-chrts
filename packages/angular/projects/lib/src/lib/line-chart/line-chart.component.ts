import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { Axis, AxisType, CurveType, Line, Position, XYContainer } from '@unovis/ts';

@Component({
  selector: 'ngx-line-chart',
  standalone: true,
  template: `<div #container class="ngx-chrts-container" [style.height.px]="height"></div>`,
  styles: [
    `:host{display:block}`,
    `.ngx-chrts-container{width:100%;}`, // height is controlled via inline style
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent<T extends Record<string, any> = Record<string, any>>
  implements AfterViewInit, OnChanges, OnDestroy
{
  @ViewChild('container', { static: true })
  private readonly containerRef!: ElementRef<HTMLDivElement>;

  @Input({ required: true }) data: T[] = [];

  /** Which property to show as the X tick label (x is internally the item index). */
  @Input() xKey?: keyof T & string;

  /** Which property to plot on the Y axis. */
  @Input({ required: true }) yKey!: keyof T & string;

  @Input() height = 280;
  @Input() curveType: CurveType = CurveType.MonotoneX;
  @Input() lineWidth = 2;

  private xy?: XYContainer<T>;
  private line?: Line<T>;
  private xAxis?: Axis<T>;
  private yAxis?: Axis<T>;

  ngAfterViewInit(): void {
    this.line = new Line<T>(this.buildLineConfig());

    this.xAxis = new Axis<T>({
      type: AxisType.X,
      position: Position.Bottom,
      tickFormat: (tick) => this.formatXTick(tick),
      gridLine: false,
    });

    this.yAxis = new Axis<T>({
      type: AxisType.Y,
      position: Position.Left,
      gridLine: true,
    });

    this.xy = new XYContainer<T>(
      this.containerRef.nativeElement,
      {
        height: this.height,
        autoMargin: true,
        components: [this.line],
        xAxis: this.xAxis,
        yAxis: this.yAxis,
      },
      this.data ?? []
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.xy || !this.line) return;

    if (changes['height']) {
      this.xy.updateContainer({ ...this.xy.config, height: this.height }, true);
    }

    if (changes['yKey'] || changes['curveType'] || changes['lineWidth']) {
      this.line.setConfig(this.buildLineConfig());
    }

    if (changes['xKey']) {
      this.xAxis?.setConfig({ ...this.xAxis.config, tickFormat: (tick) => this.formatXTick(tick) });
    }

    if (changes['data']) {
      this.xy.setData(this.data ?? []);
    } else {
      // Ensure we render after config-only updates
      this.xy.setData(this.data ?? []);
    }
  }

  ngOnDestroy(): void {
    this.xy?.destroy();
    this.xy = undefined;
  }

  private buildLineConfig() {
    return {
      x: (_d: T, i: number) => i,
      y: (d: T) => Number(d?.[this.yKey]),
      curveType: this.curveType,
      lineWidth: this.lineWidth,
    };
  }

  private formatXTick(tick: number | Date): string {
    if (!this.xKey) return String(tick);
    if (typeof tick !== 'number' || !Number.isFinite(tick)) return '';

    const index = Math.round(tick);
    const row = this.data?.[index];
    const value = row?.[this.xKey];
    return value == null ? '' : String(value);
  }
}
