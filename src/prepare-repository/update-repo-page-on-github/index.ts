import type * as GitHub from '@octokit/core';

export default function updateRepoPageOnGitHub(github: typeof GitHub.Octokit.prototype) {
  return async function (repoName: string): Promise<void> {
    const repoNameSnakeCase = repoName.split(' ').join('-').toLowerCase();
    const humanReadableRepoName = repoName.split('-').slice(0, -1).join(' ');

    const baseURL = `/repos/kaiosilveira/${repoNameSnakeCase}`;

    const repoMetadata = {
      description: `Working example with detailed commit history on the "${humanReadableRepoName}" refactoring based on Fowler's "Refactoring" book`,
      homepage: 'https://github.com/kaiosilveira/refactoring',
    };

    const tags = ['javascript', 'refactoring', repoNameSnakeCase.split('-').slice(0, -1).join('-')];

    await github.request(`PATCH ${baseURL}`, repoMetadata);
    await github.request(`PUT ${baseURL}/topics`, { names: tags });
  };
}
