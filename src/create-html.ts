import { render, html } from 'lighterhtml';

import { Renderer, ComponentInstance, RenderFuntion } from './internal-types';

export const createRender = (
  context: ComponentInstance, originalRender: Function, postFunction: Function,
): RenderFuntion => render
  .bind(context, context.shadowRoot || context, (): void => {
    let element = originalRender();
    if (context.styles) {
      element = context.html`
        ${element}
        ${context.createStyle(context.styles)}
      `;
    }

    setTimeout(postFunction);
    return element;
  });

export const createPartial = (): Renderer<HTMLElement> => html;
