import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        'ag-grid/index': resolve(import.meta.dirname, 'src/ag-grid/index.ts'),
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
        { format: 'es', chunkFileNames: '[name].js' },
        { format: 'cjs', chunkFileNames: '[name].cjs' },
      ],
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@emotion/cache',
        '@emotion/react',
        '@emotion/styled',
        '@mui/material',
        '@mui/material/styles',
        '@mui/icons-material',
        'ag-grid-community',
        'ag-grid-enterprise',
        'ag-grid-react',
      ],
    },
  },
});
