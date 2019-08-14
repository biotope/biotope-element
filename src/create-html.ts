import { bind, wire } from 'hyperhtml';

import { ComponentInstance, Renderer } from './types';

export const createHtml = (context: ComponentInstance): Renderer<ShadowRoot | HTMLElement> => {
  const boundHtml = bind(context.shadowRoot as ShadowRoot || context as HTMLElement);

  // eslint-disable-next-line func-names
  return function (template: TemplateStringsArray, ...args): ShadowRoot | HTMLElement {
    const shadowOrElement = boundHtml(template, ...args);

    // eslint-disable-next-line no-underscore-dangle
    if (!context.__initCallStack.length && !context.__initAttributesCallStack.length) {
      setTimeout((): void => context.rendered());
    }
    return shadowOrElement;
  };
};

export const createPartial = (): Renderer<HTMLElement> => wire();
