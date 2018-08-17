import BioElement from '../index';
import {BioElementConstructor} from './BioElementConstructor';

export interface WithOnChildrenUpdated {
    onChildrenUpdated(changes: MutationRecord[]): void;
}

/**
 * Adds onChildrenUpdated() to the given BioElement, which is called every time the child nodes (in the
 * light DOM) have been changed. By default, onChildrenUpdated() calls render(). Overwrite, if you need
 * to perform other actions.
 *
 * Example use case: A TabComponent, that needs to re-render the tab titles when a TabPane is added or removed.
 *
 * @param {BioElementConstructor<T extends BioElement<any, any>>} SuperClass 
 * @returns {BioElementConstructor<T & WithOnChildrenUpdated>}
 */
export function withOnChildrenUpdated<T extends BioElement<any, any>>(SuperClass: BioElementConstructor<T>) {

    class C extends (<BioElementConstructor<BioElement<any, any>>>SuperClass) {
        constructor() {
            super();

            const observer = new MutationObserver(changes => this.onChildrenUpdated(changes));
            observer.observe(this, {childList: true});
        }

        onChildrenUpdated(changes: MutationRecord[]) {
            this.render();
        }
    }

    return <BioElementConstructor<T & WithOnChildrenUpdated>>C;
}