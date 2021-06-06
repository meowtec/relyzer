/* eslint-disable import/no-extraneous-dependencies */
// @ts-check
import path from 'path';
import reactRefresh from '@vitejs/plugin-react-refresh';
import disableReactDevtool from './vite/disable-react-devtool';
import relyzer from './vite/babel-relyzer';

const { BUILD_APP, RELYZER_DEV } = process.env;

/**
 * @type { import('vite').UserConfig }
 */
const config = {
  plugins: [
    !BUILD_APP ? disableReactDevtool() : null,
    relyzer(),
    reactRefresh(),
  ],
  optimizeDeps: {
    include: [
    ],
  },
  server: {
    port: 8880,
  },
  // workaround for esbuild does not support jsx automatic runtime
  esbuild: {
    jsxFactory: 'jsx',
    jsxInject: 'import { jsx } from \'@emotion/react\'',
  },
  define: {
    'window.__RELYZER_DEV__': RELYZER_DEV,
  },
  build: {
    ...BUILD_APP ? {
      outDir: 'dist-standalone',
      lib: {
        name: 'relyzer', // unused but required
        fileName: 'standalone',
        entry: path.resolve(__dirname, 'src/standalone.tsx'),
        formats: ['iife'],
      },
    } : {
      outDir: 'dist',
      lib: {
        entry: path.resolve(__dirname, 'src/index.tsx'),
        formats: ['es'],
      },
      minify: false,
    },
    rollupOptions: {},
  },
};

export default config;
