#!/usr/bin/env node

import * as yargs from 'yargs';
import generateCommitHistoryTable from './generate-cmt-table';
import generatePatchMarkdown from './generate-diff';
import prepareRepository from './prepare-repository';

(async () => {
  await yargs
    .scriptName('@kaiosilveira/refactoring-catalog-cli')
    .usage('$0 <cmd> [args]')
    .command(
      'generate-cmt-table',
      'Generates a markdown table containing the commit history',
      async yargs => {
        return await yargs.usage('Usage: -r <repository_name>').option('r', {
          alias: 'repo-name',
          describe: 'Your repository name',
          type: 'string',
          demandOption: true,
        }).argv;
      },
      generateCommitHistoryTable,
    )
    .command(
      'generate-diff',
      'Generates a markdown diff between two commits',
      async yargs => {
        return await yargs
          .usage('Usage: -f <first_commit_SHA> -l <last_commit_SHA>')
          .option('f', {
            alias: 'first-commit-SHA',
            describe: 'The first commit SHA',
            type: 'string',
            demandOption: true,
          })
          .option('l', {
            alias: 'last-commit-SHA',
            describe: 'The last commit SHA',
            type: 'string',
            demandOption: true,
          }).argv;
      },
      generatePatchMarkdown,
    )
    .command(
      'prepare-repository',
      'Prepare the repository with metadata and tags',
      async yargs => {
        return await yargs.usage('Usage: -r <repository_name>').option('r', {
          alias: 'repo-name',
          describe: 'Your repository name',
          type: 'string',
          demandOption: true,
        }).argv;
      },
      prepareRepository,
    )
    .strictCommands()
    .demandCommand(1, 'You need at least one command before moving on')
    .parse();
})().catch(console.log);
