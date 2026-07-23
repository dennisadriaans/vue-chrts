/**
 * Client-side composable for fetching block/component source code using Vite's ?raw imports.
 * This replaces the server-side /api/blocks/code endpoint and works reliably in all environments
 * including Cloudflare Workers.
 */

import type { InjectionKey, Ref } from 'vue'
import { until } from '@vueuse/core'

// Eager load all raw Vue file contents at build time
const blockFilesRaw = import.meta.glob([
  '~/components/Blocks/**/*.vue',
  '~/components/ChartGallery/**/*.vue',
  '~/components/Cards/**/*.vue',
  '~/components/lib/**/*.vue'
], {
  query: '?raw',
  import: 'default',
  eager: false
}) as Record<string, () => Promise<string>>

// Map category slugs to directory paths (mirrors server-side config)
const CATEGORY_TO_DIRS: Record<string, string | string[]> = {
  // Blocks
  'area-charts': 'Blocks/AreaCharts',
  'bar-charts': 'Blocks/BarCharts',
  'line-charts': 'Blocks/LineCharts',
  'donut-charts': 'Blocks/DonutCharts',
  'bar-lists': 'Blocks/BarLists',
  'status': 'Blocks/StatusUptime',
  'ai': 'Blocks/AI',
  'account-users': 'Blocks/AccountUsers',
  'pricing-tables': 'Blocks/PricingTables',
  'bubble-charts': 'Blocks/BubbleCharts',
  'timeline': 'Blocks/Timeline',
  'calendar': ['Blocks/Calendar', 'lib/Calendar'],
  'combo-charts': 'Blocks/ComboCharts',
  'sparklines': ['Blocks/Sparklines', 'lib/Sparkline'],
  'stat-tiles': ['Blocks/StatTiles', 'lib/StatTile'],
  'heatmaps': ['Blocks/Heatmaps', 'lib/ContributionGraph'],

  // Nested category slugs used in routes
  'dashboard/navbar': 'Blocks/Dashboard/Navbar',
  'application': 'Blocks/Application',
  'application/onboarding': 'Blocks/Application',
  'application/file-upload': 'Blocks/FileUpload',

  // Blocks that live outside `Blocks/*`
  'cards': 'Cards',

  // Chart gallery (/charts)
  'chart-gallery/area': 'ChartGallery/Area',
  'chart-gallery/bar': 'ChartGallery/Bar',
  'chart-gallery/line': 'ChartGallery/Line',
  'chart-gallery/line/elegant': 'ChartGallery/Line/Elegant',
  'chart-gallery/donut': 'ChartGallery/Donut'
}

// Convert kebab-case to PascalCase
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

// Convert to camelCase
function toCamelCase(str: string): string {
  const pascal = toPascalCase(str)
  return pascal ? pascal.charAt(0).toLowerCase() + pascal.slice(1) : pascal
}

// Generate all case variants for a path segment
function getVariants(segment: string): string[] {
  return Array.from(new Set([
    toPascalCase(segment),
    toCamelCase(segment),
    segment
  ]))
}

// Build all possible path combinations from segments
function buildPathCombos(segments: string[]): string[][] {
  const allVariants = segments.map(getVariants)
  let combos: string[][] = [[]]

  for (const segmentVariants of allVariants) {
    const next: string[][] = []
    for (const combo of combos) {
      for (const v of segmentVariants) {
        next.push([...combo, v])
      }
    }
    combos = next
  }

  return combos
}

