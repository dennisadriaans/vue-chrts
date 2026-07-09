#!/usr/bin/env node
import chalk from 'chalk'
import { Command } from 'commander'
import { CLI_VERSION } from './utils/registry.js'
import { createAddCommand } from './commands/add.js'
import { createConfigCommand } from './commands/config.js'
import { createListCommand } from './commands/list.js'
import { createHelpCommand } from './commands/help.js'
import { showBanner } from './utils/banner.js'

const program = new Command()

// Set version
program.version(CLI_VERSION)

// Register commands
program.addCommand(createAddCommand())
program.addCommand(createConfigCommand())
program.addCommand(createListCommand())
program.addCommand(createHelpCommand())

// Show banner when no command is provided
if (process.argv.length <= 2) {
  showBanner()
  process.exit(0)
}

// Enhanced error handling for unknown commands
program.on('command:*', function (operands) {
  console.error(chalk.red(`Unknown command: ${operands[0]}`))
  console.log(chalk.dim('Run "nuxt-charts --help" for available commands'))
})

// Parse CLI arguments and run the selected command
program.parseAsync(process.argv)
