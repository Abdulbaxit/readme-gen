import inquirer from 'inquirer';
import path from 'path';

export interface UserPrompts {
  projectName: string;
  description: string;
  author: string;
  github: string;
  license: string;
  sections: string[];
  tone: string;
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
    {
      type: 'checkbox',
      name: 'sections',
      message: 'Select additional sections to include:',
      choices: [
        { name: 'Roadmap', checked: true },
        { name: 'FAQ' },
        { name: 'Troubleshooting' },
        { name: 'Architecture' },
        { name: 'Environment Variables' },
        { name: 'Changelog' },
      ],
    },
    {
      type: 'list',
      name: 'tone',
      message: 'Choose the documentation tone:',
      choices: ['Professional', 'Friendly', 'Minimalist', 'Extensive Technical'],
      default: 'Professional',
    },
  ]);

  return answers as UserPrompts;
}