// Normalize glob path to match format (remove ~/components/ prefix variations)
function normalizeGlobPath(path: string): string {
  return path
    .replace(/^~\/components\//, '')
    .replace(/^\/components\//, '')
    .replace(/^components\//, '')
}

// Build a lookup map for faster access
const normalizedPathMap = new Map<string, string>()
for (const globPath of Object.keys(blockFilesRaw)) {
  const normalized = normalizeGlobPath(globPath)
  normalizedPathMap.set(normalized.toLowerCase(), globPath)
}

// Precompute directory matchers (longest dirs first) for path -> category resolution
type CategoryDirMatcher = { categorySlug: string, dir: string }
const categoryDirMatchers: CategoryDirMatcher[] = Object.entries(CATEGORY_TO_DIRS)
  .flatMap(([categorySlug, dirConfig]) => {
    const dirs = Array.isArray(dirConfig) ? dirConfig : [dirConfig]
    return dirs.map(dir => ({ categorySlug, dir }))
  })
  .sort((a, b) => b.dir.length - a.dir.length)

/**
 * Resolve a category slug from a normalized component path.
 * Example: "Blocks/Application/Onboarding/Usage.vue" -> "application/onboarding"
 */
export function getCategorySlugFromPath(componentPath: string): string | null {
  const normalized = normalizeGlobPath(componentPath)
  for (const matcher of categoryDirMatchers) {
    if (normalized === `${matcher.dir}.vue`) continue
    if (normalized.startsWith(`${matcher.dir}/`)) return matcher.categorySlug
  }
  return null
}

// Convert PascalCase/camelCase to kebab-case slug
function toSlug(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

/**
 * Get a block/component slug relative to the category directory.
 * Example: ("application/onboarding", "Blocks/Application/Onboarding/Usage.vue") -> "onboarding/usage"
 */
export function getBlockSlugFromPath(categorySlug: string, componentPath: string): string | null {
  const dirConfig = CATEGORY_TO_DIRS[categorySlug]
  if (!dirConfig) return null

  const dirs = Array.isArray(dirConfig) ? dirConfig : [dirConfig]
  const normalized = normalizeGlobPath(componentPath)

  for (const dir of dirs) {
    if (!normalized.startsWith(`${dir}/`)) continue
    const relative = normalized.slice(dir.length + 1)
    if (!relative.endsWith('.vue')) return null
    const noExt = relative.slice(0, -4)

    const segments = noExt.split('/').filter(Boolean)
    if (segments.length === 0) return null
    return segments.map(toSlug).join('/')
  }

  return null
}

/**
 * Get source code for a block by category and block slug.
 * Returns null if not found.
 */
export function getBlockCode(categorySlug: string, blockSlug: string): (() => Promise<string>) | null {
  const dirConfig = CATEGORY_TO_DIRS[categorySlug]
  if (!dirConfig) return null

  const dirs = Array.isArray(dirConfig) ? dirConfig : [dirConfig]
  const pathSegments = blockSlug.split('/').filter(Boolean)

  for (const dir of dirs) {
    for (const combo of buildPathCombos(pathSegments)) {
      const last = combo.at(-1)
      if (!last) continue

      const subPath = [...combo.slice(0, -1), `${last}.vue`].join('/')
      const fullPath = `${dir}/${subPath}`

      // Try exact match first
      const globKey = `~/components/${fullPath}`
      if (blockFilesRaw[globKey]) {
        return blockFilesRaw[globKey]
      }

      // Try case-insensitive lookup
      const lowerPath = fullPath.toLowerCase()
      const matchedGlobPath = normalizedPathMap.get(lowerPath)
      if (matchedGlobPath && blockFilesRaw[matchedGlobPath]) {
        return blockFilesRaw[matchedGlobPath]
      }
    }
  }

  return null
}

/**
 * Get source code by full component path (e.g., "Blocks/AreaCharts/ChartPreview.vue")
 */
export function getCodeByPath(componentPath: string): (() => Promise<string>) | null {
  const normalized = componentPath
    .replace(/^~\/components\//, '')
    .replace(/^\//, '')

  const globKey = `~/components/${normalized}`
  if (blockFilesRaw[globKey]) {
    return blockFilesRaw[globKey]
  }

  const lowerPath = normalized.toLowerCase()
  const matchedGlobPath = normalizedPathMap.get(lowerPath)
  if (matchedGlobPath && blockFilesRaw[matchedGlobPath]) {
    return blockFilesRaw[matchedGlobPath]
  }

  return null
}

/**
 * Check if a block exists (useful for validation)
 */
export function blockExists(categorySlug: string, blockSlug: string): boolean {
  return getBlockCode(categorySlug, blockSlug) !== null
}

/**
 * Get all available block paths (useful for debugging)
 */
export function getAllBlockPaths(): string[] {
  return Object.keys(blockFilesRaw).map(normalizeGlobPath)
}

/**
 * License check composable - provides authentication and license validation.
 * Call provideLicenseCheck() once at the layout/page level to cache license state.
 */

const LICENSE_INJECTION_KEY = Symbol('blockCodeLicense') as InjectionKey<{
  hasLicense: Readonly<Ref<boolean>>
  isChecking: Readonly<Ref<boolean>>
  checkLicense: () => Promise<boolean>
}>

export function provideLicenseCheck() {
  const { loggedIn } = useUserSession()
  const hasLicense = ref(false)
  const isChecking = ref(false)
  const hasChecked = ref(false)

  async function checkLicense(): Promise<boolean> {
    if (hasChecked.value) return hasLicense.value
    if (!loggedIn.value) {
      hasLicense.value = false
      return false
    }

    if (isChecking.value) {
      await until(isChecking).toBe(false)
      return hasLicense.value
    }

    isChecking.value = true
    try {
      const response = await $fetch<{ hasAllAccess: boolean }>('/api/payments/has-license')
      hasLicense.value = response.hasAllAccess
      hasChecked.value = true
      return hasLicense.value
    } catch {
      hasLicense.value = false
      return false
    } finally {
      isChecking.value = false
    }
  }

  watch(loggedIn, (isLoggedIn) => {
    if (!isLoggedIn) {
      hasLicense.value = false
      hasChecked.value = false
    }
  })

  const provided = {
    hasLicense: readonly(hasLicense),
    isChecking: readonly(isChecking),
    checkLicense
  }

  provide(LICENSE_INJECTION_KEY, provided)
  return provided
}

export function useLicenseCheck() {
  const injected = inject(LICENSE_INJECTION_KEY, null)
  if (injected) return injected

  // Fallback if no provider exists
  const { loggedIn } = useUserSession()
  const hasLicense = ref(false)
  const isChecking = ref(false)

  async function checkLicense(): Promise<boolean> {
    if (!loggedIn.value) return false
    isChecking.value = true
    try {
      const response = await $fetch<{ hasAllAccess: boolean }>('/api/payments/has-license')
      hasLicense.value = response.hasAllAccess
      return hasLicense.value
    } catch {
      return false
    } finally {
      isChecking.value = false
    }
  }

  return {
    hasLicense: readonly(hasLicense),
    isChecking: readonly(isChecking),
    checkLicense
  }
}
