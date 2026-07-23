// composable for template images
export const useTemplateImages = () => {
  const nuxtDashboard = Array.from({ length: 14 }, (_, i) => {
    const index = i
    return {
      light: `/images/dashboard/screenshots/${index}-light-mode.png`,
      dark: `/images/dashboard/screenshots/${index}.png`,
      alt: `Dashboard Layout ${index}`
    }
  })

  const nuxtShadcn = Array.from({ length: 14 }, (_, i) => {
    const index = i
    return {
      light: `/images/shadcn-dashboard/screenshots/${index}-light-mode.png`,
      dark: `/images/shadcn-dashboard/screenshots/${index}.png`,
      alt: `Dashboard shadcn/vue Layout ${index}`
    }
  })

  const nuxtCleanGray = Array.from({ length: 6 }, (_, i) => {
    const index = i
    return {
      light: `/images/clean-gray-dashboard/screenshots/${index}-light-mode.png`,
      dark: `/images/clean-gray-dashboard/screenshots/${index}.png`,
      alt: `Clean Gray Dashboard Layout ${index}`
    }
  })

  return {
    nuxtDashboard,
    nuxtShadcn,
    nuxtCleanGray,
    nuxtPlanner: Array.from({ length: 6 }, (_, i) => {
      const index = i + 1
      return {
        light: `/images/planner/screenshots/${index}-light-mode.png`,
        dark: `/images/planner/screenshots/${index}.png`,
        alt: `Planner Layout ${index}`
      }
    }),
    nuxtECommerceDashboard: [
      {
        light: '/images/e-commerce-dashboard/screenshots/1-light-mode.png',
        dark: '/images/e-commerce-dashboard/screenshots/1.png',
        alt: 'Dashboard Layout 1'
      },
      {
        light: '/images/e-commerce-dashboard/screenshots/2-light-mode.png',
        dark: '/images/e-commerce-dashboard/screenshots/2.png',
        alt: 'Dashboard Layout 2'
      },
      {
        light: '/images/e-commerce-dashboard/screenshots/3-light-mode.png',
        dark: '/images/e-commerce-dashboard/screenshots/3.png',
        alt: 'Dashboard Layout 3'
      },
      {
        light: '/images/e-commerce-dashboard/screenshots/4-light-mode.png',
        dark: '/images/e-commerce-dashboard/screenshots/4.png',
        alt: 'Dashboard Layout 4'
      },
      {
        light: '/images/e-commerce-dashboard/screenshots/5-light-mode.png',
        dark: '/images/e-commerce-dashboard/screenshots/5.png',
        alt: 'Dashboard Layout 5'
      },
      {
        light: '/images/e-commerce-dashboard/screenshots/6-light-mode.png',
        dark: '/images/e-commerce-dashboard/screenshots/6.png',
        alt: 'Dashboard Layout 6'
      }
    ]
  }
}
