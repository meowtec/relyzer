import ReactDOM from 'react-dom';
import {
  Bridge,
  ClientBridge,
} from '@relyzer/shared';
import { postMessageBridgeProvider } from './bridge/bridge-provider';
import App from './core/app';

document.title = 'relyzer';

const bridge: ClientBridge = new Bridge(postMessageBridgeProvider, 'CLIENT');

ReactDOM.render(
  <App
    bridge={bridge}
  />,
  document.querySelector('#root'),
);

if ((import.meta as any).hot) {
  (import.meta as any).hot.accept();
}
