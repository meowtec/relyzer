import { BridgeProvider } from '@relyzer/shared';

export const postMessageBridgeProvider: BridgeProvider = (receive) => {
  const onMessage = (ev: MessageEvent) => {
    if (ev.data) receive(ev.data);
  };

  const send = (data: any) => {
    window.opener?.postMessage(data, '*');
  };

  window.addEventListener('message', onMessage);

  return {
    send,
    unsubscribe: () => window.removeEventListener('message', onMessage),
  };
};
