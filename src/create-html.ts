// eslint-disable-next-line import/no-extraneous-dependencies
import { render, html } from 'lighterhtml';

import { HTMLFragment } from './types';
import { Renderer, ComponentInstance, RenderFunction } from './internal-types';

export { html };

export const createRender = (
  context: ComponentInstance, originalRender: Function, postFunction: Function,
): RenderFunction => {
  const renderFunction: RenderFunction = render
    .bind(context, context.shadowRoot || context, (): void => {
      let element = originalRender();
      if (context.styleContent) {
        element = context.html`
          ${element}
          ${context.createStyle(context.styleContent)}
        `;
      }
      setTimeout(postFunction);
      return element;
    });
  // eslint-disable-next-line no-underscore-dangle
  return (): HTMLFragment => (context.__created ? renderFunction() : null);
};

export const createPartial = (): Renderer<HTMLFragment> => html;
