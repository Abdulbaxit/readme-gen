import OpenAI from 'openai';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';

dotenv.config();

export interface GenerationParams {
  projectName: string;
  description: string;
  author: string;
  github: string;
  license: string;
  languages: string[];
  frameworks: string[];
  fileTree: string;
}

export async function generateReadme(params: GenerationParams): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  const prompt = `
    You are a professional software documentation expert. Write a human-sounding, professional, and clear README.md for the project described below.
    
    ### Project Details:
    - **Name**: ${params.projectName}
    - **Description**: ${params.description || 'A software project.'}
    - **Author**: ${params.author}
    - **GitHub**: ${params.github}
    - **License**: ${params.license}
    - **Main Languages**: ${params.languages.join(', ')}
    - **Frameworks/Libraries**: ${params.frameworks.join(', ')}
    
    ### Project Structure:
    \`\`\`
    ${params.fileTree}
    \`\`\`
    
    Include the following sections:
    1.  **Title and Badges** (License, Languages, etc.)
    2.  **Short Description**
    3.  **Features**
    4.  **Getting Started** (Installation and Prerequisites)
    5.  **Usage Examples**
    6.  **Project Structure Description** (briefly explain the core folders based on the tree)
    7.  **Contributing Guide**
    8.  **License Information**
    
    Make it look visually appealing with clean markdown.
  `;

  if (!apiKey) {
    logger.warn('OPENAI_API_KEY not found in environment. Returning mock README content.');
    return `# ${params.projectName}\n\n${params.description || 'Project description placeholder.'}\n\n## (Mock Generated for Testing)\n\nTo see real AI-generated content, please provide an \`OPENAI_API_KEY\` in your environment or a \`.env\` file.`;
  }

  const openai = new OpenAI({ apiKey });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert technical writer and developer documentation specialist.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || 'Failed to generate content.';
  } catch (error: any) {
    logger.error('Error calling OpenAI API: ' + error.message);
    return 'Error generating README content.';
  }
}
