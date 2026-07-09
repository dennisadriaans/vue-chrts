---
title: Laravel Charts - Interactive Data Visualization for Laravel Applications
description: Create stunning, interactive charts in your Laravel applications with Inertia.js and Livewire. Build beautiful dashboards with area charts, bar charts, line charts, and donut charts.
seo:
  title: Laravel Charts - Beautiful Data Visualization for Laravel, Inertia & Livewire
  description: A powerful chart library for Laravel applications. Build interactive dashboards with Inertia.js and Livewire. Create beautiful area charts, bar charts, line charts, and donut charts.
---

# Laravel Charts

Build beautiful, interactive data visualizations for your Laravel applications. Whether you're using Inertia.js with Vue or React, or building with Livewire, Laravel Charts provides seamless integration to present complex data in clear, engaging ways.

## Why Choose Laravel Charts

Laravel Charts is designed to integrate perfectly with the Laravel ecosystem, supporting both Inertia.js and Livewire workflows while maintaining the elegant developer experience Laravel is known for.

*   **Inertia.js Integration:** Seamlessly use charts in your Inertia.js applications with Vue or React. Pass data directly from controllers to chart components.
*   **Livewire Support:** Build reactive charts with Livewire. Update chart data without page refreshes using Livewire's reactive properties.
*   **Eloquent-Ready:** Transform Eloquent collections directly into chart data. Use Laravel's query builder to aggregate and prepare visualization data.
*   **Beautiful by Default:** Charts look stunning out of the box with a modern, clean design that matches Laravel's aesthetic philosophy.
*   **Highly Customizable:** Tailor every aspect—colors, labels, tooltips, legends—to match your application's design system.

## Chart Types for Every Laravel Application

Laravel Charts provides a comprehensive set of chart types perfect for admin panels, dashboards, and data-driven applications:

### Area Charts

Ideal for showing trends over time in your Laravel applications. Perfect for tracking user registrations, revenue growth, and performance metrics.

### Bar Charts

Compare data across categories with vertical or horizontal bar charts. Great for displaying monthly reports, category distributions, and comparative analytics.

### Line Charts

The classic choice for time series data in dashboards. Display API usage, user activity, and system metrics with clean line visualizations.

### Donut Charts

Display proportions and distributions elegantly. Perfect for showing market share, budget allocation, and category breakdowns.

## Examples

<ExamplesChartShowcase></ExamplesChartShowcase>

## Getting Started with Laravel Charts

Integrating Laravel Charts into your Laravel project is straightforward, whether you're using Inertia.js or Livewire.

### Installation

Install Laravel Charts using Composer:

::code-group
```bash [Composer]
composer require laravel-charts/charts
```
```bash [npm (for Inertia)]
npm install laravel-charts
```
::

Publish the configuration file:

```bash
php artisan vendor:publish --tag=laravel-charts-config
```

## Inertia.js Integration

Laravel Charts works beautifully with Inertia.js, allowing you to pass data from your Laravel controllers directly to Vue or React chart components.

### Controller Setup

Pass chart data from your Laravel controllers:

```php [app/Http/Controllers/DashboardController.php]
<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $salesData = Order::query()
            ->selectRaw('DATE(created_at) as date')
            ->selectRaw('SUM(total) as revenue')
            ->selectRaw('COUNT(*) as orders')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => [
                'date' => $row->date,
                'revenue' => (float) $row->revenue,
                'orders' => (int) $row->orders,
            ]);

        return Inertia::render('Dashboard', [
            'salesData' => $salesData,
        ]);
    }
}
```

### Vue Component with Inertia

Use the chart data in your Vue component:

