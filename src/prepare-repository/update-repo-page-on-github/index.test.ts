import type * as GitHub from '@octokit/core';
import updateRepoPageOnGitHub from '.';

describe('updateRepoPageOnGitHub', () => {
  const repoName = 'move-field-refactoring';
  const baseURL = `/repos/kaiosilveira/${repoName}`;

  let octokit: typeof GitHub.Octokit.prototype;
  beforeEach(() => {
    octokit = { request: jest.fn() } as unknown as typeof GitHub.Octokit.prototype;
  });

  it('should update the repository description', async () => {
    const repoMetadata = {
      description: `Working example with detailed commit history on the "move field" refactoring based on Fowler's "Refactoring" book`,
    };

    await updateRepoPageOnGitHub(octokit)(repoName);

    expect(octokit.request).toHaveBeenCalledWith(
      `PATCH ${baseURL}`,
      expect.objectContaining(repoMetadata),
    );
  });

  it('should update the repository URL', async () => {
    const homepageURL = 'https://github.com/kaiosilveira/refactoring';
    await updateRepoPageOnGitHub(octokit)(repoName);
    expect(octokit.request).toHaveBeenCalledWith(
      `PATCH ${baseURL}`,
      expect.objectContaining({ homepage: homepageURL }),
    );
  });

  it('should update the repository tags', async () => {
    const tags = ['javascript', 'refactoring', 'move-field'];
    await updateRepoPageOnGitHub(octokit)(repoName);
    expect(octokit.request).toHaveBeenCalledWith(`PUT ${baseURL}/topics`, { names: tags });
  });
});
