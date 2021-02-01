import {
  BridgeProvider,
} from '@relyzer/shared';

export const backendBridgeProvider: BridgeProvider = (receive) => {
  const win = window.open('http://localhost:8880');

  const onMessage = (ev: MessageEvent<any>) => {
    if (ev.data) receive(ev.data);
  };
  window.addEventListener('message', onMessage);

  return {
    unsubscribe: () => window.removeEventListener('message', onMessage),
    send: (data) => win?.postMessage(data, '*'),
  };
};
