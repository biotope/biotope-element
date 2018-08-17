import BioElement from '../index';
import {BioElementConstructor} from './BioElementConstructor';

/**
 * Creator function for a custom BioElement class. Use in conjunction with other extensions for a more readable syntax:
 *
 *  public class MyClass extends withOnChildrenUpdated(aBioElement<MyProps, MyState>()) {
 *    ...
 *  }
 *
 * @returns {BioElementConstructor<BioElement<TProps extends object, TState>>}
 */
export function aBioElement<TProps extends object, TState>() {

    class C extends BioElement<TProps, TState> { }

    return <BioElementConstructor<BioElement<TProps, TState>>>C;
}
