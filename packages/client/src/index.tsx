import ReactDOM from 'react-dom';
import React from 'react';
import { create as createJSS } from 'jss';
import { CacheProvider, Global } from '@emotion/react';
import createEmotionCache from '@emotion/cache';
import {
  Bridge,
  BridgeProvider,
  ClientBridge,
} from '@relyzer/shared';
import { jssPreset, StylesProvider } from '@material-ui/styles';
import InspectFrame from './inspect-frame';
import App from './app';
import { RenderRootContext } from './context';
import { globalCss, highlightCss } from './styles';

console.log(ReactDOM);

export function createHookDebugger(root: HTMLElement, bridgeProvider: BridgeProvider) {
  customElements.define('relyzer-debugger', HTMLDivElement, { extends: 'div' });

  const createDiv = () => document.createElement('div');

  const div = document.createElement('relyzer-debugger');

  div.attachShadow({
    mode: 'open',
  });

  const styleRoot = createDiv();
  const appRoot = createDiv();
  // workaround
  const portalRootContainer = createDiv();
  const portalRoot = createDiv();

  const emotionCache = createEmotionCache({
    key: 'em',
    container: styleRoot,
  });

  // some component of material-ui still use jss
  const jss = createJSS({
    plugins: [...jssPreset().plugins],
    insertionPoint: styleRoot,
  });

  portalRootContainer.appendChild(portalRoot);
  div.shadowRoot?.append(styleRoot, appRoot, portalRootContainer);
  root.appendChild(div);

  const bridge: ClientBridge = new Bridge(bridgeProvider, 'CLIENT');
  bridge.send('INIT', null);

  ReactDOM.render(
    <RenderRootContext.Provider
      value={{
        portalRoot,
      }}
    >
      <StylesProvider
        jss={jss}
      >
        <CacheProvider
          value={emotionCache}
        >
          <Global styles={globalCss + highlightCss} />
          <InspectFrame>
            <App
              bridge={bridge}
            />
          </InspectFrame>
        </CacheProvider>
      </StylesProvider>
    </RenderRootContext.Provider>,
    appRoot,
  );
}
