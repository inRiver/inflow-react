import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { docsRoutes, router } from './routes';

describe('llms.txt documentation index', () => {
  it('contains a deployed hash-router link for every registered docs route', () => {
    const text = readFileSync('public/llms.txt', 'utf8');
    const paths = Array.from(text.matchAll(/https:\/\/inriver\.github\.io\/inflow-react\/#\/([^\s)]+)/g), (match) => match[1]);
    const registered = router.routes[0].children?.map((route) => route.path);
    expect(docsRoutes.length).toBeGreaterThan(0);
    for (const route of docsRoutes) {
      expect(registered).toContain(route.path);
      expect(paths, `Missing hash URL for /${route.path}`).toContain(route.path);
    }
    for (const path of paths) {
      expect(registered, `llms.txt links unregistered route /${path}`).toContain(path);
    }
  });
});
