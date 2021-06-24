/* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
import { ComponentMetaData } from '@relyzer/shared';
import { useEffect, useMemo } from 'react';
import Collector from './collector';
import initBackend from './backend';
import { runInHookStack } from './detect-hook-callstack';

initBackend();

export function useRelyzer(data: ComponentMetaData) {
  if (!data.shouldDetectCallStack || runInHookStack(data.id)) {
    const collector = useMemo(() => new Proxy(new Collector(data), {
      ownKeys() { return []; },
    }), []);

    useEffect(() => {
      collector.flush();
    });

    collector.start();

    return function perf(value: any, index: number) {
      collector.record(index, value);

      return value;
    };
  }

  return (val: any) => val;
}
