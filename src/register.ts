import Component from '.';
import { getComponentName } from './get-component-name';

const isComponentRegistered = (name: string) => {
  switch (document.createElement(name).constructor) {
    case HTMLElement: return false;
    case HTMLUnknownElement: return false;
  }
  return true;
};

export const register = (component: typeof Component) => {
  if (!component) {
    throw new Error('No component to register defined!')
  }
  const dashedName = getComponentName(component);
  if (isComponentRegistered(dashedName)) {
    throw new Error('Component already registered!')
  }
  component.dependencies.forEach(register);
  component.define(dashedName);
}
