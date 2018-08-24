import HyperHTMLElement from 'hyperhtml-element';
import HyperHTML from 'hyperhtml';
import dasherize from 'dasherize';

import { BioAttribute } from './types';
import { isRegistered } from './is-registered';
import { attributeName } from './attribute-name';

export { BioAttribute };

export default abstract class BioElement<TProps extends object, TState> extends HyperHTMLElement<TState> {

  private _props: TProps;


  static register(): void {
    const dashedName = dasherize(this.name || this.toString().match(/^function\s*([^\s(]+)/)[1]);
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
