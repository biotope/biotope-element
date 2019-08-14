import { render, html } from 'lighterhtml';

import { Renderer } from './types';

// eslint-disable-next-line func-names
export const createHtml = (): Renderer<ShadowRoot | HTMLElement> => function (
  template: TemplateStringsArray, ...args
): ShadowRoot | HTMLElement {
  args.forEach((_, index): void => {
    if (args[index] && Array.isArray(args[index])) {
      // eslint-disable-next-line no-param-reassign
      args[index] = this.partial`${args[0]}`;
    }
  });

  const renderCallback = (): void => html(template, ...args);
  return render.bind(this, this.shadowRoot || this, renderCallback)();
};

// eslint-disable-next-line func-names
export const createPartial = (): Renderer<HTMLElement> => function (
  ...args
): HTMLElement {
  return html(...args);
};
