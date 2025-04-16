import inquirer from 'inquirer';
import chalk from 'chalk';
import { execaCommand } from 'execa';
import { getConfig } from '../utils/config.js';

export function commitCommand(program) {
  program
    .command('commit')
    .description('Create a conventional commit')
    .action(async () => {
      try {
        const config = await getConfig();
        const types = Object.keys(config.commitTypes);

        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'type',
            message: 'Select the type of change:',
            choices: types,
          },
          {
            type: 'input',
            name: 'scope',
            message: 'Scope (optional):',
          },
          {
            type: 'input',
            name: 'description',
            message: 'Short description:',
            validate: (input) => input.length > 0 || 'Description is required',
          },
          {
            type: 'input',
            name: 'body',
            message: 'Longer description (optional):',
          },
          {
            type: 'confirm',
            name: 'breaking',
            message: 'Is this a breaking change?',
            default: false,
          },
        ]);

        // Format the commit message
        let commitMessage = `${answers.type}`;
        if (answers.scope) {
          commitMessage += `(${answers.scope})`;
        }
        commitMessage += `: ${answers.description}`;

        if (answers.breaking) {
          commitMessage += '\n\nBREAKING CHANGE: ';
          if (answers.body) {
            commitMessage += answers.body;
          } else {
            commitMessage += 'This introduces a breaking change.';
          }
        } else if (answers.body) {
          commitMessage += `\n\n${answers.body}`;
        }

        // Check if there are staged changes
        const { stdout: status } = await execaCommand('git status --porcelain');
        if (!status) {
          console.log(chalk.yellow('Warning: No changes to commit'));
          const { proceed } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'proceed',
              message: 'Stage all changes and proceed?',
              default: false,
            },
          ]);

          if (proceed) {
            await execaCommand('git add .');
          } else {
            console.log(chalk.red('Commit aborted'));
            return;
          }
        }

        // Commit the changes
        const { stdout } = await execaCommand(`git commit -m "${commitMessage}"`);
        console.log(chalk.green('Successfully created commit:'));
        console.log(stdout);
      } catch (error) {
        console.error(chalk.red('Error creating commit:'), error.message);
        process.exit(1);
      }
    });
}
