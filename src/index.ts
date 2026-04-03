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
  .version('1.0.0')
  .argument('[directory]', 'directory to scan', '.')
  .option('-o, --output <filename>', 'output filename', 'README_NEW.md')
  .option('-y, --yes', 'skip prompts and use defaults', false)
  .action(async (directory, options) => {
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

    const outputPath = path.join(cwd, options.output);
    fs.writeFileSync(outputPath, readmeContent);
    
    logger.success(`README saved to: ${outputPath}`);
    logger.info('Review the generated file and rename it to README.md if you like it!');
  });

program.parse(process.argv);
