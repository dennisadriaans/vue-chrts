import fs from 'fs/promises'
import path from 'path'
import { CONFIG } from './config.js'
import { isPathSafe } from './validators.js'

export async function downloadWithTimeout(
  url: string,
  timeoutMs: number,
  token?: string
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  const headers: Record<string, string> = {
    'User-Agent': 'nuxt-charts-cli/0.0.1'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers
    })
    clearTimeout(timeout)
    return response
  } catch (error) {
    clearTimeout(timeout)
    throw error
  }
}

export async function extractZipSafe(
  zipPath: string,
  extractDir: string
): Promise<void> {
  const AdmZip = (await import('adm-zip')).default

  try {
    const zip = new AdmZip(zipPath)
    const entries = zip.getEntries()

    // Security checks
    if (entries.length > 1000) {
      throw new Error('Zip contains too many files (max 1000)')
    }

    let totalSize = 0
    for (const entry of entries) {
      // Check file path safety
      const entryPath = path.join(extractDir, entry.entryName)
      if (!isPathSafe(extractDir, entryPath)) {
        throw new Error(`Unsafe file path in zip: ${entry.entryName}`)
      }

      // Check file extension
      const ext = path.extname(entry.entryName).toLowerCase()
      if (ext && !CONFIG.ALLOWED_EXTENSIONS.includes(ext as any)) {
        throw new Error(`Disallowed file type in zip: ${ext}`)
      }

      // Check individual file size and total size
      const uncompressedSize = entry.header.size
      if (uncompressedSize > CONFIG.MAX_FILE_SIZE) {
        throw new Error(`File too large in zip: ${entry.entryName}`)
      }

      totalSize += uncompressedSize
      if (totalSize > CONFIG.MAX_FILE_SIZE) {
        throw new Error('Zip contents too large when uncompressed')
      }

      // Check for zip bombs (high compression ratio)
      const compressedSize = entry.header.compressedSize
      if (compressedSize > 0 && uncompressedSize / compressedSize > 100) {
        throw new Error(
          `Suspicious compression ratio in file: ${entry.entryName}`
        )
      }
    }

    // Extract safely
    zip.extractAllTo(extractDir, true)
  } catch (error) {
    // Clean up on error
    try {
      await fs.rm(extractDir, { recursive: true, force: true })
    } catch {
      // Ignore cleanup errors
    }
    throw error
  }
}
