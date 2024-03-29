import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import {
  mapCommitTextToDiffObj,
  mapCommitHistoryToDiffObjects,
  generateCommitDiffMarkdown,
  fetchReversedCommitHistoryWithPatch,
} from '.';

const diff = fs.readFileSync(path.join(__dirname, 'data.diff'), 'utf-8');

describe('mapCommitTextToDiffObj', () => {
  it('should convert the commit string into a diff object', () => {
    const commit = `
      commit 13b64a068556a5b637c0e0e66d4382b5be0667dd
      Author: Kaio Silveira <silveira.kaio@icloud.com>
      Date:   Fri Mar 29 12:47:14 2024 +0000

          distance-travelled: rename \`acc\` to \`primaryAcceleration\` and redeclare \`acc\` later

      diff --git a/src/distance-travelled/index.js b/src/distance-travelled/index.js
      index d2aa02b..0791bd6 100644
      --- a/src/distance-travelled/index.js
      +++ b/src/distance-travelled/index.js
      @@ -1,12 +1,12 @@
      export function distanceTravelled(scenario, time) {
        let result;
      -  let acc = scenario.primaryForce / scenario.mass;
      +  let primaryAcceleration = scenario.primaryForce / scenario.mass;
        let primaryTime = Math.min(time, scenario.delay);
      -  result = 0.5 * acc * primaryTime * primaryTime;
      +  result = 0.5 * primaryAcceleration * primaryTime * primaryTime;
        let secondaryTime = time - scenario.delay;
        if (secondaryTime > 0) {
      -    let primaryVelocity = acc * scenario.delay;
      -    acc = (scenario.primaryForce + scenario.secondaryForce) / scenario.mass;
      +    let primaryVelocity = primaryAcceleration * scenario.delay;
      +    let acc = (scenario.primaryForce + scenario.secondaryForce) / scenario.mass;
          result += primaryVelocity * secondaryTime + 0.5 * acc * secondaryTime * secondaryTime;
        }
        return result;
    `;

    const diff = mapCommitTextToDiffObj(commit);

    expect(diff.commit).toEqual('13b64a068556a5b637c0e0e66d4382b5be0667dd');
    expect(diff.author).toEqual('Kaio Silveira <silveira.kaio@icloud.com>');
    expect(diff.date).toEqual('Fri Mar 29 12:47:14 2024 +0000');

    expect(diff.message).toEqual(
      'distance-travelled: rename `acc` to `primaryAcceleration` and redeclare `acc` later',
    );

    expect(diff.contents.split('\n').map((l: string) => l.trim())).toEqual(
      `
        +++ b/src/distance-travelled/index.js
        @@ -1,12 +1,12 @@
        export function distanceTravelled(scenario, time) {
          let result;
        -  let acc = scenario.primaryForce / scenario.mass;
        +  let primaryAcceleration = scenario.primaryForce / scenario.mass;
          let primaryTime = Math.min(time, scenario.delay);
        -  result = 0.5 * acc * primaryTime * primaryTime;
        +  result = 0.5 * primaryAcceleration * primaryTime * primaryTime;
          let secondaryTime = time - scenario.delay;
          if (secondaryTime > 0) {
        -    let primaryVelocity = acc * scenario.delay;
        -    acc = (scenario.primaryForce + scenario.secondaryForce) / scenario.mass;
        +    let primaryVelocity = primaryAcceleration * scenario.delay;
        +    let acc = (scenario.primaryForce + scenario.secondaryForce) / scenario.mass;
            result += primaryVelocity * secondaryTime + 0.5 * acc * secondaryTime * secondaryTime;
          }
          return result;
      `
        .trim()
        .split('\n')
        .map((l: string) => l.trim()),
    );
  });
});

describe('mapCommitHistoryToDiffObjects', () => {
  it('should convert the commit history string into an array of diff objects', () => {
    const diffs = mapCommitHistoryToDiffObjects(diff);
    expect(diffs.some(d => d.commit === '13b64a068556a5b637c0e0e66d4382b5be0667dd')).toBeTruthy();
    expect(diffs.some(d => d.commit === 'd9435cc944a2a56f5e9241484fd2302980927b42')).toBeTruthy();
  });
});

