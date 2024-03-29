# Relyzer

React functional component debugger.

## Screenshot

<img width="1336" alt="screenshot" src="https://user-images.githubusercontent.com/4006436/137918770-35c4741c-a970-43ab-aba3-f1fff8cb2339.png">

## 中文说明

https://zhuanlan.zhihu.com/p/391734514

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

**Notice that `@relyzer/babel` will do nothing when `process.env.NODE_ENV === 'production'`**

Before the use, you probably need to know how **Relyzer** works:

In order to collect the runtime information, **Relyzer** uses babel to transform the functional component code, adding some hooks code into the body.

```diff
function MyComponent() {
  // relyzer will auto add some code
+  const r = useRelyzer()
  const a = useCallback()
+  r(a)
  ...
+  r()
}
```

React hooks could only properly run inside functional components or other hooks. So it is important to ensure that the additional code only be added and runs in real functional components.

There are two way for that purpose:

### (1) Add jsdoc

Use `@component` or `'use relyzer'` for explicitly marking the function as a component:

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

### (2) Use the `autoDetect` option

Tell Relyzer to auto detect the components.

Relyzer will inject `useRelyzer` to all the functions with uppercase first letter.
When `useRelyzer` called, it will try to check whether the function is called in the React render call stack

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
3. Select component in the components tree viewer
