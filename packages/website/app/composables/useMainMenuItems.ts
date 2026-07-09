import type { DropdownMenuItem } from '@nuxt/ui'
import type { ContentNavigationItem } from '@nuxt/content'

export function useMainMenuItems() {
  const { getAllLicense } = usePayments()
  const navigation = inject<Ref<ContentNavigationItem[]>>('navigation', ref([]))

  const items = computed(() => {
    const mainItems: DropdownMenuItem[][] = [
      [
        { label: 'Charts', to: '/charts' },
        { label: 'Blocks', to: '/blocks' },
        { label: 'Docs', to: '/docs' },
        { label: 'Templates', to: '/templates' },
        { label: 'Pricing', to: '/pricing' }
      ]
    ]

    if (navigation.value.length > 0) {
      const docsItems = [
        { label: 'Installation', to: '/docs/getting-started/installation' },
        { label: 'CLI', to: '/docs/getting-started/cli' },
        { label: 'Vue Charts', to: '/docs/getting-started/vue-charts' },
        { label: 'Area Chart', to: '/docs/charts/area-chart' },
        { label: 'Progress Circle', to: '/docs/components/progress-circle' },
        { label: 'Dotted Map', to: '/docs/maps/dotted-map' }
      ]

      if (docsItems) {
        mainItems.push([
          { label: 'Documentation', type: 'label' },
          ...docsItems
        ])
      }
    }

    mainItems.push([
      {
        type: 'link',
        label: 'Get All-Access',
        onSelect: getAllLicense,
        target: '_blank',
        icon: 'i-lucide-lock'
      },
      {
        label: 'Follow me  on X',
        to: 'https://x.com/DennisAdriaans',
        target: '_blank',
        icon: 'i-lucide-twitter'
      },
      {
        label: 'GitHub',
        to: 'https://github.com/dennisadriaans/vue-chrts',
        target: '_blank',
        icon: 'i-lucide-github'
      }
    ])

    return mainItems
  })

  return { items }
}
