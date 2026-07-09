import type { BlockCategory, BlockItem } from '~/types/blocks'
import { BLOCK_CATEGORIES } from '~/config/blocks'
import { getAllBlockPaths, getBlockSlugFromPath, getCategorySlugFromPath } from '~/composables/useBlockCode'

// Eagerly load block components to access metadata (tags) from defineOptions
const blockComponents = import.meta.glob([
  '~/components/Blocks/**/*.vue',
  '~/components/ChartGallery/**/*.vue',
  '~/components/Cards/**/*.vue'
], {
  eager: true
}) as Record<string, any>

function toTitleCase(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .trim()
}

// Build a static blocks index once (paths are resolved at build time)
const blockCategorySlugSet = new Set(BLOCK_CATEGORIES.map(c => c.slug))
const blockCategoryTitleBySlug = new Map(BLOCK_CATEGORIES.map(c => [c.slug, c.title] as const))

function buildBlocksIndex(): BlockItem[] {
  const paths = getAllBlockPaths()
  const items: BlockItem[] = []

  for (const componentPath of paths) {
    // Only include actual block examples (exclude wrapper components and internal libs)
    if (!componentPath.startsWith('Blocks/') && !componentPath.startsWith('Cards/')) continue
    if (!componentPath.includes('/')) continue
    if (!componentPath.endsWith('.vue')) continue
    // Blocks/ are nested (Blocks/Category/Block.vue), Cards/ are direct (Cards/Block.vue)
    if (componentPath.startsWith('Blocks/') && componentPath.split('/').length < 3) continue
    if (componentPath.endsWith('/index.vue')) continue

    const categorySlug = getCategorySlugFromPath(componentPath)
    if (!categorySlug) continue
    if (!blockCategorySlugSet.has(categorySlug)) continue

    const blockSlug = getBlockSlugFromPath(categorySlug, componentPath)
    if (!blockSlug) continue

    const fileName = componentPath.split('/').at(-1)?.replace(/\.vue$/, '') || ''
    const title = toTitleCase(fileName)

    const id = `${categorySlug.replaceAll('/', '-')}-${blockSlug.replaceAll('/', '-')}`

    const fullPath = `~/components/${componentPath}`
    const component = blockComponents[fullPath]
    // Extract tags from defineOptions if present (Vue SFC default export)
    const componentTags = component?.default?.tags || []

    const tags = Array.from(new Set([
      categorySlug,
      ...blockSlug.split('/'),
      ...(Array.isArray(componentTags) ? componentTags : [])
    ]))

    items.push({
      id,
      slug: blockSlug,
      title,
      category: blockCategoryTitleBySlug.get(categorySlug) || categorySlug,
      categorySlug,
      componentName: component?.default?.name || '',
      tags,
      _path: fullPath
    })
  }

  return items
}

const ALL_BLOCKS = buildBlocksIndex()

export function useBlocks(initialQuery?: string) {
  const searchQuery = ref(initialQuery || '')
  const isSearching = computed(() => searchQuery.value.trim().length > 0)

  const blocks = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return []

    const terms = q.split(/\s+/).filter(Boolean)
    return ALL_BLOCKS.filter((block) => {
      const haystack = [
        block.title,
        block.category,
        block.categorySlug,
        block.id,
        ...(block.tags ?? [])
      ].join(' ').toLowerCase()

      return terms.every(term => haystack.includes(term))
    })
  })

  const categories = computed<BlockCategory[]>(() => {
    // Provide category grouping for category pages.
    const bySlug = new Map<string, BlockItem[]>()
    for (const block of ALL_BLOCKS) {
      const list = bySlug.get(block.categorySlug) ?? []
      list.push(block)
      bySlug.set(block.categorySlug, list)
    }

    const result: BlockCategory[] = []
    for (const category of BLOCK_CATEGORIES) {
      const blocks = bySlug.get(category.slug) ?? []
      if (blocks.length === 0) continue
      result.push({
        slug: category.slug,
        title: category.title,
        blocks
      })
    }

    return result
  })

  function search(query: string) {
    searchQuery.value = query

    if (query.trim().length > 2) {
      const { trackSearch } = useButtonTracking()
      trackSearch(query.trim())
    }
  }

  function getBlocksByCategory(categorySlug: string) {
    return computed(() => categories.value.find(c => c.slug === categorySlug)?.blocks ?? [])
  }

  return {
    // State
    searchQuery,
    blocks,
    categories,
    isSearching,

    // Actions
    search,
    getBlocksByCategory
  }
}
