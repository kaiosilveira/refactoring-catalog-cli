import { Octokit } from '@octokit/core';

export default async function updateRepoPageOnGitHub(repoName: string): Promise<void> {
  const repoNameSnakeCase = repoName.split(' ').join('-').toLowerCase();
  const humanReadableRepoName = repoName.replace(/-/g, ' ');

  const baseURL = `/repos/kaiosilveira/${repoNameSnakeCase}`;
  const github = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const repoMetadata = {
    description: `Working example with detailed commit history on the "${humanReadableRepoName}" refactoring based on Fowler's "Refactoring" book`,
    homepage: 'https://github.com/kaiosilveira/refactoring',
  };

  const tags = ['javascript', 'refactoring', repoNameSnakeCase];

  await github.request(`PATCH ${baseURL}`, repoMetadata);
  await github.request(`PUT ${baseURL}/topics`, { names: tags });
}
