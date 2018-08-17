import HyperHTMLElement from 'hyperhtml-element';

const attributeName = (attr: string|BioAttribute) => typeof attr === 'string' ? attr : attr.name;

export interface BioAttribute {
  name: string;
  converter: Function;
}

export default class BioElement<TProps extends object, TState> extends HyperHTMLElement<TState> {

  private _props: TProps;

  // overwrite if some attributes should be auto-merged to your props
  static bioAttributes: (string|BioAttribute)[] = [];

  static get observedAttributes(): string[] {
    return this.bioAttributes.map(attributeName);
  };

  attributeChangedCallback(name: string, _: string, newValue: string): void {
    const attribute = BioElement.bioAttributes.find(attr => attributeName(attr) === newValue);
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

  // overwrite if you eg need to merge into your state
  onPropsChanged() {
    this.render();
  }
}
