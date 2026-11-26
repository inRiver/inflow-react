// Extract wrapper-owned prop declarations from the source public barrel.
// Writes JSON to stdout, or to dist/cli/manifest.json with --write.
import ts from 'typescript';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const barrel = path.join(root, 'src/components/themed/index.ts');
const infoPath = path.join(root, 'src/showcase/themedComponentInfo.ts');
const config = ts.readConfigFile(path.join(root, 'tsconfig.app.json'), ts.sys.readFile);
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
if (parsed.errors.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(parsed.errors, {
  getCurrentDirectory: () => root, getCanonicalFileName: (file) => file, getNewLine: () => '\n',
}));
const program = ts.createProgram([barrel, infoPath], parsed.options);
const checker = program.getTypeChecker();
const barrelFile = program.getSourceFile(barrel);
const infoFile = program.getSourceFile(infoPath);
if (!barrelFile || !infoFile) throw new Error('Could not load barrel or showcase metadata');

const unalias = (symbol) => symbol?.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
const text = (node) => node.getText().trim();
const docs = (symbol) => ts.displayPartsToString(symbol?.getDocumentationComment(checker) ?? []) || null;

// Parse the object literal itself, without evaluating arbitrary showcase code.
const metadataDeclaration = infoFile.statements
  .filter(ts.isVariableStatement)
  .flatMap((statement) => [...statement.declarationList.declarations])
  .find((declaration) => declaration.name.getText() === 'THEMED_COMPONENT_INFO');
if (!metadataDeclaration?.initializer || !ts.isObjectLiteralExpression(metadataDeclaration.initializer)) {
  throw new Error('Expected THEMED_COMPONENT_INFO object literal');
}
const descriptions = new Map();
for (const entry of metadataDeclaration.initializer.properties) {
  if (!ts.isPropertyAssignment(entry) || !ts.isObjectLiteralExpression(entry.initializer)) {
    throw new Error('Unsupported metadata entry');
  }
  const fields = new Map(entry.initializer.properties.map((field) => {
    if (!ts.isPropertyAssignment(field) || !ts.isStringLiteral(field.initializer)) {
      throw new Error(`Unsupported metadata field in ${entry.name.getText()}`);
    }
    return [field.name.getText(), field.initializer.text];
  }));
  const name = fields.get('themedName');
  const reason = fields.get('reason');
  if (!name || !reason || descriptions.has(name)) throw new Error(`Invalid or duplicate metadata: ${name}`);
  descriptions.set(name, reason);
}

// Resolve local type aliases (e.g. ThemedPageHeaderProps = PageHeaderProps),
// but keep external aliases, unions and intersections explicit rather than
// pretending the checker's common-property flattening describes every branch.
function ownMembers(declaration, visited = new Set()) {
  if (visited.has(declaration)) return { members: [], bases: [], issues: ['Recursive props alias'] };
  visited.add(declaration);
  if (ts.isInterfaceDeclaration(declaration)) {
    return {
      members: [...declaration.members],
      bases: declaration.heritageClauses?.flatMap((clause) => clause.types.map(text)) ?? [],
      issues: [],
      parameters: declaration.typeParameters?.map(text) ?? [],
    };
  }
  if (ts.isTypeAliasDeclaration(declaration)) {
    const node = declaration.type;
    if (ts.isTypeLiteralNode(node)) return { members: [...node.members], bases: [], issues: [], parameters: declaration.typeParameters?.map(text) ?? [] };
    if (ts.isTypeReferenceNode(node)) {
      const target = unalias(checker.getSymbolAtLocation(node.typeName));
      const local = target?.declarations?.find((d) => (ts.isInterfaceDeclaration(d) || ts.isTypeAliasDeclaration(d)) &&
        !path.relative(path.join(root, 'src/components/themed'), d.getSourceFile().fileName).startsWith('..'));
      if (local && !node.typeArguments?.length) return ownMembers(local, visited);
      return { members: [], bases: [text(node)], issues: ['External or instantiated props alias not flattened'], parameters: declaration.typeParameters?.map(text) ?? [] };
    }
    return { members: [], bases: [text(node)], issues: ['Union/intersection or other props alias not flattened'], parameters: declaration.typeParameters?.map(text) ?? [] };
  }
  return { members: [], bases: [], issues: ['Unsupported props declaration'] };
}

