import HyperHTMLElement from 'hyperhtml-element';

const parseAttribute = (value: string) => {
  let parsedValue: string|number|object = value;
  if (!isNaN(value as any)) {
    parsedValue = +value;
  }
  return parsedValue;
};

export default class BioElement<TProps extends object, TState> extends HyperHTMLElement<TState> {

  private _props: TProps;

  // overwrite if some attributes should be auto-merged to your props
  static get observedAttributes(): string[] {
    return [];
  };

  attributeChangedCallback(name: string, _: string, newValue: string): void {
    this.props = {
      ...(this.props as any),
      [name]: parseAttribute(newValue),
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

  get propsFromAttributes(): TProps {
    return BioElement.observedAttributes.reduce((collection: TProps, attributeName: string) => ({
      ...(collection as any),
      ...(this.hasAttribute(attributeName)
        ? { [attributeName]: parseAttribute(this.getAttribute(attributeName)) }
        : {}
      ),
    }), {}) as TProps;
  }

  // overwrite if you eg need to merge into your state
  onPropsChanged() {
    this.render();
  }
}
