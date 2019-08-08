import HyperHTMLElement from 'hyperhtml-element';
import { camel } from 'change-case';

import { getComponentName } from './get-component-name';
import { isRegistered } from './is-registered';
import { attributeName, attributeValue } from './attribute-mapper';
import { createStyle } from './style';
import { Attribute } from './types';

export { Attribute };

abstract class Component<TProps = object, TState = object> extends HyperHTMLElement<TState> {
  public static componentName: string;

  public static basedOn: string = null;

  public static dependencies: (typeof Component)[] = [];

  public static attributes: (string | Attribute)[] = [];

  public static get observedAttributes(): string[] {
    return this.attributes.map(attributeName);
  }

  public static register(silent: boolean = true): boolean {
    const dashedName = getComponentName(this);
    if (isRegistered(dashedName)) {
      if (!silent) {
        // eslint-disable-next-line no-console
        console.warn(`Attempt to re-register component "${dashedName}". Skipping…`);
      }
      return false;
    }

    this.dependencies.forEach((component): boolean => component.register(silent));

    this.define(dashedName, {
      ...(this.basedOn ? { extends: this.basedOn } : {}),
    });

    return true;
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

  public created(): void {
    this.render();
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    const attribute = (this.constructor as typeof Component).attributes
      .find((attr: string): boolean => attributeName(attr) === name);

    if (attribute) {
      this.props = {
        ...(this.props as TProps),
        [camel(name)]: attributeValue(attribute, newValue),
      };
    }
  }

  // overwrite if you, for example, need to merge props into your state
  protected onPropsChanged(): void {
    this.render();
  }

  protected emit<T>(name: string, detail?: T, addPrefix: boolean = false): boolean {
    if (!name) {
      throw Error('No event name defined. Please provide a name.');
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

// eslint-disable-next-line import/no-default-export
export default Component;
