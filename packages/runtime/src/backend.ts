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
import { findHookCollector, getComponentClassOrFunction, listenOnClosed } from './utils';
import { createBackendBridgeProvider } from './bridge-provider';

class Backend {
  component: DevtoolComponentInstance | null = null;

  bridge: BackendBridge | null = null;

  constructor() {
    if (window.location.search.includes('__no_relyzer__')) {
      return;
    }
    this.watchInspectedInstance();
    this.createInlineBridge();
  }

  componentSyncWeapSet = new WeakSet<Collector>();

  get collector() {
    return findHookCollector(this.component);
  }

  send: BackendBridge['send'] = (channel, msg) => {
    this.bridge?.send(channel, msg);
  };

  watchInspectedInstance() {
    let { $r } = window;
    this.useComponent($r);

    Object.defineProperty(window, '$r', {
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
      this.send('UPDATE', {
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

    // do not show `component can not be inspected` when developing using inline mode
    if (window.__RELYZER_DEV__) {
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
      this.send('COMPONENT', collector.toPlain());
    } else {
      const componentType = component && getComponentClassOrFunction(component);
      this.send('COMPONENT', componentType ? {
        id: null,
        component: {
          name: componentType.displayName || componentType.name,
        },
      } : null);
    }
  }

  createBridge(bridgeProvider: BridgeProvider) {
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
      this.collector?.inspectValue(data.frameId, data.loc, data.all);
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

    return bridge;
  }

  destroyBridge(bridge: Bridge<any, any>) {
    bridge.destroy();
    this.bridge = null;
  }

  createPostMessageBridgeWindow() {
    if (window.__RELYZER_DEV__) {
      return window.open(`http://localhost:8880/?${window.__RELYZER_IS_TERMINAL__ ? '__no_relyzer__' : ''}`);
    }

    const win = window.open();
    if (win) {
      win.document.write(`
        <div id="root"></div>
        <script src="https://unpkg.com/@relyzer/client@1.0.0-alpha.4/dist/standalone.iife.js"></script>
      `);
    }

    return win;
  }

  createPostMessageBridge() {
    const win = this.createPostMessageBridgeWindow();
    if (win) {
      const bridge = this.createBridge(createBackendBridgeProvider(win));
      listenOnClosed(win, () => {
        this.destroyBridge(bridge);
        this.createInlineBridge();
      });
    }
  }

  createInlineBridge() {
    const bridgeProviderPair = createInlineBridgeProviderPair();
    const div = document.createElement('div');
    document.body.appendChild(div);
    const inlineBridge = this.createBridge(bridgeProviderPair[1]);
    const destroyInlineDebugger = createHookDebugger({
      root: div,
      bridgeProvider: bridgeProviderPair[0],
      onOpenExternal: () => {
        destroyInlineDebugger();
        this.destroyBridge(inlineBridge);
        this.createPostMessageBridge();
      },
    });
  }
}

export default function initBackend() {
  void new Backend();
}
