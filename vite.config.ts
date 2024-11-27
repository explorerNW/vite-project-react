import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import CustomPlugin from './vite/vite.custom.plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({}),
    viteCompression({
      algorithm: 'gzip',
    }),
  ],
  optimizeDeps: {
    include: [],
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          lodash: ['lodash'],
          antd: ['antd'],
          three: ['three'],
        },
      },
      plugins: [
        visualizer({
          open: false,
        }),
        CustomPlugin(),
      ],
    },
  },
});
