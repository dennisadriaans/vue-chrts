#!/usr/bin/env node
import { Command } from 'commander'
import chalk from 'chalk'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'


// Read version from package.json at runtime for compatibility
async function getPackageVersion() {
  try {
    const pkgPath = path.join(__dirname || path.dirname(new URL(import.meta.url).pathname), '../package.json')
    const data = await fs.readFile(pkgPath, 'utf-8')
    return JSON.parse(data).version || '0.0.0'
  } catch {
    return '0.0.0'
  }
}

const program = new Command()

// Config file location
const CONFIG_PATH = path.join(os.homedir(), '.nuxtcharts-cli.json')

// Read token from config file
async function getTokenFromConfig(): Promise<string | undefined> {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf-8')
    const config = JSON.parse(data)
    return typeof config.token === 'string' ? config.token : undefined
  } catch {
    return undefined
  }
}

// Write token to config file
async function setTokenToConfig(token: string): Promise<void> {
  const config = { token }
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8')
}

// Set version dynamically at runtime
(async () => {
  const version = await getPackageVersion()
  program.version(version).description('A custom CLI for nuxt-charts-site')
  program.parse(process.argv)

  // Show help if no command provided
  if (!process.argv.slice(2).length) {
    program.outputHelp()
  }
})()

// Configuration
const CONFIG = {
  BASE_URL: 'https://nuxtcharts.com/api/lib',
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_EXTENSIONS: ['.vue', '.ts', '.js', '.json', '.md', '.zip'],
  TIMEOUT: 30000, // 30 seconds
} as const

const Mapping = {
  'ProgressCircle': 'ProgressCircle',
  'StatusTracker': 'StatusTracker',
  'calendar': 'Calendar',
} as const

// Input validation
function validateComponent(component: string): component is keyof typeof Mapping {
  if (typeof component !== 'string') return false
  return component in Mapping
}

function validatePath(inputPath: string): boolean {
  if (typeof inputPath !== 'string') return false
  if (inputPath.length > 255) return false
  // Disallow dangerous characters and patterns
  const dangerousPatterns = [
    /\.\./, // Parent directory
    /[<>"|*?]/, // Invalid filename characters
    /^\/|^[a-zA-Z]:\\/, // Absolute paths
    /\0/, // Null bytes
    /^\./, // Hidden files (starting with .)
  ]
  return !dangerousPatterns.some((pattern) => pattern.test(inputPath))
}

function isPathSafe(base: string, target: string): boolean {
  try {
    const rel = path.relative(base, target)
    return !rel.startsWith('..') && !path.isAbsolute(rel) && rel !== ''
  } catch {
    return false
  }
}

async function extractZipSafe(
  zipPath: string,
  extractDir: string,
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
          `Suspicious compression ratio in file: ${entry.entryName}`,
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

async function downloadWithTimeout(
  url: string,
  timeoutMs: number,
  token?: string,
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  const headers: Record<string, string> = {
    'User-Agent': 'nuxt-charts-cli/0.0.1',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers,
    })
    clearTimeout(timeout)
    return response
  } catch (error) {
    clearTimeout(timeout)
    throw error
  }
}

