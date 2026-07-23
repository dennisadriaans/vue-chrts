---
title: Angular Charts - Beautiful, Interactive Data Visualization for Angular
description: Create stunning, interactive charts in your Angular applications with a powerful chart library. Build responsive area charts, bar charts, line charts, and donut charts with ease.
seo:
  title: Angular Charts - Beautiful Data Visualization Library for Angular
  description: A powerful Angular chart library for creating interactive, responsive data visualizations. Build beautiful area charts, bar charts, line charts, and donut charts for your Angular projects.
---

# Angular Charts

Build beautiful, interactive data visualizations for your Angular applications. Whether you're creating dashboards, analytics platforms, or data-driven applications, Angular Charts provides the tools you need to present complex data in clear, engaging ways.

## Why Choose Angular Charts

Angular Charts is designed from the ground up for the Angular ecosystem, providing seamless integration with Angular's component architecture and reactive programming patterns.

*   **Native Angular Integration:** Built specifically for Angular with full TypeScript support, dependency injection compatibility, and Angular-style component APIs.
*   **Reactive by Design:** Leverage RxJS observables for real-time data updates. Charts automatically respond to data changes without manual refresh.
*   **Responsive & Mobile-Ready:** Charts automatically adapt to any screen size, providing a consistent experience across desktop, tablet, and mobile devices.
*   **Highly Customizable:** Control every aspect of your charts—colors, labels, tooltips, legends, and animations—to match your application's design system.
*   **Performance Optimized:** Efficient rendering ensures smooth interactions even with large datasets, using Angular's change detection strategies.

## Chart Types for Every Use Case

[Angular Charts](https://angularcharts.com) provides a comprehensive set of chart types to visualize any kind of data:

### Area Charts

Perfect for showing trends over time with filled areas that emphasize volume and magnitude. Ideal for revenue tracking, user growth, and performance metrics.

### Bar Charts

Excellent for comparing values across categories. Use vertical or horizontal orientations, stacked or grouped layouts to highlight differences and rankings.

### Line Charts

The classic choice for time series data. Display single or multiple data series with smooth curves or stepped transitions.


### Donut Charts

Show part-to-whole relationships with elegant donut and pie charts. Perfect for displaying proportions, distributions, and market share data.

## Examples

<ExamplesChartShowcase></ExamplesChartShowcase>

## Getting Started with Angular Charts

Integrating Angular Charts into your Angular project is straightforward. Follow these steps to add beautiful data visualizations to your application.

### Installation

Install Angular Charts using your preferred package manager:

::code-group
```bash [npm]
npm install angular-charts
```
```bash [yarn]
yarn add angular-charts
```
```bash [pnpm]
pnpm add angular-charts
```
::

### Basic Configuration

Import the Angular chart modules into your Angular module or standalone component:

```typescript [app.module.ts]
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AreaChartModule, BarChartModule, LineChartModule } from 'angular-charts';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AreaChartModule,
    BarChartModule,
    LineChartModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Creating Your First Chart

Here's a simple example of an area chart in Angular:

```typescript [analytics.component.ts]
import { Component } from '@angular/core';

interface ChartData {
  date: string;
  desktop: number;
  mobile: number;
}

@Component({
  selector: 'app-analytics',
  template: `
    <area-chart
      [data]="chartData"
      [height]="300"
      [categories]="categories"
      [yGridLine]="true"
      [xFormatter]="xFormatter"
      curveType="monotoneX"
      legendPosition="topRight">
    </area-chart>
  `
})
export class AnalyticsComponent {
  chartData: ChartData[] = [
    { date: '2024-04-01', desktop: 222, mobile: 150 },
    { date: '2024-04-02', desktop: 180, mobile: 97 },
    { date: '2024-04-03', desktop: 167, mobile: 120 },
    { date: '2024-04-04', desktop: 260, mobile: 240 },
    { date: '2024-04-05', desktop: 240, mobile: 290 },
  ];

  categories = {
    desktop: { name: 'Desktop', color: '#3b82f6' },
    mobile: { name: 'Mobile', color: '#22c55e' }
  };

  xFormatter = (tick: number): string => {
    const date = new Date(this.chartData[tick]?.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
}
```

## Advanced Features

### Real-Time Data Updates

Angular Charts integrates seamlessly with RxJS for real-time data streaming:

```typescript [live-dashboard.component.ts]
import { Component, OnInit } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-live-dashboard',
  template: `
    <line-chart
      [data]="liveData$ | async"
      [height]="300"
      [categories]="categories"
      [animated]="true">
    </line-chart>
  `
})
export class LiveDashboardComponent implements OnInit {
  liveData$: Observable<any[]>;

  categories = {
    value: { name: 'Real-time Value', color: '#8b5cf6' }
  };

  ngOnInit() {
    this.liveData$ = interval(1000).pipe(
      startWith(0),
      map(() => this.generateDataPoint())
    );
  }

  private generateDataPoint() {
    // Generate real-time data
    return { timestamp: new Date(), value: Math.random() * 100 };
  }
}
```

### Theming and Customization

Match your charts to your application's design system with comprehensive theming options:

```typescript [chart-theme.ts]
export const customChartTheme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    neutral: '#6b7280'
  },
  tooltip: {
    backgroundColor: '#1f2937',
    textColor: '#ffffff',
    borderRadius: '8px'
  },
  legend: {
    position: 'bottom',
    alignment: 'center'
  },
  grid: {
    strokeColor: 'rgba(107, 114, 128, 0.2)',
    strokeWidth: 1
  }
};
```

### Interactive Tooltips

Provide rich contextual information with customizable tooltips:

```typescript [tooltip-example.component.ts]
@Component({
  selector: 'app-tooltip-example',
  template: `
    <bar-chart
      [data]="salesData"
      [height]="300"
      [categories]="categories"
      [tooltipTemplate]="customTooltip">
    </bar-chart>

    <ng-template #customTooltip let-data>
      <div class="custom-tooltip">
        <h4>{{ data.category }}</h4>
        <p>Value: {{ data.value | number }}</p>
        <p>Growth: {{ data.growth }}%</p>
      </div>
    </ng-template>
  `
})
export class TooltipExampleComponent {
  // Component implementation
}
```

## Best Practices for Angular Charts

### 1. Optimize for Performance

When working with large datasets, consider these performance optimizations:

- **Use OnPush Change Detection:** Improve performance by using `ChangeDetectionStrategy.OnPush` for chart components.
- **Implement Virtual Scrolling:** For dashboards with multiple charts, use Angular CDK's virtual scrolling.
- **Debounce Data Updates:** When handling real-time data, debounce updates to prevent excessive re-renders.

### 2. Ensure Accessibility

Make your charts accessible to all users:

- Provide meaningful `aria-label` attributes for chart containers.
- Include alternative text descriptions for screen readers.
- Ensure sufficient color contrast for all chart elements.
- Support keyboard navigation for interactive chart features.

### 3. Responsive Design Patterns

Create charts that work on all devices:

```typescript [responsive-chart.component.ts]
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-responsive-chart',
  template: `
    <area-chart
      [data]="data"
      [height]="chartHeight"
      [categories]="categories">
    </area-chart>
  `
})
export class ResponsiveChartComponent {
  chartHeight = 300;

