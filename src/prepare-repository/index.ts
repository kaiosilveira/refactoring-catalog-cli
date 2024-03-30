import type * as yargs from 'yargs';
import updateRepoPageOnGitHub from './update-repo-page-on-github';
import updateReadmeFile from './update-readme';

export default async function prepareRepository(argv: yargs.Arguments): Promise<void> {
  const repoName = argv['repo-name'] as string;
  updateReadmeFile(repoName);
  await updateRepoPageOnGitHub(repoName);
}
