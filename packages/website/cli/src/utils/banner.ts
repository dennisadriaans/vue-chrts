import chalk from 'chalk'

export function showBanner(): void {
  const banner = `
${chalk.green('┌─────────────────────────────────────────────────────────────┐')}
${chalk.green('│')}                                                             ${chalk.green('│')}
${chalk.green('│')}     ${chalk.bold.white('███╗   ██╗██╗   ██╗██╗  ██╗████████╗')}                ${chalk.green('│')}
${chalk.green('│')}     ${chalk.bold.white('████╗  ██║██║   ██║╚██╗██╔╝╚══██╔══╝')}                ${chalk.green('│')}
${chalk.green('│')}     ${chalk.bold.white('██╔██╗ ██║██║   ██║ ╚███╔╝    ██║')}                   ${chalk.green('│')}
${chalk.green('│')}     ${chalk.bold.white('██║╚██╗██║██║   ██║ ██╔██╗    ██║')}                   ${chalk.green('│')}
${chalk.green('│')}     ${chalk.bold.white('██║ ╚████║╚██████╔╝██╔╝ ██╗   ██║')}                   ${chalk.green('│')}
${chalk.green('│')}     ${chalk.bold.white('╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝')}                   ${chalk.green('│')}
${chalk.green('│')}                                                             ${chalk.green('│')}
${chalk.green('│')}         ${chalk.bold.green('█████╗ ██╗  ██╗ █████╗ ██████╗ ████████╗███████╗')}  ${chalk.green('│')}
${chalk.green('│')}        ${chalk.bold.green('██╔══██╗██║  ██║██╔══██╗██╔══██╗╚══██╔══╝██╔════╝')}  ${chalk.green('│')}
${chalk.green('│')}        ${chalk.bold.green('██║  ╚═╝███████║███████║██████╔╝   ██║   ███████╗')}  ${chalk.green('│')}
${chalk.green('│')}        ${chalk.bold.green('██║  ██╗██╔══██║██╔══██║██╔══██╗   ██║   ╚════██║')}  ${chalk.green('│')}
${chalk.green('│')}        ${chalk.bold.green('╚█████╔╝██║  ██║██║  ██║██║  ██║   ██║   ███████║')}  ${chalk.green('│')}
${chalk.green('│')}         ${chalk.bold.green('╚════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝')}  ${chalk.green('│')}
${chalk.green('│')}                                                             ${chalk.green('│')}
${chalk.green('│')}                      ${chalk.dim.green('CLI v0.0.17')}                          ${chalk.green('│')}
${chalk.green('│')}                                                             ${chalk.green('│')}
${chalk.green('└─────────────────────────────────────────────────────────────┘')}

  ${chalk.dim('Beautiful chart components for your Nuxt application')}

  ${chalk.bold('Quick Start:')}

    ${chalk.green('$')} ${chalk.cyan('nuxt-charts')} ${chalk.white('add')} ${chalk.yellow('ProgressCircle')}
    ${chalk.green('$')} ${chalk.cyan('nuxt-charts')} ${chalk.white('list')}
    ${chalk.green('$')} ${chalk.cyan('nuxt-charts')} ${chalk.white('config set-token')} ${chalk.yellow('<your-token>')}

  ${chalk.dim('Learn more:')} ${chalk.blue.underline('https://nuxtcharts.com')}
  ${chalk.dim('Get help:')}   ${chalk.cyan('nuxt-charts --help')}

`
  console.log(banner)
}
