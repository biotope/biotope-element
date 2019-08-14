
export interface Attribute {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  converter: (prop?: string) => any;
}

export type HTMLElementContent = string | { toString: () => string };

export type Renderer<TRender> = (template: TemplateStringsArray, ...args) => TRender;

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
  html: Renderer<ShadowRoot | HTMLElement>;
  partial: Renderer<HTMLElement>;
  created: () => void;
  connectedCallback: () => void;
  attributeChangedCallback: (name: string, oldValue: string, newValue: string) => void;
  render: () => void;
  rendered: () => void;
  emit: <TEvent>(name: string, detail?: TEvent, addPrefix?: boolean) => boolean;
  createStyle: () => HTMLStyleElement;
  setState: (state: object | ((state: object) => object)) => void;
}

type RuntimeComponent = ComponentPrototype & HTMLElement;

export interface ComponentInstance extends RuntimeComponent {
  constructor: ComponentType;
  props: object;
  state: object;
  defaultProps: object;
  defaultState: object;
  __currentProps: object;
  __currentState: object;
  __html: Renderer<ShadowRoot | HTMLElement>;
  __partial: Renderer<HTMLElement>;
  __initCallStack: (() => void)[];
  __initAttributesCallStack: (() => void)[];
}
