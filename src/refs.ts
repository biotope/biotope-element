import { RefObject } from './types';

export const createRef = <TRef>(): RefObject<TRef> => ({
  current: null,
});

export const createRefCallback = <T>(getter: () => T): RefObject<T> => ({
  get current(): T {
    return getter();
  },
});
