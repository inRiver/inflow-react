const expectedTag = process.env.INRIVER_THEME_RELEASE_TAG;
const npmTag = process.env.npm_config_tag || 'latest';
const checkpointTagPattern = /^react\d+-mui\d+(?:\.\d+)?$/;

if (!expectedTag) {
  console.error(
    'Publishing is blocked. Set INRIVER_THEME_RELEASE_TAG to an approved checkpoint tag, for example react19-mui6.3.'
  );
  process.exit(1);
}

if (!checkpointTagPattern.test(expectedTag)) {
  console.error(
    `Invalid INRIVER_THEME_RELEASE_TAG "${expectedTag}". Use a checkpoint tag like react19-mui6.3.`
  );
  process.exit(1);
}

if (npmTag !== expectedTag) {
  console.error(
    `Publish tag mismatch. Run npm publish --tag ${expectedTag}, not --tag ${npmTag}.`
  );
  process.exit(1);
}

if (npmTag === 'latest') {
  console.error('Direct publish to latest is blocked. Promote with npm dist-tag only after adoption verification.');
  process.exit(1);
}

console.log(`Publishing approved for compatibility checkpoint: ${expectedTag}`);
