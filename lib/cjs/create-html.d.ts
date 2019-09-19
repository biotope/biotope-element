import { html } from 'lighterhtml';
import { HTMLFragment } from './types';
import { Renderer, ComponentInstance, RenderFunction } from './internal-types';
export { html };
export declare const createRender: (context: ComponentInstance, originalRender: Function, postFunction: Function) => RenderFunction;
export declare const createPartial: () => Renderer<HTMLFragment>;
