import { PriceEnum } from '~~/utils/ProductMap'

export const nuxtDashboardContent = {
  priceKey: PriceEnum.NuxtDashboard,
  seo: {
    title:
      'Nuxt Dashboard Admin Template - Premium Nuxt Admin Dashboard with Nuxt UI & Nuxt Charts',
    description:
      'Transform your data into actionable insights with our premium Nuxt Dashboard Admin Template. Built with Nuxt UI v3, Tailwind CSS, and Nuxt Charts. Includes multiple dashboards, chart examples, and more.',
    ogTitle:
      'Nuxt Dashboard Admin Template - Premium Nuxt Admin Dashboard with Nuxt UI & Nuxt Charts',
    ogDescription:
      'Transform your data into actionable insights with our premium Nuxt Dashboard Admin Template. Built with Nuxt UI v3, Tailwind CSS, and Nuxt Charts. Includes multiple dashboards, chart examples, and more.',
    ogImageUrl: 'https://nuxtcharts.com/images/og/dashboard.png?v=1',
    ogImageType: 'image/png',
    ogImageWidth: 1200,
    ogImageHeight: 630,
    twitterCard: 'summary_large_image',
    twitterTitle:
      'Nuxt Dashboard Template - Premium Nuxt Admin Dashboard with Nuxt UI & Nuxt Charts',
    twitterDescription:
      'Transform your data into actionable insights with our premium Nuxt Dashboard Template. Built with Nuxt UI v3, Tailwind CSS, and Nuxt Charts. Includes multiple dashboards, chart examples, and more.',
    twitterImage: 'https://nuxtcharts.com/images/og/dashboard.png?v=1',
    twitterImageAlt:
      'Nuxt Dashboard Template - Premium Nuxt Admin Dashboard with Nuxt UI & Nuxt Charts',
    twitterCreator: '@DennisAdriaans'
  },
  hero: {
    heading: 'Nuxt Dashboard Admin Template',
    subheading:
      'Build stunning admin dashboards in minutes. Complete with charts, tables and 6+ pre-built layouts.',
    cta: {
      label: 'Buy Now for $99',
      icon: 'i-lucide-download',
      disabled: false
    },
    demoCita: {
      label: 'View Demo',
      icon: 'i-lucide-monitor-speaker',
      href: 'https://nuxt-dashboard-demo.nuxtcharts.com'
    },
    badges: ['Vue 3', 'Nuxt 3', 'TypeScript', 'Tailwind CSS', 'Nuxt UI']
  },
  banner: '/images/dashboard-banner.png',
  stats: [
    {
      value: '1000+',
      label: 'Downloads',
      icon: 'i-lucide-download'
    },
    {
      value: '6+',
      label: 'Dashboard Layouts',
      icon: 'i-lucide-layout-dashboard'
    },
    {
      value: '20+',
      label: 'Chart Types',
      icon: 'i-lucide-bar-chart-3'
    },
    {
      value: '4.9',
      label: 'User Rating',
      icon: 'i-lucide-star'
    }
  ],
  testimonials: [
    {
      name: 'David',
      role: 'Nuxt Developer',
      avatar: '/images/avatars/sarah.jpg',
      content:
        'I\'m thrilled with the premium Charts module and happy to support it! As I rebuild Greenmeister, I\'m eager to use your dashboard templates.',
      rating: 5
    },
    {
      name: 'Matthew',
      role: 'Nuxt Developer',
      avatar: '/images/avatars/mike.jpg',
      content:
        'I just invested in Nuxt Dashboard, the dragging functionality is 10/10! I had some difficulties with GitHub access. But everything worked out great!',
      rating: 5
    },
    {
      name: 'Emma',
      role: 'Nuxt Developer',
      avatar: '/images/avatars/emma.jpg',
      content:
        'The chart components are awesome. Easy to integrate and are beautiful out of the box. Will add them soon to my current project.',
      rating: 5
    }
  ],
  features: [
    {
      title: '6+ Dashboards',
      text: 'Multiple pre-built dashboard layouts for analytics, sales, projects, and more.',
      icon: 'i-lucide-layout-dashboard'
    },
    {
      title: 'User Management',
      text: 'Manage users, roles, and permissions with a secure user system.',
      icon: 'i-lucide-users'
    },
    {
      title: 'Billing & Invoice Components',
      text: 'Integrated billing and invoicing UI components for seamless transactions.',
      icon: 'i-lucide-receipt'
    },
    {
      title: 'Pricing Tables',
      text: 'Beautiful and customizable pricing tables for your SaaS or product.',
      icon: 'i-lucide-table'
    },
    {
      title: 'Kanban Board',
      text: 'Organize tasks and workflows visually with a drag-and-drop Kanban board.',
      icon: 'i-lucide-kanban'
    },
    {
      title: 'Project Timeline',
      text: 'Track project milestones and deadlines with an interactive timeline.',
      icon: 'i-lucide-milestone'
    },
    {
      title: 'Calendar Component',
      text: 'Schedule events and manage appointments with a modern calendar UI.',
      icon: 'i-lucide-calendar'
    },
    {
      title: 'Settings Management',
      text: 'Easily configure and manage dashboard settings and preferences.',
      icon: 'i-lucide-settings'
    }
  ],
  galleryTitle: 'Dashboard Gallery',
  galleryDescription:
    'Explore our collection of beautifully crafted dashboard layouts. Click any image to view it in full size.'
  // Add more static content as needed for features, testimonials, etc.
}
