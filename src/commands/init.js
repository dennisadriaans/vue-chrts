import fs from 'fs/promises';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { execaCommand } from 'execa';
import ora from 'ora';
import { defaultConfig } from '../utils/config.js';

export function initCommand(program) {
  program
    .command('init')
    .description('Initialize chrts-release configuration')
    .action(async () => {
      try {
        console.log(chalk.blue('Initializing chrts-release...'));

        // Check if config already exists
        const configPath = path.resolve(process.cwd(), '.chrts-release.json');
        let existingConfig = null;

        try {
          const configContent = await fs.readFile(configPath, 'utf-8');
          existingConfig = JSON.parse(configContent);
          console.log(chalk.yellow('Existing configuration found. This will update the existing configuration.'));
        } catch (error) {
          // Config doesn't exist yet, which is fine
        }

        // Find packages in the monorepo
        const spinner = ora('Detecting packages').start();
        const { stdout: findPackagesOutput } = await execaCommand('find packages -name "package.json" | grep -v "node_modules"');
        const detectedPackages = findPackagesOutput
          .split('\n')
          .filter(Boolean)
          .map(path => path.replace('/package.json', ''));
        
        spinner.succeed(`Detected ${detectedPackages.length} packages: ${detectedPackages.join(', ')}`);

        // Gather configuration details
        const answers = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'packages',
            message: 'Select packages to include in releases:',
            choices: detectedPackages,
            default: existingConfig?.packages || detectedPackages,
          },
          {
            type: 'list',
            name: 'npmPublishAccess',
            message: 'npm publish access:',
            choices: [
              { name: 'public', value: 'public' },
              { name: 'restricted', value: 'restricted' },
              { name: 'default (no flag)', value: '' },
            ],
            default: existingConfig?.npmPublishAccess || 'public',
          },
        ]);

        // Create changelog files entries
        const changelogFiles = {};
        for (const packagePath of answers.packages) {
          try {
            const packageJsonPath = path.join(process.cwd(), packagePath, 'package.json');
            const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
            const packageJson = JSON.parse(packageJsonContent);
            changelogFiles[packageJson.name] = `${packagePath}/CHANGELOG.md`;
          } catch (error) {
            console.warn(chalk.yellow(`Could not read package.json for ${packagePath}`));
          }
        }

        // Create config file
        const config = {
          ...defaultConfig,
          packages: answers.packages,
          changelogFiles,
          npmPublishAccess: answers.npmPublishAccess || undefined,
        };

        await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
        
        console.log(chalk.green('\nConfiguration saved to .chrts-release.json'));
        console.log(chalk.blue('\nNext steps:'));
        console.log('1. Run ' + chalk.yellow('chrts-release commit') + ' to create conventional commits');
        console.log('2. Run ' + chalk.yellow('chrts-release version') + ' to bump package versions');
        console.log('3. Run ' + chalk.yellow('chrts-release changelog') + ' to generate changelogs');
        console.log('4. Run ' + chalk.yellow('chrts-release release') + ' for a complete release process');
        
      } catch (error) {
        console.error(chalk.red('Error initializing configuration:'), error.message);
        process.exit(1);
      }
    });
}
