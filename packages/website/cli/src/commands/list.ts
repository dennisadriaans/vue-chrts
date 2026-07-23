import chalk from 'chalk'
import { Command } from 'commander'
import { Mapping } from '../utils/config.js'
import { fetchRegistry } from '../utils/registry.js'

export function createListCommand(): Command {
  return new Command('list')
    .description('List all available components')
    .action(async () => {
      console.log(chalk.dim('Fetching component registry...'))

      const registry = await fetchRegistry()

      if (registry) {
        console.log(chalk.blue(`Available components (v${registry.latestVersion}):`))
        registry.components.forEach((comp) => {
          console.log(chalk.green(`  ${comp.name}`), chalk.dim(`- ${comp.description}`))
        })
      } else {
        console.log(chalk.yellow('Could not fetch registry, showing local components:'))
        Object.entries(Mapping).forEach(([key, value]) => {
          console.log(chalk.green(`  ${key}`), chalk.dim(`(${value})`))
        })
      }
    })
}
