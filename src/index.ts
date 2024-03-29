#!/usr/bin/env node

import * as yargs from 'yargs';
import generateCommitHistoryTable from './generate-cmt-table';

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
    .strictCommands()
    .demandCommand(1, 'You need at least one command before moving on')
    .parse();
})().catch(console.log);
