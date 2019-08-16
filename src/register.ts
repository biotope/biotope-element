import { getComponentName } from './get-component-name';
import { isRegistered } from './is-registered';
import { attributeName } from './attribute-mapper';
import { kebabToCamel } from './case-converters';
import { ComponentInstance, ComponentType } from './types';

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

  context.observedAttributes = context.attributes && context.attributes.length
    ? context.attributes.map(attributeName)
    : [];

  const originalConnectedCallback = context.prototype.connectedCallback;

  context.prototype.connectedCallback = function (): void {
    (this as ComponentInstance).__initCallStack
      .unshift((): void => originalConnectedCallback.bind(this as ComponentInstance)());

    resolveCallStack((this as ComponentInstance), '__initCallStack');
    resolveCallStack((this as ComponentInstance), '__initAttributesCallStack');
  };

  const originalAttributeChangedCallback = context.prototype.attributeChangedCallback;

  context.prototype.attributeChangedCallback = function (...args): void {
    const callFunction = (): void => originalAttributeChangedCallback
      .bind((this as ComponentInstance))(...args);

    if (!(this as ComponentInstance).__initCallStack.length) {
      callFunction();
    } else {
      (this as ComponentInstance).__initAttributesCallStack.unshift(callFunction);
    }
  };

  customElements.define(context.componentName, context, {
    ...(context.basedOn ? { extends: context.basedOn } : {}),
  });

  return true;
  /* eslint-enable no-param-reassign,no-underscore-dangle,func-names */
};
