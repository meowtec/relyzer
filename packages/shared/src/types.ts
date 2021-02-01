import type { ComponentType } from 'react';

export type Loc = [
  startLine: number,
  startCol: number,
  endLine: number,
  endCol: number,
];

export interface ObservedMeta {
  name: string;
  loc: string;
  type: 'var' | 'dep' | 'props' | 'attr';
}

/**
 * 组件元数据，主要由 ast transformer 生成
 */
export interface ComponentMetaData {
  id: string;
  name?: string;
  code: string;
  loc?: string;
  observedList: ObservedMeta[];
}

export interface DevtoolHook<T = any> {
  name: string;
  value: T;
  subHooks: DevtoolHook[];
}

export interface DevtoolComponentInstance {
  isReactComponent?: {};
  type?: ComponentType;
  props: Record<string, any>;
  hooks?: DevtoolHook[];
}

export interface InaccessibleInstanceInfo {
  id: null;
  component: {
    name: string;
  };
}

export interface CollectorInstanceInfo {
  id: number;
  updatedTimes: number;
  latestFrame?: PlainCollectorFrame;
  component: ComponentMetaData;
}

export type ObjectSummary = [
  type: 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' | 'array',
  value: string | number | null,
];

export interface PlainCollectorFrame {
  id: number;
  pid: number;
  createdAt: number;
  records: Record<number, ObjectSummary>;
  updatedIds: number[];
  updatedTimes: Record<number, number>;
  props: Record<string, any>;
  updatedProps: string[];
  propsUpdatedTimes: Record<string, number>;
}
