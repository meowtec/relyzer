# relyzer

React functional component debugger.

## Usage

At present you can use relyzer only with babel.

### Install packages

```bash
npm i relyzer -D
```

### Add babel config

```diff
{
  plugins: [
    // enable only for development
+    isDevelopment ? 'module:@relyzer/babel' : null,
  ].filter(Boolean),
}
```

### Add jsdoc

Add `@component` tag in jsdoc of your react component
```diff
/**
 * my component
+ * @component
 */
function MyComponent() {
  const [val, setVal] = useState();

  return (
    <div />
  )
}
```

### Install React Devtool
Make sure you have installed **React Devtool** in Chrome or Firefox.

**NOTICE:**
**There is a problem in the current version of React Devtool (v4.10.1 12/4/2020).**
**_relyzer_ is intended to work with the future version of _React Devtool_. Please wait or build React Devtool yourself.**

### Start App

1. Start the dev server and open browser page
2. Open React Devtool
3. Select the component in the components view
