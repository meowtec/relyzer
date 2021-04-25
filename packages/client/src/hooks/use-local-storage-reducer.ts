import { Reducer, useCallback, useReducer } from 'react';

export default function useLocalStorageReducer<S, A>(
  key: string,
  reducer: Reducer<S, A>,
  initializerArg: S,
) {
  const composedReducer: Reducer<S, A> = useCallback((state, action) => {
    const newState = reducer(state, action);
    localStorage.setItem(key, JSON.stringify(newState));
    return newState;
  }, [key, reducer]);

  return useReducer(
    composedReducer,
    initializerArg,
    (state) => {
      const content = localStorage.getItem(key);
      if (content == null) {
        return state;
      }

      try {
        return JSON.parse(content);
      } catch {
        return state;
      }
    },
  );
}
