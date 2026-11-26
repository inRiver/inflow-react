import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { describe, it } from 'node:test';

// A process cannot change its own timezone once it has started, so the datetime tests run again as separate processes
// whose host timezone is set: one with a daylight saving gap, and one far ahead of UTC.
const vitest = join(process.cwd(), 'node_modules', 'vitest', 'vitest.mjs');
const zones = ['America/New_York', 'Pacific/Kiritimati'];

describe('datetime formatters in other host timezones', () => {
  for (const zone of zones) {
    it(`give the same results with the host in ${zone}`, () => {
      const result = spawnSync(
        process.execPath,
        [
          vitest,
          'run',
          'src/datetime/format.test.ts',
          'src/datetime/formatEdgeCases.test.ts',
          'src/datetime/dayFilter.test.ts',
          'src/datetime/pickerTimeZone.test.tsx',
        ],
        { cwd: process.cwd(), encoding: 'utf8', env: { ...process.env, TZ: zone, INFLOW_HOST_TZ: zone } },
      );
      assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    });
  }
});
