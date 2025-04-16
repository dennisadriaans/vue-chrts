import inquirer from 'inquirer';
import chalk from 'chalk';
import semver from 'semver';
import fs from 'fs/promises';
import { execaCommand } from 'execa';
import ora from 'ora';
import { getConfig } from '../utils/config.js';
import { getLastTag, getCommitsSinceLastTag } from '../utils/git.js';
import { getPackagePaths, updatePackageVersions } from '../utils/packages.js';

export function versionCommand(program) {
  program
    .command('version')
    .description('Update package versions')
    .option('--dry-run', 'Show what would be done without making changes', false)
    .option(
      '--type <type>',
      'Version bump type (major, minor, patch, or auto)',
      'auto'
    )
    .action(async (options) => {
      const spinner = ora('Analyzing repository').start();

      try {
        // Load configuration
        const config = await getConfig();

        // Get current version from package.json files
        const packagePaths = await getPackagePaths(config);
        const packageJsons = await Promise.all(
          packagePaths.map(async (path) => {
            const content = await fs.readFile(`${path}/package.json`, 'utf-8');
            return { path, content: JSON.parse(content) };
          })
        );

        // Determine current version (they should all be the same)
        const currentVersion = packageJsons[0].content.version;

        // Get commits since last tag
        const lastTag = await getLastTag();
        spinner.text = `Analyzing commits since ${lastTag || 'beginning'}`;
        const commits = await getCommitsSinceLastTag(lastTag);

        // Determine bump type based on conventional commits
        let bumpType = options.type;
        if (bumpType === 'auto') {
          bumpType = 'patch'; // Default to patch

          // Check commits for bump type
          for (const commit of commits) {
            if (commit.breaking) {
              bumpType = 'major';
              break;
            } else if (commit.type === 'feat') {
              bumpType = 'minor';
            }
          }
        }

        // Calculate new version
        const newVersion = semver.inc(currentVersion, bumpType);
        spinner.succeed(`Current version: ${currentVersion}, New version: ${newVersion} (${bumpType} bump)`);

        if (options.dryRun) {
          console.log(chalk.yellow('\nDry run - no changes made'));
          return;
        }

        // Confirm version update
        const { confirmVersion } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmVersion',
            message: `Update all packages to version ${newVersion}?`,
            default: true,
          },
        ]);

        if (!confirmVersion) {
          console.log(chalk.red('Version update aborted'));
          return;
        }

        // Update package.json files
        const updateSpinner = ora('Updating package versions').start();
        await updatePackageVersions(packagePaths, newVersion);
        updateSpinner.succeed('Updated package versions');

        console.log(chalk.green(`\nSuccessfully updated all packages to version ${newVersion}`));
      } catch (error) {
        spinner.fail('Error updating versions');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });
}
