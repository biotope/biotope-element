import { ComponentInstance, RenderFunction } from './internal-types';
import { HTMLFragment, SVGFragment } from './types';

const emitRendered = (context: ComponentInstance, elements: ComponentInstance[]): void => {
  // eslint-disable-next-line no-underscore-dangle
  if (!elements.length || !elements.some((element) => !element.__rendered)) {
    // eslint-disable-next-line no-underscore-dangle,no-param-reassign
    context.__rendered = true;
    context.emit('rendered', undefined, true);
  } else {
    setTimeout(() => emitRendered(context, elements));
  }
};

export const ready = (context: ComponentInstance): void => {
  // eslint-disable-next-line no-underscore-dangle
  if (!context.__ready) {
    // eslint-disable-next-line no-underscore-dangle,no-param-reassign
    context.__ready = true;
    context.ready();
    context.emit('ready', undefined, true);
  }
};

export const rendered = (context: ComponentInstance): void => {
  context.rendered();

  const elements = ([...(context.shadowRoot || context).querySelectorAll('*')] as ComponentInstance[])
    // eslint-disable-next-line no-underscore-dangle
    .filter((element) => typeof element.__rendered === 'boolean');

  emitRendered(context, elements);
};

export const render = (
  context: ComponentInstance, renderFunction: RenderFunction,
): HTMLFragment | SVGFragment => {
  // eslint-disable-next-line no-underscore-dangle,no-param-reassign
  context.__rendered = false;
  return renderFunction();
};
