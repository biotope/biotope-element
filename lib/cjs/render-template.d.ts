import { HTMLFragment } from './types';
import { ComponentInstance, RenderFunction } from './internal-types';
export declare const templateToFunctionString: (template?: string, splitStart?: string, splitEnd?: string) => string;
export declare const renderTemplate: (context: ComponentInstance, template?: string | RenderFunction) => HTMLFragment;
