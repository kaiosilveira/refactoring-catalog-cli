import fs from 'fs';
import path from 'path';

export function updatePackageJson(packageJson: any, repositoryName: string): any {
  return {
    ...packageJson,
    name: repositoryName,
    repository: `https://github.com/kaiosilveira/${repositoryName}.git`,
  };
}

export default function updatePackageJsonFile(repositoryName: string): void {
  const filepath = path.join(process.cwd(), 'package.json');
  const contents = fs.readFileSync(filepath, 'utf8');

  const updated = updatePackageJson(JSON.parse(contents), repositoryName);

  fs.writeFileSync(filepath, JSON.stringify(updated, null, 2));
}
