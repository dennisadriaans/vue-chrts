import fs from 'fs/promises'
import path from 'path'
import os from 'os'

// Config file location
export const CONFIG_PATH = path.join(os.homedir(), '.nuxtcharts-cli.json')

// Configuration constants
export const CONFIG = {
  BASE_URL: 'https://nuxtcharts.com/api/lib',
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_EXTENSIONS: ['.vue', '.ts', '.js', '.json', '.md', '.zip'],
  TIMEOUT: 30000 // 30 seconds
} as const

// Component mapping
export const Mapping = {
  ProgressCircle: 'ProgressCircle',
  StatusTracker: 'StatusTracker',
  CategoryDistribution: 'CategoryDistribution',
  Calendar: 'Calendar'
} as const

// Read token from config file
export async function getTokenFromConfig(): Promise<string | undefined> {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf-8')
    const config = JSON.parse(data)
    return typeof config.token === 'string' ? config.token : undefined
  } catch {
    return undefined
  }
}

// Write token to config file
export async function setTokenToConfig(token: string): Promise<void> {
  const config = { token }
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8')
}

// Obfuscate token for display (show first 4 and last 4 characters)
export function obfuscateToken(token: string): string {
  if (token.length <= 8) {
    return '*'.repeat(token.length)
  }
  const start = token.slice(0, 4)
  const end = token.slice(-4)
  const middle = '*'.repeat(Math.min(token.length - 8, 16))
  return `${start}${middle}${end}`
}
