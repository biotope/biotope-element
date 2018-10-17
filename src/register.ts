import Component from '.';
import { getComponentName } from './get-component-name';

const isComponentRegistered = (name: string) => {
  switch (document.createElement(name).constructor) {
    case HTMLElement: return false;
    case HTMLUnknownElement: return false;
  }
  return true;
};

const generateId = (length: number = 32) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const isNotChild = (element: HTMLElement, _: number, elements: HTMLElement[]) => !elements
  .filter(node => element !== node)
  .reduce((result, node) => result || node.contains(element), false);

interface UnregisteredHTMLElement {
  oldElement: HTMLElement,
  outerHTML: string;
  id: string;
}

export const register = (component: typeof Component) => {
  const dashedName = getComponentName(component);
  const isRegistered = isComponentRegistered(dashedName);
  let elements: UnregisteredHTMLElement[] = [];

  if (!isRegistered) {
    elements = ([].slice.call(document.getElementsByTagName(dashedName)) as HTMLElement[])
    .filter(isNotChild)
    .map(element => ({
      oldElement: element,
      outerHTML: element.outerHTML,
      id: generateId(),
    }));

    elements.forEach(({ oldElement, id }) => oldElement.outerHTML = `<div id="${id}"></div>`);
  }

  component.dependencies.forEach(dependency => dependency.register());

  if (!isRegistered) {
    component.define(dashedName);

    elements.forEach(({ outerHTML, id }) => {
      document.getElementById(id).outerHTML = outerHTML;
    })
  }
}
