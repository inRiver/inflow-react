# Third-party notices

## Bundled fonts

The package includes unmodified font files obtained from these exact npm archives:

- `@fontsource-variable/inter@5.3.0` (Inter v20), copyright 2016 The Inter Project Authors. Normal and italic variable fonts include weight and optical-size axes, with all seven upstream script subsets.
- `@fontsource/material-icons@5.3.0` (Material Icons v145), attribution Google Inc.
- `@fontsource/material-icons-outlined@5.3.0` (Material Icons Outlined v110), attribution Google Inc.

Each font is distributed under the SIL Open Font License 1.1 supplied in its archive. Complete notices accompany the binaries in `src/fonts/<family>/LICENSE` and are copied to `dist/fonts/<family>/LICENSE` in the npm package. The original font bytes are unchanged. The Inter CSS family alias is `Inter` to match the existing theme. Local CSS adds the legacy icon ligature classes and selects WOFF2 for the supported modern browsers.

Exact archive integrity values, upstream sources, per-file SHA-256 hashes and sizes are recorded in the accompanying `dist/fonts/manifest.json`. These assets do not change the license of the surrounding Inflow library. Font source: https://github.com/google/fonts ; Inter project: https://github.com/rsms/inter ; distribution: https://fontsource.org/ .

## Bundled MUI SVG icon components

SVG icon components imported from `@mui/icons-material` are bundled with the library; consumers do not need that package for built-in icons. The package's MIT notice follows. Its Material icon designs originate from Google's Material Design icon collection.

MIT License

Copyright (c) 2014 Call-Em-All

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
