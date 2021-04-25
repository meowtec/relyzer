// @ts-check
import { transformAsync } from '@babel/core';
import relyzerBabel from '@relyzer/babel';

/**
 * @relyzer/babel as vite plugn
 * NOT working!!! because esbuild removes code comments!
 */
export default function relyzer() {
  let shouldSkip = false;

  /**
   * @type {import('vite').Plugin}
   */
  const plugin = {
    configResolved(config) {
      shouldSkip = config.command === 'build' || config.isProduction;
    },

    async transform(code) {
      if (shouldSkip) return null;

      if (code.includes('@component')) {
        const result = await transformAsync(code, {
          plugins: [relyzerBabel],
        });

        return result && result.code;
      }
      return null;
    },
  };

  return plugin;
}
