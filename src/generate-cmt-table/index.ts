import { type exec } from 'child_process';

export async function fetchReversedOneLineCommitHistory(props: {
  execFn: typeof exec;
}): Promise<Array<{ sha: string; msg: string }>> {
  const { execFn } = props;
  return await new Promise((resolve, reject) => {
    execFn('git log --oneline --reverse --no-abbrev-commit', (err, stdout) => {
      if (err !== null) {
        reject(err);
      }

      const commits = stdout
        .split('\n')
        .map(commit => {
          const firstSpaceIdx = commit.indexOf(' ');
          const [sha, msg] = [
            commit.substring(0, firstSpaceIdx),
            commit.substring(firstSpaceIdx + 1),
          ];
          return { sha, msg };
        })
        .filter(({ sha }) => sha !== '');

      resolve(commits);
    });
  });
}

export function createCommitHistoryTableHeaders(): string {
  return ['| Commit SHA | Message |', '| ---------- | ------- |'].join('\n');
}

export function createCommitHistoryTableRow(
  repoName: string,
  cmt: { sha: string; msg: string },
): string {
  const { sha, msg } = cmt;
  const cmtURL = `https://github.com/kaiosilveira/${repoName}/commit/${sha}`;
  return `| [${sha.slice(0, 7)}](${cmtURL}) | ${msg} |`;
}
