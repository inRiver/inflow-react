import { rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Do not remove the showcase's index.html or assets. ES and CJS are built in one process.
let outputsCleaned = false;
const cleanLibraryOutputs = (): Plugin => ({
  name: 'clean-library-outputs',
  buildStart() {
    if (outputsCleaned) return;
    outputsCleaned = true;
    for (const output of [
      '_chunks', 'ag-grid', 'components', 'datetime', 'providers', 'theme', 'cli', 'fonts',
      'index.js', 'index.js.map', 'index.cjs', 'index.cjs.map', 'index.d.ts', 'index.d.ts.map', 'index.d.cts',
    ]) {
      rmSync(resolve(import.meta.dirname, 'dist', output), { recursive: true, force: true });
    }
  },
});

export default defineConfig({
  plugins: [react(), cleanLibraryOutputs()],
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        'ag-grid/index': resolve(import.meta.dirname, 'src/ag-grid/index.ts'),
        'datetime/index': resolve(import.meta.dirname, 'src/datetime/index.ts'),
        'datetime/client': resolve(import.meta.dirname, 'src/datetime/client.ts'),
      },
      name: 'Inflow',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        entryName === 'index' ? (format === 'es' ? 'index.js' : 'index.cjs') : `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    sourcemap: true,
    emptyOutDir: false,
    rollupOptions: {
      output: [
        {
          format: 'es',
          chunkFileNames: '_chunks/[name]-[hash].js',
          postBanner: (chunk) =>
            chunk.isEntry && (chunk.name === 'index' || chunk.name === 'datetime/client') ? "'use client';\n" : '',
        },
        {
          format: 'cjs',
          chunkFileNames: '_chunks/[name]-[hash].cjs',
          postBanner: (chunk) =>
            chunk.isEntry && (chunk.name === 'index' || chunk.name === 'datetime/client') ? "'use client';\n" : '',
        },
      ],
      // MUI X and Day.js are owned by the app: bundling them would give the pickers a second React context and Day.js
      // a second locale and plugin registry.
      external: (id) => [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@emotion/cache',
        '@emotion/react',
        '@emotion/styled',
        '@mui/material',
        '@mui/material/styles',
        '@mui/icons-material',
        '@mui/x-date-pickers',
        'dayjs',
        'ag-grid-community',
        'ag-grid-enterprise',
        'ag-grid-react',
      ].includes(id) || id.startsWith('@mui/material/') || id.startsWith('@mui/x-date-pickers/') || id.startsWith('dayjs/'),
    },
  },
});
