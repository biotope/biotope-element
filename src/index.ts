import { register } from './register';
import { createHtml, createPartial } from './create-html';
import { attributeChangedCallback } from './attribute-changed-callback';
import { emit } from './emit';
import { createStyle } from './create-style';
import { Attribute, Renderer } from './types';

export { Attribute };

// eslint-disable-next-line import/no-default-export
export default abstract class Component<TProps = object, TState = object> extends HTMLElement {
  public static componentName: string;

  public static basedOn: string = null;

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

  protected get html(): Renderer<ShadowRoot | HTMLElement> {
    /* eslint-disable no-underscore-dangle */
    if (!this.__html) {
      this.__html = createHtml();
    }
    return this.__html;
    /* eslint-enable no-underscore-dangle */
  }

  protected get partial(): Renderer<HTMLElement> {
    /* eslint-disable no-underscore-dangle */
    if (!this.__partial) {
      this.__partial = createPartial();
    }
    return this.__partial;
    /* eslint-enable no-underscore-dangle */
  }

  protected readonly defaultProps: TProps;

  protected readonly defaultState: TState;

  private __currentProps: TProps;

  private __currentState: TState;

  private __html: Renderer<ShadowRoot | HTMLElement>;

  private __partial: Renderer<HTMLElement>;

  private __initCallStack: (() => void)[];

  private __initAttributesCallStack: (() => void)[];

  public static register(silent: boolean = true): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return register(this as any, silent);
  }

  public constructor(useShadow: boolean = true) {
    super();
    // eslint-disable-next-line no-underscore-dangle
    this.__initCallStack = [(): void => this.created()];
    // eslint-disable-next-line no-underscore-dangle
    this.__initAttributesCallStack = [];

    if (useShadow) {
      this.attachShadow({ mode: 'open' });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public created(): void {}

  public connectedCallback(): void {
    this.render();
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return attributeChangedCallback(this as any, name, oldValue, newValue);
  }

  public render(): ReturnType<typeof Component.prototype.html> {
    return this.html``;
  }

  // eslint-disable-next-line class-methods-use-this
  public rendered(): void {}

  protected emit<TEvent>(name: string, detail?: TEvent, addPrefix: boolean = false): boolean {
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
