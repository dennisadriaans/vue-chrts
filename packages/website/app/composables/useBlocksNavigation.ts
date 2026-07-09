import { BLOCK_CATEGORIES } from '~/config/blocks'
import type { BlockNavigationItem, BlockNavigationCategory } from '~/types/blocks'

export type { BlockNavigationItem, BlockNavigationCategory }

export const useBlocksNavigation = () => {
  // Generate navigation items from the centralized config
  const items: BlockNavigationItem[] = BLOCK_CATEGORIES.map(config => ({
    label: config.title,
    path: `/blocks/${config.slug}`,
    icon: config.icon,
    image: config.image,
    imageLight: config.imageLight,
    description: config.description,
    count: config.count ?? 0,
    new: config.new
  }))

  const categories: BlockNavigationCategory[] = [
    {
      title: 'Blocks',
      items
    }
  ]

  return {
    categories,
    items
  }
}
