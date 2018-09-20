import { expect } from 'chai';
import * as sinon from 'sinon';
import Component from '../src/index';

describe('props', () => {
    describe('setter', () => {
        it('calls onPropsChanged callback when props setter is called', () => {
            const onPropsChangedSpy = sinon.spy();
            class Test extends Component<{}, {}> {
                static componentName = 'x-test';

                onPropsChanged() {
                    onPropsChangedSpy();
                };
            }
            const testComponent = Object.create(Test.prototype, {});

            testComponent.props = {
                test: 'someValue'
            };

            expect(onPropsChangedSpy).to.have.been.calledOnce;
        })
    })

    describe('getter', () => {
        it('returns empty object for no set props', () => {
            class Test extends Component<{}, {}> {
                static componentName = 'x-test';
            }
            const testComponent = Object.create(Test.prototype, {});

            expect(testComponent.props).to.be.empty;
        })

        it('returns default props if set', () => {
            class Test extends Component<{ myProp: string }, {}> {
                static componentName = 'x-test';
                get defaultProps() {
                    return {
                        myProp: 'value'
                    }
                }
            }
            const testComponent = Object.create(Test.prototype, {});

            expect(testComponent.props.myProp).to.eq('value');
        })
    })
})