describe('generateCommitDiffMarkdown', () => {
  it('should generate a markdown containing the commit history', () => {
    const diff = {
      commit: '13b64a068556a5b637c0e0e66d4382b5be0667dd',
      author: 'Kaio Silveira <silveira.kaio@icloud.com>',
      date: 'Fri Mar 29 12:47:14 2024 +0000',
      message:
        'distance-travelled: rename `acc` to `primaryAcceleration` and redeclare `acc` later',
      contents:
        '@@ -1,12 +1,12 @@\n' +
        ' export function distanceTravelled(scenario, time) {\n' +
        '   let result;\n' +
        '-  let acc = scenario.primaryForce / scenario.mass;\n' +
        '+  let primaryAcceleration = scenario.primaryForce / scenario.mass;\n' +
        '   let primaryTime = Math.min(time, scenario.delay);\n' +
        '-  result = 0.5 * acc * primaryTime * primaryTime;\n' +
        '+  result = 0.5 * primaryAcceleration * primaryTime * primaryTime;\n' +
        '   let secondaryTime = time - scenario.delay;\n' +
        '   if (secondaryTime > 0) {\n' +
        '-    let primaryVelocity = acc * scenario.delay;\n' +
        '-    acc = (scenario.primaryForce + scenario.secondaryForce) / scenario.mass;\n' +
        '+    let primaryVelocity = primaryAcceleration * scenario.delay;\n' +
        '+    let acc = (scenario.primaryForce + scenario.secondaryForce) / scenario.mass;\n' +
        '     result += primaryVelocity * secondaryTime + 0.5 * acc * secondaryTime * secondaryTime;\n' +
        '   }\n' +
        '   return result;\n' +
        'commit d9435cc944a2a56f5e9241484fd2302980927b42\n' +
        'Author: Kaio Silveira <silveira.kaio@icloud.com>\n' +
        'Date:   Fri Mar 29 13:36:27 2024 +0000\n' +
        '    distance-travelled: make `primaryAcceleration` a `const`\n' +
        'diff --git a/src/distance-travelled/index.js b/src/distance-travelled/index.js\n' +
        'index 0791bd6..51eaca1 100644\n' +
        '--- a/src/distance-travelled/index.js\n' +
        '+++ b/src/distance-travelled/index.js\n' +
        '@@ -1,6 +1,6 @@\n' +
        ' export function distanceTravelled(scenario, time) {\n' +
        '   let result;\n' +
        '-  let primaryAcceleration = scenario.primaryForce / scenario.mass;\n' +
        '+  const primaryAcceleration = scenario.primaryForce / scenario.mass;\n' +
        '   let primaryTime = Math.min(time, scenario.delay);\n' +
        '   result = 0.5 * primaryAcceleration * primaryTime * primaryTime;\n' +
        '   let secondaryTime = time - scenario.delay;',
    };

    expect(
      generateCommitDiffMarkdown(diff)
        .trim()
        .split('\n')
        .map(l => l.trim()),
    ).toEqual(
      `
      - ${diff.message}:

      \`\`\`diff
      ${diff.contents}
      \`\`\`
    `
        .trim()
        .split('\n')
        .map(l => l.trim()),
    );
  });
});

describe('fetchReversedCommitHistoryWithPatch', () => {
  it('should fetch the commit history with patch', async () => {
    const execFn = jest.fn((cmd, cb) => cb(null, diff)) as unknown as typeof exec;
    const commitHistory = await fetchReversedCommitHistoryWithPatch({ execFn });

    expect(execFn).toHaveBeenCalledWith('git log --patch --reverse', expect.any(Function));
    expect(commitHistory).toEqual(diff);
  });

  it('should fetch the commit history with patch between two commits', async () => {
    const execFn = jest.fn((cmd, cb) => cb(null, diff)) as unknown as typeof exec;
    const commitHistory = await fetchReversedCommitHistoryWithPatch({
      execFn,
      start: 'sha123',
      end: 'sha456',
    });

    expect(execFn).toHaveBeenCalledWith(
      'git log sha123..sha456 --patch --reverse',
      expect.any(Function),
    );

    expect(commitHistory).toEqual(diff);
  });
});
