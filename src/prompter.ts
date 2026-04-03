import inquirer from 'inquirer';
import path from 'path';

export interface UserPrompts {
  projectName: string;
  description: string;
  author: string;
  github: string;
  license: string;
}

export async function promptUserSettings(cwd: string): Promise<UserPrompts> {
  const defaultProjectName = path.basename(cwd);

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is the project name?',
      default: defaultProjectName,
    },
    {
      type: 'input',
      name: 'description',
      message: 'Briefly describe the project:',
    },
    {
      type: 'input',
      name: 'author',
      message: 'Who is the author?',
    },
    {
      type: 'input',
      name: 'github',
      message: 'What is the GitHub username/handle?',
    },
    {
      type: 'list',
      name: 'license',
      message: 'Choose a license:',
      choices: ['MIT', 'Apache 2.0', 'GPLv3', 'ISC', 'Unlicense', 'None'],
      default: 'MIT',
    },
  ]);

  return answers as UserPrompts;
}
