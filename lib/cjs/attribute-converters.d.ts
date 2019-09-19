import { PropValue } from './types';
export declare const toBoolean: (prop?: PropValue) => boolean;
export declare const toNumber: (prop?: PropValue) => number;
export declare const toArray: <T>(prop?: PropValue) => T[];
export declare const toObject: (prop?: PropValue) => object;
export declare const toFunction: (prop?: PropValue) => Function;
export declare const toString: (prop?: PropValue) => string;
