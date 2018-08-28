import HyperHTMLElement from 'hyperhtml-element';
import HyperHTML from 'hyperhtml';

import { BioAttribute } from './types';
import { getComponentName } from './get-component-name';
import { isRegistered } from './is-registered';
import { attributeName } from './attribute-name';

export { BioAttribute };

export default abstract class BioElement<TProps extends object, TState> extends HyperHTMLElement<TState> {

  private _props: TProps;

  // overwrite to set dependencies
  static dependencies: Function[] = [];

  // overwrite if you have a minifier/uglifier in your project
  static componentName: string;

  static register(): void {
    const dashedName = getComponentName(this);
    if (!isRegistered(dashedName)) {
      this.define(dashedName);
    }
  }

  // overwrite if some attributes should be auto-merged to your props
  static bioAttributes: (string | BioAttribute)[] = [];

  static get observedAttributes(): string[] {
    return this.bioAttributes.map(attributeName);
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    (this.constructor as any).dependencies.forEach((dep: any) => dep.register());
  }

  attributeChangedCallback(name: string, _: string, newValue: string): void {
    const attribute = (this.constructor as any).bioAttributes.find((attr: string) => attributeName(attr) === name);
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

  set props(value) {
    this._props = value;
    this.onPropsChanged();
  }

  get wire() {
    return HyperHTML.wire(this);
  }

  // overwrite if you eg need to merge into your state
  onPropsChanged() {
    this.render();
  }
}
