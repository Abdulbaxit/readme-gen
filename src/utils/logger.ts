import chalk from 'chalk';

export const logger = {
  info: (msg: string) => console.log(chalk.blue('ℹ ') + msg),
  success: (msg: string) => console.log(chalk.green('✔ ') + msg),
  warn: (msg: string) => console.log(chalk.yellow('⚠ ') + msg),
  error: (msg: string) => console.error(chalk.red('✖ ') + msg),
  project: (msg: string) => console.log(chalk.cyan.bold('\n🚀 ' + msg + '\n')),
  dim: (msg: string) => console.log(chalk.gray(msg)),
};
