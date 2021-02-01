import { BridgeProvider } from './bridge';

/**
 * the basic bridge implement for communication in same page context
 */
export const createInlineBridgeProviderPair = (): [BridgeProvider, BridgeProvider] => {
  type BridgeProviderReceive = Parameters<BridgeProvider>[0];
  const receives: [BridgeProviderReceive | null, BridgeProviderReceive | null] = [null, null];

  const createBridgeProvider = (index: 0 | 1): BridgeProvider => (receive) => {
    receives[index] = receive;

    return {
      send(data) {
        receives[index ? 0 : 1]?.(data);
      },
      unsubscribe() {
        receives[index] = null;
      },
    };
  };

  return [createBridgeProvider(0), createBridgeProvider(1)];
};
