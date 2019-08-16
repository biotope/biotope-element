import { render, html } from 'lighterhtml';

import { Renderer, ComponentInstance, RenderFuntion } from './types';

export const createRender = (
  context: ComponentInstance,
  originalRender: Function,
  postFunction: Function,
): RenderFuntion => render
  .bind(context, context.shadowRoot || context, (): void => {
    const element = originalRender();
    setTimeout(postFunction);
    return element;
  });

export const createPartial = (): Renderer<HTMLElement> => html;