program
  .command('add <component> [version] [targetPath]')
  .description(
    'Copy a component to a target path (default: ./app/components/<ComponentName>). Optionally specify a version',
  )
  .option('-t, --token <token>', 'API token for authentication')
  .action(
    async (
      component: string,
      version?: string,
      targetPath?: string,
      options?: { token?: string },
    ) => {
      if (!validateComponent(component)) {
        console.error(chalk.red(`Invalid component name: ${component}`))
        console.log(
          chalk.dim('Available components:'),
          Object.keys(Mapping).join(', '),
        )
        return
      }

      if (targetPath && !validatePath(targetPath)) {
        console.error(
          chalk.red(
            'Invalid target path. Paths must be relative and contain only safe characters.',
          ),
        )
        return
      }

      const latestVersion = 'v2'
      const useVersion = version || latestVersion

      const pascalName = Mapping[component]
      const baseUrl = `${CONFIG.BASE_URL}/${useVersion}/${pascalName}`

      // Get token: CLI option > config file
      let token = options?.token
      if (!token) {
        token = await getTokenFromConfig()
      }

      try {
        console.log(chalk.dim(`Fetching from: ${baseUrl}`))

        const res = await downloadWithTimeout(
          baseUrl + '.zip',
          CONFIG.TIMEOUT,
          token,
        )

        if (!res.ok) {
          console.log(res)
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`)
        }

        const contentLength = res.headers.get('content-length')
        if (contentLength && parseInt(contentLength) > CONFIG.MAX_FILE_SIZE) {
          throw new Error(
            `File too large: ${contentLength} bytes (max ${CONFIG.MAX_FILE_SIZE})`,
          )
        }

        const contentType = res.headers.get('content-type') || ''
        const baseDir = process.cwd()
        const safeTarget = targetPath || `./app/components/${pascalName}`
        const absTarget = path.resolve(baseDir, safeTarget)

        // Path safety check
        if (!isPathSafe(baseDir, absTarget)) {
          throw new Error(
            'Target path is not safe! Must be within current directory.',
          )
        }

        // Ensure target directory exists
        const targetDir = path.dirname(absTarget)
        await fs.mkdir(targetDir, { recursive: true })

        if (contentType.includes('application/zip')) {
          console.log(chalk.dim('Processing zip file...'))

          // Stream download to temporary file
          const buffer = Buffer.from(await res.arrayBuffer())

          // Validate buffer size
          if (buffer.length > CONFIG.MAX_FILE_SIZE) {
            throw new Error(`Downloaded file too large: ${buffer.length} bytes`)
          }

          const zipPath = absTarget.endsWith('.zip')
            ? absTarget
            : `${absTarget}.zip`
          await fs.writeFile(zipPath, buffer)

          const extractDir = zipPath.replace(/\.zip$/, '')
          await fs.mkdir(extractDir, { recursive: true })

          try {
            await extractZipSafe(zipPath, extractDir)
            await fs.unlink(zipPath) // Clean up zip file

            console.log(
              chalk.green(
                `✓ Component '${component}' ${useVersion} extracted to '${extractDir}'`,
              ),
            )
          } catch (extractError) {
            // Clean up on failure
            try {
              await fs.unlink(zipPath)
              await fs.rm(extractDir, { recursive: true, force: true })
            } catch {
              // Ignore cleanup errors
            }
            throw extractError
          }
        } else {
          console.log(chalk.dim('Processing single file...'))

          // Handle single file with size limit
          const content = await res.text()

          if (content.length > CONFIG.MAX_FILE_SIZE) {
            throw new Error(
              `File content too large: ${content.length} characters`,
            )
          }

          // Validate file extension if target has one
          const ext = path.extname(absTarget).toLowerCase()
          if (ext && !CONFIG.ALLOWED_EXTENSIONS.includes(ext as any)) {
            throw new Error(`Disallowed file extension: ${ext}`)
          }

          await fs.writeFile(absTarget, content, 'utf-8')
          console.log(
            chalk.green(`✓ File for '${component}' saved to '${absTarget}'`),
          )
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        console.error(chalk.red(`Failed to copy component: ${errorMessage}`))

        // Don't exit with process.exit(1) - let the caller handle it
        // This is better for testing and when used as a library
        return
      }
    },
  )
// Config command to set token
program
  .command('config')
  .description('Configuration commands')
  .command('set-token')
  .description('Set and persist the API token for authentication')
  .argument('<token>', 'API token value')
  .action(async (token: string) => {
    try {
      await setTokenToConfig(token)
      console.log(chalk.green('✓ Token saved to config'))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      console.error(chalk.red(`Failed to save token: ${errorMessage}`))
    }
  })

// Add help command
program
  .command('list')
  .description('List all available examples')
  .action(() => {
    console.log(chalk.blue('Available examples:'))
    Object.entries(Mapping).forEach(([key, value]) => {
      console.log(chalk.green(`  ${key}`), chalk.dim(`(${value})`))
    })
  })

// Enhanced error handling for unknown commands
program.on('command:*', function (operands) {
  console.error(chalk.red(`Unknown command: ${operands[0]}`))
  console.log(chalk.dim('Run "nuxt-charts --help" for available commands'))
})
