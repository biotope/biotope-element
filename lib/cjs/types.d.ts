export declare type PropValue = string | boolean | number | any[] | object | Function;
export interface SimpleAttribute {
    name: string;
}
export interface TypedAttribute extends SimpleAttribute {
    type: 'string' | 'boolean' | 'number' | 'array' | 'object' | 'function';
}
export interface ConvertibleAttribute extends SimpleAttribute {
    converter: (prop?: PropValue) => PropValue;
}
export declare type Attribute = SimpleAttribute | TypedAttribute | ConvertibleAttribute;
export declare type HTMLElementContent = string | {
    toString: () => string;
};
export interface HTMLFragment {
    type: 'html';
    args: TemplateStringsArray;
}
export interface RefObject<TRef> {
    current?: TRef;
}
