import { EventEmitter } from 'eventemitter3';
import {
  CollectorInstanceInfo, InaccessibleInstanceInfo, PlainCollectorFrame,
} from './types';
import { randomId } from './utils';

const { log } = console;

export const BRIDGE_IDENTIFIER = 'HOOK_PROBE_BRIDGE';

export interface BridgeMessageData<T = any> {
  type: any;
  owner: string;
  name: string;
  data: T;
}

export interface ClientMessages {
  INIT: null;
  COMPONENT_OK: number;
  LOG: {
    collectorId: number;
    frameId: number;
    loc: number;
    all: boolean;
  };
  REQUEST_FRAME: number;
}

export interface BackendMessages {
  COMPONENT: InaccessibleInstanceInfo | CollectorInstanceInfo | null;
  UPDATE: Omit<CollectorInstanceInfo, 'component'>;
  RESPONSE_FRAME: {
    index: number;
    frame: PlainCollectorFrame;
  };
}

export type BridgeProvider = (receive: (data: BridgeMessageData) => boolean) => {
  send: (data: BridgeMessageData) => void;
  unsubscribe?: () => void;
};

export class Bridge<InComming extends Record<string, any>, OutComming extends Record<string, any>> extends EventEmitter {
  id = randomId();

  private provider: ReturnType<BridgeProvider>;

  constructor(provider: BridgeProvider, private name?: string) {
    super();

    this.provider = provider((data: BridgeMessageData) => {
      if (data.type !== BRIDGE_IDENTIFIER) {
        return false;
      }

      log(`%c${this.name}#IN:  %c${data.name}`, 'color: #09f', 'color: purple; font-weight: 700', data.data);
      this.emit(`data::${data.name}`, data.data);

      return true;
    });
  }

  public listen<K extends (keyof InComming) & string>(name: K, listener: (data: InComming[K]) => void) {
    this.on(`data::${name}`, listener);
    return () => this.unlisten(name, listener);
  }

  public unlisten<K extends (keyof InComming) & string>(name: K, listener: (data: InComming[K]) => void) {
    this.off(`data::${name}`, listener);
  }

  public send<K extends (keyof OutComming) & string>(name: K, data: OutComming[K]) {
    log(`%c${this.name}#OUT: %c${name}`, 'color: green', 'color: purple; font-weight: 700', data);
    this.provider.send({
      type: BRIDGE_IDENTIFIER,
      owner: this.id,
      name,
      data,
    });
  }
}

export type BackendBridge = Bridge<ClientMessages, BackendMessages>;

export type ClientBridge = Bridge<BackendMessages, ClientMessages>;
