import { DevtoolComponentInstance } from '@relyzer/shared';
import Collector from './collector';

export function getComponentClassOrFunction(component: DevtoolComponentInstance) {
  return component.isReactComponent
    ? component.constructor as React.ComponentClass
    : component.type;
}

export function findHookCollector(component: DevtoolComponentInstance | null): Collector | null {
  const hook = component?.hooks?.find((item) => item.name.toUpperCase() === 'RELYZER');

  return hook?.subHooks.find((item) => item.value?.$$typeof === 'relyzer')?.value;
}

export function listenOnClosed(win: Window, callback: () => void) {
  const interval = setInterval(() => {
    if (win.closed) {
      clearInterval(interval);
      callback();
    }
  }, 300);
}
