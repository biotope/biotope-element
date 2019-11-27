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
      const element = originalRender();
      setTimeout(postFunction);
      return element;
    });
  // eslint-disable-next-line no-underscore-dangle
  return (): HTMLFragment => (context.__created ? renderFunction() : null);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createPartial = (): Renderer<HTMLFragment> => html as any;
