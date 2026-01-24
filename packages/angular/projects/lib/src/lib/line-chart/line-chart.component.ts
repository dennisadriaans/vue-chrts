import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurveType } from '@unovis/ts';
import { AreaChartComponent } from '../area-chart/area-chart.component';
import { LegendPosition, axisFormatter, AxisConfig, MarkerConfig, BulletLegendItemInterface } from '../types';

@Component({
  selector: 'line-chart',
  standalone: true,
  imports: [CommonModule, AreaChartComponent],
  template: `
    <area-chart
      [data]="data()"
      [height]="height()"
      [padding]="padding()"
      [categories]="categories()"
      [stacked]="stacked()"
      [hideArea]="true"
      [curveType]="curveType()"
      [lineWidth]="lineWidth()"
      [lineDashArray]="lineDashArray()"
      [xLabel]="xLabel()"
      [yLabel]="yLabel()"
      [xFormatter]="xFormatter()"
      [yFormatter]="yFormatter()"
      [xNumTicks]="xNumTicks()"
      [xExplicitTicks]="xExplicitTicks()"
      [minMaxTicksOnly]="minMaxTicksOnly()"
      [yNumTicks]="yNumTicks()"
      [hideXAxis]="hideXAxis()"
      [hideYAxis]="hideYAxis()"
      [xGridLine]="xGridLine()"
      [yGridLine]="yGridLine()"
      [xDomainLine]="xDomainLine()"
      [yDomainLine]="yDomainLine()"
      [xTickLine]="xTickLine()"
      [yTickLine]="yTickLine()"
      [hideTooltip]="hideTooltip()"
      [hideLegend]="hideLegend()"
      [legendPosition]="legendPosition()"
      [legendStyle]="legendStyle()"
      [tooltipTitleFormatter]="tooltipTitleFormatter()"
      [markerConfig]="markerConfig()"
      [yDomain]="yDomain()"
      [xDomain]="xDomain()"
      (click)="click.emit($event)"
    ></area-chart>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent<T extends Record<string, any>> {
  readonly data = input.required<T[]>();
  readonly height = input<number>(400);
  readonly padding = input<{ top: number; right: number; bottom: number; left: number }>({
    top: 5,
    right: 5,
    bottom: 5,
    left: 5,
  });
  readonly categories = input.required<Record<string, BulletLegendItemInterface>>();
  readonly stacked = input<boolean>(false);
  readonly curveType = input<CurveType>();
  readonly lineWidth = input<number>(2);
  readonly lineDashArray = input<number[][]>();
  readonly xLabel = input<string>();
  readonly yLabel = input<string>();
  readonly xFormatter = input<axisFormatter>();
  readonly yFormatter = input<axisFormatter>();
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
  readonly tooltipTitleFormatter = input<(data: T) => string | number>();
  readonly markerConfig = input<MarkerConfig>();
  readonly yDomain = input<[number, number]>();
  readonly xDomain = input<[number, number]>();

  readonly click = output<{ event: MouseEvent; values?: T }>();
}
