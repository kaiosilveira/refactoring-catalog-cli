import { Octokit } from '@octokit/core';
import type * as yargs from 'yargs';

export default async function prepareRepository(argv: yargs.Arguments): Promise<void> {
  const repoName = argv['repo-name'] as string;
  const repoNameSnakeCase = repoName.split(' ').join('-').toLowerCase();
  const humanReadableRepoName = repoName.replace(/-/g, ' ');
  const baseURL = `/repos/kaiosilveira/${repoNameSnakeCase}-refactoring`;

  const github = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const repoMetadata = {
    description: `Working example with detailed commit history on the "${humanReadableRepoName}" refactoring based on Fowler's "Refactoring" book`,
    homepage: 'https://github.com/kaiosilveira/refactoring',
  };

  const tags = ['javascript', 'refactoring', repoNameSnakeCase];

  await github.request(`PATCH ${baseURL}`, repoMetadata);
  await github.request(`PUT ${baseURL}/topics`, { names: tags });
}
