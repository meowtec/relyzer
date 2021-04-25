import {
  useCallback,
  useRef,
} from 'react';

export default function usePullLast<T>(val: T) {
  const ref = useRef(val);
  ref.current = val;

  return useCallback(() => ref.current, []);
}
