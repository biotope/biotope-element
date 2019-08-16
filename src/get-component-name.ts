import { camelToKebab } from './case-converters';
import { ComponentType } from './types';

export const getComponentName = (context: ComponentType): string => context.componentName
  || camelToKebab(context.name || context.toString().match(/^function\s*([^\s(]+)/)[1]);
