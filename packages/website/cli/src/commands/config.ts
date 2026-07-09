import chalk from 'chalk'
import { Command } from 'commander'
import { CONFIG_PATH, getTokenFromConfig, setTokenToConfig, obfuscateToken } from '../utils/config.js'

export function createConfigCommand(): Command {
  const configCommand = new Command('config')
    .description('Configuration commands')

  configCommand
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

  configCommand
    .command('show')
    .description('Show current configuration')
    .action(async () => {
      try {
        const token = await getTokenFromConfig()
        console.log(chalk.blue('Current configuration:'))
        console.log(chalk.dim(`  Config path: ${CONFIG_PATH}`))
        if (token) {
          console.log(chalk.green(`  Token: ${obfuscateToken(token)}`))
        } else {
          console.log(chalk.yellow('  Token: not set'))
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        console.error(chalk.red(`Failed to read config: ${errorMessage}`))
      }
    })

  return configCommand
}
