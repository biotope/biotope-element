import Component from '.';
import { getComponentName } from './get-component-name';

const ELEMENT_IDS_BEING_USED: string[] = [];

const isComponentRegistered = (name: string) => {
  switch (document.createElement(name).constructor) {
    case HTMLElement: return false;
    case HTMLUnknownElement: return false;
  }
  return true;
};

const generateUniqueId = (length: number = 32): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  if (ELEMENT_IDS_BEING_USED.indexOf(text) < 0) {
    ELEMENT_IDS_BEING_USED.push(text);
    return text;
  }
  return generateUniqueId(length);
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

  // if component is not registered, remove any existing element from the page
  if (!isRegistered) {
    elements = ([].slice.call(document.getElementsByTagName(dashedName)) as HTMLElement[])
    .filter(isNotChild)
    .map(element => ({
      oldElement: element,
      outerHTML: element.outerHTML,
      id: generateUniqueId(),
    }));

    elements.forEach(({ oldElement, id }) => oldElement.outerHTML = `<div id="${id}"></div>`);
  }

  component.dependencies.forEach(dependency => dependency.register());

  if (!isRegistered) {
    component.define(dashedName);

    // re-apply the previously removed elements from the page
    elements.forEach(({ outerHTML, id }) => {
      const element = document.getElementById(id);
      const wrappingElement = document.createElement('div');
      wrappingElement.innerHTML = outerHTML;

      element.parentNode.replaceChild(wrappingElement.children[0], element);
      ELEMENT_IDS_BEING_USED.splice(ELEMENT_IDS_BEING_USED.indexOf(id), 1);
    })
  }
}
