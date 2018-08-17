import BioElement from '../index';

/**
 * Allows to pass a BioElement (as it's constructor function value) as a parameter to a function.
 * You will only need to use this when writing a custom mixin function (eg. see withOnChildrenUpdated()).
 */
export default interface BioElementConstructor<T extends BioElement<any, any>> {
    new (...args: any[]): T;

    readonly bioAttributes: string[];
    define(name: string, options?: ElementDefinitionOptions): void;
}