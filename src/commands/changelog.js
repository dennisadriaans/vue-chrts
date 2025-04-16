import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { getConfig } from '../utils/config.js';
import { getCommitsSinceLastTag, getLastTag } from '../utils/git.js';

export function changelogCommand(program) {
  program
    .command('changelog')
    .description('Generate or update changelogs')
    .option('--from <tag>', 'Starting tag or commit')
    .option('--to <ref>', 'Ending reference (default: HEAD)', 'HEAD')
    .option('--dry-run', 'Show changelog without writing to file', false)
    .action(async (options) => {
      const spinner = ora('Generating changelog').start();

      try {
        const config = await getConfig();
        const fromTag = options.from || await getLastTag();
        
        spinner.text = `Analyzing commits since ${fromTag || 'beginning'}`;
        const commits = await getCommitsSinceLastTag(fromTag, options.to);

        // Group commits by type
        const groupedCommits = {};
        
        for (const commit of commits) {
          const type = commit.type || 'other';
          if (!groupedCommits[type]) {
            groupedCommits[type] = [];
          }
          groupedCommits[type].push(commit);
        }

        // Generate changelog content
        let changelogContent = `# Changelog\n\n`;
        changelogContent += `## [Unreleased]\n\n`;

        // Add grouped commits
        for (const type in groupedCommits) {
          if (groupedCommits[type].length > 0) {
            const typeTitle = config.commitTypes[type] || type;
            changelogContent += `### ${typeTitle}\n\n`;

            for (const commit of groupedCommits[type]) {
              let entry = `- ${commit.subject}`;
              if (commit.scope) {
                entry = `- **${commit.scope}:** ${commit.subject}`;
              }
              
              if (commit.breaking) {
                entry += ' (BREAKING CHANGE)';
              }
              
              entry += ` ([${commit.hash.substring(0, 7)}](https://github.com/username/vue-chrts/commit/${commit.hash}))\n`;
              changelogContent += entry;
            }
            
            changelogContent += '\n';
          }
        }

        spinner.succeed('Changelog generated');

        if (options.dryRun) {
          console.log(chalk.yellow('\nDry run - displaying changelog:\n'));
          console.log(changelogContent);
          return;
        }

        // Write changelog to files
        for (const [packageName, changelogPath] of Object.entries(config.changelogFiles)) {
          try {
            const fullPath = path.resolve(process.cwd(), changelogPath);
            
            // Check if file exists
            let existingContent = '';
            try {
              existingContent = await fs.readFile(fullPath, 'utf-8');
            } catch (e) {
              // File doesn't exist, we'll create it
            }
            
            // Update existing changelog or create new one
            let updatedContent;
            if (existingContent && existingContent.includes('# Changelog')) {
              // Insert after the Unreleased section
              const unreleasedIndex = existingContent.indexOf('## [Unreleased]');
              if (unreleasedIndex !== -1) {
                const afterUnreleased = existingContent.indexOf('##', unreleasedIndex + 14);
                if (afterUnreleased !== -1) {
                  updatedContent = (
                    existingContent.substring(0, afterUnreleased) +
                    changelogContent.substring(changelogContent.indexOf('### ')) +
                    existingContent.substring(afterUnreleased)
                  );
                } else {
                  updatedContent = existingContent + changelogContent.substring(changelogContent.indexOf('### '));
                }
              } else {
                updatedContent = existingContent + '\n' + changelogContent;
              }
            } else {
              updatedContent = changelogContent;
            }
            
            await fs.writeFile(fullPath, updatedContent, 'utf-8');
            console.log(chalk.green(`Updated changelog for ${packageName} at ${changelogPath}`));
          } catch (error) {
            console.error(chalk.yellow(`Warning: Could not update changelog for ${packageName}:`, error.message));
          }
        }

        console.log(chalk.green('\nChangelog generation complete'));
      } catch (error) {
        spinner.fail('Error generating changelog');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });
}
