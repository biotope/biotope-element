
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PropValue = string | boolean | number | any[] | object | Function;

export interface SimpleAttribute {
  name: string;
}

export interface TypedAttribute extends SimpleAttribute {
  type: 'string' | 'boolean' | 'number' | 'array' | 'object' | 'function';
}

export interface ConvertibleAttribute extends SimpleAttribute {
  converter: (prop?: PropValue) => PropValue;
}

export type Attribute = SimpleAttribute | TypedAttribute | ConvertibleAttribute;

export type HTMLElementContent = string | { toString: () => string };

export interface HTMLFragment {
  type: 'html';
  args: TemplateStringsArray;
}

export interface SVGFragment {
  type: 'svg';
  args: TemplateStringsArray;
}

export interface RefObject<TRef> {
  current?: TRef;
}
