import { exec } from 'child_process';
import yargs from 'yargs';

export function mapCommitTextToDiffObj(commit: string): any {
  const [commitLine, authorLine, dateLine, messageLine, ...contents] = commit
    .trim()
    .split('\n')
    .filter(l => l.trim() !== '');

  return {
    commit: commitLine.match(/commit (.*)/)?.[1],
    author: authorLine.match(/Author: (.*)/)?.[1],
    date: dateLine.match(/Date: (.*)/)?.[1].trim(),
    message: messageLine.trim(),
    contents: contents.slice(3).join('\n'),
  };
}

export function mapCommitHistoryToDiffObjects(commitHistory: string): any[] {
  const groups: string[] = [];

  let commit = '';
  for (const line of commitHistory.split('\n')) {
    if (/commit\s\w{40}/gi.test(line)) {
      if (commit) groups.push(commit);
      commit = line;
    } else {
      commit += '\n' + line;
    }
  }

  return groups.map(mapCommitTextToDiffObj);
}

export function generateCommitDiffMarkdown(diff: any): string {
  return `
- ${diff.message}:

\`\`\`diff
${diff.contents}
\`\`\`
  `;
}

export async function fetchReversedCommitHistoryWithPatch(props: {
  start?: string;
  end?: string;
  execFn: typeof exec;
}): Promise<string> {
  const { execFn, start, end } = props;
  return await new Promise((resolve, reject) => {
    const cmd =
      start && end ? `git log ${start}..${end} --patch --reverse` : 'git log --patch --reverse';

    execFn(cmd, (err, stdout) => {
      if (err === null) resolve(stdout);
      else reject(err);
    });
  });
}

export default async function generatePatchMarkdown(argv: yargs.Arguments): Promise<any> {
  const commitHistory = await fetchReversedCommitHistoryWithPatch({
    execFn: exec,
    start: argv['first-commit-SHA'] as string,
    end: argv['last-commit-SHA'] as string,
  });

  const diffObjs = mapCommitHistoryToDiffObjects(commitHistory);
  const markdown = diffObjs.map(generateCommitDiffMarkdown).join('\n');
  console.log(markdown);
}
