// @ts-check
/**
 * disabled __REACT_DEVTOOLS_GLOBAL_HOOK__ when bundle react to dist file
 * make sure that relyzer client ui not display in devtool
 */
export default function disableReactDevtool() {
  /**
   * @type {import('vite').Plugin}
   */
  const plugin = {
    transform(code, id) {
      if (id.includes('/react-dom/')) {
        return code.replace(
          /__REACT_DEVTOOLS_GLOBAL_HOOK__/g,
          'undefined',
        );
      }
      return null;
    },
  };

  return plugin;
}
