import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZoneChangeDetection } from '@angular/core';
import { AreaChartComponent, AreaChartCategory } from './area-chart.component';
import { CurveType } from '@unovis/ts';

interface TestData {
  month: string;
  sales: number;
  profit: number;
}

describe('AreaChartComponent', () => {
  let component: AreaChartComponent<TestData>;
  let fixture: ComponentFixture<AreaChartComponent<TestData>>;

  const testData: TestData[] = [
    { month: 'Jan', sales: 100, profit: 50 },
    { month: 'Feb', sales: 120, profit: 55 },
    { month: 'Mar', sales: 180, profit: 80 },
    { month: 'Apr', sales: 110, profit: 40 },
    { month: 'May', sales: 90, profit: 30 },
  ];

  const testCategories: Record<string, AreaChartCategory> = {
    sales: {
      name: 'Sales',
      color: '#3b82f6',
    },
    profit: {
      name: 'Profit',
      color: '#10b981',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaChartComponent],
      providers: [provideZoneChangeDetection({ eventCoalescing: true })],
    }).compileComponents();

    fixture = TestBed.createComponent(AreaChartComponent<TestData>);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('data', testData);
    fixture.componentRef.setInput('categories', testCategories);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Basic rendering', () => {
    it('should render with required inputs', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.ngx-chrts-container');
      expect(container).toBeTruthy();
    });

    it('should apply height from input', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('height', 350);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.ngx-chrts-container');
      expect(container.style.height).toBe('350px');
    });

    it('should use default height when not provided', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.ngx-chrts-container');
      expect(container.style.height).toBe('280px');
    });
  });

  describe('Data updates', () => {
    it('should handle data updates', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.detectChanges();

      expect(component.data()).toEqual(testData);

      const newData = [
        { month: 'Jun', sales: 150, profit: 70 },
        { month: 'Jul', sales: 160, profit: 75 },
      ];
      fixture.componentRef.setInput('data', newData);
      fixture.detectChanges();

      expect(component.data()).toEqual(newData);
    });

    it('should handle empty data array', () => {
      fixture.componentRef.setInput('data', []);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.detectChanges();

      expect(component.data()).toEqual([]);
    });
  });

  describe('Curve type', () => {
    it('should use default curve type MonotoneX', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.detectChanges();

      expect(component.curveType()).toBe(CurveType.MonotoneX);
    });

    it('should apply custom curve type', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('curveType', CurveType.Linear);
      fixture.detectChanges();

      expect(component.curveType()).toBe(CurveType.Linear);
    });

    it('should update curve type', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('curveType', CurveType.MonotoneX);
      fixture.detectChanges();

      expect(component.curveType()).toBe(CurveType.MonotoneX);

      fixture.componentRef.setInput('curveType', CurveType.Step);
      fixture.detectChanges();

      expect(component.curveType()).toBe(CurveType.Step);
    });
  });

  describe('Line styling', () => {
    it('should use default line width', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.detectChanges();

      expect(component.lineWidth()).toBe(2);
    });

    it('should apply custom line width', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('lineWidth', 4);
      fixture.detectChanges();

      expect(component.lineWidth()).toBe(4);
    });

    it('should handle line dash array', () => {
      const dashArray = [
        [5, 5],
        [10, 5],
      ];
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('lineDashArray', dashArray);
      fixture.detectChanges();

      expect(component.lineDashArray()).toEqual(dashArray);
    });
  });

  describe('Axis configuration', () => {
    it('should apply axis labels', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('xLabel', 'Month');
      fixture.componentRef.setInput('yLabel', 'Value');
      fixture.detectChanges();

      expect(component.xLabel()).toBe('Month');
      expect(component.yLabel()).toBe('Value');
    });

    it('should apply number of ticks', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('xNumTicks', 5);
      fixture.componentRef.setInput('yNumTicks', 10);
      fixture.detectChanges();

      expect(component.xNumTicks()).toBe(5);
      expect(component.yNumTicks()).toBe(10);
    });

    it('should handle minMaxTicksOnly', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('minMaxTicksOnly', true);
      fixture.detectChanges();

      expect(component.minMaxTicksOnly()).toBe(true);
    });
  });

  describe('Grid and domain lines', () => {
    it('should use default grid line values', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.detectChanges();

      expect(component.xGridLine()).toBe(true);
      expect(component.yGridLine()).toBe(true);
      expect(component.xDomainLine()).toBe(true);
      expect(component.yDomainLine()).toBe(true);
    });

    it('should apply custom grid line settings', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('xGridLine', false);
      fixture.componentRef.setInput('yGridLine', false);
      fixture.detectChanges();

      expect(component.xGridLine()).toBe(false);
      expect(component.yGridLine()).toBe(false);
    });

    it('should apply custom domain line settings', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('xDomainLine', false);
      fixture.componentRef.setInput('yDomainLine', false);
      fixture.detectChanges();

      expect(component.xDomainLine()).toBe(false);
      expect(component.yDomainLine()).toBe(false);
    });

    it('should apply custom tick line settings', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('xTickLine', false);
      fixture.componentRef.setInput('yTickLine', false);
      fixture.detectChanges();

      expect(component.xTickLine()).toBe(false);
      expect(component.yTickLine()).toBe(false);
    });
  });

  describe('Visibility toggles', () => {
    it('should handle hideArea', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('hideArea', true);
      fixture.detectChanges();

      expect(component.hideArea()).toBe(true);
    });

    it('should handle hideXAxis', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('hideXAxis', true);
      fixture.detectChanges();

      expect(component.hideXAxis()).toBe(true);
    });

    it('should handle hideYAxis', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('hideYAxis', true);
      fixture.detectChanges();

      expect(component.hideYAxis()).toBe(true);
    });
  });

  describe('Domains', () => {
    it('should apply xDomain', () => {
      const xDomain: [number | undefined, number | undefined] = [0, 10];
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('xDomain', xDomain);
      fixture.detectChanges();

      expect(component.xDomain()).toEqual(xDomain);
    });

    it('should apply yDomain', () => {
      const yDomain: [number | undefined, number | undefined] = [0, 200];
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('yDomain', yDomain);
      fixture.detectChanges();

      expect(component.yDomain()).toEqual(yDomain);
    });
  });

  describe('Padding', () => {
    it('should use default padding', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.detectChanges();

      expect(component.padding()).toEqual({ top: 5, right: 5, bottom: 5, left: 5 });
    });

    it('should apply custom padding', () => {
      const padding = { top: 10, right: 20, bottom: 10, left: 20 };
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('padding', padding);
      fixture.detectChanges();

      expect(component.padding()).toEqual(padding);
    });
  });

  describe('Stacked mode', () => {
    it('should use default non-stacked mode', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.detectChanges();

      expect(component.stacked()).toBe(false);
    });

    it('should enable stacked mode', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('stacked', true);
      fixture.detectChanges();

      expect(component.stacked()).toBe(true);
    });

    it('should toggle stacked mode', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('stacked', false);
      fixture.detectChanges();

      expect(component.stacked()).toBe(false);

      fixture.componentRef.setInput('stacked', true);
      fixture.detectChanges();

      expect(component.stacked()).toBe(true);
    });
  });

  describe('Gradient stops', () => {
    it('should use default gradient stops', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.detectChanges();

      expect(component.gradientStops()).toEqual([
        { offset: '0%', stopOpacity: 1 },
        { offset: '75%', stopOpacity: 0 },
      ]);
    });

    it('should apply custom gradient stops', () => {
      const customStops = [
        { offset: '0%', stopOpacity: 1 },
        { offset: '50%', stopOpacity: 0.5 },
        { offset: '100%', stopOpacity: 0 },
      ];
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('gradientStops', customStops);
      fixture.detectChanges();

      expect(component.gradientStops()).toEqual(customStops);
    });
  });

  describe('Categories', () => {
    it('should handle categories with colors', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.detectChanges();

      expect(component.categories()).toEqual(testCategories);
    });

    it('should handle categories without colors', () => {
      const categoriesWithoutColor: Record<string, AreaChartCategory> = {
        sales: { name: 'Sales' },
        profit: { name: 'Profit' },
      };
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', categoriesWithoutColor);
      fixture.detectChanges();

      expect(component.categories()).toEqual(categoriesWithoutColor);
    });

    it('should handle category updates', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.detectChanges();

      const newCategories: Record<string, AreaChartCategory> = {
        sales: { name: 'Updated Sales', color: '#ff0000' },
        profit: { name: 'Updated Profit', color: '#00ff00' },
      };
      fixture.componentRef.setInput('categories', newCategories);
      fixture.detectChanges();

      expect(component.categories()).toEqual(newCategories);
    });
  });

  describe('Formatters', () => {
    it('should apply xFormatter', () => {
      const xFormatter = (tick: number) => `Month ${tick}`;
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('xFormatter', xFormatter);
      fixture.detectChanges();

      expect(component.xFormatter()).toBe(xFormatter);
    });

    it('should apply yFormatter', () => {
      const yFormatter = (tick: number) => `$${tick}`;
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('yFormatter', yFormatter);
      fixture.detectChanges();

      expect(component.yFormatter()).toBe(yFormatter);
    });

    it('should handle xKey for tick formatting', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.componentRef.setInput('xKey', 'month');
      fixture.detectChanges();

      expect(component.xKey()).toBe('month');
    });
  });

  describe('Component lifecycle', () => {
    it('should clean up on destroy', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.detectChanges();

      // Just verify that destroy doesn't throw errors
      expect(() => {
        fixture.destroy();
      }).not.toThrow();
    });

    it('should handle changes after initialization', () => {
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('categories', testCategories);
      fixture.detectChanges();

      // Update height
      fixture.componentRef.setInput('height', 400);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.ngx-chrts-container');
      expect(container.style.height).toBe('400px');
    });
  });
});
