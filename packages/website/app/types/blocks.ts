export interface BlockItem {
  id: string
  slug: string
  title: string
  category: string
  categorySlug: string
  componentName: string
  tags?: string[]
  _path: string
}

export interface BlockCategory {
  slug: string
  title: string
  blocks: BlockItem[]
}

export interface BlocksResponse {
  blocks: BlockItem[]
  categories: BlockCategory[]
}

export interface BlockNavigationItem {
  label: string
  path: string
  icon?: string
  image?: string
  imageLight?: string
  description?: string
  count: number
  new?: boolean
}

export interface BlockNavigationCategory {
  title: string
  items: BlockNavigationItem[]
}
