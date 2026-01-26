import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulletLegendItemInterface, axisFormatter } from '../types';

@Component({
  selector: 'ngx-tooltip',
  standalone: true,
  imports: [],
  template: `
    <div [style]="containerStyle">
      @if (titleFormat()) {
        <div [style]="titleStyle">
          {{ titleFormat() }}
        </div>
      }
      <div [style]="contentStyle">
        @for (entry of visibleEntries(); track entry.key; let i = $index) {
          <span [style]="getDotStyle(entry.key, i)"></span>
          <span [style]="labelStyle">
            {{ categories()[entry.key].name }}
          </span>
          <span [style]="valueStyle">
            {{ yFormatter() ? yFormatter()!(entry.value, i, []) : entry.value }}
          </span>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent<T extends Record<string, any>> {
  readonly data = input.required<T>();
  readonly categories = input.required<Record<string, BulletLegendItemInterface>>();
  readonly titleFormatter = input<(data: T) => string | number>();
  readonly yFormatter = input<axisFormatter>();

  readonly titleFormat = computed(() => {
    const data = this.data();
    const formatter = this.titleFormatter();
    if (formatter) return formatter(data);
    
    // getFirstPropertyValue equivalent
    if (data && Object.keys(data).length > 0) {
      const firstKey = Object.keys(data)[0];
      return data[firstKey];
    }
    return undefined;
  });

  private readonly keyBlockList = ['_index', '_stacked', '_ending'];

  readonly visibleEntries = computed(() => {
    const data = this.data();
    const categories = this.categories();
    return Object.entries(data ?? {})
      .filter(([key]) => !this.keyBlockList.includes(key) && Object.keys(categories).includes(key))
      .map(([key, value]) => ({ key, value }));
  });

  readonly containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    padding: '0px',
    margin: '0px'
  };

  readonly titleStyle = {
    color: 'var(--vis-tooltip-title-color, #000)',
    textTransform: 'var(--vis-tooltip-title-text-transform, capitalize)',
    borderBottom: 'var(--vis-tooltip-title-border-bottom, 1px solid #e5e7eb)',
    padding: 'var(--vis-tooltip-title-padding, 0.75rem 0.75rem 0.5rem 0.75rem)',
    margin: 'var(--vis-tooltip-title-margin, 0 0 0.25rem 0)',
    fontSize: 'var(--vis-tooltip-title-font-size, 0.875rem)',
    lineHeight: 'var(--vis-tooltip-title-line-height, 100%)',
    fontWeight: 'var(--vis-tooltip-title-font-weight, 600)',
  };

  readonly contentStyle = {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    gap: 'var(--vis-tooltip-content-gap, 0.25rem 0.5rem)',
    padding: 'var(--vis-tooltip-content-padding, 0 0.75rem 0.5rem 0.75rem)',
  };

  readonly labelStyle = {
    fontWeight: 'var(--vis-tooltip-label-font-weight, 400)',
    fontSize: 'var(--vis-tooltip-label-font-size, 0.875rem)',
    color: 'var(--vis-tooltip-label-color, inherit)',
    margin: 'var(--vis-tooltip-label-margin, 0 1rem 0 0)',
    whiteSpace: 'nowrap',
  };

  readonly valueStyle = {
    fontSize: 'var(--vis-tooltip-value-font-size, 0.875rem)',
    fontWeight: 'var(--vis-tooltip-value-font-weight, 600)',
    color: 'var(--vis-tooltip-value-color, inherit)',
    textAlign: 'right',
    fontVariantNumeric: 'tabular-nums',
  };

  getDotStyle(key: string, index: number) {
    const category = this.categories()[key];
    const color = (category && typeof category.color === 'string') 
      ? category.color 
      : `var(--vis-color${index})`;
    
    return {
      width: '8px',
      height: '8px',
      aspectRatio: '1',
      borderRadius: 'var(--vis-tooltip-dot-border-radius, 4px)',
      margin: 'var(--vis-tooltip-dot-margin, 0)',
      flexShrink: '0',
      backgroundColor: color,
    };
  }
}
