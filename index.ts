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

  static get observedAttributes(): string[] {
    return [];
  };

  attributeChangedCallback() {
    this.onPropsChanged();
  }

  get props(): TProps {
    return { ...(<any>this.defaultProps), ...(<any>this.propsFromAttributes), ...(<any>this._props) };
  }

  set props(value) {
    this._props = value;
    this.onPropsChanged();
  }

  get propsFromAttributes(): TProps {
    return null;
  }

  get defaultProps(): TProps {
    return null;
  }

  // overwrite if you eg need to merge into your state
  onPropsChanged() {
    this.render();
  }
}
