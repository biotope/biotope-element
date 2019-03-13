import HyperHTMLElement from 'hyperhtml-element';
import { wire, hyper } from 'hyperhtml';

import { camelize } from './camelize';
import { Attribute } from './types';
import { register } from './register';
import { attributeNameMapper } from './attribute-name-mapper';

export { Attribute };

export default abstract class Component<TProps, TState> extends HyperHTMLElement<TState> {
  // overwrite to set dependencies
  public static dependencies: (typeof Component)[] = [];

  // overwrite if you have a minifier/uglifier in your project
  public static componentName: string;

  public static register(): void {
    register(this);
  }

  public static get observedAttributes(): string[] {
    return this.attributes.map(attributeNameMapper);
  };

  // overwrite if some attributes should be auto-merged to your props
  protected static attributes: (string | Attribute)[] = [];

  // overwrite if you want default props in your component
  protected get defaultProps(): TProps {
    return null;
  }

  public get props(): TProps {
    return {
      ...(this.defaultProps as any),
      ...(this.currentProps as any),
    };
  }

  public set props(value: TProps) {
    this.currentProps = value;
    this.onPropsChanged();
  }

  protected get wire() {
    return wire;
  }

  protected get hyper() {
    return hyper;
  }

  private currentProps: TProps;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  // overwrite if you, for example, need to fetch something after the component is created
  public created() {
    this.render();
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    const attribute = (this.constructor as any).attributes
      .find((attr: string) => attributeNameMapper(attr) === name);

    if (attribute) {
      this.props = {
        ...(this.props as any),
        [camelize(name)]: typeof attribute === 'string' ? newValue : attribute.converter(newValue),
      };
    };
  }

  // overwrite if you, for example, need to merge props into your state
  protected onPropsChanged() {
    this.render();
  }

  protected emit<T>(name: string, detail?: T, addPrefix: boolean = true) {
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
}
