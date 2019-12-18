import { SVGFragment } from './types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, html, svg } from 'lighterhtml';

import { HTMLFragment } from './types';
import { Renderer, ComponentInstance, RenderFunction } from './internal-types';

export { html, svg };

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
  return (): HTMLFragment | SVGFragment => (context.__created ? renderFunction() : null);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createPartial = (): Renderer<HTMLFragment> => html as any;
export const createSVGPartial = (): Renderer<SVGFragment> => svg as any;
