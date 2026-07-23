import fs from 'fs/promises'
import path from 'path'
import chalk from 'chalk'
import { Command } from 'commander'
import { validateComponent, validatePath, isPathSafe } from '../utils/validators.js'
import { CONFIG, Mapping, getTokenFromConfig } from '../utils/config.js'
import { getLatestLibraryVersion } from '../utils/registry.js'
import { downloadWithTimeout, extractZipSafe } from '../utils/download.js'

export function createAddCommand(): Command {
  return new Command('add')
    .argument('<component>', 'Component name to add')
    .argument('[version]', 'Specific version (optional)')
    .argument('[targetPath]', 'Target directory (optional)')
    .description(
      'Copy a component to a target path (default: ./app/components/<ComponentName>). Optionally specify a version'
    )
    .option('-t, --token <token>', 'API token for authentication')
    .action(
      async (
        component: string,
        version?: string,
        targetPath?: string,
        options?: { token?: string }
      ) => {
        if (!validateComponent(component)) {
          console.error(chalk.red(`Invalid component name: ${component}`))
          console.log(
            chalk.dim('Available components:'),
            Object.keys(Mapping).join(', ')
          )
          return
        }

        if (targetPath && !validatePath(targetPath)) {
          console.error(
            chalk.red(
              'Invalid target path. Paths must be relative and contain only safe characters.'
            )
          )
          return
        }

        const useVersion = version || (await getLatestLibraryVersion())

        const pascalName = Mapping[component]
        const baseUrl = `${CONFIG.BASE_URL}/v${useVersion}/${pascalName}`

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
            token
          )

          if (!res.ok) {
            console.log(res)
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`)
          }

          const contentLength = res.headers.get('content-length')
          if (contentLength && parseInt(contentLength) > CONFIG.MAX_FILE_SIZE) {
            throw new Error(
              `File too large: ${contentLength} bytes (max ${CONFIG.MAX_FILE_SIZE})`
            )
          }

          const contentType = res.headers.get('content-type') || ''
          const baseDir = process.cwd()
          const safeTarget = targetPath || `./app/components/${pascalName}`
          const absTarget = path.resolve(baseDir, safeTarget)

          // Path safety check
          if (!isPathSafe(baseDir, absTarget)) {
            throw new Error(
              'Target path is not safe! Must be within current directory.'
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
                  `✓ Component '${component}' ${useVersion} extracted to '${extractDir}'`
                )
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
                `File content too large: ${content.length} characters`
              )
            }

            // Validate file extension if target has one
            const ext = path.extname(absTarget).toLowerCase()
            if (ext && !CONFIG.ALLOWED_EXTENSIONS.includes(ext as any)) {
              throw new Error(`Disallowed file extension: ${ext}`)
            }

            await fs.writeFile(absTarget, content, 'utf-8')
            console.log(
              chalk.green(`✓ File for '${component}' saved to '${absTarget}'`)
            )
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err)
          console.error(chalk.red(`Failed to copy component: ${errorMessage}`))

          // Don't exit with process.exit(1) - let the caller handle it
          // This is better for testing and when used as a library
          return
        }
      }
    )
}
