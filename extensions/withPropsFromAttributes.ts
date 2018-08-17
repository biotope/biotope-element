import BioElement, {BioAttribute} from '../index';
import {BioElementConstructor} from './BioElementConstructor';

export interface WithPropsFromAttributes<TProps> {
    propsFromAttributes: TProps;
}

/***
 * Adds propsFromAttributes() to the given BioElement; it returns a TProps value derived from the current values of
 * all bioAttributes.
 *
 * @param {BioElementConstructor<T extends BioElement<TProps, any>>} SuperClass
 * @returns {BioElementConstructor<T & WithPropsFromAttributes<TProps extends object>>}
 */
export function withPropsFromAttributes<TProps extends object, T extends BioElement<TProps, any>>(SuperClass: BioElementConstructor<T>) {

    class C extends (<BioElementConstructor<BioElement<any, any>>>SuperClass) {

        get propsFromAttributes(): TProps {
            return (<any>this.constructor).bioAttributes.reduce((collection: TProps, attribute: (string|BioAttribute)) => {
                const {name, converter} = typeof attribute === 'string' ? {name: attribute, converter: (_: string) => _} : attribute;

                return {
                    ...(collection as any),
                    ...(this.hasAttribute(name)
                            ? { [name]: converter(this.getAttribute(name)) }
                            : {}
                    ),
                };
            }, {}) as TProps;
        }
    }

    return <BioElementConstructor<T & WithPropsFromAttributes<TProps>>>C;
}