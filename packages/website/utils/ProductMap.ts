export enum PriceEnum {
  AllAccessPassLegacy = 'price_1RBgovAcM5RqVNgOjoxuNq4r',
  AllAccessPass = 'price_1SE5wNAcM5RqVNgOZZLQvt6J',
  NuxtDashboard = 'price_1RVrMYAcM5RqVNgOyfKk2ITX',
  NuxtDashboard2 = 'price_1SMXwbAcM5RqVNgOpvcTqAuC',
  NuxtEcommerceDashboard = 'price_1RhrhIAcM5RqVNgOiCti4uLu',
  NuxtPlanner = 'price_1SklKJAcM5RqVNgOlKvkccG9',
  NuxtSimplistic = 'price_1SE5tSAcM5RqVNgO0UmFDF01',
  NuxtShadcnDashboard = 'price_1SSeBhAcM5RqVNgOh02KSa67',
  NuxtUIThemeEditor = 'price_1ShDcWAcM5RqVNgODbJkBs3y',
  NuxtChartsTeams = 'price_1Sb4eaAcM5RqVNgO0PXYvtHM',
  NuxtCleanGrayDashboard = 'price_1SyWwbAcM5RqVNgO7ZUouqdn',
  NuxtHRTheme = 'price_1TAnNdAcM5RqVNgO6xaVH53t',
  NuxtApplicationTheme = 'price_1TAoofAcM5RqVNgOSNoXihIC'
}

export const ProductMap: Record<string, { title: string, slug: string }> = {
  [PriceEnum.AllAccessPass]: {
    title: 'All-Access Pass',
    slug: 'all-access-pass'
  },
  [PriceEnum.AllAccessPassLegacy]: {
    title: 'All-Access Pass',
    slug: 'all-access-pass'
  },
  [PriceEnum.NuxtDashboard]: {
    title: 'Nuxt Dashboard',
    slug: 'nuxt-dashboard'
  },
  [PriceEnum.NuxtDashboard2]: {
    title: 'Nuxt Dashboard 2',
    slug: 'nuxt-dashboard-2'
  },
  [PriceEnum.NuxtEcommerceDashboard]: {
    title: 'Nuxt E-commerce Dashboard',
    slug: 'nuxt-dashboard-e-commerce'
  },
  [PriceEnum.NuxtPlanner]: {
    title: 'Nuxt Planner',
    slug: 'nuxt-planner-dashboard'
  },
  [PriceEnum.NuxtSimplistic]: {
    title: 'Nuxt Simplistic',
    slug: 'nuxt-simplistic'
  },
  [PriceEnum.NuxtShadcnDashboard]: {
    title: 'Nuxt shadcn/vue Dashboard',
    slug: 'nuxt-shadcn-dashboard'
  },
  [PriceEnum.NuxtUIThemeEditor]: {
    title: 'Nuxt UI Theme Editor',
    slug: 'nuxt-ui-theme-editor'
  },
  [PriceEnum.NuxtChartsTeams]: {
    title: 'Nuxt Charts Teams',
    slug: 'nuxt-charts-teams'
  },
  [PriceEnum.NuxtCleanGrayDashboard]: {
    title: 'Nuxt Clean Gray Dashboard',
    slug: 'nuxt-clean-gray-dashboard'
  },
  [PriceEnum.NuxtHRTheme]: {
    title: 'Nuxt HR Theme',
    slug: 'nuxt-hr-theme'
  },
  [PriceEnum.NuxtApplicationTheme]: {
    title: 'Nuxt Application Theme',
    slug: 'nuxt-application-theme'
  }
}
