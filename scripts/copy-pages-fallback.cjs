// GitHub Pages has no server-side rewrites, so a direct visit or refresh on a
// client-side route (e.g. /inflow-react/components) returns a real 404 instead
// of index.html. GitHub Pages does serve a custom 404.html for any unmatched
// path within the same site, so copying the built index.html to 404.html lets
// react-router take over and resolve the route client-side.
const fs = require('node:fs');
const path = require('node:path');

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');
const notFoundPath = path.join(distDir, '404.html');

if (!fs.existsSync(indexPath)) {
  console.error(`Cannot create GitHub Pages 404 fallback: ${indexPath} does not exist. Run the build first.`);
  process.exit(1);
}

fs.copyFileSync(indexPath, notFoundPath);
console.log(`Copied ${path.relative(process.cwd(), indexPath)} -> ${path.relative(process.cwd(), notFoundPath)} for GitHub Pages SPA fallback.`);
