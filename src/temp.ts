import { exec } from 'child_process';
import {
  fetchReversedCommitHistoryWithPatch,
  generateCommitDiffMarkdown,
  mapCommitHistoryToDiffObjects,
} from './generate-diff';

(async () => {
  const commitHistory = await fetchReversedCommitHistoryWithPatch({ execFn: exec });
  const diffObjs = mapCommitHistoryToDiffObjects(commitHistory).reverse().slice(0, 1);
  const markdown = diffObjs.map(generateCommitDiffMarkdown).join('\n');
  console.log(markdown);
})().catch(console.log);
