import ReactDOM from 'react-dom';
import { create as createJSS } from 'jss';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@emotion/cache';
import {
  Bridge,
  BridgeProvider,
  ClientBridge,
} from '@relyzer/shared';
import { jssPreset, StylesProvider } from '@material-ui/styles';
import InspectFrame from './devtool';
import App from './core/app';
import { RenderRootContext } from './context';

const TAG_NAME = 'relyzer-debugger';

// avoid re-define when hot reload
if (!customElements.get(TAG_NAME)) {
  customElements.define('relyzer-debugger', HTMLDivElement, { extends: 'div' });
}

export function createHookDebugger({
  root,
  bridgeProvider,
  onOpenExternal,
}: {
  root: HTMLElement;
  bridgeProvider: BridgeProvider;
  onOpenExternal: () => void;
}) {
  const createDiv = () => document.createElement('div');

  const div = document.createElement('relyzer-debugger');

  div.attachShadow({
    mode: 'open',
  });

  const styleRoot = createDiv();
  const appRoot = createDiv();
  // workaround for the bug of material-ui
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
          <InspectFrame
            onPopout={onOpenExternal}
          >
            <App
              bridge={bridge}
            />
          </InspectFrame>
        </CacheProvider>
      </StylesProvider>
    </RenderRootContext.Provider>,
    appRoot,
  );

  return () => {
    ReactDOM.unmountComponentAtNode(appRoot);
  };
}
