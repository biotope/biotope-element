import sinon from 'sinon';
import { expect } from 'chai';
import Component from '../src/index';


describe('render', () => {

    it('is called on created', () => {
        const renderSpy = sinon.spy();
        class HelloWorld extends Component<object, object> {
            public static componentName = 'x-world';

            public render = renderSpy;
        }

        const instance = new HelloWorld();
        instance.created();

        expect(renderSpy).to.have.been.calledOnce;
    });

    it('is called onPropsChanged by default', () => {
        const renderSpy = sinon.spy();
        class HelloWorld extends Component<object, object> {
            public static componentName = 'x-world';

            public render = renderSpy;
        }

        const instance = new HelloWorld();
        (instance as any).onPropsChanged();

        expect(renderSpy).to.have.been.calledOnce;
    });
})

