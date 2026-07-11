/**
 * Block category configuration
 * This is the single source of truth for block categories.
 * When adding a new block category:
 * 1. Create the component folder in app/components/Blocks/{FolderName}/
 * 2. Create the category wrapper component: app/components/Blocks/{FolderName}.vue
 * 3. Add the configuration here
 */

export interface BlockCategoryConfig {
  slug: string
  title: string
  folderName: string
  componentName: string
  icon: string
  description: string
  image?: string
  imageLight?: string
  new?: boolean
  count?: number
}

export const BLOCK_CATEGORIES: BlockCategoryConfig[] = [
  {
    slug: 'area-charts',
    title: 'Area Charts',
    folderName: 'AreaCharts',
    componentName: 'BlocksAreaCharts',
    icon: 'i-lucide-chart-area',
    image: '/images/blocks/blocks-area.svg',
    description: 'Beautiful area visualizations for analytics',
    count: 12
  },
  {
    slug: 'bar-charts',
    title: 'Bar Charts',
    folderName: 'BarCharts',
    componentName: 'BlocksBarCharts',
    icon: 'i-lucide-chart-column-increasing',
    image: '/images/blocks/blocks-bar.svg',
    imageLight: '/images/blocks/blocks-bar-light.svg',
    description: 'Professional bar charts for data comparison',
    count: 11
  },
  {
    slug: 'line-charts',
    title: 'Line Charts',
    folderName: 'LineCharts',
    componentName: 'BlocksLineCharts',
    icon: 'i-lucide-chart-line',
    image: '/images/blocks/blocks-line.svg',
    description: 'Elegant line charts for trend analysis',
    count: 9
  },
  {
    slug: 'donut-charts',
    title: 'Donut Charts',
    folderName: 'DonutCharts',
    componentName: 'BlocksDonutCharts',
    icon: 'i-lucide-donut',
    image: '/images/blocks/blocks-donut.svg',
    description: 'Modern donut charts for data distribution',
    count: 5
  },
  {
    slug: 'dashboard/navbar',
    title: 'Dashboard Navbar',
    folderName: 'Dashboard/Navbar',
    componentName: 'BlocksDashboardNavbar',
    icon: 'i-lucide-chart-spline',
    image: '/images/blocks/blocks-dashboard-navbar.svg',
    description: 'Complete analytics dashboard layouts',
    count: 4,
    new: true
  },
  {
    slug: 'status',
    title: 'Status & Uptime',
    folderName: 'StatusUptime',
    componentName: 'BlocksStatusUptime',
    icon: 'i-lucide-bell',
    image: '/images/blocks/blocks-status.svg',
    description: 'Status indicators and uptime monitoring',
    count: 6
  },
  {
    slug: 'calendar',
    title: 'Calendar',
    folderName: 'Calendar',
    componentName: 'BlocksCalendar',
    icon: 'i-lucide-calendar',
    image: '/images/blocks/blocks-calendar.svg',
    description: 'Calendar components and date pickers',
    count: 4
  },
  {
    slug: 'ai',
    title: 'AI',
    folderName: 'AI',
    componentName: 'BlocksAI',
    icon: 'i-lucide-brain-circuit',
    image: '/images/blocks/blocks-ai.svg',
    description: 'AI-powered components and interfaces',
    count: 2
  },
  {
    slug: 'bar-lists',
    title: 'Bar Lists',
    folderName: 'BarLists',
    componentName: 'BlocksBarLists',
    icon: 'i-lucide-list',
    image: '/images/blocks/blocks-bar-list.svg',
    description: 'Interactive progress and ranking lists',
    count: 4
  },
  {
    slug: 'cards',
    title: 'Cards',
    folderName: 'Cards',
    componentName: 'BlocksCards',
    icon: 'i-lucide-gallery-vertical',
    image: '/images/blocks/blocks-cards.svg',
    description: 'Versatile card layouts for any content',
    count: 10,
    new: true
  },
  {
    slug: 'account-users',
    title: 'Account & Users',
    folderName: 'AccountUsers',
    componentName: 'BlocksAccountUsers',
    icon: 'i-lucide-users',
    image: '/images/blocks/blocks-account-users.svg',
    description: 'User management and profile components',
    count: 9
  },
  {
    slug: 'pricing-tables',
    title: 'Pricing Tables',
    folderName: 'PricingTables',
    componentName: 'BlocksPricingTables',
    icon: 'i-lucide-layout-grid',
    image: '/images/blocks/blocks-pricing-tables.svg',
    description: 'Pricing tables & sections',
    count: 4
  },
  {
    slug: 'application/onboarding',
    title: 'Onboarding',
    folderName: 'Application',
    componentName: 'BlocksApplication',
    icon: 'i-lucide-layout-grid',
    image: '/images/blocks/blocks-applications.svg',
    description: 'Application layouts & components',
    count: 1,
    new: true
  },
  {
    slug: 'application/file-upload',
    title: 'File Upload',
    folderName: 'FileUpload',
    componentName: 'BlocksFileUpload',
    icon: 'i-lucide-upload',
    image: '/images/blocks/blocks-applications.svg',
    description: 'File Upload Components',
    count: 1,
    new: true
  },
  {
    slug: 'combo-charts',
    title: 'Combo Charts',
    folderName: 'ComboCharts',
    componentName: 'BlocksComboCharts',
    icon: 'i-lucide-combine',
    image: '/images/blocks/blocks-combo.svg',
    description: 'Dual-axis bar and line charts for mixed metrics',
    count: 2,
    new: true
  },
  {
    slug: 'sparklines',
    title: 'Sparklines',
    folderName: 'Sparklines',
    componentName: 'BlocksSparklines',
    icon: 'i-lucide-activity',
    image: '/images/blocks/blocks-sparkline.svg',
    description: 'Compact inline trend charts for dense dashboards',
    count: 3,
    new: true
  },
  {
    slug: 'stat-tiles',
    title: 'Stat Tiles',
    folderName: 'StatTiles',
    componentName: 'BlocksStatTiles',
    icon: 'i-lucide-gauge',
    image: '/images/blocks/blocks-stat-tile.svg',
    description: 'KPI cards with value, trend and inline sparkline',
    count: 3,
    new: true
  },
  {
    slug: 'heatmaps',
    title: 'Heatmaps',
    folderName: 'Heatmaps',
    componentName: 'BlocksHeatmaps',
    icon: 'i-lucide-grid-3x3',
    image: '/images/blocks/blocks-heatmap.svg',
    description: 'GitHub-style contribution and activity heatmaps',
    count: 2,
    new: true
  }
  // {
  //   slug: 'bubble-charts',
  //   title: 'Bubble Charts',
  //   folderName: 'BubbleCharts',
  //   componentName: 'BlocksBubbleCharts',
  //   icon: 'i-lucide-circle-dot',
  //   description: 'Bubble visualizations for multi-dimensional data',
  //   count: 1
  // }
]

// Create lookup maps for quick access
export const SLUG_TO_CONFIG = new Map(
  BLOCK_CATEGORIES.map(config => [config.slug, config])
)

export const FOLDER_TO_CONFIG = new Map(
  BLOCK_CATEGORIES.map(config => [config.folderName, config])
)

// Helper to get category by slug
export function getCategoryBySlug(slug: string): BlockCategoryConfig | undefined {
  return SLUG_TO_CONFIG.get(slug)
}

// Helper to get all navigation items
export function getBlockNavigationItems() {
  return BLOCK_CATEGORIES.map(config => ({
    label: config.title,
    path: `/blocks/${config.slug}`,
    icon: config.icon,
    image: config.image,
    imageLight: config.imageLight,
    description: config.description,
    count: 0, // Will be populated dynamically
    new: config.new
  }))
}
