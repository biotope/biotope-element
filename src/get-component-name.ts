import { camelToKebab } from './case-converters';
import { ComponentType } from './internal-types';

export const getComponentName = (context: ComponentType): string => context.componentName
  || camelToKebab(context.name || context.toString().match(/^function\s*([^\s(]+)/)[1]);
