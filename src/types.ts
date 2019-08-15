
export interface SimpleAttribute {
  name: string;
}

export interface TypedAttribute extends SimpleAttribute {
  type: 'object' | 'array' | 'boolean' | 'number' | 'string';
}

export interface ConvertableAttribute extends SimpleAttribute {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  converter: (prop?: string) => any;
}

export type Attribute = SimpleAttribute | TypedAttribute | ConvertableAttribute;

export type HTMLElementContent = string | { toString: () => string };
