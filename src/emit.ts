import { ComponentInstance } from './internal-types';

export const emit = <T>(
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
