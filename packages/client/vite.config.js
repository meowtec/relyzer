/* eslint-disable import/no-extraneous-dependencies */
// @ts-check
import path from 'path';
import reactRefresh from '@vitejs/plugin-react-refresh';
import disableReactDevtool from './vite/disable-react-devtool';
import relyzer from './vite/babel-relyzer';

/**
 * @type { import('vite').UserConfig }
 */
const config = {
  plugins: [
    reactRefresh(),
    disableReactDevtool(),
    relyzer(),
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
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      formats: ['es'],
    },
    minify: false,
    rollupOptions: {
      // external: ['react', 'react-dom'],
    },
  },
};

export default config;
