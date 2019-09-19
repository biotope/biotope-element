import { RefObject } from './types';
export declare const createRef: <TRef>() => RefObject<TRef>;
export declare const createRefCallback: <T>(getter: () => T) => RefObject<T>;
