import { rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Chunk file names are hashed and `emptyOutDir` is off, so chunks from earlier builds would otherwise be packed.
// The ES and CJS outputs are built one after the other, so clean only before the first.
let chunksCleaned = false;
const cleanChunks = (): Plugin => ({
  name: 'clean-chunks',
  buildStart() {
    if (chunksCleaned) return;
    chunksCleaned = true;
    rmSync(resolve(import.meta.dirname, 'dist/_chunks'), { recursive: true, force: true });
  },
});

export default defineConfig({
  plugins: [react(), cleanChunks()],
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        'ag-grid/index': resolve(import.meta.dirname, 'src/ag-grid/index.ts'),
        'datetime/index': resolve(import.meta.dirname, 'src/datetime/index.ts'),
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
        { format: 'es', chunkFileNames: '_chunks/[name]-[hash].js' },
        { format: 'cjs', chunkFileNames: '_chunks/[name]-[hash].cjs' },
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