```vue [resources/js/Pages/Dashboard.vue]
<script setup lang="ts">
import { computed } from 'vue';
import { AreaChart, LegendPosition, CurveType } from 'laravel-charts';

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

const props = defineProps<{
  salesData: SalesData[];
}>();

const categories = computed(() => ({
  revenue: {
    name: 'Revenue',
    color: '#3b82f6',
  },
  orders: {
    name: 'Orders',
    color: '#22c55e',
  },
}));

const xFormatter = (tick: number): string => {
  const date = new Date(props.salesData[tick]?.date);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
</script>

<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Sales Dashboard</h2>
    
    <AreaChart
      :data="salesData"
      :height="300"
      :categories="categories"
      :y-grid-line="true"
      :x-formatter="xFormatter"
      :curve-type="CurveType.MonotoneX"
      :legend-position="LegendPosition.TopRight"
    />
  </div>
</template>
```

## Livewire Integration

Laravel Charts also integrates seamlessly with Livewire for reactive, real-time chart updates without writing JavaScript.

### Livewire Component

Create a Livewire component for your dashboard:

```php [app/Livewire/SalesChart.php]
<?php

namespace App\Livewire;

use App\Models\Order;
use Carbon\Carbon;
use Livewire\Component;

class SalesChart extends Component
{
    public string $period = '30';
    
    public function getChartDataProperty(): array
    {
        return Order::query()
            ->selectRaw('DATE(created_at) as date')
            ->selectRaw('SUM(total) as revenue')
            ->where('created_at', '>=', Carbon::now()->subDays((int) $this->period))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => [
                'date' => $row->date,
                'revenue' => (float) $row->revenue,
            ])
            ->toArray();
    }

    public function render()
    {
        return view('livewire.sales-chart');
    }
}
```

### Livewire Blade View

Create the corresponding Blade view with the chart:

```blade [resources/views/livewire/sales-chart.blade.php]
<div>
    <div class="mb-4">
        <select wire:model.live="period" class="rounded border-gray-300">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
        </select>
    </div>

    <x-area-chart
        :data="$this->chartData"
        :height="300"
        :categories="[
            'revenue' => ['name' => 'Revenue', 'color' => '#3b82f6'],
        ]"
        :y-grid-line="true"
    />
</div>
```

## Working with Eloquent Data

Laravel Charts makes it easy to transform Eloquent data into chart-ready formats.

### Aggregating Data with Eloquent

```php [app/Services/ChartDataService.php]
<?php

namespace App\Services;

use App\Models\User;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class ChartDataService
{
    public function getUserRegistrations(int $days = 30): Collection
    {
        return User::query()
            ->selectRaw('DATE(created_at) as date')
            ->selectRaw('COUNT(*) as registrations')
            ->where('created_at', '>=', Carbon::now()->subDays($days))
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    public function getRevenueByCategory(): Collection
    {
        return Order::query()
            ->join('products', 'orders.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->selectRaw('categories.name as category')
            ->selectRaw('SUM(orders.total) as revenue')
            ->groupBy('categories.name')
            ->orderByDesc('revenue')
            ->get();
    }

    public function getMonthlyComparison(): Collection
    {
        return Order::query()
            ->selectRaw('MONTH(created_at) as month')
            ->selectRaw('YEAR(created_at) as year')
            ->selectRaw('SUM(total) as revenue')
            ->selectRaw('COUNT(*) as orders')
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();
    }
}
```

### Using the Service in Controllers

```php [app/Http/Controllers/AnalyticsController.php]
<?php

namespace App\Http\Controllers;

use App\Services\ChartDataService;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function __construct(
        private ChartDataService $chartService
    ) {}

    public function index()
    {
        return Inertia::render('Analytics', [
            'userRegistrations' => $this->chartService->getUserRegistrations(),
            'revenueByCategory' => $this->chartService->getRevenueByCategory(),
            'monthlyComparison' => $this->chartService->getMonthlyComparison(),
        ]);
    }
}
```

## Advanced Features

### Real-Time Updates with Laravel Echo

Combine Laravel Charts with Laravel Echo for real-time dashboard updates:

