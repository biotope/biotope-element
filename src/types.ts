
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PropValue = string | boolean | number | any[] | object | Function;

export interface SimpleAttribute {
  name: string;
}

export interface TypedAttribute extends SimpleAttribute {
  type: 'string' | 'boolean' | 'number' | 'array' | 'object' | 'function';
}

export interface ConvertableAttribute extends SimpleAttribute {
  converter: (prop?: PropValue) => PropValue;
}

export type Attribute = SimpleAttribute | TypedAttribute | ConvertableAttribute;

export type HTMLElementContent = string | { toString: () => string };

export interface RefObject<TRef> {
  current?: TRef;
}
