import { postMessageBridgeProvider } from './bridge-provider';
import { createHookDebugger } from '.';

createHookDebugger(document.getElementById('root')!, postMessageBridgeProvider);

if ((import.meta as any).hot) {
  (import.meta as any).hot.accept();
}
