import { render, html } from 'lighterhtml';

import { Renderer, ComponentInstance } from './types';

export const createHtml = (context: ComponentInstance): Renderer<ShadowRoot | HTMLElement> => (
  template: TemplateStringsArray, ...args
): ShadowRoot | HTMLElement => {
  const element = render.bind(
    context,
    context.shadowRoot || context,
    (): void => html(template, ...args.map(
      /* istanbul ignore next */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (_, index): any => (args[index] && Array.isArray(args[index])
        ? context.partial`${args[index]}`
        : args[index]),
    )),
  )();

  setTimeout((): void => context.rendered());
  return element;
};

export const createPartial = (): Renderer<HTMLElement> => html;
