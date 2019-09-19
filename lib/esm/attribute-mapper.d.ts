import { TypedAttribute, ConvertibleAttribute, PropValue } from './types';
export declare const attributeName: (attribute: string | import("./types").SimpleAttribute | TypedAttribute | ConvertibleAttribute) => string;
export declare const attributeValue: (attribute: string | import("./types").SimpleAttribute | TypedAttribute | ConvertibleAttribute, value?: PropValue) => PropValue;
