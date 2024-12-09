import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import CustomPlugin from './vite/vite.custom.plugin';
import { fileURLToPath } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({}),
    viteCompression({
      algorithm: 'gzip',
    }),
    sentryVitePlugin({
      org: 'wangnie',
      project: 'react',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
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
      maxWorkers: 4,
    },

    commonjsOptions: {
      include: [/node_modules/],
    },

    manifest: true,

    rollupOptions: {
      output: {
        manualChunks: {
          lodash: ['lodash'],
          antd: ['antd'],
          three: ['three'],
        },
      },
      cache: true,
      perf: true,
      maxParallelFileOps: 4,
      treeshake: {
        moduleSideEffects: 'no-external',
        preset: 'recommended',
      },
      plugins: [
        visualizer({
          open: false,
        }),
        CustomPlugin(),
      ],
    },

    sourcemap: true,
  },
});
