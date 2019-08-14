import { kebab } from 'change-case';

interface NamedComponent extends Function {
  componentName?: string;
}

export const getComponentName = (context: NamedComponent): string => context.componentName
  || kebab(context.name || context.toString().match(/^function\s*([^\s(]+)/)[1]);
