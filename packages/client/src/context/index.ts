import type {
  CollectorInstanceInfo,
  ClientBridge,
  PlainCollectorFrame,
  InaccessibleInstanceInfo,
} from '@relyzer/shared';
import { createContext } from 'react';

export interface Instance {
  collector: InaccessibleInstanceInfo | CollectorInstanceInfo;
  frames: Array<PlainCollectorFrame | null>;
}

export interface AppState {
  bridge: ClientBridge;
  instance: Instance | null;
}

export const BridgeContext = createContext<ClientBridge | null>(null);

export const FrameVisibleContext = createContext<boolean>(true);

export const RenderRootContext = createContext<{
  portalRoot?: HTMLElement;
}>({});
