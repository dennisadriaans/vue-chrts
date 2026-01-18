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
  VisSingleContainerModule,
  VisDonutModule,
  VisTooltipModule,
  VisBulletLegendModule,
} from '@unovis/angular';
import { Donut } from '@unovis/ts';
import { LegendPosition, BulletLegendItemInterface } from '../types';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { DonutType } from './types';

@Component({
  selector: 'ngx-donut-chart',
  standalone: true,
  imports: [
    CommonModule,
    VisSingleContainerModule,
    VisDonutModule,
    VisTooltipModule,
    VisBulletLegendModule,
    TooltipComponent,
  ],
  template: `
    <div
      [style.display]="'flex'"
      [style.flexDirection]="isLegendTop() ? 'column-reverse' : 'column'"
      [style.gap]="'var(--vis-legend-spacing)'"
      (click)="onClick($event)"
    >
      <vis-single-container
        [data]="data()"
        [height]="height()"
        [margin]="{}"
      >
        <vis-tooltip
          [horizontalShift]="20"
          [verticalShift]="20"
          [triggers]="tooltipTriggers"
        ></vis-tooltip>

        <vis-donut
          [value]="valueAccessor"
          [cornerRadius]="radius()"
          [arcWidth]="arcWidth()"
          [color]="colorAccessor"
          [angleRange]="angleRange()"
          [padAngle]="padAngle()"
        ></vis-donut>

        <div
          [style.position]="'absolute'"
          [style.top]="'50%'"
          [style.left]="'50%'"
          [style.transform]="'translate(-50%, -50%)'"
        >
          <ng-content></ng-content>
        </div>
      </vis-single-container>

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
          <ngx-tooltip
            [data]="hoverValues()!"
            [categories]="categories()"
            [titleFormatter]="tooltipTitleFormatter()"
          ></ngx-tooltip>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutChartComponent {
  readonly data = input.required<number[]>();
  readonly height = input<number>(400);
  readonly categories = input.required<Record<string, BulletLegendItemInterface>>();
  readonly type = input<DonutType>(DonutType.Full);
  readonly radius = input<number>(0);
  readonly arcWidth = input<number>(20);
  readonly padAngle = input<number>(0);
  readonly hideLegend = input<boolean>(false);
  readonly legendPosition = input<LegendPosition>(LegendPosition.BottomCenter);
  readonly legendStyle = input<Record<string, string>>();
  readonly tooltipTitleFormatter = input<(data: any) => string | number>();

  readonly click = output<{ event: MouseEvent; values?: any }>();

  readonly tooltipWrapper = viewChild<ElementRef<HTMLDivElement>>('tooltipWrapper');
  readonly hoverValues = signal<any>(undefined);

  readonly isLegendTop = computed(() => this.legendPosition().startsWith('top'));

  readonly legendAlignment = computed(() => {
    const pos = this.legendPosition();
    if (pos.includes('left')) return 'flex-start';
    if (pos.includes('right')) return 'flex-end';
    return 'center';
  });

  readonly categoriesArray = computed(() => Object.values(this.categories()));

  readonly legendItems = computed(() => {
    return this.categoriesArray().map((item) => ({
      ...item,
      color: this.normalizeColor(item.color),
    }));
  });

  readonly angleRange = computed((): [number, number] | undefined => {
    return this.type() === DonutType.Half
      ? [-1.5707963267948966, 1.5707963267948966]
      : undefined;
  });

  valueAccessor = (d: number) => d;

  colorAccessor = (_: number, i: number) => {
    const cat = this.categoriesArray()[i];
    if (!cat) return undefined;
    return this.normalizeColor(cat.color);
  };

  tooltipTriggers: Record<string, (d: any) => string> = {
    [Donut.selectors.segment]: (d: any) => {
      this.onCrosshairUpdate(d);
      return d ? this.tooltipWrapper()?.nativeElement.innerHTML ?? '' : '';
    },
  };

  onCrosshairUpdate(d: any): void {
    const keyName = Object.values(this.categories())[d?.index]?.name;
    this.hoverValues.set({
      label: keyName,
      [keyName]: d?.data,
    });
    this.cdr.detectChanges();
  }

  onClick(event: MouseEvent): void {
    this.click.emit({ event, values: this.hoverValues() });
  }

  private normalizeColor(color: string | string[] | undefined, fallback = '#ccc'): string {
    if (!color) return fallback;
    return Array.isArray(color) ? color[0] || fallback : color;
  }

  private cdr = inject(ChangeDetectorRef);
}
