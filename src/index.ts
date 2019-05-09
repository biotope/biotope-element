import HyperHTMLElement from 'hyperhtml-element';

import { camelize } from './camelize';
import { Attribute } from './types';
import { register } from './register';
import { attributeNameMapper } from './attribute-name-mapper';
import { createStyle } from './style';

export { Attribute };

// eslint-disable-next-line import/no-default-export
export default
// eslint-disable-next-line @typescript-eslint/no-explicit-any
abstract class Component<TProps = any, TState = any> extends HyperHTMLElement<TState> {
  // overwrite to set dependencies
  public static dependencies: (typeof Component)[] = [];

  // overwrite if you have a minifier/uglifier in your project
  public static componentName: string;

  // sets the HTMLElement, that should be extended
  public static basedOn: string = null;

  // overwrite if some attributes should be auto-merged to your props
  protected static attributes: (string | Attribute)[] = [];

  public static get observedAttributes(): string[] {
    return this.attributes.map(attributeNameMapper);
  }

  public static register(): void {
    register(this);
  }

  public get props(): TProps {
    return {
      ...(this.defaultProps as TProps),
      ...(this.currentProps as TProps),
    };
  }

  public set props(value: TProps) {
    this.currentProps = value;
    this.onPropsChanged();
  }

  // overwrite if you want default props in your component
  // eslint-disable-next-line class-methods-use-this
  protected get defaultProps(): TProps {
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  protected get wire(): typeof Component.wire {
    return Component.wire;
  }

  // eslint-disable-next-line class-methods-use-this
  protected get hyper(): typeof Component.hyper {
    return Component.hyper;
  }

  private currentProps: TProps;

  public constructor(useShadow: boolean = true) {
    super();
    if (useShadow) {
      this.attachShadow({ mode: 'open' });
    }
  }

  // overwrite if you, for example, need to fetch something after the component is created
  public created(): void {
    this.render();
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    const attribute = (this.constructor as typeof Component).attributes
      .find((attr: string): boolean => attributeNameMapper(attr) === name);

    if (attribute) {
      this.props = {
        ...(this.props as TProps),
        [camelize(name)]: typeof attribute === 'string' ? newValue : attribute.converter(newValue),
      };
    }
  }

  // overwrite if you, for example, need to merge props into your state
  protected onPropsChanged(): void {
    this.render();
  }

  protected emit<T>(name: string, detail?: T, addPrefix: boolean = false): boolean {
    if (!name) {
      throw Error('No event name defined. Please provide a name');
    }
    return this.dispatchEvent(new CustomEvent(
      `${addPrefix ? `${(this.constructor as typeof Component).componentName}-` : ''}${name}`,
      {
        bubbles: true,
        ...(detail !== undefined ? { detail } : {}),
      },
    ));
  }

  protected createStyle = createStyle;
}
