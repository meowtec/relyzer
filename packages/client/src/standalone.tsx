import { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Global } from '@emotion/react';
import {
  Bridge,
  ClientBridge,
} from '@relyzer/shared';
import { postMessageBridgeProvider } from './bridge/bridge-provider';
import App from './core/app';

document.title = 'relyzer';

const bridge: ClientBridge = new Bridge(postMessageBridgeProvider, 'CLIENT');

ReactDOM.render(
  <Fragment>
    <Global
      styles={{
        body: {
          margin: 0,
        },
        '#root': {
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        },
      }}
    />
    <App
      bridge={bridge}
    />
  </Fragment>,
  document.querySelector('#root'),
);

if ((import.meta as any).hot) {
  (import.meta as any).hot.accept();
}
