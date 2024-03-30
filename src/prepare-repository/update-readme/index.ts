import fs from 'fs';
import path from 'path';

const humanizeRepoName = (repoName: string): string => {
  return repoName
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .slice(0, -1)
    .join(' ');
};

export function updateReadmeContents(markdown: string, repoName: string): string {
  const result = markdown
    .trim()
    .replace(/refactoring-catalog-template/g, repoName)
    .replace('# Refactoring name', `# ${humanizeRepoName(repoName)}`)
    .replace(/\[REPOSITORY_NAME\]/g, repoName);

  return result;
}

export default function updateReadmeFile(repoName: string): void {
  const readmePath = path.join(process.cwd(), 'README.md');
  const readmeContent = fs.readFileSync(readmePath, 'utf-8');
  const updatedReadmeContent = updateReadmeContents(readmeContent, repoName);
  fs.writeFileSync(readmePath, updatedReadmeContent);
}
