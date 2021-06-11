# Relyzer

React functional component debugger.

## Usage

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

Before use, you probably need to know how **Relyzer** works:

In order to collect the runtime infomations, it uses babel to transform the functional component code, adding some hooks code into the body.

```diff
function MyComponent() {
  // relyzer will auto add some code
+  const r = useRelyzer()
  const a = useCallback()
+  r.foo()
  ...
+  r.bar()
}
```

So it is important to ensure that the additional code only be added and runs in real functional components.

There are two way for that:

The one is that you should tell relyzer which functions are React components and should be transformed.

You can use `@component` or `'use relyzer'` for marking the function as a component:

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

/**
 * my component
 */
function MyComponent() {
+ 'use relyzer'
  const [val, setVal] = useState();

  return (
    <div />
  )
}
```

The second way, is to tell Relyzer to auto detect the components.

Relyzer will treat functions with uppercase first letter as functional components. And when the added hook `useRelyzer` be called, it will check whether the function is called in the React render call stack.

```diff
{
  plugins: [
    // enable only for development
+    isDevelopment ? ['module:@relyzer/babel', { autoDetect: true }] : null,
  ].filter(Boolean),
}
```

### Install React Devtool
Make sure you have installed the latest **React Devtool** in Chrome or Firefox.

### Start App

1. Start the dev server and open browser page
2. Open React Devtool
3. Select the component in the components view
