import { Attribute, HTMLElementContent } from './types';

export type Renderer<TRender> = (template: TemplateStringsArray, ...args: object[]) => TRender;

export type RenderFuntion = () => HTMLElement;

export interface ComponentType extends Function {
  componentName: string;
  basedOn: string;
  attributes: (string | Attribute)[];
  dependencies: ComponentType[];
  observedAttributes: string[];
  register: (silent?: boolean) => boolean;
  prototype: ComponentPrototype;
}

export interface ComponentPrototype extends Function {
  html: Renderer<HTMLElement>;
  partial: Renderer<HTMLElement>;
  created: () => void;
  connectedCallback: () => void;
  attributeChangedCallback: (name: string, oldValue: string, newValue: string) => void;
  render: RenderFuntion;
  rendered: () => void;
  emit: <TEvent>(name: string, detail?: TEvent, addPrefix?: boolean) => boolean;
  createStyle: (styleContent: HTMLElementContent) => HTMLStyleElement;
  setState: (state: object | ((state: object) => object)) => void;
}

type RuntimeComponent = ComponentPrototype & HTMLElement;

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
  __html: Renderer<HTMLElement>;
  __initCallStack: (() => void)[];
  __initAttributesCallStack: (() => void)[];
}
