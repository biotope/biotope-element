import { ComponentType } from './types';

const camelToKebab = (string: string): string => string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

export const getComponentName = (context: ComponentType): string => context.componentName
  || camelToKebab(context.name || context.toString().match(/^function\s*([^\s(]+)/)[1]);
