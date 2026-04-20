#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import ora from 'ora';
import { logger } from './utils/logger.js';
import { scanDirectory, getProjectStructureSummary } from './scanner.js';
import { detectProjectDetails } from './detector.js';
import { promptUserSettings } from './prompter.js';
import { generateReadme } from './generator.js';

const program = new Command();

program
  .name('readme-gen')
  .description('AI-powered README generator for professional software projects')
  .version('1.0.0');

async function runGenerator(directory: string, options: any) {
  const cwd = path.resolve(directory);
  
  if (!fs.existsSync(cwd)) {
    logger.error(`Directory not found: ${cwd}`);
    process.exit(1);
  }

  logger.project(`readme-gen - Scanning ${path.basename(cwd)}...`);

  const spinner = ora('Scanning project structure...').start();
  const files = await scanDirectory(cwd);
  const detection = await detectProjectDetails(cwd, files);
  const fileTree = getProjectStructureSummary(cwd, files);
  spinner.succeed('Scanning complete!');

  logger.info(`Detected: ${detection.frameworks.length > 0 ? detection.frameworks.join(', ') : detection.languages.join(', ') || 'Unknown Project Type'}`);
  
  let userSettings;
  if (options.yes) {
    userSettings = {
      projectName: path.basename(cwd),
      description: '',
      author: '',
      github: '',
      license: 'MIT',
    };
  } else {
    userSettings = await promptUserSettings(cwd);
  }

  const genSpinner = ora('Generating professional README content with AI...').start();
  const readmeContent = await generateReadme({
    ...userSettings,
    languages: detection.languages,
    frameworks: detection.frameworks,
    fileTree,
  });
  genSpinner.succeed('Generation complete!');

  const outputPath = path.join(cwd, options.output || 'README_NEW.md');
  fs.writeFileSync(outputPath, readmeContent);
  
  logger.success(`README saved to: ${outputPath}`);
  logger.info('Review the generated file and rename it to README.md if you like it!');
}

program
  .command('gen', { isDefault: true })
  .description('Generate a professional README.md (default command)')
  .argument('[directory]', 'directory to scan', '.')
  .option('-o, --output <filename>', 'output filename', 'README_NEW.md')
  .option('-y, --yes', 'skip prompts and use defaults', false)
  .action(runGenerator);

program
  .command('config')
  .description('Configure readme-gen settings')
  .option('-k, --key <key>', 'Set OpenAI API key')
  .action((options) => {
    if (options.key) {
      const envPath = path.resolve(process.cwd(), '.env');
      let envContent = '';
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
      }

      if (envContent.includes('OPENAI_API_KEY=')) {
        envContent = envContent.replace(/OPENAI_API_KEY=.*/, `OPENAI_API_KEY=${options.key}`);
      } else {
        envContent += `\nOPENAI_API_KEY=${options.key}\n`;
      }

      fs.writeFileSync(envPath, envContent.trim() + '\n');
      logger.success('OpenAI API key saved to .env file');
    } else {
      logger.info('Usage: readme-gen config --key <your-api-key>');
    }
  });

program.parse(process.argv);
