import { register } from './register';
import { createRender, createPartial, html, svg, createSVGPartial } from './create-html';
import { attributeChangedCallback } from './attribute-changed-callback';
import { emit } from './emit';
import { createStyle } from './create-style';
import { render, rendered, ready } from './create-renders';
import { Attribute, PropValue, HTMLFragment, SVGFragment } from './types';
import { Renderer } from './internal-types';

export * from './refs';
export * from './attribute-converters';
export * from './types';
export * from './create-style';
export { html, svg };

// eslint-disable-next-line import/no-default-export
export default abstract class Component<TProps = object, TState = object> extends HTMLElement {
  public static componentName: string;

  public static dependencies: (typeof Component)[] = [];

  public static attributes: (string | Attribute)[] = [];

  private static observedAttributes: string[];

  public get props(): TProps {
    /* eslint-disable no-underscore-dangle */
    if (!this.__currentProps) {
      this.__currentProps = (this.defaultProps || {}) as TProps;
    }
    return this.__currentProps;
    /* eslint-enable no-underscore-dangle */
  }

  protected get state(): TState {
    /* eslint-disable no-underscore-dangle */
    if (!this.__currentState) {
      this.__currentState = (this.defaultState || {}) as TState;
    }
    return this.__currentState;
    /* eslint-enable no-underscore-dangle */
  }

  protected get html(): Renderer<HTMLFragment> {
    /* eslint-disable no-underscore-dangle */
    if (!this.__html) {
      this.__html = createPartial();
    }
    return this.__html;
    /* eslint-enable no-underscore-dangle */
  }

  protected get svg(): Renderer<SVGFragment> {
    /* eslint-disable no-underscore-dangle */
    if (!this.__svg) {
      this.__svg = createSVGPartial();
    }
    return this.__svg;
    /* eslint-enable no-underscore-dangle */
  }

  protected readonly defaultProps: TProps;

  protected readonly defaultState: TState;

  private __currentProps: TProps;

  private __currentState: TState;

  private __html: Renderer<HTMLFragment>;

  private __svg: Renderer<SVGFragment>;

  private __created = false;

  private __rendered = false;

  private __ready = false;

  private __attributeChangedCallbackStack: (() => void)[] = [];

  public static register(outputToConsole = false): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return register(this as any, outputToConsole);
  }

  public constructor(useShadow = true) {
    super();

    if (useShadow) {
      this.attachShadow({ mode: 'open' });
    }

    const originalRender = this.render.bind(this);
    this.render = createRender(
      /* eslint-disable @typescript-eslint/no-explicit-any */
      this as any,
      () => render(this as any, originalRender),
      () => {
        rendered(this as any);
        ready(this as any);
      },
      /* eslint-enable @typescript-eslint/no-explicit-any */
    );
  }

  /* istanbul ignore next */
  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-empty-function
  public connectedCallback(): void {}

  /* istanbul ignore next */
  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-empty-function
  public disconnectedCallback(): void {}

  public attributeChangedCallback(name: string, previous: PropValue, current: PropValue): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return attributeChangedCallback(this as any, name, previous, current);
  }

  // eslint-disable-next-line class-methods-use-this
  public render(): HTMLFragment | SVGFragment {
    return null;
  }

  /* istanbul ignore next */
  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-empty-function
  public rendered(): void {}

  /* istanbul ignore next */
  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-empty-function
  public ready(): void {}

  public addEventListener(type, listener, options?): void {
    // eslint-disable-next-line no-underscore-dangle
    if (type === 'ready' && this.__ready) {
      listener();
    } else {
      super.addEventListener(type, listener, options);
    }
  }

  protected emit<TEvent>(name: string, detail?: TEvent, singleEmit = false): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return emit(this as any, name, detail, singleEmit);
  }

  protected createStyle = createStyle;

  protected setState(state: Partial<TState> | ((state: TState) => Partial<TState>)): void {
    // eslint-disable-next-line no-underscore-dangle
    this.__currentState = {
      ...this.state,
      ...(typeof state === 'function' ? state.call(this, this.state) : state),
    };
    this.render();
  }
}
