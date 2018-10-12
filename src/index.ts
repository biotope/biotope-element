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
  static componentName: string;

  static register(): void {
    const dashedName = getComponentName(this);
    if (!isRegistered(dashedName)) {
      this.define(dashedName);
    }
    this.dependencies.forEach(dependency => dependency.register());
  }

  // overwrite if some attributes should be auto-merged to your props
  protected static _attributes: (string | Attribute)[] = [];

  static get observedAttributes(): string[] {
    return this._attributes.map(attributeNameMapper);
  };

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

  attributeChangedCallback(name: string, _: string, newValue: string): void {
    const attribute = (this.constructor as any)._attributes
      .find((attr: string) => attributeNameMapper(attr) === name);

    if (!attribute) {
      return
    };
    this.props = {
      ...(this.props as any),
      [name]: typeof attribute === 'string' ? newValue : attribute.converter(newValue),
    };
  }

  // overwrite if you want default props in your component
  get defaultProps(): TProps {
    return null;
  }

  get props(): TProps {
    return {
      ...(this.defaultProps as any),
      ...(this._props as any),
    };
  }

  set props(value: TProps) {
    this._props = value;
    this.onPropsChanged();
  }

  protected get wire() {
    return HyperHTML.wire;
  }

  protected get hyper() {
    return HyperHTML.hyper;
  }

  // overwrite if you eg need to merge into your state
  onPropsChanged() {
    this.render();
  }
}
