import { globby } from 'globby';
import treeify from 'treeify';
import path from 'path';
import fs from 'fs';

export interface ProjectFile {
  name: string;
  path: string;
  isDirectory: boolean;
}

export const IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/.git/**',
  '**/dist/**',
  '**/build/**',
  '**/target/**',
  '**/bin/**',
  '**/obj/**',
  '**/.next/**',
  '**/.DS_Store',
  '**/package-lock.json',
  '**/yarn.lock',
  '**/pnpm-lock.yaml',
];

export async function scanDirectory(cwd: string): Promise<string[]> {
  const files = await globby(['**/*'], {
    cwd,
    ignore: IGNORE_PATTERNS,
    dot: true,
    onlyFiles: true,
    gitignore: true,
  });
  return files;
}

export function generateFileTree(files: string[]): string {
  const tree: any = {};
  files.forEach(file => {
    const parts = file.split(path.sep);
    let current = tree;
    parts.forEach(part => {
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    });
  });
  return treeify.asTree(tree, true, true);
}

export function getProjectStructureSummary(cwd: string, files: string[]): string {
  const folderStructure = generateFileTree(files.slice(0, 50)); // Limit to first 50 files for AI context
  return folderStructure;
}