  @HostListener('window:resize')
  onResize() {
    this.chartHeight = window.innerWidth < 768 ? 200 : 300;
  }
}
```

### 4. Data Formatting and Localization

Support international users with proper formatting:

```typescript [localized-chart.component.ts]
import { Component, LOCALE_ID, Inject } from '@angular/core';
import { formatNumber, formatDate } from '@angular/common';

@Component({
  selector: 'app-localized-chart',
  template: `
    <line-chart
      [data]="data"
      [height]="300"
      [categories]="categories"
      [yFormatter]="currencyFormatter"
      [xFormatter]="dateFormatter">
    </line-chart>
  `
})
export class LocalizedChartComponent {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  currencyFormatter = (value: number): string => {
    return formatNumber(value, this.locale, '1.0-2');
  };

  dateFormatter = (tick: number): string => {
    return formatDate(this.data[tick].date, 'MMM d', this.locale);
  };
}
```

## Use Cases for Angular Charts

### SaaS Analytics Dashboards

Build comprehensive analytics dashboards showing user engagement, conversion rates, and revenue metrics. Angular Charts' reactive nature makes it perfect for displaying real-time SaaS metrics.

### Financial Applications

Create financial dashboards with stock charts, portfolio performance tracking, and market analysis visualizations. Support for multiple data series and time-based axes makes financial data visualization intuitive.

### IoT and Monitoring Systems

Display sensor data, system metrics, and monitoring dashboards with real-time updates. Integration with WebSockets and RxJS enables smooth streaming data visualization.

### E-commerce Platforms

Visualize sales trends, inventory levels, customer behavior, and marketing performance. Bar charts and area charts help identify patterns and opportunities.

## Learn More

Ready to start building beautiful data visualizations for your Angular applications? Explore our comprehensive documentation:

*   [Installation Guide](/docs/getting-started/installation) - Detailed setup instructions
*   [Chart Types](/docs/charts/area-chart) - Explore all available chart types
*   [Customization](/docs/customize/tooltips) - Learn how to style and customize your charts
*   [Examples](/charts) - Browse our gallery of chart examples

Start creating stunning Angular charts today and transform how your users interact with data.
