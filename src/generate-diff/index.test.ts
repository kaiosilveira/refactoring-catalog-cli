import { mapCommitTextToDiffObj } from '.';

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

    expect(diff.description).toEqual(
      'diff --git a/src/distance-travelled/index.js b/src/distance-travelled/index.js',
    );

    expect(diff.contents.split('\n').map((l: string) => l.trim())).toEqual(
      `
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
