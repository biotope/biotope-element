import dasherize from 'dasherize';

interface NamedComponent extends Function {
  componentName: string;
}

export const getComponentName = (context: NamedComponent) => context.componentName || dasherize(
  context.name || context.toString().match(/^function\s*([^\s(]+)/)[1],
);
