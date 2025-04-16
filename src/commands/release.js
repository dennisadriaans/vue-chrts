import inquirer from 'inquirer';
import chalk from 'chalk';
import { execaCommand } from 'execa';
import ora from 'ora';
import { getConfig } from '../utils/config.js';
import { getPackagePaths } from '../utils/packages.js';

export function releaseCommand(program) {
  program
    .command('release')
    .description('Complete release process (version, changelog, build, publish)')
    .option('--dry-run', 'Show what would be done without making changes', false)
    .option('--skip-build', 'Skip building packages', false)
    .option('--skip-publish', 'Skip publishing packages to npm', false)
    .action(async (options) => {
      try {
        const config = await getConfig();
        
        // Check if working directory is clean
        const { stdout: gitStatus } = await execaCommand('git status --porcelain');
        if (gitStatus) {
          console.log(chalk.yellow('Working directory is not clean:'));
          console.log(gitStatus);
          
          const { proceed } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'proceed',
              message: 'Continue with release anyway? (Not recommended)',
              default: false,
            },
          ]);
          
          if (!proceed) {
            console.log(chalk.red('Release aborted. Please commit or stash your changes first.'));
            return;
          }
        }
        
        // Run version command
        console.log(chalk.blue('Step 1: Updating package versions'));
        await execaCommand(`node bin/chrts-release.js version ${options.dryRun ? '--dry-run' : ''}`, { stdio: 'inherit' });
        
        if (options.dryRun) {
          console.log(chalk.yellow('\nDry run - skipping remaining steps'));
          return;
        }
        
        // Run changelog command
        console.log(chalk.blue('\nStep 2: Generating changelog'));
        await execaCommand('node bin/chrts-release.js changelog', { stdio: 'inherit' });
        
        // Build packages if not skipped
        if (!options.skipBuild) {
          console.log(chalk.blue('\nStep 3: Building packages'));
          const buildSpinner = ora('Building packages').start();
          try {
            await execaCommand('pnpm build');
            buildSpinner.succeed('Packages built successfully');
          } catch (error) {
            buildSpinner.fail('Failed to build packages');
            console.error(chalk.red('Build error:'), error.message);
            const { continueDespiteError } = await inquirer.prompt([
              {
                type: 'confirm',
                name: 'continueDespiteError',
                message: 'Continue despite build error?',
                default: false,
              },
            ]);
            
            if (!continueDespiteError) {
              console.log(chalk.red('Release aborted.'));
              return;
            }
          }
        } else {
          console.log(chalk.yellow('\nSkipping build step'));
        }
        
        // Get package paths for tagging and publishing
        const packagePaths = await getPackagePaths(config);
        const mainPackagePath = packagePaths[0];
        
        // Read version from main package
        const { stdout: packageData } = await execaCommand(`cat ${mainPackagePath}/package.json`);
        const packageJson = JSON.parse(packageData);
        const version = packageJson.version;
        
        // Create git tag
        console.log(chalk.blue(`\nStep 4: Creating git tag v${version}`));
        await execaCommand(`git add .`);
        await execaCommand(`git commit -m "release: v${version}"`);
        await execaCommand(`git tag v${version}`);
        
        // Push changes and tags
        const { pushChanges } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'pushChanges',
            message: 'Push changes and tags to remote?',
            default: true,
          },
        ]);
        
        if (pushChanges) {
          const pushSpinner = ora('Pushing to remote').start();
          try {
            await execaCommand('git push');
            await execaCommand('git push --tags');
            pushSpinner.succeed('Changes and tags pushed to remote');
          } catch (error) {
            pushSpinner.fail('Failed to push to remote');
            console.error(chalk.red('Error:'), error.message);
          }
        }
        
        // Publish to npm if not skipped
        if (!options.skipPublish) {
          console.log(chalk.blue('\nStep 5: Publishing packages to npm'));
          
          const { confirmPublish } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'confirmPublish',
              message: `Publish packages to npm?`,
              default: true,
            },
          ]);
          
          if (confirmPublish) {
            for (const packagePath of packagePaths) {
              const publishSpinner = ora(`Publishing ${packagePath}`).start();
              try {
                await execaCommand(`cd ${packagePath} && npm publish ${config.npmPublishAccess ? `--access ${config.npmPublishAccess}` : ''}`);
                publishSpinner.succeed(`Published ${packagePath}`);
              } catch (error) {
                publishSpinner.fail(`Failed to publish ${packagePath}`);
                console.error(chalk.red('Error:'), error.message);
              }
            }
          } else {
            console.log(chalk.yellow('Skipping npm publish'));
          }
        } else {
          console.log(chalk.yellow('\nSkipping npm publish'));
        }
        
        console.log(chalk.green(`\n✨ Successfully released version ${version}! ✨`));
      } catch (error) {
        console.error(chalk.red('Error during release:'), error.message);
        process.exit(1);
      }
    });
}
