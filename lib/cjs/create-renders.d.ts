import { ComponentInstance, RenderFunction } from './internal-types';
import { HTMLFragment } from './types';
export declare const rendered: (context: ComponentInstance) => void;
export declare const render: (context: ComponentInstance, renderFunction: RenderFunction) => HTMLFragment;
