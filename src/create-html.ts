import { render, html } from 'lighterhtml';

import { Renderer, ComponentInstance } from './types';

// eslint-disable-next-line func-names
export const createHtml = (context: ComponentInstance): Renderer<ShadowRoot | HTMLElement> => (
  template: TemplateStringsArray, ...args
): ShadowRoot | HTMLElement => {
  const element = render.bind(
    context,
    context.shadowRoot || context,
    (): void => html(template, ...args.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (_, index): any => (args[index] && Array.isArray(args[index])
        ? context.partial`${args[index]}`
        : args[index]),
    )),
  )();

  setTimeout((): void => context.rendered());
  return element;
};

// eslint-disable-next-line func-names
export const createPartial = (): Renderer<HTMLElement> => html;
