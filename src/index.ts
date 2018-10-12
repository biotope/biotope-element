import HyperHTMLElement from 'hyperhtml-element';
import HyperHTML from 'hyperhtml';

import { Attribute } from './types';
import { getComponentName } from './get-component-name';
import { isRegistered } from './is-registered';
import { attributeNameMapper } from './attribute-name-mapper';

export { Attribute };

export default abstract class Component<TProps, TState> extends HyperHTMLElement<TState> {
  // overwrite to set dependencies
  public static dependencies: (typeof Component)[] = [];

  // overwrite if you have a minifier/uglifier in your project
  public static componentName: string;

  public static register(): void {
    const dashedName = getComponentName(this);
    if (!isRegistered(dashedName)) {
      this.define(dashedName);
    }
    this.dependencies.forEach(dependency => dependency.register());
  }

  public static get observedAttributes(): string[] {
    return this.attributes.map(attributeNameMapper);
  };

  // overwrite if some attributes should be auto-merged to your props
  protected static attributes: (string | Attribute)[] = [];

  private currentProps: TProps;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    if (
      !(this.constructor as typeof Component).attributes
      || !(this.constructor as typeof Component).attributes.length
    ) {
      this.render();
    }
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    const attribute = (this.constructor as any).attributes
      .find((attr: string) => attributeNameMapper(attr) === name);

    if (attribute) {
      this.props = {
        ...(this.props as any),
        [name]: typeof attribute === 'string' ? newValue : attribute.converter(newValue),
      };
    };
  }

  // overwrite if you want default props in your component
  protected get defaultProps(): TProps {
    return null;
  }

  protected get props(): TProps {
    return {
      ...(this.defaultProps as any),
      ...(this.currentProps as any),
    };
  }

  protected set props(value: TProps) {
    this.currentProps = value;
    this.onPropsChanged();
  }

  protected get wire() {
    return HyperHTML.wire;
  }

  protected get hyper() {
    return HyperHTML.hyper;
  }

  // overwrite if you, for example, need to merge props into your state
  protected onPropsChanged() {
    this.render();
  }
}
