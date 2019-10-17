import { getComponentName } from './get-component-name';
import { isRegistered } from './is-registered';
import { attributeName } from './attribute-mapper';
import { kebabToCamel } from './case-converters';
import { ComponentInstance, ComponentType } from './internal-types';
import { AnyValue } from './types';

const resolveCallStack = (context: ComponentInstance, property: '__initCallStack' | '__initAttributesCallStack'): void => {
  while (context[property].length) {
    context[property].pop()();
  }
};

export const register = (context: ComponentType, silent: boolean): boolean => {
  /* eslint-disable no-param-reassign,no-underscore-dangle,func-names */
  const dashedName = getComponentName(context);

  if (!context.componentName) {
    if (!silent) {
      // eslint-disable-next-line no-console
      console.warn(`Static property "componentName" missing. Setting it to "${dashedName}"…`);
    }
    context.componentName = dashedName;
  }

  if (isRegistered(context.componentName)) {
    if (!silent) {
      // eslint-disable-next-line no-console
      console.warn(`Attempt to re-register component "${context.componentName}". Skipping…`);
    }
    return false;
  }

  context.dependencies.forEach((component): boolean => component.register(silent));

  const allAttributes = (context.attributes && context.attributes.length ? context.attributes : [])
    .filter((attribute) => attribute);

  context.observedAttributes = allAttributes.map(attributeName);

  allAttributes.forEach((attribute): void => {
    const name = attributeName(attribute);
    const nameCamel = kebabToCamel(name);
    const prop = {
      get(): AnyValue {
        return this.props[nameCamel];
      },
      set(value?: AnyValue): void {
        this.attributeChangedCallback(name, this.props[nameCamel], value);
      },
    };

    Object.defineProperty(context.prototype, name, prop);
    Object.defineProperty(context.prototype, nameCamel, prop);
  });

  const originalConnectedCallback = context.prototype.connectedCallback;

  context.prototype.connectedCallback = function (): void {
    const instance = (this as ComponentInstance);
    instance.__initCallStack.unshift((): void => originalConnectedCallback.bind(instance)());

    resolveCallStack(instance, '__initCallStack');
    resolveCallStack(instance, '__initAttributesCallStack');
  };

  const originalAttributeChangedCallback = context.prototype.attributeChangedCallback;

  context.prototype.attributeChangedCallback = function (...args): void {
    const instance = (this as ComponentInstance);
    const callFunction = (): void => originalAttributeChangedCallback.bind(instance)(...args);

    if (!instance.__initCallStack.length) {
      callFunction();
    } else {
      instance.__initAttributesCallStack.unshift(callFunction);
    }
  };

  customElements.define(context.componentName, context);

  return true;
  /* eslint-enable no-param-reassign,no-underscore-dangle,func-names */
};
