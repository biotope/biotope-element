import { register } from './register';
import { createRender, createPartial, html } from './create-html';
import { attributeChangedCallback } from './attribute-changed-callback';
import { emit } from './emit';
import { createStyle } from './create-style';
import { Attribute, PropValue } from './types';
import { Renderer } from './internal-types';

export * from './refs';
export * from './attribute-converters';
export * from './types';
export * from './create-style';
export { html };

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

  protected get html(): Renderer<HTMLElement> {
    /* eslint-disable no-underscore-dangle */
    if (!this.__html) {
      this.__html = createPartial();
    }
    return this.__html;
    /* eslint-enable no-underscore-dangle */
  }

  protected readonly defaultProps: TProps;

  protected readonly defaultState: TState;

  private __currentProps: TProps;

  private __currentState: TState;

  private __html: Renderer<HTMLElement>;

  private __created = false;

  private __attributeChangedCallbackStack: (() => void)[] = [];

  public static register(silent = true): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return register(this as any, silent);
  }

  public constructor(useShadow = true) {
    super();

    if (useShadow) {
      this.attachShadow({ mode: 'open' });
    }

    const postFunction = (): void => this.rendered();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.render = createRender(this as any, this.render.bind(this), postFunction);
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

  public render(): HTMLElement {
    return this.html``;
  }

  /* istanbul ignore next */
  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-empty-function
  public rendered(): void {}

  protected emit<TEvent>(name: string, detail?: TEvent, addPrefix = false): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return emit(this as any, name, detail, addPrefix);
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
