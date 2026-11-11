# Optional local assets

## Choose explicitly

Default usage does not load font CSS. Keep your existing host-supplied Inter/Material Icons setup, or accept system-font fallbacks for text. Fixed Inflow icons are SVG either way; string-icon props still need a font.

For complete bundled font setup, import once in the application’s supported global style entry:

```ts
import '@inriver/inflow-react/local-assets.css';
import { InflowProvider } from '@inriver/inflow-react';
```

There is no automatic registration, provider setting, opt-out switch or change to existing default imports. The showcase intentionally imports this stylesheet and labels its choice on `/local-assets`.

For partial adoption, the existing `fonts/inter.css` and `fonts/material-icons.css` exports remain available. Do not combine them with the complete import unnecessarily.

## Integration checklist

1. Install the package and compatible React 19, MUI 9 and Emotion peers. The bundled assets do not replace those dependencies.
2. Choose host-owned assets, complete local assets, or one narrower font export. Avoid duplicate/conflicting global font registrations across microfrontends.
3. Let the app bundler resolve CSS imports and copy/rebase all WOFF2 URLs. Verify deployment paths and font MIME types. For a CDN, ensure the host allows the asset origin and configures any required CORS headers.
4. Permit the font origin in `font-src`; no Google Fonts allowance is needed. Do not loosen unrelated CSP directives to fix a missing asset.
5. Put CSS in the framework’s supported global entry, not a raw Node.js server script. The package JS entry remains usable for SSR and CommonJS without importing CSS.
6. Recheck light/dark layouts and typography after opting in. If the host used a fallback or another Inter version, widths/wrapping can change. Existing CSS targeting old built-in icon spans may need SVG/slot selectors.
7. Treat iframe/Shadow DOM font/style ownership explicitly. `InflowProvider` scopes baseline/theme variables but does not install global font assets into another document.
8. For truly offline operation, cache or distribute the complete app and assets. Self-hosted fonts remove an external font-server requirement; they do not make host APIs, images or an uncached first navigation available offline.

## Size tradeoff

All 16 bundled font files total 994,268 bytes before package compression. The initial optional-font branch increased the npm tarball from 206,729 bytes to 1,218,705 bytes (approximately 207 KB to 1.22 MB). Every installation includes those files, even if CSS is not imported. Exact tarball size varies with code/docs/releases; `npm run test:pack` reports the current measured values.

That package size is not initial browser traffic. Only explicit CSS import registers font faces, and browsers download the subsets/styles actually used. Inter has seven subsets in normal/italic variable forms; icon support includes filled and outlined faces. Built-in SVGs do not download font assets. For the initial branch, the main ESM JS increased by only 1,288 bytes independently of font assets.

## Licensing and verification

The WOFF2 binaries are unmodified Fontsource 5.3.0 assets with original SIL OFL 1.1 notices. See `THIRD_PARTY_NOTICES.md` and `src/fonts/manifest.json`; packaged copies are under `dist/fonts`.

`npm run test:pack` installs the tarball in an isolated consumer, checks ESM/CJS and font exports, validates original binary hashes/licenses, and bundles both default and complete-local-assets entrypoints. Neither path may introduce Google Fonts requests; the default path must not emit font assets. Real-browser verification is still needed for each host’s CSP, layout and deployment.
