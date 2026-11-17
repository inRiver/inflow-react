import { parseArgs } from 'node:util';

export interface Prop {
  name: string;
  type: string;
  optional: boolean;
  jsdoc: string | null;
  deprecated?: boolean;
  source?: string;
}

export interface Component {
  componentName: string;
  description: string | null;
  usageExample: string | null;
  deprecated: boolean;
  extends: string[];
  props: Prop[];
  status: string;
  reasons: string[];
  typeParameters: string[];
}

export interface Manifest {
  components: Component[];
  tokens: Record<string, unknown>;
  docs: Record<string, string>;
}

interface SearchResult {
  type: 'component' | 'token' | 'doc';
  name: string;
  description: string;
  command: string;
  score: number;
}

export interface Response {
  ok: boolean;
  command: string;
  data?: unknown;
  error?: string;
}

export interface Output {
  response: Response;
  text: string;
  json: boolean;
}

const help = `Usage:
  inflow component --list [--json]
  inflow component <Name> [--json]
  inflow tokens [--json]
  inflow search <query> [--json]
  inflow docs <setup|theming|migration> [--json]
  inflow --help [--json]`;

function tokenLeaves(value: unknown, prefix = ''): { path: string; value: unknown }[] {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([key, child]) => tokenLeaves(child, prefix ? `${prefix}.${key}` : key));
  }
  return [{ path: prefix, value }];
}

// Exact and substring hits precede subsequence hits; ties are alphabetical.
function score(query: string, name: string, description: string): number {
  const key = name.toLowerCase();
  const detail = description.toLowerCase();
  if (key === query) return 0;
  if (key.startsWith(query)) return 1;
  if (key.includes(query)) return 2;
  if (detail.includes(query)) return 3;
  let index = 0;
  for (const char of key) if (char === query[index]) index++;
  return index === query.length ? 4 : -1;
}

function search(manifest: Manifest, query: string): SearchResult[] {
  const candidates: Omit<SearchResult, 'score'>[] = [
    ...manifest.components.map((component) => ({
      type: 'component' as const, name: component.componentName,
      description: component.description ?? '', command: `inflow component ${component.componentName}`,
    })),
    ...tokenLeaves(manifest.tokens).map(({ path, value }) => ({
      type: 'token' as const, name: path, description: String(value), command: 'inflow tokens',
    })),
    ...Object.entries(manifest.docs).map(([name, description]) => ({
      type: 'doc' as const, name, description, command: `inflow docs ${name}`,
    })),
  ];
  return candidates.map((candidate) => ({ ...candidate, score: score(query.toLowerCase(), candidate.name, candidate.description) }))
    .filter((result) => result.score >= 0)
    .sort((a, b) => a.score - b.score || a.name.localeCompare(b.name) || a.type.localeCompare(b.type));
}

function formatComponent(component: Component): string {
  const lines = [component.componentName, component.description ?? 'No description available.', `Deprecated: ${component.deprecated ? 'yes' : 'no'}`];
  if (component.typeParameters.length) lines.push(`Type parameters: ${component.typeParameters.join(', ')}`);
  if (component.extends.length) lines.push(`Extends: ${component.extends.join(', ')}`);
  lines.push('Owned props:');
  if (!component.props.length) lines.push('  (none)');
  for (const prop of component.props) {
    lines.push(`  ${prop.name}${prop.optional ? '?' : ''}: ${prop.type}${prop.deprecated ? ' [deprecated]' : ''}${prop.source ? ` [${prop.source}]` : ''}`);
    if (prop.jsdoc) lines.push(`    ${prop.jsdoc}`);
  }
  if (component.status !== 'ok') lines.push(`Notes: ${component.reasons.join('; ')}`);
  lines.push(`Usage example: ${component.usageExample ?? 'not available.'}`);
  return lines.join('\n');
}

export function execute(args: string[], manifest: Manifest): Output {
  const json = args.includes('--json');
  let command = args.find((arg) => !arg.startsWith('-')) ?? 'help';
  const fail = (error: string): Output => ({ json, response: { ok: false, command, error }, text: error });
  try {
    const parsed = parseArgs({ args, allowPositionals: true, options: {
      json: { type: 'boolean' }, help: { type: 'boolean' }, list: { type: 'boolean' },
    } });
    const [action, ...positionals] = parsed.positionals;
    command = action ?? 'help';
    const success = (data: unknown, text: string): Output => ({ json, response: { ok: true, command, data }, text });
    if (!action || parsed.values.help) {
      if (parsed.values.list || positionals.length) return fail('Unexpected arguments for help.');
      return success(help, help);
    }
    if (action === 'component') {
      if (parsed.values.list && positionals.length === 0) {
        return success(manifest.components, manifest.components.map((item) => `${item.componentName} — ${item.description ?? 'No description available.'}${item.deprecated ? ' [deprecated]' : ''}`).join('\n'));
      }
      if (parsed.values.list || positionals.length !== 1) return fail('Use inflow component --list or inflow component <Name>.');
      const component = manifest.components.find((item) => item.componentName.toLowerCase() === positionals[0].toLowerCase());
      if (!component) return fail(`Unknown component: ${positionals[0]}`);
      return success(component, formatComponent(component));
    }
    if (parsed.values.list) return fail('--list is only valid for component.');
    if (action === 'tokens') {
      if (positionals.length) return fail('Use inflow tokens.');
      const text = Object.entries(manifest.tokens).map(([group, value]) => `${group}:\n${tokenLeaves(value).map((leaf) => `  ${leaf.path}: ${String(leaf.value)}`).join('\n')}`).join('\n');
      return success(manifest.tokens, text);
    }
    if (action === 'search') {
      if (positionals.length !== 1 || !positionals[0].trim()) return fail('Use inflow search <query>.');
      const query = positionals[0].trim();
      const results = search(manifest, query);
      return success({ query, matchCount: results.length, results }, results.length
        ? results.map((item) => `[${item.type}] ${item.name} — ${item.command}`).join('\n')
        : `No matches for "${query}".`);
    }
    if (action === 'docs') {
      if (positionals.length !== 1) return fail('Use inflow docs <setup|theming|migration>.');
      const topic = positionals[0].toLowerCase();
      if (!Object.hasOwn(manifest.docs, topic)) return fail(`Unknown topic: ${positionals[0]}`);
      return success({ topic, summary: manifest.docs[topic] }, `${topic}\n${manifest.docs[topic]}`);
    }
    return fail(`Unknown command: ${action}`);
  } catch (error) {
    return fail(error instanceof Error ? error.message : String(error));
  }
}
