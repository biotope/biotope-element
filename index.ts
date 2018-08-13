import HyperHTMLElement from 'hyperhtml-element';


export default class BioElement<TProps extends object, TState> extends HyperHTMLElement<TState> {

  private _props: TProps;

  static get observedAttributes(): string[] {
    return [];
  };

  attributeChangedCallback() {
    this.render();
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


export interface BioElementConstructor<T extends BioElement<any, any>> {
    new (...args: any[]): T;

    define(name: string, options?: ElementDefinitionOptions): void;
}


export function withPropsAndState<TProps extends object, TState>() {

  class C extends BioElement<TProps, TState> { }

  return <BioElementConstructor<BioElement<TProps, TState>>>C;
}


export interface WithOnChildrenUpdated {
    onChildrenUpdated(changes: MutationRecord[]): void;
}

export function withOnChildrenUpdated<T extends BioElement<any, any>>(SuperClass: BioElementConstructor<T>) {
  
    class C extends (<BioElementConstructor<BioElement<any, any>>>SuperClass) {
        constructor() {
            super();

            const observer = new MutationObserver(changes => this.onChildrenUpdated(changes));
            observer.observe(this, {childList: true});
        }

        onChildrenUpdated(changes: MutationRecord[]) {
            this.render();
        }
    }

    return <BioElementConstructor<T & WithOnChildrenUpdated>>C;
}