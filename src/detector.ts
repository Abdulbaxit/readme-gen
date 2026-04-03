import fs from 'fs';
import path from 'path';

export interface DetectionResult {
  languages: string[];
  frameworks: string[];
  type: string;
}

const LANGUAGE_MAP: Record<string, string> = {
  '.ts': 'TypeScript',
  '.js': 'JavaScript',
  '.py': 'Python',
  '.go': 'Go',
  '.rb': 'Ruby',
  '.rs': 'Rust',
  '.java': 'Java',
  '.cpp': 'C++',
  '.c': 'C',
  '.php': 'PHP',
  '.html': 'HTML',
  '.css': 'CSS',
  '.sh': 'Shell',
};

const FRAMEWORK_MARKERS = [
  { name: 'React', files: ['package.json'], search: /"react":/ },
  { name: 'Vue', files: ['package.json'], search: /"vue":/ },
  { name: 'Next.js', files: ['package.json'], search: /"next":/ },
  { name: 'Express', files: ['package.json'], search: /"express":/ },
  { name: 'NestJS', files: ['package.json'], search: /"@nestjs\/core":/ },
  { name: 'Django', files: ['requirements.txt', 'pyproject.toml'], search: /django/i },
  { name: 'Flask', files: ['requirements.txt', 'pyproject.toml'], search: /flask/i },
  { name: 'FastAPI', files: ['requirements.txt', 'pyproject.toml'], search: /fastapi/i },
  { name: 'Ruby on Rails', files: ['Gemfile'], search: /rails/i },
  { name: 'Spring Boot', files: ['pom.xml', 'build.gradle'], search: /spring-boot/i },
  { name: 'Laravel', files: ['composer.json'], search: /laravel\/framework/ },
];

export async function detectProjectDetails(cwd: string, files: string[]): Promise<DetectionResult> {
  const languagesSet = new Set<string>();
  const frameworksSet = new Set<string>();

  // Detect Languages based on file extensions
  files.forEach(file => {
    const ext = path.extname(file);
    if (LANGUAGE_MAP[ext]) {
      languagesSet.add(LANGUAGE_MAP[ext]);
    }
  });

  // Detect Frameworks based on markers
  for (const marker of FRAMEWORK_MARKERS) {
    for (const markerFile of marker.files) {
      const filePath = path.join(cwd, markerFile);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (marker.search.test(content)) {
          frameworksSet.add(marker.name);
          break;
        }
      }
    }
  }

  return {
    languages: Array.from(languagesSet),
    frameworks: Array.from(frameworksSet),
    type: frameworksSet.size > 0 ? Array.from(frameworksSet)[0] : (languagesSet.size > 0 ? Array.from(languagesSet)[0] : 'Project'),
  };
}
