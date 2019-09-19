import { Attribute, PropValue, HTMLFragment, HTMLElementContent } from './types';
export declare type Renderer<TRender> = (template: TemplateStringsArray, ...args: any[]) => TRender;
export declare type RenderFunction = () => HTMLFragment;
export interface ComponentType extends Function {
    componentName: string;
    attributes: (string | Attribute)[];
    dependencies: ComponentType[];
    observedAttributes: string[];
    register: (silent?: boolean) => boolean;
    prototype: ComponentPrototype;
}
export interface ComponentPrototype extends Function {
    html: Renderer<HTMLFragment>;
    created: () => void;
    connectedCallback: () => void;
    disconnectedCallback: () => void;
    attributeChangedCallback: (name: string, oldValue: PropValue, newValue: PropValue) => void;
    render: RenderFunction;
    rendered: () => void;
    emit: <TEvent>(name: string, detail?: TEvent, singleEmit?: boolean) => boolean;
    createStyle: (styleContent: HTMLElementContent) => HTMLFragment;
    setState: (state: object | ((state: object) => object)) => void;
}
declare type RuntimeComponent = ComponentPrototype & HTMLElement;
export interface ComponentInstance extends RuntimeComponent {
    constructor: ComponentType;
    props: object;
    state: object;
    template: string;
    styles: HTMLElementContent;
    defaultProps: object;
    defaultState: object;
    __currentProps: object;
    __currentState: object;
    __html: Renderer<HTMLFragment>;
    __created: boolean;
    __rendered: boolean;
    __attributeChangedCallbackStack: (() => void)[];
}
export {};
