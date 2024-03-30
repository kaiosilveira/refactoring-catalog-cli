import { updatePackageJson } from '.';

const packageJson = `
{
  "type": "module",
  "name": "refactoring-catalog-template",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "https://github.com/kaiosilveira/refactoring-catalog-template.git",
  "author": "Kaio Silveira <silveira.kaio@icloud.com>",
  "license": "MIT",
  "scripts": {
    "test": "NODE_OPTIONS=--experimental-vm-modules jest /src --passWithNoTests",
    "tools:cli": "npx @kaiosilveira/refactoring-catalog-cli"
  },
  "devDependencies": {
    "jest": "^29.0.3",
    "@kaiosilveira/refactoring-catalog-cli": "0.3.31"
  }
}
`.trim();

describe('updatePackageJson', () => {
  const repositoryName = 'move-field-refactoring';
  const parsedPackageJson = JSON.parse(packageJson);

  it('should update the repository name', () => {
    const updatedPackageJson = updatePackageJson(parsedPackageJson, repositoryName);
    expect(updatedPackageJson.name).toBe(repositoryName);
  });

  it('should update the repository URL', () => {
    const updatedPackageJson = updatePackageJson(parsedPackageJson, repositoryName);
    expect(updatedPackageJson.repository).toBe(
      `https://github.com/kaiosilveira/${repositoryName}.git`,
    );
  });
});