const exports = checker.getExportsOfModule(checker.getSymbolAtLocation(barrelFile));
const components = [];
for (const exported of exports) {
  const symbol = unalias(exported);
  if (!exported.name.startsWith('Themed') || !(symbol.flags & ts.SymbolFlags.Value)) continue;
  const name = exported.name;
  const reasons = [];
  const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0];
  const source = declaration?.getSourceFile();
  const propsName = `${name}Props`;
  const sourceExports = source && checker.getExportsOfModule(checker.getSymbolAtLocation(source));
  const propsSymbol = unalias(sourceExports?.find((candidate) => candidate.name === propsName));
  const propsDeclaration = propsSymbol?.declarations?.find((d) => ts.isInterfaceDeclaration(d) || ts.isTypeAliasDeclaration(d));
  // Avoid silently pairing an unrelated conventionally named type with a component.
  let referenced = false;
  function visit(node) {
    if (ts.isTypeReferenceNode(node) && text(node.typeName) === propsName) referenced = true;
    ts.forEachChild(node, visit);
  }
  if (declaration) visit(declaration);
  const sourceDescription = docs(symbol)?.replace(/\s+/g, ' ').replace(new RegExp(`^${name}\\s+`), '').split(/(?<=\.)\s/)[0];
  const result = {
    componentName: name,
    source: source ? path.relative(root, source.fileName).replaceAll('\\', '/') : null,
    description: descriptions.get(name) ?? sourceDescription ?? `Inflow component ${name}.`,
    descriptionSource: descriptions.has(name) ? 'showcase' : sourceDescription ? 'jsdoc' : 'fallback',
    // Demo snippets are not consistently self-contained, so do not invent examples.
    usageExample: null,
    deprecated: symbol.getJsDocTags(checker).some((tag) => tag.name === 'deprecated'),
    propsInterface: propsDeclaration ? propsName : null,
    typeParameters: [],
    extends: [],
    props: [],
    status: 'ok',
    reasons,
  };
  if (!propsDeclaration || !referenced) {
    result.status = 'failed';
    reasons.push(!propsDeclaration ? `No exported ${propsName} declaration found` : `Could not verify component references ${propsName}`);
    components.push(result);
    continue;
  }
  const own = ownMembers(propsDeclaration);
  result.typeParameters = own.parameters ?? [];
  result.extends = own.bases;
  if (own.bases.length) reasons.push(`Inherited or aliased props not flattened: ${own.bases.join(', ')}`);
  reasons.push(...own.issues);
  if (result.typeParameters.length) reasons.push('Generic types preserved as source text; referenced shapes are not expanded');
  for (const member of own.members) {
    if (!ts.isPropertySignature(member) || !member.name || !member.type) {
      reasons.push(`Unsupported prop member: ${text(member)}`);
      continue;
    }
    const property = checker.getSymbolAtLocation(member.name);
    result.props.push({
      name: property?.getName() ?? text(member.name),
      type: text(member.type),
      optional: Boolean(member.questionToken),
      jsdoc: docs(property),
      ...(property?.getJsDocTags(checker).some((tag) => tag.name === 'deprecated') ? { deprecated: true } : {}),
    });
  }
  // forwardRef adds a public ref outside the named props interface. Read the
  // callable public type so memo-only components don't acquire a false ref.
  const componentType = checker.getTypeOfSymbolAtLocation(symbol, declaration);
  const signature = checker.getSignaturesOfType(componentType, ts.SignatureKind.Call)[0];
  const parameter = signature?.getParameters()[0];
  if (parameter) {
    const parameterType = checker.getTypeOfSymbolAtLocation(parameter, declaration);
    const ref = checker.getPropertyOfType(parameterType, 'ref');
    if (ref && !result.props.some((prop) => prop.name === 'ref')) {
      result.props.push({
        name: 'ref',
        type: checker.typeToString(checker.getTypeOfSymbolAtLocation(ref, declaration), declaration, ts.TypeFormatFlags.NoTruncation),
        optional: Boolean(ref.flags & ts.SymbolFlags.Optional),
        jsdoc: docs(ref),
        source: 'React RefAttributes',
      });
    }
  } else reasons.push('Could not inspect callable public component props for ref');
  if (reasons.length) result.status = 'partial';
  components.push(result);
}
const counts = Object.fromEntries(['ok', 'partial', 'failed'].map((status) => [status, components.filter((item) => item.status === status).length]));
if (counts.failed) throw new Error(`Could not extract props for: ${components.filter((item) => item.status === 'failed').map((item) => item.componentName).join(', ')}`);
// The Vite tokens chunk has minified, unstable export names. Bake the canonical
// source object instead; it is self-contained and adds no CLI runtime imports.
const tokenSource = await readFile(path.join(root, 'src/theme/tokens.ts'), 'utf8');
const tokenModule = ts.transpileModule(tokenSource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { inflowTokens } = await import(`data:text/javascript;base64,${Buffer.from(tokenModule).toString('base64')}`);
// Summaries derived from README.md and docs/VERSIONING.md, not the full docs.
const docsTopics = {
  setup: 'Install @inriver/inflow-react and its React 19, MUI 9 and Emotion peer dependencies. Wrap your app in InflowProvider. Optional local font assets: import @inriver/inflow-react/local-assets.css in your global CSS entry.',
  theming: 'Use InflowProvider mode=light or mode=dark; the consumer controls the mode. Prefer the MUI theme for MUI components and inflowTokens for custom surfaces. The provider scopes its baseline and CSS variables to its own root.',
  migration: 'In 4.0.0, deprecated ThemedButton, ThemedTextField, createDefaultTheme, defaultTheme and ThemedChatPanel onSend were removed. Use MUI Button and TextField, createInflowTheme and inflowTheme, and onSendMessage instead. InflowLocalizationProvider moved to @inriver/inflow-react/datetime/client. Review peer compatibility and release notes before upgrading.',
};
const manifest = { strategy: 'TypeScript source AST and checker; own props plus React ref; inherited props noted, not flattened', metadataEntries: descriptions.size, counts, components, tokens: inflowTokens, docs: docsTopics };
const output = JSON.stringify(manifest, null, 2) + '\n';
if (process.argv.slice(2).includes('--write')) {
  const outputDir = path.join(root, 'dist/cli');
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, 'manifest.json'), output);
} else {
  process.stdout.write(output);
}