```vue [resources/js/Pages/LiveDashboard.vue]
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { LineChart } from 'laravel-charts';

const liveData = ref([]);

onMounted(() => {
  window.Echo.channel('dashboard')
    .listen('MetricUpdated', (event) => {
      liveData.value.push({
        timestamp: event.timestamp,
        value: event.value,
      });
      
      // Keep last 50 data points
      if (liveData.value.length > 50) {
        liveData.value.shift();
      }
    });
});
</script>

<template>
  <LineChart
    :data="liveData"
    :height="300"
    :categories="{ value: { name: 'Real-time Metric', color: '#8b5cf6' } }"
    :animated="true"
  />
</template>
```

### Exporting Charts

Add export functionality to your Laravel dashboards:

```php [app/Http/Controllers/ExportController.php]
<?php

namespace App\Http\Controllers;

use App\Services\ChartDataService;
use Illuminate\Http\Response;

class ExportController extends Controller
{
    public function exportCsv(ChartDataService $chartService)
    {
        $data = $chartService->getMonthlyComparison();
        
        $csv = "Month,Year,Revenue,Orders\n";
        foreach ($data as $row) {
            $csv .= "{$row->month},{$row->year},{$row->revenue},{$row->orders}\n";
        }
        
        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="report.csv"');
    }
}
```

## Best Practices for Laravel Charts

### 1. Cache Chart Data

Improve performance by caching expensive queries:

```php [app/Services/ChartDataService.php]
use Illuminate\Support\Facades\Cache;

public function getUserRegistrations(int $days = 30): Collection
{
    return Cache::remember("chart.registrations.{$days}", 3600, function () use ($days) {
        return User::query()
            ->selectRaw('DATE(created_at) as date')
            ->selectRaw('COUNT(*) as registrations')
            ->where('created_at', '>=', Carbon::now()->subDays($days))
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    });
}
```

### 2. Use Database Indexes

Ensure your database tables have proper indexes for chart queries:

```php [database/migrations/add_chart_indexes.php]
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->index('created_at');
            $table->index(['created_at', 'total']);
        });
    }
};
```

### 3. Validate Date Ranges

Always validate user input for date-based charts:

```php [app/Http/Requests/ChartRequest.php]
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChartRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'start_date' => 'required|date|before:end_date',
            'end_date' => 'required|date|after:start_date|before_or_equal:today',
            'period' => 'sometimes|in:7,30,90,365',
        ];
    }
}
```

### 4. Handle Empty Data Gracefully

Always provide fallback UI for empty datasets:

```vue [resources/js/Components/ChartWrapper.vue]
<script setup>
defineProps(['data', 'title']);
</script>

<template>
  <div class="chart-wrapper">
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    
    <div v-if="data && data.length > 0">
      <slot />
    </div>
    
    <div v-else class="flex items-center justify-center h-64 bg-gray-50 rounded">
      <p class="text-gray-500">No data available for the selected period</p>
    </div>
  </div>
</template>
```

## Use Cases for Laravel Charts

### Admin Dashboards

Build comprehensive admin panels with Laravel Charts. Display user metrics, content statistics, and system health all in one place.

### E-commerce Analytics

Track sales performance, inventory levels, and customer behavior. Visualize revenue trends, product performance, and conversion funnels.

### SaaS Applications

Monitor subscription metrics, feature usage, and customer engagement. Build investor-ready dashboards with clear data visualizations.

### CRM Systems

Visualize sales pipelines, deal progression, and team performance. Create reports that help sales teams make data-driven decisions.

## Learn More

Ready to start building beautiful data visualizations for your Laravel applications? Explore our comprehensive documentation:

*   [Installation Guide](/docs/getting-started/installation) - Detailed setup instructions
*   [Chart Types](/docs/charts/area-chart) - Explore all available chart types
*   [Customization](/docs/customize/tooltips) - Learn how to style and customize your charts
*   [Examples](/charts) - Browse our gallery of chart examples

Start creating stunning Laravel charts today and transform how your users interact with data.
