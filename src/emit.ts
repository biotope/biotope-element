import { ComponentInstance } from './types';

export const emit = <T>(
  // FIXME - false positive on linting for rule "arrow-parens"
  // eslint-disable-next-line arrow-parens
  context: ComponentInstance, name: string, detail: T, addPrefix: boolean,
): boolean => {
  if (!name) {
    throw Error('No event name defined. Please provide a name.');
  }
  return context.dispatchEvent(new CustomEvent(
    `${addPrefix ? `${context.constructor.componentName}-` : ''}${name}`,
    {
      bubbles: true,
      ...(detail !== undefined ? { detail } : {}),
    },
  ));
};
