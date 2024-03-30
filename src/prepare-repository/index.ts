import type * as yargs from 'yargs';
import updateRepoPageOnGitHub from './update-repo-page-on-github';

export default async function prepareRepository(argv: yargs.Arguments): Promise<void> {
  const repoName = argv['repo-name'] as string;
  await updateRepoPageOnGitHub(repoName);
}
