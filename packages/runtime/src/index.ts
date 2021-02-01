import { ComponentMetaData } from '@relyzer/shared';
import { useEffect, useMemo } from 'react';
import Collector from './collector';
import { injectDebugger } from './backend';

export function useRelyzer(data: ComponentMetaData) {
  injectDebugger();

  const collector = useMemo(() => new Proxy(new Collector(data), {
    ownKeys() { return []; },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
