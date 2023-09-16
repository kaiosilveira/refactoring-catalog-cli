#!/usr/bin/env node

import { exec } from 'child_process';
import { argv } from 'process';
import {
  createCommitHistoryTableHeaders,
  createCommitHistoryTableRow,
  fetchReversedOneLineCommitHistory,
} from './impl';

(async () => {
  const repoName = argv[2];

  const history = await fetchReversedOneLineCommitHistory({ execFn: exec });
  const headers = createCommitHistoryTableHeaders();
  const body = history.map(createCommitHistoryTableRow.bind(null, repoName)).join('\n');
  const table = [headers, body].join('\n');

  console.log(table);
})().catch(console.log);
