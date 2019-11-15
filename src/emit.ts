import { ComponentInstance } from './internal-types';

export const emit = <T>(
  context: ComponentInstance, name: string, detail: T, singleEmit: boolean,
): boolean => {
  if (!name) {
    throw Error('No event name defined. Please provide a name.');
  }
  return context.dispatchEvent(new CustomEvent(name, {
    bubbles: !singleEmit,
    ...(detail !== undefined && { detail }),
  }));
};
