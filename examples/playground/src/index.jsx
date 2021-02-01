// @ts-check
import React from 'react';
import ReactDOM from 'react-dom';
import { SWRConfig } from 'swr';
import App from './app';

const app = document.getElementById('app');

console.log(ReactDOM);

ReactDOM.render(
  <SWRConfig
    value={{
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }}
  >
    <App />
  </SWRConfig>,
  app,
);
