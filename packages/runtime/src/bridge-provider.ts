import {
  BridgeProvider,
} from '@relyzer/shared';

export const createBackendBridgeProvider: (win: Window) => BridgeProvider = (win) => (receive) => {
  const onMessage = (ev: MessageEvent<any>) => {
    if (ev.data) receive(ev.data);
  };

  window.addEventListener('message', onMessage);

  return {
    unsubscribe: () => window.removeEventListener('message', onMessage),
    send: (data) => win?.postMessage(data, '*'),
  };
};
