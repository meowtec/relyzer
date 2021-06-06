// @ts-check
import { transformAsync } from '@babel/core';
import relyzerBabel from '@relyzer/babel';
import syntaxTs from '@babel/plugin-syntax-typescript';

/**
 * @relyzer/babel as vite plugin
 */
export default function relyzer() {
  let shouldSkip = false;

  /**
   * @type {import('vite').Plugin}
   */
  const plugin = {
    name: 'relyzer',

    enforce: 'pre',

    configResolved(config) {
      shouldSkip = config.command === 'build' || config.isProduction;
    },

    async transform(code, id) {
      if (shouldSkip) return null;

      if (!/node_modules|(packages\/client\/dist)/.test(id)) {
        const result = await transformAsync(code, {
          plugins: [
            [
              syntaxTs,
              {
                isTSX: /\.tsx$/i.test(id),
              },
            ],
            [
              relyzerBabel,
              {
                autoDetect: true,
              },
            ],
          ],
        });

        return result && result.code;
      }
      return null;
    },
  };

  return plugin;
}
