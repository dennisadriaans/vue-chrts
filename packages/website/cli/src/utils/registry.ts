import { CONFIG } from './config.js'

export const CLI_VERSION = '0.0.17'

// Registry types
export interface RegistryComponent {
  name: string
  description: string
  version: string
}

export interface RegistryResponse {
  latestVersion: string
  components: RegistryComponent[]
  updatedAt: string
}

// Fetch latest version and components from server registry
export async function fetchRegistry(): Promise<RegistryResponse | null> {
  try {
    const res = await fetch(`${CONFIG.BASE_URL}/registry.json`, {
      headers: { 'User-Agent': `nuxt-charts-cli/${CLI_VERSION}` }
    })
    if (!res.ok) return null
    return (await res.json()) as RegistryResponse
  } catch {
    return null
  }
}

// Get latest library version from registry (fallback to CLI version)
export async function getLatestLibraryVersion(): Promise<string> {
  const registry = await fetchRegistry()
  return registry?.latestVersion ?? CLI_VERSION
}
