import throttle from 'lodash/throttle';
import {
  DevtoolComponentInstance,
  createInlineBridgeProviderPair,
  BridgeProvider,
  Bridge,
  BackendBridge,
} from '@relyzer/shared';
import { createHookDebugger } from '@relyzer/client';
import Collector from './collector';

function getComponentClassOrFunction(component: DevtoolComponentInstance) {
  return component.isReactComponent
    ? component.constructor as React.ComponentClass
    : component.type;
}

function findHookCollector(component: DevtoolComponentInstance | null): Collector | null {
  const hook = component?.hooks?.find((item) => item.name.toUpperCase() === 'RELYZER');

  return hook?.subHooks.find((item) => item.value?.$$typeof === 'relyzer')?.value;
}

class Backend {
  component: DevtoolComponentInstance | null = null;

  bridge: BackendBridge | null = null;

  constructor(bridgeProvider: BridgeProvider) {
    this.watchInspectedInstance();
    this.initBridge(bridgeProvider);
  }

  componentSyncWeapSet = new WeakSet<Collector>();

  get collector() {
    return findHookCollector(this.component);
  }

  watchInspectedInstance() {
    let { $r } = (globalThis as any);
    this.useComponent($r);

    Object.defineProperty(globalThis, '$r', {
      configurable: true,

      get: () => $r,

      set: (instance: DevtoolComponentInstance) => {
        $r = instance;
        this.useComponent(instance);
      },
    });
  }

  onProbeFrame = () => {
    const { collector } = this;
    if (!collector) return;
    if (!this.componentSyncWeapSet.has(collector)) {
      this.sendCollectorInfo();
    } else {
      this.bridge?.send('UPDATE', {
        id: collector.id,
        latestFrame: collector.latestFrame.toPlain(),
        updatedTimes: collector.updatedTimes,
      });
    }
  };

  /**
   * when $r changed, use it.
   * use throttle for avoiding a flicker
   */
  useComponent = throttle((component: DevtoolComponentInstance | null) => {
    if (component === this.component) return;
    if ((window as any).NEVER_TO_EMPTY) {
      const hook = findHookCollector(component);
      if (!hook) return;
    }

    this.collector?.off('frame', this.onProbeFrame);
    this.component = component;
    this.collector?.on('frame', this.onProbeFrame);
    this.sendCollectorInfo();
  }, 300);

  /**
   * 将 collector 的基本信息发送给客户端。
   */
  sendCollectorInfo() {
    const { component, collector } = this;

    if (collector) {
      this.bridge?.send('COMPONENT', collector.toPlain());
    } else {
      const componentType = component && getComponentClassOrFunction(component);
      this.bridge?.send('COMPONENT', componentType ? {
        id: null,
        component: {
          name: componentType.displayName || componentType.name,
        },
      } : null);
    }
  }

  initBridge(bridgeProvider: BridgeProvider) {
    const bridge: BackendBridge = new Bridge(bridgeProvider, 'BACKEND');

    this.bridge = bridge;

    bridge.listen('COMPONENT_OK', (id) => {
      if (this.collector && id === this.collector.id) {
        this.componentSyncWeapSet.add(this.collector);
      }
    });

    bridge.listen('INIT', () => {
      this.componentSyncWeapSet = new WeakSet();
      this.sendCollectorInfo();
    });

    bridge.listen('LOG', (data) => {
      if (this.collector?.id !== data.collectorId) return;
      // TODO
      this.collector?.inspectValue(data.frameId, data.loc);
    });

    bridge.listen('REQUEST_FRAME', (frameIndex) => {
      const { collector } = this;
      if (collector) {
        bridge.send('RESPONSE_FRAME', {
          index: frameIndex,
          frame: collector.frames[frameIndex].toPlain(),
        });
      }
    });
  }
}

let injected = false;

export function injectDebugger() {
  if (injected) return;
  injected = true;

  // avoid react warn
  setTimeout(() => {
    const bridgeProviderPair = createInlineBridgeProviderPair();
    const div = document.createElement('div');
    document.body.appendChild(div);
    createHookDebugger(div, bridgeProviderPair[0]);
    void new Backend(bridgeProviderPair[1]);
  });
}
