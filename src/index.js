import { Command } from 'commander';
import chalk from 'chalk';
import { createRequire } from 'module';
import updateNotifier from 'update-notifier';

// Commands
import { commitCommand } from './commands/commit.js';
import { versionCommand } from './commands/version.js';
import { changelogCommand } from './commands/changelog.js';
import { releaseCommand } from './commands/release.js';
import { initCommand } from './commands/init.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

// Notify about updates
updateNotifier({ pkg }).notify();

export const program = new Command();

program
  .name('chrts-release')
  .description('Release management tool for vue-chrts monorepo')
  .version(pkg.version);

// Register commands
commitCommand(program);
versionCommand(program);
changelogCommand(program);
releaseCommand(program);
initCommand(program);

// Global error handler
process.on('unhandledRejection', (err) => {
  console.error(chalk.red('Error:'), err);
  process.exit(1);
});
