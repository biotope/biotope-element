import { RefObject } from './types';

export const createRef = <TRef>(): RefObject<TRef> => ({
  current: null,
});
