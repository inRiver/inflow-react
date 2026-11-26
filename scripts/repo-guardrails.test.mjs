import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');

describe('repository guardrails', () => {
  it('points every CODEOWNERS rule at an existing path and a valid owner', () => {
    const owner = /^@[\w.-]+(\/[\w.-]+)?$|^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const rules = read('.github/CODEOWNERS')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));
    assert.ok(rules.length > 0, 'CODEOWNERS has no rules');

    for (const rule of rules) {
      const [pattern, ...owners] = rule.split(/\s+/);
      assert.ok(owners.length > 0 && owners.every((name) => owner.test(name)), `${pattern} has no valid owner`);
      assert.ok(existsSync(join(root, pattern.replace(/^\//, ''))), `${pattern} matches nothing`);
    }
  });

  it('documents only npm scripts that exist', () => {
    const { scripts } = JSON.parse(read('package.json'));
    for (const file of ['AGENTS.md', 'docs/CONTRIBUTING.md', '.github/pull_request_template.md']) {
      for (const [, run, shorthand] of read(file).matchAll(/npm run ([\w:-]+)|npm (test|start)\b/g)) {
        const name = run ?? shorthand;
        assert.ok(name in scripts, `${file} mentions "npm ${name}", which package.json does not define`);
      }
    }
  });
});
