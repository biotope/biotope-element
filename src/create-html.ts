// eslint-disable-next-line import/no-extraneous-dependencies
import { render, html as internalHtml } from 'lighterhtml';

import { HTMLFragment } from './types';
import { Renderer, ComponentInstance, RenderFunction } from './internal-types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const html = internalHtml as any as Renderer<HTMLFragment>;

export { html };

export const createRender = (
  context: ComponentInstance, originalRender: Function, postFunction: Function,
): RenderFunction => {
  const renderFunction: RenderFunction = render
    .bind(context, context.shadowRoot || context, (): void => {
      const element = originalRender();
      setTimeout(postFunction);
      return element;
    });
  // eslint-disable-next-line no-underscore-dangle
  return (): HTMLFragment => (context.__created ? renderFunction() : null);
};

export const createPartial = (): Renderer<HTMLFragment> => html;
