import Component from '.';
import { getComponentName } from './get-component-name';

const isComponentRegistered = (name: string): boolean => {
  switch (document.createElement(name).constructor) {
    case HTMLElement: return false;
    case HTMLUnknownElement: return false;
    default: return true;
  }
};

export const register = (component: typeof Component): void => {
  if (!component) {
    throw new Error('No component to register defined!');
  }
  const dashedName = getComponentName(component);
  if (isComponentRegistered(dashedName)) {
    // eslint-disable-next-line no-console
    console.warn(`Attempt to re-register component "${dashedName}". Skipping…`);
    return;
  }

  const additionalConfiguration: ElementDefinitionOptions = {};

  if (component.basedOn) {
    additionalConfiguration.extends = component.basedOn;
  }

  component.dependencies.forEach(register);

  component.define(dashedName, additionalConfiguration);
};
