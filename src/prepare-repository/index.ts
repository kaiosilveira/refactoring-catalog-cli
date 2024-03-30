import type * as yargs from 'yargs';
import updateRepoPageOnGitHub from './update-repo-page-on-github';
import updateReadmeFile from './update-readme';
import { Octokit } from '@octokit/core';

export default async function prepareRepository(argv: yargs.Arguments): Promise<void> {
  const repoName = argv['repo-name'] as string;

  updateReadmeFile(repoName);

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  await updateRepoPageOnGitHub(octokit)(repoName);
}
