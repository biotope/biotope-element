import { render, html } from 'lighterhtml';

import { Renderer } from './types';

// eslint-disable-next-line func-names
export const createHtml = (): Renderer<ShadowRoot | HTMLElement> => function (
  template: TemplateStringsArray, ...args
): ShadowRoot | HTMLElement {
  const parsedArgs = args.map((_, index): void => (args[index] && Array.isArray(args[index])
    ? this.partial`${args[index]}`
    : args[index]
  ));

  const update = (): void => {
    const element = html(template, ...parsedArgs);
    setTimeout((): void => this.rendered());
    return element;
  };

  return render.bind(this, this.shadowRoot || this, update)();
};

export const createPartial = (): Renderer<HTMLElement> => html;
