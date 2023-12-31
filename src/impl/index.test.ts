import { jest, expect } from '@jest/globals';
import { type ExecException, exec } from 'child_process';

import {
  fetchReversedOneLineCommitHistory,
  createCommitHistoryTableHeaders,
  createCommitHistoryTableRow,
} from '.';

jest.mock('child_process');
const execFn = jest.mocked(exec);

describe('fetchReversedOneLineCommitHistory', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an exception in case of failure', async () => {
    const mockFn = (
      _cmd: string,
      callback: (err: ExecException | null, stdout: string) => void,
    ): any => {
      callback(new Error('Failed to list commits'), '');
    };

    execFn.mockImplementationOnce(mockFn as unknown as typeof exec);

    await expect(
      fetchReversedOneLineCommitHistory({ execFn: execFn as unknown as typeof exec }),
    ).rejects.toThrow();
  });

  it('should fetch a git log --oneline --reverse --no-abbrev-commit history of the repository', async () => {
    const output = [
      'a055f7be4a4fe35ed1dc7d0afeb1e34add6882b9 docs: update CI badge for the template',
      'e066530f8e269db073fd140856b2cf08733d2115 chore(prettier): add semi: true',
    ].join('\n');

    const mockFn = (
      _cmd: string,
      callback: (err: ExecException | null, stdout: string) => void,
    ): any => {
      callback(null, output);
    };

    execFn.mockImplementationOnce(mockFn as unknown as typeof exec);

    const result = await fetchReversedOneLineCommitHistory({
      execFn: execFn as unknown as typeof exec,
    });

    expect(result).toHaveLength(2);
    const firstCommit = result[0];
    const secondCommit = result[1];
    expect(firstCommit.sha).toEqual('a055f7be4a4fe35ed1dc7d0afeb1e34add6882b9');
    expect(firstCommit.msg).toEqual('docs: update CI badge for the template');

    expect(secondCommit.sha).toEqual('e066530f8e269db073fd140856b2cf08733d2115');
    expect(secondCommit.msg).toEqual('chore(prettier): add semi: true');

    expect(execFn).toHaveBeenCalledWith(
      'git log --oneline --reverse --no-abbrev-commit',
      expect.any(Function),
    );
  });

  it('should ignore blank lines', async () => {
    const output = [
      'a055f7be4a4fe35ed1dc7d0afeb1e34add6882b9 docs: update CI badge for the template',
      'e066530f8e269db073fd140856b2cf08733d2115 chore(prettier): add semi: true',
      '',
    ].join('\n');

    const mockFn = (
      _cmd: string,
      callback: (err: ExecException | null, stdout: string) => void,
    ): any => {
      callback(null, output);
    };

    execFn.mockImplementation(mockFn as unknown as typeof exec);

    const result = await fetchReversedOneLineCommitHistory({
      execFn: execFn as unknown as typeof exec,
    });

    expect(result).toHaveLength(2);
    const firstCommit = result[0];
    const secondCommit = result[1];
    expect(firstCommit.sha).toEqual('a055f7be4a4fe35ed1dc7d0afeb1e34add6882b9');
    expect(firstCommit.msg).toEqual('docs: update CI badge for the template');

    expect(secondCommit.sha).toEqual('e066530f8e269db073fd140856b2cf08733d2115');
    expect(secondCommit.msg).toEqual('chore(prettier): add semi: true');

    expect(execFn).toHaveBeenCalledWith(
      'git log --oneline --reverse --no-abbrev-commit',
      expect.any(Function),
    );
  });
});

describe('createCommitHistoryTableHeaders', () => {
  it('should create the markdown headers for the commit history table', () => {
    expect(createCommitHistoryTableHeaders()).toEqual(
      ['| Commit SHA | Message |', '| ---------- | ------- |'].join('\n'),
    );
  });
});

describe('createCommitHistoryTableRow', () => {
  const repoName = 'encapsulate-record-refactoring';
  const cmtData = {
    sha: 'a055f7be4a4fe35ed1dc7d0afeb1e34add6882b9',
    msg: 'docs: update CI badge for the template',
  };

  const firstSevenDigitsOfCommitSHA = cmtData.sha.slice(0, 7);
  const cmtURL = `https://github.com/kaiosilveira/${repoName}/commit/${cmtData.sha}`;

  expect(createCommitHistoryTableRow(repoName, cmtData)).toEqual(
    `| [${firstSevenDigitsOfCommitSHA}](${cmtURL}) | ${cmtData.msg} |`,
  );
});
