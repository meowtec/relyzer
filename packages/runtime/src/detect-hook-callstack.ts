import ErrorStackParser from 'error-stack-parser';

const detectResultMap = new Map<string, boolean>();

export function runInHookStack(id: string) {
  if (detectResultMap.has(id)) {
    return detectResultMap.get(id);
  }

  const stack = ErrorStackParser.parse(new Error());
  const isInHook = !!(
    stack[3]?.functionName === 'renderWithHooks'
    || stack[4]?.functionName?.includes('inspectHooksOfFiber')
  );

  detectResultMap.set(id, isInHook);

  return isInHook;
}
