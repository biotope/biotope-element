// eslint-disable-next-line import/no-extraneous-dependencies
import { render, html } from 'lighterhtml';

import { HTMLFragment } from './types';
import { Renderer, ComponentInstance, RenderFuntion } from './internal-types';

export { html };

export const createRender = (
  context: ComponentInstance, originalRender: Function, postFunction: Function,
): RenderFuntion => {
  const renderFunction: RenderFuntion = render
    .bind(context, context.shadowRoot || context, (): void => {
      const element = originalRender();
      setTimeout(postFunction);
      return element;
    });
  // eslint-disable-next-line no-underscore-dangle
  return (): HTMLFragment => (context.__created ? renderFunction() : null);
};

export const createPartial = (): Renderer<HTMLFragment> => html;
