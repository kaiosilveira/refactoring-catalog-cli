export function mapCommitTextToDiffObj(commit: string): any {
  const [commitLine, authorLine, dateLine, messageLine, descriptionLine, ...contents] = commit
    .trim()
    .split('\n')
    .filter(l => l.trim() !== '');

  return {
    commit: commitLine.match(/commit (.*)/)?.[1],
    author: authorLine.match(/Author: (.*)/)?.[1],
    date: dateLine.match(/Date: (.*)/)?.[1].trim(),
    message: messageLine.trim(),
    description: descriptionLine.trim(),
    contents: contents.slice(3).join('\n'),
  };
}

export function mapCommitHistoryToDiffObjects(commitHistory: string): any[] {
  return [...commitHistory.matchAll(/(?=commit)/g)].map(d =>
    mapCommitTextToDiffObj(commitHistory.substring(d.index as unknown as number)),
  );
}
